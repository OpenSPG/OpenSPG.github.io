In this case, all the data is structured data. There are two main capabilities required in this case:

- Structured Mapping: The original data and the schema-defined table fields are not completely consistent, so a data field mapping process needs to be defined.
- Entity Linking: In relationship building, entity linking is a very important construction method. This example demonstrates a simple case of implementing entity linking capability for companies.

#### Structured Mapping from Source Data to SPG Data

Taking the import of `Company` instances as an example:

```yaml
id,name,products
CSF0000000254,北大*药*份限公司,"医疗器械批发,医药批发,制药,其他化学药品"
```

The code for importing `Company` instances is as follows, with detailed explanations provided in the comments:

```python
# -*- coding: utf-8 -*-

from knext.core.builder.pipeline.builder_job import BuilderJob
from knext.core.builder.pipeline.model.component import SourceCsvComponent, SinkToKgComponent, EntityMappingComponent, \
RelationMappingComponent

# To create a import task, it must inherit from BuilderJob class.
# Importing basic information of company
class Company(BuilderJob):
    # Parallelization Parameter
    parallelism = 6

    ```
    Create a construction task pipeline, which should have a source node and a sink node. 
    Here, the mapping node is a structured data mapping node.
    ```
    def build(self):
        source = SourceCsvComponent(
            # Specify the data source address
            local_path="./builder/task/data/Company.csv",
            columns=["id", "name", "products"],
            start_row=2
        )

        # spg_type_name  Specifies which data type to import to
        # add_field      Specifies which field from the data source to import into the field defined in the schema
        mapping = EntityMappingComponent(
            spg_type_name="DEFAULT.Company"
        ).add_field("id", "id") \
        .add_field("name", "name") \
        .add_field("products", "product")

        # sink节点，使用系统的图谱节点
        sink = SinkToKgComponent()

        return source >> mapping >> sink


# Importing financial relations between companies.
class CompanyFundTrans(BuilderJob):

    ```
    Similar to the import of basic information, the RelationMappingComponent represents the relation mapping node.
    ```
    def build(self):
        source = SourceCsvComponent(
            local_path="./builder/task/data/Company_fundTrans_Company.csv",
            columns=["src", "dst", 'transDate', 'transAmt'],
            start_row=2
        )

        # For the relation mapping node, specify the specific relation
        # add_field  Specifies which field from the data source to import into the field defined in the schema
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

```

To submit the task, execute the following command:

```shell
knext builder submit Company,CompanyFundTrans
```

In general, this mapping relationship can satisfy the import of structured data. However, in some scenarios, it may be necessary to manipulate the data to meet specific requirements. In such cases, we need to implemented a self-defined operator.

#### Self-defined Entity Linking Operator

For example, consider the following data:

```python
id,name,age,legalRep
0,路**,63,"新疆*花*股*限公司,三角*胎股*限公司,传化*联*份限公司"
```

The "legalRep" field is the company name, but the company ID is set as the primary key, it is not possible to directly associate the company name with a specific company. Assuming there is a search service available that can convert the company name to an ID, a Self-defined linking operator needs to be developed to perform this conversion. The operator should be placed in the following directory:

```python
|_event
	|_builder
    	|_operator
        	|_company_operator.py
```

The specific implementation code is as follows：

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
    llm_response = requests.post('http://11.166.207.228:8888', json=param)
    if llm_response.status_code == 200:
        content = llm_response.content
        if content.startswith("输出结果:"):
            return content[content.index(":") + 1:].strip().rstrip("。")
    else:
        return "null"

# The linking operator must be inherited from EntityLinkOp
class CompanyLinkerOperator(EntityLinkOp):
    # bind it to the SupplyChain.Company type, all the linking relations to this entity will excute the linking operation.
    bind_to = "SupplyChain.Company"

    def __init__(self):
        super().__init__()
        self.search_client = SearchClient("SupplyChain.Company")
        # The default setting is to disable advanced ranking capabilities for llms.
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

To publish the operator, execute the following command:

```shell
knext operator publish CompanyLinkerOperator
```

After the submission is completed, the construction of the "person" entity can be done following the normal mapping process. Here is an example of the "person" entity:

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
from knext.core.builder.job.model.component import SourceCsvComponent, SinkToKgComponent, RelationMappingComponent, \
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
        ).add_field("id", SupplyChain.Person.id) \
            .add_field("name", SupplyChain.Person.name) \
            .add_field("age", SupplyChain.Person.age) \
            .add_field("legalRep", SupplyChain.Person.legalRepresentative)

        sink = SinkToKgComponent()

        return source >> mapping >> sink
```

Finally, submit the task:

```shell
knext builder submit Person
```
