---
title: 建模最佳实践
order: 2
nav:
  second:
    order: 2
    title: 知识建模
---

为了方便大家更好地理解和应用OpenSPG构建知识图谱，我们从SPGSchema建模的最佳实践中总结出了7个原则，每个原则都搭配了相关示例进行说明。期望通过这些原则能解决大家在建模时的疑惑，能充分发挥OpenSPG高效且强大的知识表达能力。

# 1、类型选择原则

![](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*l1nISolnG3AAAAAAAAAAAAAADtmcAQ/original)

### 原则1：复杂多元结构用实体类型或事件类型

:::info
**解释：**当一个事物需要丰富的属性来进行描述，比如某个“公司”，不光是只用一个名称，还要借助经营范围、企业证件号码、注册地址等信息来描述，就适合使用实体类型进行建模。
:::

![image.png](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*3GntTLnB4f4AAAAAAAAAAAAADtmcAQ/original)

### 原则2：扁平化的分类标签用概念类型

:::info
**解释：**当目标建模对象仅仅是语言或文本意义上的分类标签，重点表达标签之间的上位、包含、因果等关系时，适合使用概念类型来进行建模，比如“矿石开采”、“矿石冶炼”这类表达对产业分类的标签。概念和实体、事件的区别是：

1. **多元结构 vs 一元结构: ** 如公司类型，有所在行政区域、所属行业、经营产品类目等多元属性定义，每个属性关联一个具体的概念类型。
   而行政区域、行业类目、产品类目都是一元结构的概念分类，重点表达的是类目之间的上下位关系。
2. **同名建模冲突处理机制：**
   比如杭州市，若描述其特产、人口、区号等信息时应使用实体类型进行建模，但同时杭州市也可以作为一个行政区划的角度来使用，主要说明杭州市位于浙江省，浙江省又位于中国，此时杭州市、浙江省、中国都属于行政区划的一个实例，它们重点表达相互间的地理上的位于关系。
   这个时候，建议创建一个实体类型的同时又再创建一个概念类型，杭州市作为这两种类型的实例分别导入。
   :::
   以如下Schema为例：

```yaml
namespace CKG

AdministractiveArea(行政区划): ConceptType
  hypernymPredicate: locateAt

... ...

City(城市): EntityType
  properties:
    localProducts(特产): Product
      constraint: MultiValue
    population(人口数量): Integer
    areaCode(区号): Text
    region(行政区划): AdministractiveArea
```

```
“City(城市)”的实体:
{
  "id": "hz",
  "name": "杭州市",
  "areaCode": "0571",
  "region": "中国-浙江省-杭州市"
}

“AdministractiveArea(行政区划)”的概念：
 中国 <-locateAt- 浙江省 <-locateAt- 杭州市
```

### 原则3：实体/事件多类型使用动态分类原则

:::info
**解释：**
客观世界对同一个事物会有多种分类，比如表示商铺的分类有：超市、便利店、加油站、洗车店等，如果按照这些不同分类视角分别进行实体类型建模，会造成图谱的类型爆炸，在数据构建和推理应用上会变得非常麻烦。SPG使用类型定义 +
分类概念的方式实现多分类来解决这个问题。
:::
以商铺为例子。建模时先创建一个“商铺”的实体类型，然后再为这个实体类型创建一个“商铺分类”的概念类型用于分类。注意定义上要把概念类型放到实体类型的前面：

```yaml
namespace World

TaxonomyOfShop(商铺分类): ConceptType
  hypernymPredicate: isA

Shop(商铺): EntityType
  desc: 诸如便利店和加油站等
  properties:
    locateArea(所在区域): AdministractiveArea
    address(地址): Text
    contactPhone(联系电话): STD.ChinaTelCode
    IND#belongTo(属于): TaxonomyOfShop
```

然后准备“商铺分类”的概念数据作导入用：

```
超市
便利店
加油站
洗车店
```

导入“Shop(商铺)”的实例数据的时候，如下所示：

```
id,name,locateArea,address,contactPhone,belongTo

1,罗森便利店,杭州市,浙江省杭州市西湖区西溪路588号1层,0571-85801525,便利店

2,中国石化(杭州古荡加油站),杭州市,浙江省杭州市西湖区天目山路331号,0571-85220839,加油站
```

通过belongTo属性的值会自动产生从实例到概念的边，实现对实体的分类。

![](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*grXfT7FsX-0AAAAAAAAAAAAADtmcAQ/original)

在查询时，我们可以直接用概念类型“TaxonomyOfShop”指代类型“Shop”，实现按概念召回对应的实体。实现跟使用类型分别建模的效果，但是大幅简化数据的查询和维护。

```graphql
MATCH (s:`TaxonomyOfShop`/`便利店`) RETURN s
# 返回id为1的"罗森便利店"实体

MATCH (s:`TaxonomyOfShop`/`加油站`) RETURN s
# 返回id为1的"中国石化(杭州古荡加油站)"实体
```

另外，SPGSchema也支持以规则作为概念挂载依据，即通过规则对实体的属性进行运算得出要挂载的概念名称。
比如我们可以通过定义如下的概念规则，根据实体的名称里的关键词自动分类：

```graphql
Define (s:Shop)-[p:belongTo]->(o:`TaxonomyOfShop`/`便利店`) {
    Structure {
        (s)
    }
    Constraint {
        R1("是便利店"): s.name like "%便利店%"
    }
}

Define (s:Shop)-[p:belongTo]->(o:`TaxonomyOfShop`/`加油站`) {
    Structure {
        (s)
    }
    Constraint {
        R1("是加油站"): s.name like "%加油站%"
    }
}
```

导入“Shop(商铺)”的实例数据的时候，不再导入belongTo属性：

```
id,name,city,address,contactPhone

1,罗森便利店,杭州市,浙江省杭州市西湖区西溪路588号1层,0571-85801525

2,中国石化(杭州古荡加油站),杭州市,浙江省杭州市西湖区天目山路331号,0571-85220839
```

数据导入完成后，查询可得到belongTo属性的值和关系：

```graphql
MATCH (s:Shop WHERE id="1")-[p:belongTo]-(o) RETURN s,p,o
```

![](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*w9dWT7gk7FMAAAAAAAAAAAAADtmcAQ/original)

:::warning
**注意：**
如果概念定义了归纳规则，但在数据导入时又导入了belongTo属性值，会以规则运算结果优先。
:::

### **原则4：概念类型不继承**

:::info
**解释：**概念类型的父类有且只有Thing，不能继承其他的类型。因为概念本身默认会有上下位关系，就隐含继承的语义。如果概念类型再继承，在语义上就会有冲突。
:::

# 2、属性/关系的选择原则

### 原则5：关系的指向遵守由动到静原则，反之被禁止

:::info
**解释：**事件类型可指向任意类型，实体类型不可指向事件类型，概念类型只能指向概念类型，反之被禁止。

1. **事件允许指向任意类型： **事件都是独立发生的行为动作，实体/概念/标准类型是被动跟发生的事件关联，所以是事件类型指向任意类型，反之禁止。
2. **实体禁止指向事件类型：**实体都是多元要素的复杂对象，它可以和其他实体主动产生关联，但概念类型、标准类型只能做为实体的属性类型。因为实体本身不自动产生事件，所以实体禁止直接建立和事件的关系。
3. **概念禁止指向多元类型：**概念是扁平化的分类标签，它抽象描述一类共同特征的实体集合，所以它只能被事件或实体用作属性类型的定义，反之禁止。
   :::

![](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*OyptTbv1_FMAAAAAAAAAAAAADtmcAQ/original)

### 原则6：概念类型之间只允许系统指定的7大类语义关系

> 具体参见附录2

- HYP: 上位关系(Hypernym)，是指一种更广泛或更一般的概念包含或包括另一种更具体或更特定的概念的关系。目前可用的谓词为isA、locateAt等。
- SYNANT: 同义反义关系(Synonymy/Antonymy)，表达概念之间是同义还是反义的关系。目前可用的谓词有synonym、antonym等。
- CAU: 因果关系(Causal)，表示指一个事件或行为（原因）导致另一个事件或行为（结果）发生的一类关系。目前可用的谓词有leadTo等。
- SEQ: 顺承关系(Sequential)，是连续发生的事情或动作，这些事情或动作有先后顺序。目前可用的谓词有happenedBefore等。
- IND: 归纳关系(Induction)，是指从一类有共同特征的实体中得出对这些实体概括性的概念，这种个体和概念之间的关系就是归纳关系。目前可用的谓词有belongTo等。
- INC: 包含关系(Inclusion)，表达部分与整体的关系。目前可用的谓词有isPartOf等。
- USE: 用途关系(Usage)，表达作用/用途的关系。

### 原则7：属性尽量标准化(推荐但不强制约束)

:::info
**解释：**
尽可能的使用概念类型、标准类型和实体类型对属性进行标准化。因为SPGSchema会自动根据属性生成等价的关系，简化关系的创建和数据维护。尤其在变更实体的属性值后，关系实例会自动根据属性值同步，让属性等价的关系始终保持跟属性值的描述一致。SPGSchema建议尽量使用属性来替代关系的创建，只有确实需要在关系上配置属性，或者定义逻辑关系的时候再使用关系的创建。
:::
![image.png](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*A3GfQJSXCv8AAAAAAAAAAAAADtmcAQ/original)
