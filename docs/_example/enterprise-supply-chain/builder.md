---
title: 知识构建
order: 3
---

本例中数据均为结构化数据，本例中主要需要两个部分能力：

- 结构化Mapping：原始数据和schema定义表字段并不完全一致，需要定义数据字段映射过程
- 实体链指：在关系构建中，实体链指是非常重要的建设手段，本例演示一个简单case，实现公司的链指能力

## 1 源数据到SPG数据的Mapping能力

以导入company数据为例：

```yaml
id,name,products
CSF0000000254,北大*药*份限公司,"医疗器械批发,医药批发,制药,其他化学药品"
```

导入company的代码如下，详细内容如注释：

````python
# -*- coding: utf-8 -*-

from knext.core.builder.pipeline.builder_job import BuilderJob
from knext.core.builder.pipeline.model.component import SourceCsvComponent, SinkToKgComponent, EntityMappingComponent, \
RelationMappingComponent

# 导入基本信息任务，必须继承BuilderJob
class Company(BuilderJob):
    # 并行化参数
    parallelism = 6

    ```
    返回构建任务pipeline，每个导入任务都需要有一个source节点，一个sink节点
    这里mappiing节点为一个结构化数据映射节点
    ```
    def build(self):
        source = SourceCsvComponent(
            # 指定数据源地址
            local_path="./builder/task/data/Company.csv",
            columns=["id", "name", "products"],
            start_row=2
        )

        # spg_type_name代表是向哪个数据类型导入
        # add_field表示从数据源的哪个字段导入到schema中定义的哪个字段
        mapping = EntityMappingComponent(
            spg_type_name="DEFAULT.Company"
        ).add_field("id", "id") \
        .add_field("name", "name") \
        .add_field("products", "product")

        # sink节点，使用系统的图谱节点
        sink = SinkToKgComponent()

        return source >> mapping >> sink


# 导入公司间的资金关系
class CompanyFundTrans(BuilderJob):

    ```
    和基本信息导入类似，此处RelationMappingComponent代表关系隐射节点
    ```
    def build(self):
        source = SourceCsvComponent(
            local_path="./builder/task/data/Company_fundTrans_Company.csv",
            columns=["src", "dst", 'transDate', 'transAmt'],
            start_row=2
        )

        # 关系映射节点需要指定是哪条具体关系
        # add_field表示从数据源的哪个字段导入到schema中定义的哪个字段
        mapping = RelationMappingComponent(
            subject_name='DEFAULT.Company',
            predicate_name='fundTrans',
            object_name='DEFAULT.Company'
        ).add_field("src", "srcId") \
        .add_field("dst", "dstId") \
        .add_field("transDate", 'transDate') \
        .add_field('transAmt', 'transAmt')

        sink = SinkToKgComponent()

        return source >> mapping >> sink

````

在knext中执行如下命令提交任务：

```shell
knext builder submit Company,CompanyFundTrans
```

一般情况下这种映射关系基本能够满足结构化数据导入，但在一些场景下可能需要对数据进行部分数据才能满足要求，此时就需要实现自定义算子来处理问题。

## 2 自定义算子实现链指能力

例如如下数据：

```python
id,name,age,legalRep
0,路**,63,"新疆*花*股*限公司,三角*胎股*限公司,传化*联*份限公司"
```

legalRep字段为公司名字，但在系统中已经将公司id设置成为主键，直接通过公司名是无法关联到具体公司，假定存在一个搜索服务，可将公司名转换为id，此时需要自定开发一个链指算子，实现该过程的转换。

算子放在如下目录：

```python
|_event
    |_builder
        |_operator
            |_company_operator.py
```

具体实现代码如下：

```python
# -*- coding: utf-8 -*-

from typing import List

import requests

from knext.core.builder.operator import Vertex, EvalResult
from knext.core.builder.operator.model.op import EntityLinkOp
from knext.core.wrapper.search_client import SearchClient


def llm_infer(word, recall):
  """
  Here is the implement of LLM inferring
  """

  prompt_text = f'你作为一个语言专家，请在目标词里选出跟输入词意思最相近的一个词，如果没有意思相近的则输出null。\n要求：输出结果直接显示选中的目标词，不需要给出选择的任何理由。\n输入词：{word}。\n目标词：[{recall}]。'
  param = {
    "prompt": prompt_text,
    "history": None
  }
  llm_response = requests.post('http://127.0.0.1:8888', json=param)
  if llm_response.status_code == 200:
    content = llm_response.content
    if content.startswith("输出结果:"):
      return content[content.index(":") + 1:].strip().rstrip("。")
  else:
    return "null"

# 必须继承EntityLinkOp 才为链指算子
class CompanyLinkerOperator(EntityLinkOp):
  # 绑定到SupplyChain.Company类型，所有链指到该实体的关系均会进行链指操作
  bind_to = "SupplyChain.Company"

  def __init__(self):
    super().__init__()
    self.search_client = SearchClient("SupplyChain.Company")
    # 默认关闭大模型精排能力
    self.enable_llm = False

  def eval(self, record: Vertex) -> EvalResult[List[Vertex]]:
    company_name = record.properties["company"]
    query = {"match": {"name": company_name}}
    recalls = self.search_client.search(query, 0, 30)
    if recalls is not None:
      if recalls[0].score < 0.6:
        # Low similarity, discard recall results
        return EvalResult([])

      if company_name == recalls[0].properties["name"]:
        # If the result of Top1 is the same as the attribute value, then returned directly
        return EvalResult([Vertex(biz_id=recalls[0].doc_id, vertex_type="SupplyChain.Company")])

      # Perform fine-ranking on coarse recall results by calling LLM
      if not self.enable_llm:
        return EvalResult([Vertex(biz_id=recalls[0].doc_id, vertex_type="SupplyChain.Company")])

      recall_dict = {}
      for item in recalls:
        recall_dict[item.properties["name"]] = item.doc_id
      recall_str = ",".join(recall_dict.keys())

      # ----- Please enable the code below when LLM service is ready ------
      llm_result = llm_infer(company_name, recall_str)
      if len(llm_result) > 0 and llm_result != "null":
        return EvalResult([Vertex(biz_id=recall_dict[llm_result], vertex_type="SupplyChain.Company")])

    return EvalResult([])

```

执行如下命令提交：

```shell
knext operator publish CompanyLinkerOperator
```

提交完成后，person构建只需按照正常mapping流程即可，如下person代码：

```python
# -*- coding: utf-8 -*-

#  Copyright 2023 Ant Group CO., Ltd.
#
#  Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
#  in compliance with the License. You may obtain a copy of the License at
#
#  http://www.apache.org/licenses/LICENSE-2.0
#
#  Unless required by applicable law or agreed to in writing, software distributed under the License
#  is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
#  or implied.

from knext.core.builder.job.builder import BuilderJob
from knext.core.builder.job.model.component import SourceCsvComponent, SinkToKgComponent, RelationMappingComponent,
  EntityMappingComponent
from knext.examples.supplychain.schema.supplychain_schema_helper import SupplyChain


class Person(BuilderJob):

  def build(self):
    source = SourceCsvComponent(
      local_path="./builder/job/data/Person.csv",
      columns=["id", 'name', 'age', 'legalRep'],
      start_row=2
    )

    mapping = EntityMappingComponent(
      spg_type_name=SupplyChain.Person
    ).add_field("id", SupplyChain.Person.id)
      .add_field("name", SupplyChain.Person.name)
      .add_field("age", SupplyChain.Person.age)
      .add_field("legalRep", SupplyChain.Person.legalRepresentative)

    sink = SinkToKgComponent()

    return source >> mapping >> sink
```

最后提交person任务即可：

```shell
knext builder submit Person
```
