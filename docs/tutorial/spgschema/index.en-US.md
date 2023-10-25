---
title: SPG Schema
order: 4
---

# SPG-Schema

# Introduction to the basics of Schema

In this chapter, we will introduce the fundamentals of entity, event, and concept types in SPG.

## Entity Type

Entity type, which defines a collection of instances with a common data structure (characteristics). Entity types are typically used to describe specific objects in the real world, such as companies, schools, books, and so on. Taking the example of a school entity type, its instances can be "xxx City First Primary School" or "xxx University".

The definition of an entity type mainly consists of attributes and relations. The value domain of an attribute can be basic types such as text, integer and float, or advanced types such as concepts and entities. When using advanced types as the value domain of an attribute, it also establishes a relation from the entity to the advanced type. This is an important feature of SPGSchema.

The definition of a relation needs to be defined on the source entity type, and the direction is always outward. Attributes can also be defined on relations, but the value domain is limited to basic types.

Entity types include several default attributes, which do not require additional definitions in knowledge modeling:

- id (primary key, required)
- name (entity name)
- description (entity description)

Taking the example of a school, the properties of the entity type can be as follows:

```yaml
englishName: Text
shortName: Text
founder: Person
foundDate: STD.Date
category: TaxonomySchool
address: Text
```

An instance of the school entity type can look like:

```json
{
  "id": "zjdx",
  "name": "Zhejiang University",
  "englishName": "Zhejiang University",
  "shortName": "ZJU",
  "founder": "Lin Qi",
  "foundDate": "18970521",
  "category": "Public University",
  "address": "Xixi Campus: No. 148, Tianmushan Road, Xihu District, Hangzhou City"
}
```

## Event Type

EventType is a modeling approach that extends the entity type by incorporating four elements: subject, object, time, and location. It aims to represent dynamic behavior and reflect the state of things in different spatial and temporal intervals. Events can include policy events, industry events, and user behavior events. Among these elements, the subject element is mandatory, while the others are optional.

Both event types and entity types are abstract descriptions of objective things. However, entity types primarily contain relatively static objective attributes and relations, lacking dynamic changes that occur over time and space. As a result, they may have a one-sided view and lack in-depth semantic information. For instance, expressing "XX company is listed on the Shenzhen Stock Exchange on October 28th".

Taking the example of an enterprise event type, its attributes can be as follows:

```yaml
subject: Company
object: Text
time: STD.Date
location: Text
behavior: Behavior
```

An instance of the enterprise event type can be:

```json
{
  "id": "2023100820394930",
  "name": "XX company is listed on the Shenzhen Stock Exchange on October 28th",
  "subject": "XX company",
  "object": "Shenzhen Stock Exchange",
  "time": "20231028",
  "location": "Shenzhen Stock Exchange",
  "behavior": "listing"
}
```

## Concept Type

Concept is an abstraction description of a class of entities that share common characteristics. It is often used to categorize entity/event types. For example: concepts for school classification could include primary schools, secondary schools, and universities. The main difference between concepts and entities is that concepts cannot refer to specific objects in the real world. They provide a general and summarized description of a class of things. Additionally, concepts are assumed to have a hierarchical relationship (which can be specified during modeling) between them, allowing for abstract descriptions of generalization and specialization. For example: the concept hierarchy for school classification would have "middle school" and "high school" as subordinate concepts to the concept "secondary school."

When creating a concept type, it typically includes the following attributes:

- name (concept name, required)
- alias (concept alias, optional)
- stdId (standard ID, optional)

When importing concepts, a hyphen (-) is used as a separator for the hierarchical relationship. Each concept must provide a complete hierarchy of its superordinate concepts.

Here is an example of concept instances for school classification:

```json
[
  {
    "name": "public institution",
    "alias": "public, public school"
  },
  {
    "name": "public institution-public university",
    "alias": null
  },
  {
    "name": "public institution-public university-comprehensive public university",
    "alias": "public comprehensive university"
  }
]
```

## Semantic relations between SPG types

![image.png](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*3s79QouHNicAAAAAAAAAAAAADtmcAQ/original)

- HYP: Hypernym, refers to the relation where a broader or more general concept includes or encompasses another more specific or particular concept. The available predicates are "isA" and "locateAt", while other predicates are yet to be expanded.
- SYNANT: Synonymy/Antonymy, expresses whether concepts are synonymous or antonymous to each other. The available predicates are "synonym" and "antonym", while other predicates are yet to be expanded.
- CAU: Causality, represents the relation where one event or action (cause) leads to another event or action (effect). The available predicate is "leadTo", while other predicates are yet to be expanded.
- SEQ: Sequentiality, refers to a sequence of events or actions that occur in a specific order. The available predicate is "happenedBefore", while other predicates are yet to be expanded.
- IND: Induction, refers to the relation where general concepts are derived from a group of entities with common characteristics. The available predicate is "belongTo", while other predicates are yet to be expanded.
- INC: Inclusion, expresses the relation between a part and a whole. The available predicate for this relationship is "isPartOf", while other predicates are yet to be expanded.

# Declarative Schema

Operators are not defined in the declarative Schema, they are bound by the release of KNext (refer
to [KNext Tutorial](/tutorial/knext) for operator development).

## KeyWords

```
namespace

EntityType, ConceptType, EventType, ->, STD.*, Text, Float, Integer

desc, constraint, value, properties, relations, rule, hypernymPredicate

NotNull, MultiValue, Enum, Regular
```

> -> Used to express the inheritance relationship of a type, A -> B
>
> STD.\* Anything beginning with STD. is a reserved keyword, used as a standard type name.

## Basic Syntax

Similar to YAML, indentation is used as a representation of scopes. Four spaces are recommended for indentation (tab
characters are treated as two spaces)

- **A(B): C**
  - A is the English name of the type/property
  - B is the Chinese name of the type/property
  - C is the value
- **A(B)->P**
  - A is the English name of the type
  - B is the Chinese name of the type
  - P is the parent type to be inherited from
- **namespace A**
  - A is the project prefix, which must appear in the first line of the Schema file. The project prefix is
    automatically spliced into the entity type name when the Schema is submitted.

## Syntax

There are 6 levels of indentation, listed in order of indentation:

- Level 1 (no indentation): defines the type, namespace
- Level 2: Define meta-information about the type, such as description, attributes, relationships, etc.
- Layer 3: Define names and types of attributes/relationships.
- Layer 4: Define meta-information about attributes/relationships, e.g., constraints, subattributes, logical rules, etc.
- Layer 5: Define names and types of sub-properties
- Layer 6: Define meta-information about sub-properties, e.g., descriptions, constraints, etc.

```yaml
namespace DEFAULT

TypeA("Entity type A"): EntityType
    desc: "Entity Type Description"
    properties:
        property1("Attribute1"): STD.ChinaMobile
            desc: "Description of Attribute 1"
                constraint: NotNull, MultiValue
            properties:
                property2("Subproperties 1"): Text
                    desc: "Subproperties 1, enumerated constraint"
                    constraint: NotNull, Enum="A,B,C"
                property3("Subproperties 3"): Text
                    desc: "Subproperties 3, regular constraint"
                    constraint: Regular="^abc[0-9]+$"
                property4("Subproperties 4"): Text
                    rule: [ [
                        Define property4...
                    ] ]
    relations:
        relation1("relation1"): TypeA
            desc: "Description of relationship 1"
            properties:
                confidence("confidence level"): Float
            rule: [ [
                Define relation1...
            ] ]

TypeB("Entity type B") -> TypeA:
    desc: "This is a subtype of entity type A"
```

### Define entity types

```yaml
# defines an entity type for a company
Company("company"): EntityType

  # defines an entity type that inherits from company
    ListedCompany("listed company") -> Company.
```

#### Defining Attributes and Relationships

```yaml
Company("company"): EntityType
    # the description of the company
    desc: "description of the company"
    properties:
        # Define properties
        address("address"): Text
            # Define the address property as a non-null constraint here, in addition to MultiValue, Enum and Regular.
            constraint: NotNull
        industry("industry"): Industry
        # Each type creates id, name, and description attributes by default, all of type Text.
        # id (primary key): Text
        # name: Text
        # description: Text
    relations:
        # Define relationships
        subCompany("sub company"): Company
```

#### Defining sub-properties

```yaml
Company("company"): EntityType
    desc: "Description of the company"
    properties:
        address("address"): Text
            # Define the confidence of the address sub-property.
            confidence: Float
        industry("industry"): Industry
```

#### Defines the predicate logic

```yaml
Company("company"): EntityType
    desc: "Description of the company"
    relations:
        Risk("risk association"): Company
            # Define the predicate logic of the relationship here, using [[ and ]] as delimiters for the logic rules
            rule: [ [
                Define (s:Comapny)-[ p:risk ]->(o:Company) {
                                                               ... ...
                }
            ] ]
```

### Define concept types

```yaml
Industry("Company Industry Classification"): ConceptType
    # Define the context predicate for the concept here, defaults to isA, you can specify isA and locateAt.
    hypernymPredicate: isA
```

### Define the event type

```yaml
CompanyRiskEvent("Corporate risk events"): EventType
    properties:
        # Here the subject of the event type is defined as a company, and the event type must define a subject subject
        subject: Company
```

## schema example

```yaml
namespace DEFAULT

Symptom("symptom"): EntityType

Drug("drug"): EntityType

Indicator("indicator"): EntityType

BodyPart("body part"): ConceptType
    hypernymPredicate: isA

HospitalDepartment("hospital department"): ConceptType
    hypernymPredicate: isA

Disease("disease"): EntityType
    properties:
        complication("complication"): Disease
            constraint: MultiValue

        commonSymptom("common symptom"): Symptom
            constraint: MultiValue

        applicableDrug("applicable drug"): Drug
            constraint: MultiValue

        department("department"): HospitalDepartment
            constraint: MultiValue

        diseaseSite("disease site"): BodyPart
            constraint: MultiValue

    relations:
        abnormal("abnormal"): Indicator
            properties:
                range("range"): Text
                color("color"): Text
                shape("shape"): Text
```

# Objectified Schema

After the Schema is released, a python class is generated based on the project prefix：<br />
knext/example/schema/project/DEFAULT.py<br />knext/example/schema/project/Fraud.py

> The class name is the prefix name of the project
> Class member variable is the type name under the project

```python
class DEFAULT:
    def __init__(self):
        self.Disease = self.Disease()
        self.Symptom = self.Symptom()
        self.Drug = self.Drug()
        self.BodyPart = self.BodyPart()
        self.HospitalDepartment = self.HospitalDepartment()
        pass

    class Disease:
        __typename__ = "DEFAULT.Disease"
        id = "id"
        name = "name"
        commonSymptom = "commonSymptom"
        complication = "complication"
        applicableDrug = "applicableDrug"
        department = "department"
        diseaseSite = "diseaseSite"

        def __init__(self):
            pass

    class Symptom:
        __typename__ = "DEFAULT.Symptom"
        id = "id"
        name = "name"

        def __init__(self):
            pass

    class Drug:
        __typename__ = "DEFAULT.Drug"
        id = "id"
        name = "name"

        def __init__(self):
            pass

    class BodyPart:
        __typename__ = "DEFAULT.BodyPart"
        id = "id"
        name = "name"
        alias = "alias"
        stdId = "stdId"

        def __init__(self):
            pass

    class HospitalDepartment:
        __typename__ = "DEFAULT.HospitalDepartment"
        id = "id"
        name = "name"
        alias = "alias"
        stdId = "stdId"

        def __init__(self):
            pass
```

The code is as follows when the user uses schema:

> You need to import the project schema class first.

```python
from knext.example.schema.project.DEFAULT import DEFAULT

if __name__ == '__main__':
    disease_name = DEFAULT.Disease.name
    ......
    commonSym = DEFAULT.Disease.commomSymptom
    ......

    # Entity Link Mapping Component Definitions
    mapping_disease = EntityMappingComponent(
        spg_type=DEFAULT.Disease
    ).add_field("id", "id")
    .add_field("name", DEFAULT.Disease.name)
    .add_field("commonSymptom", DEFAULT.Disease.commonSymptom)
    .add_field("applicableDrug", DEFAULT.Disease.applicableDrug)
    .add_field("complication", DEFAULT.Disease.complication)

```

# Create schema with the python API

### Syntax

#### initialize

```python
schema = Schema()
```

#### Schema interface

```python
session = schema.create_session()
```

> create_session represents the creation of a Schema change session, which will contain all the Schema information of the current project.

#### Session interface

```python
session.create_type(disease)
session.update_type(disease)
session.delete_type(disease)
session.commit()
```

> create_type is for create entity type operation, update_type is for update operation, and delete_type is for delete operation.
>
> commit for committing Schema changes

### example

```python
schema = Schema()

# create session
session = schema.create_session()

# The modeling example above, implemented in code：
hospital_department = ConceptType(
    name="DEFAULT.HospitalDepartment",
    name_zh="医院科室",
    hypernym_predicate=HypernymPredicateEnum.IsA
)

body_part = ConceptType(
    name="DEFAULT.BodyPart",
    name_zh="人体部位",
    hypernym_predicate=HypernymPredicateEnum.IsA
)

drug = EntityType(
    name="DEFAULT.Drug",
    name_zh="药品"
)

symptom = EntityType(
    name="DEFAULT.Symptom",
    name_zh="症状"
)

disease = EntityType(
    name="DEFAULT.Disease",
    name_zh="疾病",
    properties=[
        Property(
            name="commonSymptom",
            name_zh="常见症状",
            object_type_name="DEFAULT.Symptom"
        ),
        Property(
            name="applicableDrug",
            name_zh="适用药品",
            object_type_name="DEFAULT.Drug"
        ),
        Property(
            name="department",
            name_zh="就诊科室",
            object_type_name="DEFAULT.HospitalDepartment"
        ),
        Property(
            name="diseaseSite",
            name_zh="发病部位",
            object_type_name="DEFAULT.BodyPart"
        ),
        Property(
            name="complication",
            name_zh="并发症",
            object_type_name="DEFAULT.Disease"
        )
    ]
)

# create entity type
session.create_type(hospital_department)
session.create_type(body_part)
session.create_type(drug)
session.create_type(symptom)
session.create_type(disease)

# commit schema change
session.commit()
```
