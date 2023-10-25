# 1 Schema details

Schema tutorial of OpenSPG, please refer to [spgschema_tutorial](core/spgschema_tutorial). <br>
For modeling of the Enterprise Supply Chain Knowledge Graph, please refer to the documentation：[schema description](https://github.com/OpenSPG/openspg/blob/master/python/knext/examples/supplychain/schema/supplychain.schema). <br>
Execute the following script to complete schema creation: <br>

```
knext schema commit
```

# 2 SPG Modeling vs Property Graph Modeling

This section will compare the differences between SPG semantic modeling and regular modeling.

### 2.1 Semantic Attributes vs Text Attributes

Assuming the following company information exists: <br>
"北大药份限公司" produces four products: "医疗器械批发,医药批发,制药,其他化学药品".

```
id,name,products
CSF0000000254,北大*药*份限公司,"医疗器械批发,医药批发,制药,其他化学药品"
```

###### Modeling based on text attributes

```yaml
//Text Attributes
Company(企业): EntityType
    properties:
        product(经营产品): Text
```

At this moment, the products are only represented as text without semantic information. It is not possible to obtain the upstream and downstream industry chain related information for "北大药份限公司", which is inconvenient for maintenance and usage.

###### Modeling based on relations

To achieve better maintenance and management of the products, it is generally recommended to represent the products as entities and establish relations between the company and its products.

```yaml
Product(产品): EntityType
    properties:
        name(产品名): Text
    relations:
        isA(上位产品): Product

Company(企业): EntityType
    relations:
        product(经营产品): Product
```

However, such modeling method requires the data to be divided into four columns:

```
id,name,product
CSF0000000254,北大*药*份限公司,医疗器械批发
CSF0000000254,北大*药*份限公司,医药批发
CSF0000000254,北大*药*份限公司,制药
CSF0000000254,北大*药*份限公司,其他化学药品
```

This approach has two disadvantages: <br>

1. The raw data needs to be cleaned and converted into multiple rows. <br>
2. It requires adding and maintaining relation data. When the original data changes, the existing relations need to be deleted and new data needs to be added, which can lead to data errors. <br>

###### Modeling based on SPG semantic attributes

SPG supports semantic attributes, which can simplify knowledge construction. <br>
The modeling can be done as follows: <br>

```yaml
Product(产品): ConceptType
    hypernymPredicate: isA

Company(企业): EntityType
    properties:
        product(经营产品): Product
            constraint: MultiValue
```

In this model, the `Company` entity has a property called "经营产品" (Business Product), which is `Product` type. By importing the following data, the conversion from attribute to relation can be automatically achieved.

```
id,name,products
CSF0000000254,北大*药*份限公司,"医疗器械批发,医药批发,制药,其他化学药品"
```

### 2.2 Logical Expression of Attributes and Relationships vs Data Representation of Attributes and Relationships

Assuming the goal is to obtain the industry of a company. Based on the available data, the following query can be executed:

```
MATCH
    (s:Company)-[:product]->(o:Product)-[:belongToIndustry]->(i:Industry)
RETURN
    s.id, i.id
```

This approach requires familiarity with the graph schema and has a higher learning curve for users. Therefore, another practice is to re-import these types of attributes into the knowledge graph, as shown below:

```yaml
Company(企业): EntityType
    properties:
        product(经营产品): Product
            constraint: MultiValue
    relations:
        belongToIndustry(所在行业): Industry
```

To directly obtain the industry information of a company, a new relation type can be added. However, there are two main drawbacks to this approach: <br>

- It requires manual maintenance of the newly added relation data, increasing the cost of maintenance.
- Due to the dependency on the source of the new relation and the knowledge graph data, it is very easy to introduce inconsistencies.

To address these drawbacks, OpenSPG supports logical expression of attributes and relations. <br>
The modeling can be done as follows:

```yaml
Company(企业): EntityType
    properties:
        product(经营产品): Product
            constraint: MultiValue
    relations:
        belongToIndustry(所在行业): Industry
          rule: [[
              Define (s:Company)-[p:belongToIndustry]->(o:Industry) {
                        STRUCTURE {
                          (s)-[:product]->(c:Product)-[:belongToIndustry]->(o)
                        }
                        CONSTRAINT {
                        }
                    }
              ]]
```

You can refer to the examples in Scenario 1 and Scenario 2 of the [Enterprise Supply Chain Query](example/enterprise-supply-chain/detail/enterprise_supply_chain_query) for specific details.

### 2.3 Concepts vs Entitys

Existing knowledge graph solutions also include common sense knowledge graphs such as ConceptNet. In practical
business applications, different domains have their own categorical systems that reflect the semantic understanding of the business. There is no universal common sense graph that can be applied to all business scenarios. Therefore, a common practice is to create the domain-specific categorical system as entities and mix them with other entity data. This approach leads to the need for both schema extension modeling and fine-grained semantic modeling on the same categorical system. The coupling of data structure definition and semantic modeling results in complexity in engineering implementation and maintenance management. It also increases the difficulty in organizing and representing (cognitive) domain knowledge.

OpenSPG distinguishes between concepts and entities to decouple semantics from data. This helps address the challenges mentioned above.

```yaml
Product(产品): ConceptType
    hypernymPredicate: isA

Company(企业): EntityType
    properties:
        product(经营产品): Product
            constraint: MultiValue
```

Products are defined as concepts, while companies are defined as entities, evolving independently. They are linked together using semantic attributes provided by OpenSPG, eliminating the need for manual maintenance of associations between companies and products.

### 2.4 Event Representation in Spatio-Temporal Context

The representation of events with multiple elements is indeed a type of lossless representation using a hypergraph structure. It expresses the spatio-temporal relations of multiple elements. Events are temporary associations of various elements caused by certain actions. Once the action is completed, the association disappears. In traditional property graphs, events can only be replaced by entities, and the event content is expressed using textual attributes. An example of such an event is shown below: <br>
![Event Representation](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*pUlGS6-E3lEAAAAAAAAAAAAADtmcAQ/original) <br>

```yaml
Event(事件):
  properties:
    eventTime(发生时间): Long
    subject(涉事主体): Text
    object(客体): Text
    place(地点): Text
    industry(涉事行业): Text
```

This representation method is unable to capture the multidimensional associations of real events. OpenSPG provides event modeling that enables the association of multiple elements in an event, as shown below.

```yaml
CompanyEvent(公司事件): EventType
	properties:
		subject(主体): Company
		index(指标): Index
		trend(趋势): Trend
		belongTo(属于): TaxOfCompanyEvent
```

In the above event, all attribute types are defined SPG types, without any basic type expressions. OpenSPG utilizes this declaration to implement the expression of multiple elements in an event. Specific application examples can be found in the detailed description of Scenario 3 in the [Enterprise Supply Chain Query](example/enterprise-supply-chain/detail/enterprise_supply_chain_query) document.
