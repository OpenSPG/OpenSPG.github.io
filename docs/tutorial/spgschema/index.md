---
title: SPG Schema
order: 4
---

# SPG-Schema知识建模

# Schema类型

在这个章节里，我们将介绍SPG里的实体、事件和概念类型等基础知识。

## 实体类型 (EntityType)

实体类型，定义了具有共同数据结构（特征）的一类实例的集合，是一种多元要素的复合节点类型。通常实体类型用于描述客观世界中的一个具体事物，比如公司、学校、书籍等等。再以学校这个实体类型举例，它的实例可以有“xxx市第一小学”、“xxx大学”等。

实体类型的定义主要由属性和关系组成，属性的值域可以是文本、整数和浮点数这样的基础类型，也可以是概念、实体等高级类型。使用了高级类型做值域的属性，会同时产生从自身指向高级类型的关系。这也是SPGSchema的一个重要特性。

关系的定义需要在起点实体类型上定义，方向始终为出边方向。关系上也可以再定义属性，但值域只允许是基础类型。

实体类型会包含几个默认属性，在知识建模中无须额外定义：

- id (主键，必填)
- name (实体名称)
- description (实体描述)

以学校举例，实体类型的属性可以有如下：

```yaml
enName(英文名): Text
shortName(简称): Text
founder(创办人): Person
foundDate(创立日期): STD.Date
category(类别): TaxonomySchool
address(地址): Text
```

那学校实体类型的实例可以是：

```json
{
  "id": "zjdx",
  "name": "浙江大学",
  "enName": "Zhejiang University",
  "shortName": "浙大、ZJU",
  "founder": "林启",
  "foundDate": "18970521",
  "category": "公立大学",
  "address": "西溪校区：杭州市西湖区天目山路148号"
}
```

## 事件类型 (EventType)

在实体类型的基础上，加入主体、客体、时间、空间这四类要素，是对动态行为的建模，旨在反映在不同空间、时间区间上事物的状态。例如政策事件、行业事件、用户行为事件，都属于事件类型。其中主体要素是必须具备的，其余要素是可选的。

事件类型跟实体类型都是对客观事物的抽象描述，但实体类型包含的是相对静态的客观属性和关系，缺少了随时间、空间的发展而产生的动态变化，从而存在片面性，缺乏了深层语义信息。例如表达“XX公司在10月28日在深交所挂牌上市”。

以企业事件类型举例，其属性可以有如下：

```yaml
subject(主体): Company
object(客体): Text
time(时间): STD.Date
location(地点): Text
behavior(行为): Behavior
```

那学校实体类型的实例可以是：

```json
{
  "id": "2023100820394930",
  "name": "XX公司在10月28日在深交所挂牌上市",
  "subject": "XX公司",
  "object": "深交所",
  "time": "20231028",
  "location": "深交所",
  "behavior": "上市"
}
```

## 概念类型 (ConceptType)

概念是对一类具有共同特征的实体的抽象化描述，通常是用于描述实体/事件类型的分类。比如学校分类概念：小学、中学、大学。概念跟实体的区别是概念无法指代一个客观世界的具体事物，它是对一类事物的总结概括型描述。

同时，概念和概念之间还默认具备上位关系（可以在建模时候选择上位关系谓词），通过该关系形成往上泛化、往下具化的抽象描述。比如学校分类概念的“初级中学”、“高级中学”的上位关系是“中学”。

实体类型和概念类型的区别，实体类型往往跟业务强相关，比如电商业务的用户、商户和商品等。而概念类型则通常和行业共识、领域常识强相关，比如学生、白领、公务员这些个概念是从职业角度对用户的分类概括，又比如五星商户、高信用商户这些概念是对商户的分类概括，再比如数码产品、母婴产品是对商品的分类概括。

概念类型在创建时，会默认包含如下属性：

- name (概念名称，必填)
- alias (概念别名，选填)
- stdId (标准ID，选填)

概念在导入的时候，使用短横-符号作为上位关系分隔符，每个概念需要完整给出所有的上位关系。
以学校分类概念举例概念实例：

```json
[
  {
    "name": "公立院校",
    "alias": "公立,公立学校"
  },
  {
    "name": "公立院校-公立大学",
    "alias": null
  },
  {
    "name": "公立院校-公立大学-公立综合类大学",
    "alias": "公立综合大学"
  }
]
```

## 类型间的语义关联

![image.png](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*3s79QouHNicAAAAAAAAAAAAADtmcAQ/original)

- HYP: 上位关系(Hypernym)，是指一种更广泛或更一般的概念包含或包括另一种更具体或更特定的概念的关系。目前可用的谓词为isA、locateAt，其他谓词尚待扩展。
- SYNANT: 同义反义关系(Synonymy/Antonymy)，表达概念之间是同义还是反义的关系。目前可用的谓词有synonym、antonym，其他谓词尚待扩展。
- CAU: 因果关系(Causal)，表示指一个事件或行为（原因）导致另一个事件或行为（结果）发生的一类关系。目前可用的谓词有leadTo，其他谓词尚待扩展。
- SEQ: 顺承关系(Sequential)，是连续发生的事情或动作，这些事情或动作有先后顺序。目前可用的谓词有happenedBefore，其他谓词尚待扩展。
- IND: 归纳关系(Induction)，是指从一类有共同特征的实体中得出对这些实体概括性的概念，这种个体和概念之间的关系就是归纳关系。目前可用的谓词有belongTo，其他谓词尚待扩展。
- INC: 包含关系(Inclusion)，表达部分与整体的关系。目前可用的谓词有isPartOf，其他谓词尚待扩展。

# 声明式Schema

在声明式Schema里不定义算子，算子由KNext的发布来绑定（算子开发参考[KNext教程](/tutorial/knext)）。

## 关键字

```
namespace

EntityType, ConceptType, EventType, ->, STD.*, Text, Float, Integer

desc, constraint, value, properties, relations, rule, hypernymPredicate

NotNull, MultiValue, Enum, Regular
```

> -> 用于表达类型的继承关系，A -> B
>
> STD.\*表示以STD.开头的都是预留关键字，作标准类型名称

## 基础句法

类似YAML，以缩进作为作用域的表示。缩进建议使用4个空格（Tab符会被当做两个空格）

- **A(B): C**
  - A为类型/属性的英文名
  - B为类型/属性的中文名称
  - C为取值
- **A(B)->P**
  - A为类型的英文名
  - B为类型的中文名称
  - P为要继承自的父类型
- **namespace A**
  - A表示项目前缀，在Schema文件的第一行必须出现。项目前缀会在Schema提交的时候自动拼接到实体类型名称的前面
- **[[...]]**
  - 规则脚本的定界符，仅用于rule的定义，类似于Python的"""用法

声明式Schema脚本采用逐行解析的方式，定义上要遵循顺序原则，即父类型要在子类型之前定义、属性上使用的类型也需要在其所属类型定义之前先定义好。

## 语法结构

总共分类6层缩进，按缩进的多少依次为：

- 第一层（无缩进）：定义类型、命名空间
- 第二层：定义类型的元信息，比如描述、属性、关系等
- 第三层：定义属性/关系的名称和类型
- 第四层：定义属性/关系的元信息，比如约束、子属性、逻辑规则等
- 第五层：定义子属性的名称和类型
- 第六层：定义子属性的元信息，比如描述、约束

```yaml
namespace DEFAULT

TypeA(实体类型A): EntityType
    desc: 实体类型描述
    properties:
        property1(属性1): STD.ChinaMobile
            desc: 属性1的描述
                constraint: NotNull, MultiValue
            properties:
                 property2(属性1的子属性): Text
                     desc: 属性1的子属性，枚举约束
                     constraint: NotNull, Enum="A,B,C"
                 property3(属性1的子属性): Text
                     desc: 属性1的子属性，正则约束
                     constraint: Regular="^abc[0-9]+$"
                 property4(属性4): Text
                      rule: [[
                        Define property4...
                       ]]
    relations:
        relation1(关系1): TypeA
            desc: 关系1的描述
            properties:
                 confidence(置信度): Float
            rule: [[
               Define relation1...
            ]]

TypeB(实体类型B) -> TypeA:
    desc: 这是实体类型A的子类型
```

### 定义实体类型

```yaml
# 以下定义一个公司的实体类型
Company(公司): EntityType

# 以下是定义一个继承自公司的实体类型
ListedCompany(上市公司) -> Company:
```

#### 定义属性和关系

```yaml
Company(公司): EntityType
    # 这里是公司的描述
    desc: 公司的描述
    properties:
        # 这里定义属性
        address(地址): Text
            # 这里定义地址属性为非空约束，除此还可以定义MultiValue(多值，英文逗号分割)、Enum(枚举)和Regular(正则)
            constraint: NotNull
        industry(行业): Industry
        # 每个类型会默认创建id、name和description属性，都是Text类型
        # id(主键): Text
        # name(名称): Text
        # description(描述): Text
    relations:
        # 这里定义关系
        subCompany(子公司): Company
```

#### 定义子属性

```yaml
Company(公司): EntityType
    desc: 公司的描述
    properties:
        address(地址): Text
          # 这里定义地址的子属性置信度
          confidence(置信度): Float
        industry(行业): Industry
```

#### 定义谓词逻辑

```yaml
Company(公司): EntityType
    desc: 公司的描述
    relations:
        risk(风险关联): Company
            # 这里定义关系的谓词逻辑，使用 [[ 和 ]] 作为逻辑规则的定界符
            rule: [[
               Define (s:Comapny)-[p:risk]->(o:Company) {
                    ... ...
               }
            ]]
```

### 定义概念类型

```yaml
Industry(公司行业分类): ConceptType
    # 这里定义概念的上下位关系谓词，默认为isA，可以指定isA和locateAt
    hypernymPredicate: isA
```

### 定义事件类型

```yaml
CompanyRiskEvent(公司风险事件): EventType
    properties:
        # 这里定义事件类型的主体为公司，事件类型必须定义主体subject
        subject: Company
```

## 建模示例

```yaml
namespace Medical

Symptom(症状): EntityType

Drug(药品): EntityType

Indicator(医学指征): EntityType

BodyPart(人体部位): ConceptType
    hypernymPredicate: isA

HospitalDepartment(医院科室): ConceptType
    hypernymPredicate: isA

Disease(疾病): EntityType
    properties:
        complication(并发症): Disease
            constraint: MultiValue

        commonSymptom(常见症状): Symptom
            constraint: MultiValue

        applicableDrug(适用药品): Drug
            constraint: MultiValue

        department(就诊科室): HospitalDepartment
            constraint: MultiValue

        diseaseSite(发病部位): BodyPart
            constraint: MultiValue

    relations:
        abnormal(异常指征): Indicator
            properties:
                range(指标范围): Text
                color(颜色): Text
                shape(性状): Text
```

# 对象化Schema

每次Schema变更发布后，根据项目前缀生成一个python类，比如medical例子：<br />
knext/examples/medical/schema/medical_schema_helper.py

> 类名为项目前缀名称
> 类的成员变量为该项目下的类型名称

```python
class Medical:
    def __init__(self):
        self.Disease = self.Disease()
        self.Symptom = self.Symptom()
        self.Drug = self.Drug()
        self.BodyPart = self.BodyPart()
        self.HospitalDepartment = self.HospitalDepartment()
        pass

    class Disease:
        __typename__ = "Medical.Disease"
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
        __typename__ = "Medical.Symptom"
        id = "id"
        name = "name"

        def __init__(self):
            pass

    class Drug:
        __typename__ = "Medical.Drug"
        id = "id"
        name = "name"

        def __init__(self):
            pass

    class BodyPart:
        __typename__ = "Medical.BodyPart"
        id = "id"
        name = "name"
        alias = "alias"
        stdId = "stdId"

        def __init__(self):
            pass

    class HospitalDepartment:
        __typename__ = "Medical.HospitalDepartment"
        id = "id"
        name = "name"
        alias = "alias"
        stdId = "stdId"

        def __init__(self):
            pass
```

用户使用的时候，代码如此写：

> 需要先import项目schema类

```python
from knext.examples.medical.schema.medical_schema_helper import Medical

if __name__ == '__main__':

    disease_name = Medical.Disease.name
    ... ...
    common_symptom = Medical.Disease.commomSymptom
    ... ...

    # 加工链路映射组件定义
    mapping_disease = EntityMappingComponent(
        spg_type=MEDICAL.Disease
    ).add_field("id", "id") \
        .add_field("name", Medical.Disease.name) \
        .add_field("commonSymptom", Medical.Disease.commonSymptom) \
        .add_field("applicableDrug", Medical.Disease.applicableDrug) \
        .add_field("complication", Medical.Disease.complication)
```

# 通过python API创建schema

### 语法

#### 初始化

```python
schema = Schema()
```

#### Schema类接口

```python
session = schema.create_session()
```

> create_session代表创建一个Schema变更的Session，在Session里会包含所有当前项目的Schema信息

#### Session类接口

```python
session.create_type(disease)
session.update_type(disease)
session.delete_type(disease)
session.commit()
```

> create_type代表创建类型、update_type代表更新类型、delete_type代表删除类型
>
> commit为提交Schema变更

### 完整例子

```python
schema = Schema()

# 创建session
session = schema.create_session()

# 以上面的建模例子，用代码实现
hospital_department = ConceptType(
    name="Medical.HospitalDepartment",
    name_zh="医院科室",
    hypernym_predicate=HypernymPredicateEnum.IsA
)

body_part = ConceptType(
    name="Medical.BodyPart",
    name_zh="人体部位",
    hypernym_predicate=HypernymPredicateEnum.IsA
)

drug = EntityType(
    name="Medical.Drug",
    name_zh="药品"
)

symptom = EntityType(
    name="Medical.Symptom",
    name_zh="症状"
)

disease = EntityType(
    name="Medical.Disease",
    name_zh="疾病",
    properties=[
        Property(
            name="commonSymptom",
            name_zh="常见症状",
            object_type_name="Medical.Symptom"
        ),
        Property(
            name="applicableDrug",
            name_zh="适用药品",
            object_type_name="Medical.Drug"
        ),
        Property(
            name="department",
            name_zh="就诊科室",
            object_type_name="Medical.HospitalDepartment"
        ),
        Property(
            name="diseaseSite",
            name_zh="发病部位",
            object_type_name="Medical.BodyPart"
        ),
        Property(
            name="complication",
            name_zh="并发症",
            object_type_name="Medical.Disease"
        )
    ]
)

# 定义创建类型
session.create_type(hospital_department)
session.create_type(body_part)
session.create_type(drug)
session.create_type(symptom)
session.create_type(disease)

# 提交Schema变更
session.commit()
```
