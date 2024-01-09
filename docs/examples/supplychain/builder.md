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
class Company(BuilderJob):
    ```
    返回构建任务pipeline，每个导入任务都需要有一个source节点，一个sink节点
    这里mapping节点为一个结构化数据映射节点
    ```
    def build(self):
        source = CSVReader(
            # 指定数据源地址
            local_path="./builder/task/data/Company.csv",
            columns=["id", "name", "products"],
            start_row=2
        )

        # spg_type_name代表是向哪个数据类型导入
        # add_field表示从数据源的哪个字段导入到schema中定义的哪个字段
        mapping = SPGTypeMapping(
            spg_type_name="SupplyChain.Company"
        ).add_property_mapping("id", "id") \
        .add_property_mapping("name", "name") \
        .add_property_mapping("products", "product")

        # sink节点，使用系统的图谱节点
        sink = KGWriter()

        return source >> mapping >> sink


# 导入公司间的资金关系
class CompanyFundTrans(BuilderJob):

    ```
    和基本信息导入类似，此处RelationMappingComponent代表关系隐射节点
    ```
    def build(self):
        source = CSVReader(
            local_path="./builder/task/data/Company_fundTrans_Company.csv",
            columns=["src", "dst", 'transDate', 'transAmt'],
            start_row=2
        )

        # 关系映射节点需要指定是哪条具体关系
        # add_field表示从数据源的哪个字段导入到schema中定义的哪个字段
        mapping = RelationMapping(
            subject_name='DEFAULT.Company',
            predicate_name='fundTrans',
            object_name='DEFAULT.Company'
        ).add_sub_property_mapping("src", "srcId") \
        .add_sub_property_mapping("dst", "dstId") \
        .add_sub_property_mapping("transDate", 'transDate') \
        .add_sub_property_mapping('transAmt', 'transAmt')

        sink = KGWriter()

        return source >> mapping >> sink

````

在knext中执行如下命令提交任务：

```shell
knext builder execute Company,CompanyFundTrans
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

person构建只需按照正常mapping流程即可，如下person代码：

```python
# -*- coding: utf-8 -*-
class Person(BuilderJob):

  def build(self):
    source = CSVReader(
      local_path="./builder/job/data/Person.csv",
      columns=["id", 'name', 'age', 'legalRep'],
      start_row=2
    )

    mapping = SPGTypeMapping(
      spg_type_name=SupplyChain.Person
    ).add_property_mapping("id", SupplyChain.Person.id)
      .add_property_mapping("name", SupplyChain.Person.name)
      .add_property_mapping("age", SupplyChain.Person.age)
      .add_property_mapping("legalRep", SupplyChain.Person.legalRepresentative)

    sink = KGWriter()

    return source >> mapping >> sink
```

最后提交person任务即可：

```shell
knext builder execute Person
```
