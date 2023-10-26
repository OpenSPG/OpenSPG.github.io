---
title: SPG推理语法
nav:
  second:
    title: SPG推理语法
    order: 3
---

注：KGDSL不区分大小写

## 1 保留关键词

### 1.1 常用关键词

| 关键词                                                  | 描述           | 作用范围            |
| ------------------------------------------------------- | -------------- | ------------------- |
| Define                                                  | 定义关键词     | 全局                |
| Structure                                               | 子图描述关键词 | 全局                |
| Constraint                                              | 规则描述关键词 | 全局                |
| Action                                                  | 后置动作关键词 | 全局                |
| /                                                       | 概念引用分隔符 | 全局                |
| group                                                   | 图分组关键词   | Constraint          |
| sum/filter/find/sort/slice<br>/count/max/min/avg/concat | 图聚合操作算子 | Constraint的group后 |
| and/or/not/xor/optional                                 | 逻辑计算算子   | 全局                |

### 1.2 特殊关键词

| 关键词             | 描述                            | 作用范围          |
| ------------------ | ------------------------------- | ----------------- |
| **start**          | 起点标志                        | Structure         |
| **per_node_limit** | 边限制标志                      | Structure         |
| **label**          | 得到点边的类型                  | Constraint/Action |
| **property_map**   | 将图节点或者边的属性生成map对象 | Constraint/Action |
| **path**           | 得到满足的路径                  | Constraint/Action |
| **id**             | 图谱点内部id（全局唯一）        | Constraint/Action |
| **from**           | 图谱边的起点内部id              | Constraint/Action |
| **to**             | 图谱边的终点内部id              | Constraint/Action |

## 2 数据类型

### 2.1 基本数据类型

| 数据类型 | 描述     | 示例       |
| -------- | -------- | ---------- |
| int      | 整型     | 1，2，3    |
| float    | 浮点型   | 23.11      |
| string   | 字符串   | "abcdef"   |
| bool     | 布尔类型 | true/false |
| null     | 空       | null       |

### 2.2 复杂数据类型

| 数据类型      | 描述       | 示例                                                                                                                                      |
| ------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| list          | 数组类型   | [1,2,3]                                                                                                                                   |
| multi_version | 多版本属性 | {<br>&nbsp;&nbsp;"20220111":value,<br>&nbsp;&nbsp;"20220112":value,<br>}                                                                  |
| date          | 日期类型   | /                                                                                                                                         |
| node          | 点类型     | {<br>&nbsp;&nbsp;"id":123456,<br>&nbsp;&nbsp;"label":"Film",<br>&nbsp;&nbsp;"property":{"name":"Titanic"}<br>}                            |
| edge          | 边类型     | {<br>&nbsp;&nbsp;"from":1234,<br>&nbsp;&nbsp;"to":4321,<br>&nbsp;&nbsp;"label":"starOfFilm",<br>&nbsp;&nbsp;"property":{"year":1989}<br>} |

## 3 表达式算子

### 3.1 表达式风格

我们表达式采用过程式+链式两种方式混合表达

> 链式思想：是将多个操作（多行代码）通过点号(.)链接在一起成为一句代码,使代码可读性好。
> 过程式思想：通过多行的方式，描述一段计算内容

链式风格非常适用于数据计算，如下例，我们需要计算一个表达式(1 + 2) \* 3 - 4，约束为一次只能计算一次，则过程式如下

> a = 1+2
> b = a \*3
> d = b -4

使用链式风格

> add(1,2).multiply(3).subtract(4)

一行可以表达一个完整的计算流，我们可以在做数据计算时使用该风格

### 3.2 计算运算符

| 符号 | 示例 | 含义     | 备注     |
| ---- | ---- | -------- | -------- |
| +    | a+b  | 加法     |          |
| -    | a-b  | 减法     |          |
| \*   | a\*b | 乘法     |          |
| /    | a/b  | 除法     | 不可除0  |
| %    | a%b  | 取模     | b不可为0 |
| =    | a=b  | 赋值操作 |          |

### 3.3 逻辑运算符

| 符号     | 示例                  | 含义           | 备注                                     |
| -------- | --------------------- | -------------- | ---------------------------------------- |
| and      | a and b               | 且             |                                          |
| or       | a or b                | 或             |                                          |
| not，!   | not a, !a             | 非             | not可作用于全局，但!只能作用于Constraint |
| xor      | a xor b               | 异或           |                                          |
| optional | optional (a)-[e]->(b) | 对路径表示可选 | 只在Structure中对路径生效                |
|          |                       |                |                                          |

### 3.4 比较运算符

| 符号 | 示例                       | 含义                                                                       | 备注                                                                     |
| ---- | -------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| ==   | a == b                     | 判等                                                                       | 只可比较int、float、string、node、edge，<br>其中，node、edge以id判断为准 |
| >    | a > b                      | 大于                                                                       |                                                                          |
| >=   | a>=b                       | 大于等于                                                                   |                                                                          |
| <    | a < b                      | 小于                                                                       |                                                                          |
| <=   | a<=b                       | 小于等于                                                                   |                                                                          |
| !=   | a != b                     | 不等                                                                       |                                                                          |
| in   | a in [1,2,3]               | 包含                                                                       |                                                                          |
| BT   | a bt [1,5] <br> a bt (1,5) | between运算符，表示a在1，5之间，<br>方括号表示闭区间，<br>圆括号表示开区间 | 只可比较int、float、string                                               |

### 3.5 字符串运算符

| 符号           | 示例                                                                      | 含义                                            | 返回值 | 备注                   |
| -------------- | ------------------------------------------------------------------------- | ----------------------------------------------- | ------ | ---------------------- |
| contains       | contains(a,b)                                                             | 判断a字符串是否包含b字符串                      | bool   |                        |
| like，not like | a like b，a not like b                                                    | 字符串匹配判断，%为通配符                       | bool   | "abc" like "a%" 为true |
| concat，+      | concat(a,b)，a+b，<br> concat(a,b,c)，a+b+c <br> concat(a,...,f), a+...+f | 字符串拼接，concat支持n个入参，<br> 也可用+处理 | string | 暂未实现               |
| length         | length(a)                                                                 | 返回字符串长度                                  | int    |                        |
| strstr         | strstr(str,start) <br> strstr(str,start,end)                              | 得到字符串子串，从1开始                         | string | 暂未实现               |
| lower          | lower(a)                                                                  | 全部转换成小写                                  | string | 暂未实现               |
| upper          | upper(a)                                                                  | 全部转换成大写                                  | string | 暂未实现               |
| is_not_blank   | is_not_blank(a)                                                           | 字符串不为空：""                                | bool   | 暂未实现               |

### 3.6 类型转换运算符

| 符号                            | 示例                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | 含义                                                                                                                                                                                                                                                                                                                                                                                                           | 支持情况 |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| cast(a, 'int'/'float'/'string') | <br> cast(1,'string') //转化成为str <br> cast('1', 'int') //转换成int                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | 将基本类型转换成为其他基本类型                                                                                                                                                                                                                                                                                                                                                                                 |          |
| to_date(time_str,format)        | to_date('20220101', 'yyMMdd') //转换成为日期                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | 将字符串转换成为日志类型<br>format可以为如下组合 <br> 时间类型 <br> - s，秒//unix时间戳起<br> - m，分 <br> - h，小时 <br> - d，天 <br> - M，月 <br> - y，年 <br> 可组合，各种合理格式 <br> - yyMMdd 年月日类型 <br> - yyMMdd hh:mm:ss 为简化使用，支持 <br> 数字@日期方式初始化时间                                                                                                                            | 暂未实现 |
| window(version_express, unit)   | A.cost_every_day //A为用户，cost_every_day为一个多版本属性，表示每日的花销<br> A.cost_every_day.window(cur in [1@M,2@M,3@M], M) //获取1月、2月、3月的数据，按月取数据<br> A.cost_every_day.window(start > -30@d, d) //取近30天的数据，按天取数据<br> A.cost_every_day.window(end <-15@d, d) //取15天天前的所有数据,，按天取数据<br> A.cost_every_day.window(start > -30@d and end <-15@d, d) //取30天前，到15天前的数据，按天取数据，可进行组合<br> A.cost_every_day.window( (start > -30@d and end <-15@d) and (start > -7@d), d) //取30天前，到15天前的数据，以及近7天的数据，按天取数据，可进行组合 | 将多版本类型（multi_version）转换成list，方便参与计算。**version_express**包含三个关键词<br>- start，起始版本号<br>- end，终点版本号<br>- cur，当前版本号表达式为逻辑表达式，可通过and/or进行组合<br>**unit** 为属性单位，有如下类型<br>- M，按月获取数据<br>- d，按天获取数据<br>- seq，默认值，按照序列取数据，当没有unit时，按照seq来处理<br>注意：若是按月或者按天获取数据，则需要存在按天和按月聚合的数据 | 暂未实现 |

### 3.7 list运算符（未实现）

由于list可以支持的类型为有int、float、string、node、edge，故list支持的运算符按照不同类型进行区分。
针对list对象，我们采用链式风格对列表进行计算。
假设定义一个数组:

```
array = [{age:10},{age:20},{age:30}]
```

对该数组的操作预算符用法如下：

| 符号表示                        | 示例                                                                                                                                  | 含义                                                                                                          | 输入类型 | 输出类型         | 元素类型                                                           |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | -------- | ---------------- | ------------------------------------------------------------------ |
| max(alias_name)                 | array.mark_alias(a).max(a.age) <br>//输出为30                                                                                         | 取最大值                                                                                                      | list     | int/float/string | 支持int、float、string，但node和edge对象的属性为基础类型的可以支持 |
| min(alias_name)                 | array.mark_alias(a).min(a.age) <br>//输出为10                                                                                         | 取最小值                                                                                                      | list     | int/float/string | 支持int、float、string，但node和edge对象的属性为基础类型的可以支持 |
| sum(alias_name)                 | array.mark_alias(a).sum(a.age)<br>// 输出为60                                                                                         | 对数组进行累加                                                                                                | list     | int/float        | 支持int、float、string，但node和edge对象的属性为基础类型的可以支持 |
| avg(alias_name)                 | array.mark_alias(a).avg(a.age)<br>// 输出为20                                                                                         | 取均值                                                                                                        | list     | int/float        | 支持int、float、string，但node和edge对象的属性为基础类型的可以支持 |
| count()                         | array.count() <br>//输出为3                                                                                                           | 取数组大小                                                                                                    | list     | int              | 支持所有类型                                                       |
| filter(operator_express)        | array.mark_alias(a).filter(a.age <18) <br>//输出为[{age:10}]                                                                          | 对数组进行过滤，返回新的数组                                                                                  | list     | list             | 支持所有类型                                                       |
| sort(alias_name, 'desc'/'asc')  | array.mark_alias(a).sort(a.age, 'desc')<br>//输出为[{age:30},{age:20},{age:10}]                                                       | 排序                                                                                                          | list     | list             | 支持所有类型                                                       |
| slice(start_index,end_index)    | array.mark_alias(a).slice(1,2)<br>//获取第一个到第二个的内容，输出为[{age:10},{age:20}]                                               | 切片，从指定起点index到终点index，起点为1，取闭区间<br>- start_index，起点的index<br>- end_index，终止的index |          |                  | 支持所有类型                                                       |
| get(index)                      | array.mark_alias(a).get(1)<br>//获取第一个到第二个的内容，输出为{age:10}                                                              | 获取第index个元素，从1开始<br>若超过大小，则返回null                                                          |          |                  |                                                                    |
| str_join(alias_name, tok)       | array.mark_alias(a).str_join(cast(a.age, 'string'), ',') <br>//将年龄转换成字符串，并且通过逗号生成字符串，输出为"10,20,30"           | 字符串连接<br>- alias_name，数组中元素别名<br>- tok，连接符                                                   |          |                  | 只支持string                                                       |
| accumlate(operator, alias_name) | array.mark_alias(a).accumlate('\*', a.age) //累乘，结果为6000<br> array.mark_alias(a).accumlate('+', a.age) //累加等同于sun，输出为60 | 累计计算算子<br>- operator，为\*/<br>- alias_name，数组中元素别名                                             |          |                  | 支持\*，+                                                          |

### 3.8 图聚合运算符

由于常常存在对图的聚合计算，此处定义一个图聚合算子，可以将一个子图按照指定模式聚合，并且根据别名进行数组计算,注意

| 符号    | 示例                 | 含义                         | 输入类型 | 输出类型                     | 备注                                       |
| ------- | -------------------- | ---------------------------- | -------- | ---------------------------- | ------------------------------------------ |
| group() | group(a)，group(a,b) | 将点或者边进行聚合，返回数组 | 图类型   | 后面需待具体算子，输出为数组 | 输入只能是点类型或者边类型，且必须带上起点 |

图分组解释，假设我们存在如下数据：<br>

![group_a_path](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*72A8QLOzeEcAAAAAAAAAAAAADtmcAQ/original)

查询的子图模式为：<br>

![group_a_data](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*oomuTKurb6UAAAAAAAAAAAAADtmcAQ/original)

不同的group表达的结果如下：

#### 3.8.1 示例1：group(A)

此时对A进行分组，则如下操作返回的值为<br>

> 返回类型为列表，由于整个子图分组成为了1个，所以返回的列表长度为1，后续结果只能输出1行数据<br>
> group(A).count(e1) // 对e1边进行计数，应当返回[2] <br>
> group(A).count(B) // 对子图的B类型进行统计计数，应当返回[2] <br>
> group(A).count(C) // 对子图的C类型进行统计计数，应当返回[4] <br>
> group(A).count(e2) //对e2的边进行计数，应当返回[5], 因为有5条边 <br>

#### 3.8.2 实例2：group(A,B)

被分组的图数据变成<br>
![group_a_b](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*oomuTKurb6UAAAAAAAAAAAAADtmcAQ/original)
<br>

> 返回类型为列表，由于整个子图分组成为了2个，所以返回的列表长度为2，后续结果只能输出2行数据 <br>
> group(A,B).count(A) // 返回[1,1] <br>
> group(A,B),count(B) // 返回[1,1] <br>
> group(A,B).count(C) // 返回[3,1] <br>
> group(A,B).count(e1) // 返回[1,1] <br>
> group(A,B).count(e2) //返回[3,2] <br>

#### 3.8.3 实例3：group(A,B,C)

被分组的图数据变成如下<br>
![group_a_b_c](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*P7rpSZfyFdoAAAAAAAAAAAAADtmcAQ/original) <br>

> 返回类型为列表，由于整个子图被分为了4个子图，所以返回的列表长度为4，后续结果只能输出4行数据 <br>
> group(A,B,C).count(C) // 返回[1,1,1,1] <br>
> group(A,B,C).count(e2) // 返回[1,1,1,2] <br>

注：由于子图可能被划分成为多个子图，并不对最终返回的数组保证顺序

#### 3.8.4 约束和限制

##### 约束1：不允许不包含起点

- group(B)/group(C) ,不允许分组时不包含起点，因为这样分组不能保证正确性

##### 约束2：不允许按边分组

- group(A, e1)/group(A, e2)，不允许按照边进行分组，因为存在两个相同点之间多边场景，如果允许按边聚合，则会出现大量的重复节点，导致后续计算消耗激增，且目前尚未看到有必须按边聚合场景

##### 约束3：若使用了多个group，则不允许后出现的group点比前出现的group点多

```
bNum = group(A).count(B)
eNum = group(A,B).count(e1)
```

```
eNum = group(A,B).count(e1)
bNum = group(A).count(B)
```

原因为，当group(A)分组后，B会折叠，此时在对A，B进行group会导致结果不正确，这里主要是考虑实现因素的约束

### 3.9 取数操作符

为方便对图进行取数据，设定算子如下

| 符号          | 示例            | 含义       | 备注 |
| ------------- | --------------- | ---------- | ---- |
| .             | A.id            | 取属性     |      |
| **label**     | A.**label**     | 返回类型   |      |
| **from**      | e.**from**      | 返回起点id |      |
| **to**        | e.**to**        | 返回终点id |      |
| **direction** | e.**direction** | 取边的方向 |      |

由于KGDSL中不支持if语法，所以需要针对逻辑判断部分，使用类条件运算符算子代替<br>
**rule_value**<br>

- 范式：rule_value (rule_name, true_value, false_value)<br>
- 作用：将规则真值转换为指定值，如果rule_name的规则运算结果为true，则返回true_value,如果为false，则返回falsevalue<br>
  举例：

```
//如果OnlineDiscount这个规则的运算结果为true，则返回1，否则返回null。
rule_value("OnlineDiscount", 1, null)
```

**get_first_notnull**<br>

- 范式：get_first_notnull (value1, value2, ..., valueN)<br>
- 作用：表示返回参数里第一个不为null的值，参数区为可变长度，可实现优先级的结果获取<br>

```
Share10("分享超10笔"): rakeBackCount > 10
Share100("分享超100笔"): rakeBackCount > 100
Price("定价")= get_first_notnull(rule_value("Share100", 0.5, null), rule_value("Share10", 0.8, null))
```

通过上面两个udf组合，可实现任意if-else组合

### 3.10 日期操作符（未实现）

日期类型支持如下计算操作

| 符号表示 | 示例                                                                                                                                                        | 含义     | 输入类型 | 输出类型 |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | -------- | -------- |
| +        | date1 = to_date('20220212', 'yyMMdd') //将字符串转换成日期<br> date2 = to_date('5','d') //将字符串转换成日期<br> date3 = date1 + date2 //相加，等于20220217 | 增加日期 | date     | date     |
| -        | date1 = to_date('20220212', 'yyMMdd')<br> date2 = to_date('5','d')<br> date3 = date1 - date2 //相加，等于20220207                                           | 减去日志 | date     | date     |

#### 3.10.1 日期简化形式

由于返回date类型均需要to_date进行转换，为了简化描述，可按照如下格式简化日期初始化 <br>

> 日期/单位 <br>

示例1：初始化日期简化模式 <br>

```sql
1@d
1@h
1@M
20221011@yyMMdd
```

示例2：取当前时间的相对时间 <br>
由于存在大量的近30天、近7天等表达需求，故简化now()获取当前时间，示例如下

```sql
+1@d
-1@d
+1@M
```

此外，还有其他日期函数作为补充

#### 3.10.2 now

- 范式：now()
- 作用：日期计算函数，用户返回当前日期

#### 3.10.3 date_format

- 范式：date_format(time, to_format)/date_format(time, from_format, to_format)
- 作用：日期格式化函数，将日期转换成为指定格式字符串，默认为yyyy-MM-dd HH:mm:ss / yyyyMMdd HH:mm:ss
  举例：

```
date1 = to_date('20220101', 'yyMMdd')
date_format(date1, 's') //转换成unix时间戳，值为 1640966400
date_format(date1, 'yyMMdd hh:mm:ss') //转换成为指定格式，应当为 20220101 00:00:00
```

## 4 基本语法

本章节使用场景进行语法介绍和应用

### 4.1 示例场景和需求

#### 4.1.1 示例schema

假定schema如下 <br>
![schema_example](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*hlQmQIuBBvwAAAAAAAAAAAAADtmcAQ/original)

**User属性**

| 属性名 | 类型     | 说明     |
| ------ | -------- | -------- |
| id     | string   | 主键id   |
| name   | string   | 姓名     |
| age    | int      | 年龄     |
| gender | 性别概念 | 性别属性 |

**Shop属性**

| 属性名   | 类型     | 说明         |
| -------- | -------- | ------------ |
| id       | string   | 主键id       |
| name     | string   | 店铺名       |
| category | 分类概念 | 店铺经验分类 |

**(User)-[pay]->(User) 用户向用户转账**

| 属性名 | 类型  | 说明     |
| ------ | ----- | -------- |
| amount | float | 转账数目 |

**(User)-[visit]->(Shop) 用户浏览过某个商店**

| 属性名    | 类型 | 说明             |
| --------- | ---- | ---------------- |
| timestamp | int  | 浏览商店的时间戳 |

**(User)-[own]->(Shop) 用户浏览过某个商店**

无属性

**(User)-[consume]->(Shop) 用户浏览过某个商店**

| 属性名    | 类型  | 说明         |
| --------- | ----- | ------------ |
| amount    | float | 消费金额     |
| timestamp | int   | 消费的时间戳 |

#### 4.1.2 需求列表

| 需求编号 | 需求描述                                            |
| -------- | --------------------------------------------------- |
| 1        | 判断一个User是否是店主                              |
| 3        | 统计一个Shop近7天、30天被浏览的次数                 |
| 4        | 根据Shop近7天的次数，分层高关注量Shop和低关注量Shop |
| 5        | 根据Shop的近7天销量，得到消费最高的top3用户         |
| 6        | 判断一个用户转账是否收大于支                        |
| 7        | 判断一个用户是否自己给自己转账                      |
| 8        | 得到一个用户最近7天转过账的其他用户                 |
| 9        | 用户拥有自己的商店，且在自己商店消费                |
| 10       | 统计User近7天有消费或者浏览过的店铺数目             |
| 11       | 统计每个User在某一Shop的消费总额                    |

### 4.2 整体语法描述

逻辑规则采用三段式语法表示，其语法结构，如下：

```
#Structure：定义匹配的子图结构。
Structure {
    // path desciption
}
#Constraint：定义上述Struct中，对实体和关系的约束条件、以及规则计算的表达式。
Constraint {
    // rule express
}
#Action：指定了对符合Structure和Constraint的结果进行的后置处理。
Action {
    // action desciption
}
```

定义新的逻辑谓词的语法结构，如下：

```
#Define用于定义新的逻辑谓词。它允许您创建符合特殊Structure和Constraint限制的自定义谓词。
Define (s:sType)-[p:pType]->(o:oType) {
    Structure {
        // path desciption
    }
        Constraint {
        // rule express
    }
}
```

下面的章节里，我们将对Structure、Constraint、Action、Define的用法进行详细介绍。

### 4.3 Structure定义

该部分结构主要描述路径

#### 4.3.1 路径定义

路径的基本单元是边，多种边组合起来的连通图成为路径，Structure中可以描述多个路径，方便在不同场景下使用 <br>

> 在线业务存在多种非连通图需求，离线批量计算场景较少 <br>

路径描述按照ISO GQL方式进行描述，即如下三种示例

```
Structure {
    (s:User)-[p:own]->(o:Shop)
}
```

```
Structure {
    (s:User)-[p:own]->(o:Shop), (s)-[c:consume]->(o)
}
```

> 注意：别名的类型定义只能在一处定义，通过逗号表示两个边都必须存在 <br>

```
Structure {
    (s:User)-[p:own|consume]->(o:Shop)
}
```

#### 4.3.2 路径别名

Structure中主要目的是简化路径描述，多数场景下，我们需要对路径的存在性进行判定，为方面后续的规则计算，我们使用路径别名作为Constraint的路径存在性判断参数，如下

```
Structure {
    path: (s:User)-[p:own]->(o:Shop)
}
```

> 当s这个用户拥有一家店铺时，path为true，否则为false <br>

```
Structure {
    path: (s:User)-[p:own]->(o:Shop), (s)-[c:consume]->(o)
}
```

> 当s这个用户拥有一家店铺，且在这个店铺进行了消费时，path为true，否则为false <br>

```
Structure {
    path: (s:User)-[p:own|consume]->(o:Shop)
}
```

> 当s这个用户没有在任何一家店铺消费，也不拥有任何一家店铺时，path为false，否者为true <br>

别名的优势在于可以简化path路径的描述，上述两个可以改成如下描述

```
Structure {
    ownPath: (s:User)-[p:own]->(o:Shop)
    consumePath: (s)-[c:consume]->(o)
}
```

申明两个path <br>

- "用户拥有自己的商店，且在自己商店消费" 可以表达成为ownPath and consumePath
- "用户拥有自己的商店或者在商店消费" 可以表达成为ownPath or consumePath

#### 4.3.3 路径运算符

路径定义时，可以要求Structure中路径不是必须存在，ISO GQL的路径表达中已经对且、或、可选、非做了表达，我们和ISO GQL保持一致

```
Structure {
    path: (s:User)-[p:own]->(o:Shop), (s)-[c:consume]->(o)
}
```

```
Structure {
    path: (s:User)-[p:own|consume]->(o:Shop)
}
```

（未实现）

```
Structure {
    not path: (s:User)-[p:own]->(o:Shop)
}
```

（未实现）

```
Structure {
    optional path:(s:User)-[p:own]->(o:Shop), (s)-[c:consume]->(o)
}
```

### 4.4 Constraint语法

#### 4.4.1 单规则语法

Constraint中每一行作为一个规则，规则分为如下几类

- **逻辑规则**

以 **规则英文名("规则说明"): 表达式** 这种格式进行表达，输出为布尔值。常用运算符有>、<、==、>=、<=、!=、+、-、\*、/、%等，运算符可以进行扩展。

- **计算规则**

以 **规则英文名("规则说明")= 表达式** 进行表达，输出结果为数字或者文本，取决于表达式内容。

- **赋值规则**

以 **别名.属性名=** **表达式** 没有规则名，仅允许Define中定义的别名进行属性赋值表达。此类规则仅在特定谓词的规则定义中有效。

以4.3中ownPath和consumePath为例

```
Structure {
    ownPath: (s:User)-[p:own]->(o:Shop)
    consumePath: (s)-[c:consume]->(o)
}
Constraint {
}
```

```
Structure {
    optional ownPath: (s:User)-[p:own]->(o:Shop)
    optional consumePath: (s)-[c:consume]->(o)
}
Constraint {
    ownAndConsumeUser("用户拥有自己的商店或者在商店消费"): exist(ownPath) or exist(consumePath)
}
```

```
Structure {
    (s:Shop)<-[p:visit]-(o:User)
}
Constraint {
    R1("7天内是否访问") : p.timestamp >= -7@d
}
```

> s可能存在很多个user访问，但是我们只处理7天内的边，第五行中不满足的o会被终止 <br>

#### 4.4.2 规则组语法

规则组可以将逻辑规则进行组合，主要目的是将逻辑计算层次化

```
Structure {
    （s:User）
}
Constraint {
    R1("成年人"): s.age > 18

    R2("男性"): s.gender == "男"

    // 下面这句是正确的，R3由R1和R2组合而成，就被视为是一条规则组
    R3("成年男性"): R1 and R2

    // 下面这句是错误的，规则组里不允许有非规则的变量
    R3("成年男性"): R1 and s.gender == "男"
}
```

#### 4.4.3 聚合语法

支持聚合的算子有如下特性和限制

- 算子的输入必须为list类型
- group语句可以将图进行分组，将若干条相同模式的路径进行聚合分组，当使用group时，聚合算子对整个图分组的点边进行聚合操作
- 聚合算子只能针对以一个起点产生的子图进行聚合计算，**若需要一批起点产生的子图进行计算，则不在该文档支持范围内**

由于需求中存在多种聚合类需求，4.1.2中存在统计需求列表如下

| 需求编号 | 需求描述                                            |
| -------- | --------------------------------------------------- |
| 3        | 统计一个Shop近7天、30天被浏览的次数                 |
| 4        | 根据Shop近7天的次数，分层高关注量Shop和低关注量Shop |
| 5        | 根据Shop的近7天销量，得到消费最高的top3用户         |
| 6        | 判断一个用户转账是否收大于支                        |
| 10       | 统计User近7天有消费或者浏览过的店铺数目             |
| 11       | 统计每个User在某一Shop的消费总额                    |

**示例1：需求10、需求3、需求4** <br>
![group_4_4_3_p1](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*FROwTLCV4HcAAAAAAAAAAAAADtmcAQ/original) <br>
假设当前时间为2023.1.10日，那么Alice近7天有消费或者浏览过的店铺数目应当为2，语法表达如下 <br>

```
Structure {
    (s:User)-[p:visit|consume]->(o:Shop)
}
Constraint {
    R1("近7天内有访问或消费") : p.timestamp >= -7@d
    // 忽略group(s)场景
    visitOrConsumeShopNum("统计User近7天有消费或者浏览过的店铺数目") = count(o)

    //显示表达
    visitOrConsumeShopNum("统计User近7天有消费或者浏览过的店铺数目") = group(s).count(o)
}
```

**示例2：判断用户是否收大于支** <br>
![group_4_4_3_p2](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*kJMiRbdw0BYAAAAAAAAAAAAADtmcAQ/original) <br>
上图中，Jobs、Alice、Mike属于收大于支，Bob属于支大于收，那么规则如下表示 <br>

```
Structure {
    outPath: (s:User)-[outP:pay]->(outU:User)
    inPath: (inU:User)-[inP:pay]->(s)
}
Constraint {
    // inPath不存在，则返回0，否则进行聚合计算
    inAmount("收入") = rule_value(inPath, group(s).sum(inP.amount), 0)
    // outPath不存在，则返回0，否则进行聚合计算
    outAmount("支出") = rule_value(outPath, group(s).sum(outP.amount), 0)

    R2("收大于支"): inAmount > outAmount
}
```

**示例3：根据Shop的近7天销量，得到消费最高的top3用户（未实现）** <br>

![group_4_4_3_p3](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*e6ijSZWfOUEAAAAAAAAAAAAADtmcAQ/original) <br>
上面数据实例中，top3为:Jobs、Mike、Alice <br>

```
Structure {
    (s:Shop)<-[p:consume]-(o:User)
}
Constraint {
    R1("7天内消费"): p.timestamp >= -7@d
    R2("top3的用户"): group(s).desc(p.amount).limit(3) //注意，此时只会保留Jobs、Mike、Alice节点
}
```

**示例4：统计每个User在某一Shop的销售量** <br>
假定数据如下 <br>
![group_4_4_3_p4](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*PsPlR40fUAEAAAAAAAAAAAAADtmcAQ/original) <br>
该里需要统计Shop近7天浏览的次数，值得注意的是，Bob存在2条边，这两个需要进行聚合统计 <br>

```
Structure {
    (s:Shop)<-[p:consume]-(o:User)
}
Constraint {
    R("7天内消费"): p.timestamp >= -7@d
    // 用户消费总额上赋值
    userConsumeAmount('店铺销售总额') = group(s,o).sum(p.amount) //注意，此时会输出4个结果
}
Action {
    get(s.name, userConsumeAmount)
}
```

### 4.5 Define谓词规则语法

前面几个章节主要目的为路径、规则描述，本节主要目标是对谓词进行定义。谓词主要分为三个场景进行表达

- 实体类型和概念的归纳语义定义
- 实体类型之间的逻辑谓词定义
- 实体类型和基本类型之间的逻辑谓词定义

#### 4.5.1 实体类型和概念的归纳语义定义

关于实体和概念的介绍可以参见 [schema建模手册中的说明](./spgschema_tutorial.md)。 <br>

归纳语义(Induction)，是指从一类有共同特征的实体中得出对这些实体概括性的概念，这种个体和概念之间的关系就是归纳关系。<br>
实体类型和概念间的归纳语义，通过语法规则表达如下：<br>

```
Define (s:TypeA)-[p:TypeP]->(o:TaxonomyOfTypeA/ConceptA) {
    Structure {
        // path desciption
    }
    Constraint {
        // rule express
    }
}
```

ConceptA是属于TaxonomyOfTypeA类型，上述规则表达含义为，TypeA类型的s在满足上述规则表达的前提下，可以通过TypeP谓词链接到ConceptA概念上。下面以示例举例: <br>
根据4.1.2的需求，我们可以将如下需求转化成为概念进行定义 <br>

| 需求编号 | 需求描述                                            |
| -------- | --------------------------------------------------- |
| 1        | 判断一个User是否是店主                              |
| 4        | 根据Shop近7天的次数，分层高关注量Shop和低关注量Shop |
| 7        | 判断一个用户是否自己给自己转账                      |

示例1：判断一个User是否是店主 <br>
判断是否是店主主要看名下是否有店铺 <br>
假定已经按照概念建模创建了ShopKeeper概念，如下 <br>
![concept_4_5_1_p1](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*LY8cSqBhYF8AAAAAAAAAAAAADtmcAQ/original) <br>
从实例图上可以看出，bob没有店不属于ShopKeeper，Alice有一个Hotel，所以应该属于ShopKeeper，我们可以通过语法将Alice归纳为ShopKeeper用户类别 <br>

```
Define (s:User)-[p:belongTo]->(o:TaxonomyOfUser/ShopKeeper) {
    Structure {
        path: (s)-[ownP:own]->(shop:Shop)
    }
    Constraint {
        R1("拥有店铺"): path
    }
}
```

通过如上规则，则可以将概念和实体实例建立挂载关系 <br>
示例2：根据Shop近7天的次数，分层高关注量Shop和低关注量Shop <br>
![concept_4_5_1_p2](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*RvHESr9YexsAAAAAAAAAAAAADtmcAQ/original) <br>
上图中Hotel被访问的较多，Drug Store访问很少，我们需要按照业务要求将他们和PopularShop和NamelessShop分别挂载上 <br>

```
Define (s:Shop)-[p:belongTo]->(o:TaxonomyOfShop/PopularShop) {
    Structure {
        path: (s)<-[vP:visit]-(u:User)
    }
    Constraint {
        R1("7天内消费"): vP.timestamp >= -7@d
        // 当路径不存在时，浏览次数为0，否则对u进行统计
        visitsNum("浏览次数") = rule_value(path, group(s).count(u),0)
        R2("热点商户"): visitsNum > ${hot_shop_threashold}
    }
}
```

> 注：${hot_shop_threashold} 为阈值参数，需要在谓词使用时将具体值填入 <br>

```
Define (s:Shop)-[p:belongTo]->(o:TaxonomyOfShop/NamelessShop) {
    Structure {
        path: (s)<-[vP:visit]-(u:User)
    }
    Constraint {
        R1("7天内消费"): vP.timestamp >= -7@d
        // 当路径不存在时，浏览次数为0，否则对u进行统计
        visitsNum("浏览次数") = rule_value(path, group(s).count(u),0)
        R2("低关注量商户"): visitsNum < ${nameless_shop_threashold}
    }
}
```

> 注：${nameless_shop_threashold} 为阈值参数，需要在谓词使用时将具体值填入 <br>

#### 4.5.2 实体类型之间逻辑谓词定义

可使用类型之间定义需求如下 <br>

| 需求编号 | 需求描述                            |
| -------- | ----------------------------------- |
| 7        | 判断一个用户是否自己给自己转账      |
| 8        | 得到一个用户最近7天转过账的其他用户 |
| 11       | 统计每个User在某一Shop的销售量      |

基本定义和4.5.1中基本一致，按照需求新增schema <br>
![schema_4_5_2](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*3c--RL7N-9gAAAAAAAAAAAAADtmcAQ/original) <br>

主要三种

- (s:User)-[p:transSelf]->(s) 自己向自己转账
- (s:User)-[p:trans7Days]->(o:User) 7天内有转账的用户
- (s:Shop)-[p:consumeAmount]->(o:User) 商铺某个用户的销售额

示例1：判断一个用户是否自己给自己转账 <br>

```
Define (s:User)-[p:transSelf]->(s) {
    Structure {
        path: (s)-[pp:pay]->(s)
    }
    Constraint {
        R1("自己向自己转账"): path
    }
}
```

示例2：7天内有转账的用户 <br>

```
Define (s:User)-[p:trans7Days]->(o:User) {
    Structure {
        path: (s)-[pp:pay]->(o)
    }
    Constraint {
        R1("7天内消费"): p.timestamp > -7@d
        R2("存在转账"): path
    }
}
```

示例3：商铺对一个用户的销售总额 <br>

```
Define (s:Shop)-[p:consumeAmount]->(o:User) {
    Structure {
        path: (s)<-[cp:consume]-(o)
    }
    Constraint {
        R1("存在交易用户"): path
        p.amount = group(s,o).sum(cp.amount) //统计所有的交易额
    }
}
```

#### 4.5.3 实体类型和基本类型之间逻辑谓词定义

前两章节主要是和实体类型和概念之间语义链接，实际上存在部分需求，和任何其他类型没有交互，例如如下需求 <br>

| 需求编号 | 需求描述                                |
| -------- | --------------------------------------- |
| 1        | 判断一个User是否是店主                  |
| 3        | 统计一个Shop近7天、30天被浏览的次数     |
| 6        | 判断一个用户转账是否收大于支            |
| 7        | 判断一个用户是否自己给自己转账          |
| 9        | 用户拥有自己的商店，且在自己商店消费    |
| 10       | 统计User近7天有消费或者浏览过的店铺数目 |

如上需求，我们可以增加User属性 <br>

| 属性名                     | 类型    | 说明                            |
| -------------------------- | ------- | ------------------------------- |
| isShopOwner                | boolean | 是否是店主                      |
| isIncomeLargeOutcome       | boolean | 是否收大于支                    |
| 7daysVisitOrConsumeShopNum | int     | 近7天有消费或者浏览过的店铺数目 |

Shop可以增加属性 <br>

| 属性名         | 类型 | 说明           |
| -------------- | ---- | -------------- |
| 7daysVisitNum  | int  | 近7天浏览人数  |
| 30daysVisitNum | int  | 近30天浏览人数 |

这些新增属性，可通过规则进行定义，避免出现实际的数据新导入 <br>
示例1：近7天有消费或者浏览过的店铺数目 <br>

```
Define (s:User)-[p:7daysVisitOrConsumeShopNum]->(o:int) {
    Structure {
        path: (s)-[vc:visit|consume]->(shop:Shop)
    }
    Constraint {
        R("7天内消费or浏览"): p.timestamp > -7@d
        o = group(s).count(shop) //赋值
    }
}
```

示例2：近7天浏览店铺的用户 <br>

```
Define (s:Shop)-[p:7daysVisitNum]->(o:int) {
    Structure {
        path: (s)<-[p:visit]-(u:User)
    }
    Constraint {
        R("7天内浏览"): p.timestamp > -7@d
        o = group(s).count(u) //赋值
    }
}
```

示例3：近30天浏览店铺的用户 <br>

```
Define (s:Shop)-[p:30daysVisitNum]->(o:int) {
    Structure {
        path: (s)<-[p:visit]-(u:User)
    }
    Constraint {
        R("30天内浏览"): p.timestamp > -30@d
        o = group(s).count(u) //赋值
    }
}
```

### 4.6 Action语法

Action中支持多种操作：

- createNodeInstance/createEdgeInstance：用于因果的逻辑结果的语义表达
- get ：输出匹配的结果，包括实体、关系以及属性等内容。

具体用法如下面的例子展示： <br>

#### 4.6.1 Causal logic semantics

在事理图谱中，因果关系基本需要在满足一定条件才成立，本例引用SPG白皮书中金融事理图谱章节的案例进行表述。事理描述如下图：<br>
![cau_4_6](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*Kt8mQpZQpfYAAAAAAAAAAAAADtmcAQ/original) <br>

#### 4.6.1.1 createNodeInstance

当概念之间满足因果语义的条件时，createNodeInstance将创建一个新的实例。本例中创建新的事件实例，具体使用方式如下：

```
Define (s: `ProductChain.TaxonomyOfCompanyAccident`/`周期性行业头部上市公司停产事故`)-[p: leadTo]->(o: `ProductChain.TaxonomyOfIndustryInfluence`/`成本上升`) {
    Structure {
        (s)-[:subject]->(c:ProductChain.Company)
        (c)-[:belongIndustry]->(d:ProductChain.Industry)
        (d)-[:downstream]->(down:ProductChain.Industry)
    }
    Constraint {
        // 这里没有定义约束条件
    }
    Action {
        downEvent = createNodeInstance(
            type=ProductChain.IndustryInfluence,
            value={
                subject=down.id
                objectWho="上升"
                influenceDegree="上升"
                indexTag="成本"
            }
        )
    }
}
```

**createNodeInstance参数说明：** <br>

- type：这里需要指定我们创建一个什么样的实体类型实例
- value：此处为实例的具体属性值，由kv对构成，k为schema中定义的属性名，v为具体值，可为常量，也可以为Structure和Constraint中的各种变量。注意：若k不存在于schema中或者值不满足schema定义，则为非法值
  **返回值：** <br>
- 具体实例别名，不能和Structure、Constraint中的变量重合

本例中创建一个新的事件实例downEvent，该事件类型为ProductChain.IndustryInfluence，主体为Structure中的down实体，属性代表该产业成本上升

##### 4.6.1.2 createEdgeInstance

也可以通过createEdgeInstance创建一条新的关系，可将触发的事件实例和具有因果关系的事件实例进行关联。具体使用方式如下：

```
Define (s: `ProductChain.TaxonomyOfCompanyAccident`/`周期性行业头部上市公司停产事故`)-[p: leadTo]->(o: `ProductChain.TaxonomyOfIndustryInfluence`/`成本上升`) {
    Structure {
        (s)-[:subject]->(c:ProductChain.Company)-[:belongIndustry]->(d:ProductChain.Industry)-[:downstream]->(down:ProductChain.Industry)
    }
    Constraint {

    }
    Action {
        downEvent = createNodeInstance(
            type=ProductChain.IndustryInfluence,
            value={
                subject=down.id
                objectWho="上升"
                influenceDegree="上升"
                indexTag="成本"
            }
        )
        #在事件s和新生成的downEvent建立一条leadTo边，代表一个事件实例导致了另外一个事件实例
        createEdgeInstance(
            src=s,
            dst=downEvent,
            type=leadTo,
            value={}
        )
    }
}
```

**createEdgeInstance参数说明：** <br>

- type：指定边类型
- src：起点的别名，必须存在Structure中，或者是Action中通过createNodeInstance创建的实例
- dst：终点的别名，同样满足src的约束
- value：边的属性值，也为kv对，可为空

**返回值：** <br>

- 无，主要原因为，在Action中，边实例不会被再次引用

#### 4.6.2 数据输出

get的作用是获取Structure或者Constraint中的实体、关系、属性或者临时变量，具体使用方式如下：

```
//可通过get获取Structure或者Constraint中的属性或者临时变量

Structure {
    path: (s:Shop)<-[vP:visit]-(u:User)
}
Constraint {
    R("7天内消费"): vP.timestamp >= -7@d
    visitsNum("浏览次数") = rule_value(path, group(s).count(u),0)
    R2("热点商铺"): visitsNum > 1000
}
Action {
    // 获取shop和user点的id，并且返回Constraint中的visitsNum变量
    get(s.id, u.id, visitsNum)
}
```
