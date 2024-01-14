---
title: 知识建模
order: 2
---

知识建模是开始一个图谱项目的第一步，是对该领域业务的抽象建模过程。

SPG在属性图(LPG)的基本节点类型和边类型之上扩展并引入更多主体分类模型对节点类型进行扩充以兼容更加多元的知识表示，扩展的主体类型分为实体类型、事件类型、概念类型和标准类型。同时SPG还支持了属性的可传播能力，即在实体类型和事件类型上，可以定义其属性的类型为实体类型、概念类型或者标准类型。按此方式定义，类型除了具备这些属性以外，还会自动产生跟属性同名的关系，这样建模的时候无须再纠结是建成属性还是关系，定义了属性自然也就定义了关系，在导入数据时只需导入实体，关系就会自动创建。这也是在SPG里推荐的建模方式，以属性的定义替代简单关系的定义。

SPG也可以单独定义关系。SPG中的关系需在其头节点类型下定义，不同的关系是依赖（头节点类型，关系名称，尾节点类型）这样的三元组进行区分，也就是不同的关系可以保持关系名称相同，但是头节点类型和尾节点类型不能完全相同。关系支持再定义属性，但关系属性的类型只能是文本、整数或浮点数这样的基本类型。单独定义的关系，在SPG里还支持逻辑规则的表达，即定义的关系实例可以通过规则计算得到而无须导入数据实例。定义的方式可以参见声明式Schema章节，规则的语法可以参见知识推理的KGDSL语法章节。

### 实体类型 (EntityType)

实体类型，定义了具有共同数据结构（特征）的一类实例的集合，是一种多元要素的复合节点类型。通常实体类型用于描述客观世界中的一个具体事物，比如公司、学校、书籍等等。再以学校这个实体类型举例，它的实例可以有“xxx市第一小学”、“xxx大学”等。
实体类型的定义主要由属性和关系组成，属性的值域可以是文本、整数和浮点数这样的基础类型，也可以是概念、实体等高级类型。使用了高级类型做值域的属性，会同时产生从自身指向高级类型的关系。这也是SPGSchema的一个重要特性。这里需要解释一下，在SPG里如何实现属性到关系的转换的，主要是两种策略：

- 属性值与目标实体的主键相等。在类型上没有绑定链指算子的时候，就会按这个策略执行。SPG会自动产生如下三元组的关系实例：（实体，属性名称，属性值）

属性值经过目标实体类型上的链指算子运算后得到目标实体。相比上一种情况，这里的属性值通常不是目标实体的主键，而可能是目标实体的某个属性值，比如名称等。关系的建立需要知道目标实体的主键，所以需要依靠在目标类型上绑定的链指算子，来对属性值进行相应策略的计算（比如通过文本搜索）得到目标实体的主键，最终生成如下三元组关系实例：（实体，属性名称，目标实体主键）

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
  "shortName": "浙大,ZJU",
  "founder": "林启",
  "foundDate": "18970521",
  "category": "公立大学",
  "address": "西溪校区：杭州市西湖区天目山路148号"
}
```

以上实例导入后会形成如下子图：

![](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*eHxoRJiGqUoAAAAAAAAAAAAADtmcAQ/original)

### 事件类型 (EventType)

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

实例导入后形成如下子图：

![](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*YxBRSoAp2vMAAAAAAAAAAAAADtmcAQ/original)

### 概念类型 (ConceptType)

概念是对一类具有共同特征的实体的抽象化描述，通常是用于描述实体/事件类型的分类。比如学校分类概念：小学、中学、大学。概念跟实体的区别是概念无法指代一个客观世界的具体事物，它是对一类事物的总结概括型描述。
同时，概念和概念之间还默认具备上位关系（可以在建模时候选择上位关系谓词），通过该关系形成往上泛化、往下具化的抽象描述。比如学校分类概念的“初级中学”、“高级中学”的上位关系是“中学”。概念类型不允许创建念之间语义谓词以外的属性/关系，具体有哪些概念之间的语义见第二章。
实体类型和概念类型的区别，实体类型往往跟业务强相关，比如电商业务的用户、商户和商品等。而概念类型则通常和行业共识、领域常识强相关，比如学生、白领、公务员这些个概念是从职业角度对用户的分类概括，又比如五星商户、高信用商户这些概念是对商户的分类概括，再比如数码产品、母婴产品是对商品的分类概括。
概念类型在创建时，会默认包含如下属性：

- name (概念名称，必填)
- alias (概念别名，选填)
- stdId (标准ID，选填)

:::warning
除了默认属性外，概念类型不允许再创建属性，如果建模中发现确实需要属性描述的可以额外再创建一个实体类型。
:::
概念在导入的时候，使用短横-符号作为上位关系分隔符，每个概念需要完整给出所有的上位关系。 以学校分类概念举例概念实例：

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

导入后形成如下子图：

![](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*xijrRptZW1YAAAAAAAAAAAAADtmcAQ/original)

### 标准类型 (StandardType)

标准类型是系统内置的一种用于描述属性类型的特殊定义，通过正则约束对属性进行标准化，并且部分标准类型可以实现可传播效果，即标准类型的实例是单独的节点，属性值会被自动转换成节点，并跟实体形成连通关系。

| **标准类型英文名** | **标准类型中文名** | **正则约束**                                                                                                                                                                                           | **可传播** |
| ------------------ | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| STD.ChinaMobile    | 国内手机号         | ^((13[0-9])&#124;(14[5,7,9])&#124;(15([0-3]&#124;[5-9]))&#124;(16[5,6])&#124;(17[0-8])&#124;(18[0-9])&#124;(19[1,5,8,9]))[0-9]{8}$                                                                     | 是         |
| STD.Email          | 电子邮箱           | ^([a-zA-Z0-9]_[-_.]?[a-zA-Z0-9]+)_@([a-zA-Z0-9]\*[-_]?[a-zA-Z0-9]+)+[.][A-Za-z]{2,3}([.][A-Za-z]{2})?$                                                                                                 | 是         |
| STD.IdCardNo       | 身份证号           | ^[1-9]{1}[0-9]{5}(19&#124;20)[0-9]{2}((0[1-9]{1})&#124;(1[0-2]{1}))((0[1-9]{1})&#124;([1-2]{1}[0-9]{1}&#124;(3[0-1]{1})))[0-9]{3}[0-9xX]{1}$                                                           | 是         |
| STD.MacAddress     | MAC地址            | ([A-Fa-f0-9]{2}-){5}[A-Fa-f0-9]{2}                                                                                                                                                                     | 是         |
| STD.Date           | 数字日期           | [1,2][0-9][0-9]\[0-9\](0[1-9]&#124;1[0-2])(0[1-9]&#124;[1,2][0-9]&#124;3[0,1])                                                                                                                         | 否         |
| STD.ChinaTelCode   | 国内通讯号         | ^(400[0-9]{7})&#124;(800[0-9]{7})&#124;(0[0-9]{2,3}-[0-9]{7,8})&#124;((13[0-9])&#124;(14[5,7,9])&#124;(15([0-3]&#124;[5-9]))&#124;(16[5,6])&#124;(17[0-8])&#124;(18[0-9])&#124;(19[1,5,8,9]))[0-9]{8}$ | 是         |
| STD.Timestamp      | 时间戳             | ^(\\d{10})&#124;(\\d{13})$                                                                                                                                                                             | 否         |