---
title: SPG-Schema
order: 2
---

Note: KGDSL is case-insensitive.

## 1 Reserved Keywords

### 1.1 Common Keywords

| kewords                                                 | description                         | scopes                    |
|---------------------------------------------------------|-------------------------------------|---------------------------|
| Define                                                  | keywords for define predicate       | global                    |
| Structure                                               | Keywords for subgraph description   | global                    |
| Constraint                                              | Keywords for Constraint description | global                    |
| Action                                                  | Keywords for action                 | global                    |
| /                                                       | Concept reference delimiter         | global                    |
| group                                                   | keywords for group                  | Constraint                |
| sum/filter/find/sort/slice<br>/count/max/min/avg/concat | group operators                     | after group in Constraint |
| and/or/not/xor/optional                                 | logical operator                    | global                    |

### 1.2 Special Keywords

| keywords           | description                              | scopes            |
|--------------------|------------------------------------------|-------------------|
| __start__          | Start symbol                             | Structure         |
| __per_node_limit__ | limit symbol                             | Structure         |
| __label__          | type of entity or relation               | Constraint/Action |
| __property_map__   | mapping object for property              | Constraint/Action |
| __path__           | Obtain paths that satisfy the conditions | Constraint/Action |
| __id__             | unique id of the entity                  | Constraint/Action |
| __from__           | source entity id of the relation         | Constraint/Action |
| __to__             | destination entity id of the relation    | Constraint/Action |

## 2 Data Type

### 2.1 Basic Data Type

| Data Type | description    | example    |
|-----------|----------------|------------|
| int       | integer number | 1，2，3      |
| float     | float number   | 23.11      |
| string    | string         | "abcdef"   |
| bool      | boolean        | true/false |
| null      | null           | null       |

### 2.2 Complex Data Type

| Data Type     | description            | example                                                                                                                                   |
|---------------|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| list          | array type             | [1,2,3]                                                                                                                                   |
| multi_version | multi version property | {<br>&nbsp;&nbsp;"20220111":value,<br>&nbsp;&nbsp;"20220112":value,<br>}                                                                  |
| date          | date type              | /                                                                                                                                         |
| node          | entity type            | {<br>&nbsp;&nbsp;"id":123456,<br>&nbsp;&nbsp;"label":"Film",<br>&nbsp;&nbsp;"property":{"name":"Titanic"}<br>}                            |
| edge          | relation type          | {<br>&nbsp;&nbsp;"from":1234,<br>&nbsp;&nbsp;"to":4321,<br>&nbsp;&nbsp;"label":"starOfFilm",<br>&nbsp;&nbsp;"property":{"year":1989}<br>} |

## 3 Expression Operators

### 3.1 Expression format

We use a combination of procedural and chaining expressions in our code. <br>
> Chaining approach: It links multiple operations or lines of code together using dot notation (.) to improve code readability. <br>
> Procedural approach: It describes a computation using multiple lines of code. <br>

The chaining style is particularly suitable for data calculations. For example, consider the expression (1 + 2) * 3 - 4.
If we need to compute it step by step, the procedural approach would be: <br>
> a = 1+2 <br>
> b = a *3 <br>
> d = b -4 <br>

the chaining approach would be:
> add(1,2).multiply(3).subtract(4) <br>

using the chaining style allows us to express a complete computational flow in a single line, making it particularly
useful for data calculations. It allows for concise and readable code, where each method call builds upon the previous
one to perform a series of operations. This style can enhance code clarity and simplify complex calculations, especially
when dealing with data transformations, aggregations, or other data processing tasks.

### 3.2 Compute Operators

| Operator | example | description    | note            |
|----------|---------|----------------|-----------------|
| +        | a+b     | addition       |                 |
| -        | a-b     | subtraction    |                 |
| *        | a*b     | Multiplication |                 |
| /        | a/b     | division       | Non divisible 0 |
| %        | a%b     | modulus        | b can't be 0    |
| =        | a=b     | Assignment     |                 |

### 3.3 Logical Operators

| Operator | example               | description   | note                                                            |
|----------|-----------------------|---------------|-----------------------------------------------------------------|
| and      | a and b               | and operation |                                                                 |
| or       | a or b                | or operation  |                                                                 |
| not，!    | not a, !a             | not operation | Not can be applied globally, but ! Can only apply in Constraint |
| xor      | a xor b               | XOR operation |                                                                 |
| optional | optional (a)-[e]->(b) | optional path | optional can be applied in Structure                            |
|          |                       |               |                                                                 |

### 3.4 Compare Opeators

| Operator | example                    | description                           | note                                                                                       |
|----------|----------------------------|---------------------------------------|--------------------------------------------------------------------------------------------|
| ==       | a == b                     | equal                                 | can be applied to int/float/string/node/edge,<br>specailly,node/edge will compared with id |
| >        | a > b                      | bigger                                |                                                                                            |
| >=       | a>=b                       | bigger or equal                       |                                                                                            |
| <        | a < b                      | smaller                               |                                                                                            |
| <=       | a<=b                       | smaller or equal                      |                                                                                            |
| !=       | a != b                     | not equal                             |                                                                                            |
| in       | a in [1,2,3]               | contain                               |                                                                                            |
| BT       | a bt [1,5] <br> a bt (1,5) | between operator，a is between 1 and 5 | can be applied to int/float/string                                                         |

### 3.5 String Operators

| Operator       | example                                                                   | description                                                                             | return value | note                   |
|----------------|---------------------------------------------------------------------------|-----------------------------------------------------------------------------------------|--------------|------------------------|
| contains       | contains(a,b)                                                             | Determine whether the a string contains the b string                                    | bool         |                        |
| like, not like | a like b, a not like b                                                    | String matching, % is a wildcard character                                              | bool         | "abc" like "a%" = true |
| concat, +      | concat(a,b), a+b, <br> concat(a,b,c), a+b+c <br> concat(a,...,f), a+...+f | String concatenation, concat supports n input parameters,<br>can also be used + opeator | string       | not implemented        |
| length         | length(a)                                                                 | return length of string                                                                 | int          |                        |
| strstr         | strstr(str,start) <br> strstr(str,start,end)                              | return sub string of str                                                                | string       | not implemented        |
| lower          | lower(a)                                                                  | Convert to lowercase                                                                    | string       | not implemented        |
| upper          | upper(a)                                                                  | Convert to uppercase                                                                    | string       | not implemented        |
| is_not_blank   | is_not_blank(a)                                                           | the string is not empty                                                                 | bool         | not implemented        |

### 3.6 Type Conversion Operators

| Operator                        | example                                                                                                                                                                                                                                                                                                            | description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | note            |
|---------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------|
| cast(a, 'int'/'float'/'string') | <br> cast(1,'string')  <br> cast('1', 'int')                                                                                                                                                                                                                                                                       | Convert a base type to another base type                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |                 |
| to_date(time_str,format)        | to_date('20220101', 'yyMMdd')                                                                                                                                                                                                                                                                                      | Convert a string to a date type<br>format can be a combination of<br>time types <br> - s: Seconds//Unix timestamp<br> - m: minutes <br> - h: hours <br> - d: day <br> - M: month <br> - y: year <br> Can be combined with various reasonable formats <br> - yyMMdd <br> - yyMMdd hh:mm:ss                                                                                                                                                                                                                                                                                                                                         | not implemented |
| window(version_express, unit)   | A.cost_every_day <br> A.cost_every_day.window(cur in [1@M,2@M,3@M], M) <br> A.cost_every_day.window(start > -30@d, d) <br> A.cost_every_day.window(end <-15@d, d) <br> A.cost_every_day.window(start > -30@d and end <-15@d, d) <br> A.cost_every_day.window((start > -30@d and end <-15@d) and (start > -7@d), d) | Convert a multi-version attribute to a list for calculation purposes. The **version_express** consists of three keywords: <br> - start: Starting version number <br> - end: Ending version number <br> - cur: Current version number. Expressions can be combined using logical operators like AND/OR.<br>**unit** The unit parameter defines the unit of the attribute, with options: <br> - M: Retrieve data by month <br> - d: Retrieve data by day <br> - seq: Default value, retrieves data by sequence if no unit is specified. <br> Note: If retrieving data by month or day, the data must be aggregated by day or month. | Not implemented |

### 3.7 List Operators (Not Implemented)

Since lists can support different types such as int, float, string, node, and edge, the list operators are categorized
based on these types. For list objects, we use a chaining style to perform calculations on lists.

Assuming we define an array as:

```
array = [{age:10},{age:20},{age:30}]
```

the operations on this array are as follows:

| Operator                        | Example                                                                                                           | Description                                                   | Input type | Output type      | Element Type     |
|---------------------------------|-------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------|------------|------------------|------------------|
| max(alias_name)                 | array.mark_alias(a).max(a.age) <br>//return 30                                                                    | Get the maximum value                                         | list       | int/float/string | int,float,string |
| min(alias_name)                 | array.mark_alias(a).min(a.age) <br>//return 10                                                                    | Get the minimum value                                         | list       | int/float/string | int,float,string |
| sum(alias_name)                 | array.mark_alias(a).sum(a.age) <br>// return 60                                                                   | Accumulate the values in the list                             | list       | int/float        | int,float,string |
| avg(alias_name)                 | array.mark_alias(a).avg(a.age) <br>// return 20                                                                   | Get the average value                                         | list       | int/float        | int,float,string |
| count()                         | array.count() <br>//return 3                                                                                      | Get the size of the list                                      | list       | int              | All types        |
| filter(operator_express)        | array.mark_alias(a).filter(a.age <18) <br>//return [{age:10}]                                                     | Filter the list based on the given expression                 | list       | list             | All types        |
| sort(alias_name, 'desc'/'asc')  | array.mark_alias(a).sort(a.age, 'desc') <br>//return [{age:30},{age:20},{age:10}]                                 | Sort the list in ascending or descending order                | list       | list             | All types        |
| slice(start_index,end_index)    | array.mark_alias(a).slice(1,2) <br>//return [{age:10},{age:20}]                                                   | Get a slice of the list from the start index to the end index |            |                  | All types        |
| get(index)                      | array.mark_alias(a).get(1) <br>//return {age:10}                                                                  | Get the element at the specified index                        |            |                  |                  |
| str_join(alias_name, tok)       | array.mark_alias(a).str_join(cast(a.age, 'string'), ',') <br>//return "10,20,30"                                  | Join the elements of the list into a string using a delimiter |            |                  | string           |
| accumlate(operator, alias_name) | array.mark_alias(a).accumlate('*', a.age) //return 6000<br> array.mark_alias(a).accumlate('+', a.age) //return 60 | Perform cumulative calculation on the list using the operator |            |                  | int,float        |

### 3.8 Graph Aggregation Operators

Since there are often aggregation calculations on graphs, we define a graph aggregation operator that can aggregate a
subgraph according to a specified pattern and perform array calculations based on aliases.

| operator | Example             | Description                                     | Input type | Output type | Note                                                                     |
|----------|---------------------|-------------------------------------------------|------------|-------------|--------------------------------------------------------------------------|
| group()  | group(a)，group(a,b) | Aggregate vertices or edges and return an array | Graph      | Array       | Input must be vertices or edges, and the starting point must be included |

Explanation of graph grouping: <br>
Assuming we have the following data: <br>
![group_a_path](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*72A8QLOzeEcAAAAAAAAAAAAADtmcAQ/original) <br>
The query subgraph pattern is:<br>
![group_a_data](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*oomuTKurb6UAAAAAAAAAAAAADtmcAQ/original) <br>

group operator examples: <br>
#### 3.8.1 example 1：group(A) <br>
The grouping of A in this case would result in the following operations: <br>
> The return type is a list. Since the entire subgraph is grouped into one, the length of the returned list would be 1,
> and the subsequent results can only output one row of data. <br>
> group(A).count(e1) // Count the edges of type e1, should return [2] <br>
> group(A).count(B) // Count the occurrences of type B in the subgraph, should return [2] <br>
> group(A).count(C) // Count the occurrences of type C in the subgraph, should return [4] <br>
> group(A).count(e2) // Count the edges of type e2, should return [5] because there are 5 edges <br>

#### 3.8.2 example 2：group(A,B) <br>
Suppose we have graph datas: <br>
![group_a_b](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*E-ZBT5jz0iUAAAAAAAAAAAAADtmcAQ/original) <br>
> The return type is a list. Since the entire subgraph is grouped into two, the length of the returned list would be 2,
> and the subsequent results can only output two rows of data. <br>
> group(A,B).count(A) // return [1,1]  <br>
> group(A,B),count(B) // return [1,1] <br>
> group(A,B).count(C) // return [3,1] <br>
> group(A,B).count(e1) // return [1,1] <br>
> group(A,B).count(e2) // return [3,2] <br>

#### 3.8.3 example 3：group(A,B,C) <br>
Suppose we have graph datas: <br>
![group_a_b_c](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*P7rpSZfyFdoAAAAAAAAAAAAADtmcAQ/original) <br>
> The return type is a list. Since the entire subgraph is grouped into four, the length of the returned list would be 4,
> and the subsequent results can only output four rows of data. <br>
> group(A,B,C).count(C) // return [1,1,1,1] <br>
> group(A,B,C).count(e2) // return [1,1,1,2] <br>

Note: Since the subgraph may be divided into multiple subgraphs, the order of the returned array is not guaranteed.

#### 3.8.4 Constraints and Limitations

#### Constraint 1: Not allowing to exclude the starting point

- group(B)/group(C), It is not allowed to group without including the starting point, as this grouping cannot guarantee
  correctness.

#### Constraint 2: Not allowing grouping by edges

- group(A, e1)/group(A, e2), It is not allowed to group by edges, as there may be multiple edges between the same
  vertices. Allowing grouping by edges would result in a large number of duplicate nodes, leading to a significant
  increase in computational cost. Additionally, there hasn't been seen a scenario where grouping by edges is necessary.

#### Constraint 3: In case of using multiple groups, the later group should not have more vertices than the previous group

```
bNum = group(A).count(B)
eNum = group(A,B).count(e1)
```

```
eNum = group(A,B).count(e1)
bNum = group(A).count(B)
```

The reason is that when group(A) is performed, the vertices of B are folded. In this case, grouping A and B will result
in incorrect results. This constraint is mainly considered for implementation factors.

### 3.9 Data Retrieval Operators

To facilitate data retrieval from graphs, the following operators are defined:

| Operator      | Example         | Description                        | Note |
|---------------|-----------------|------------------------------------|------|
| .             | A.id            | Retrieve attribute                 |      |
| __label__     | A.__label__     | Return type                        |      |
| __from__      | e.__from__      | Return the starting point ID       |      |
| __to__        | e.__to__        | Return the ending point ID         |      |
| __direction__ | e.__direction__ | Retrieve the direction of the edge |      |

Since KGDSL 2.0 has removed the if syntax, we need to use conditional operator operators to replace the logical
conditions. <br>
**rule_value** <br>

- Syntax: rule_value(rule_name, true_value, false_value)
- Description: Converts the truth value of the rule_name to the specified value. If the result of the rule_name is true,
  it returns true_value; if it is false, it returns false_value.

Example:
```
//if the result of the rule "OnlineDiscount" is true, it returns 1, otherwise it returns null.
rule_value("OnlineDiscount", 1, null) 
```

**get_first_notnull** <br>

- Syntax: get_first_notnull(value1, value2, ..., valueN)
- Description: Returns the first non-null value from the arguments. The parameter list is variable-length, allowing for
  prioritized retrieval of values.

Example:
```
Share10("Share more than 10 orders"): rakeBackCount > 10
Share100("Share more than 100 orders"): rakeBackCount > 100
Price("Pricing")= get_first_notnull(rule_value("Share100", 0.5, null), rule_value("Share10", 0.8, null))
```

With the combination of these two UDFs, arbitrary if-else combinations can be achieved.

### 3.10 Date Operators (Not Implemented)

The date type supports the following calculation operations:

| Operator | Example                                                                                                          | Description   | Input type | Output type |
|----------|------------------------------------------------------------------------------------------------------------------|---------------|------------|-------------|
| +        | date1 = to_date('20220212', 'yyMMdd') <br> date2 = to_date('5','d') <br> date3 = date1 + date2 //return 20220217 | Add date      | date       | date        |
| -        | date1 = to_date('20220212', 'yyMMdd')<br> date2 = to_date('5','d')<br> date3 = date1 - date2 //return 20220207   | Subtract date | date       | date        |

#### 3.10.1 Simplified Date Initialization

To simplify the description and avoid the need for explicit to_date conversions for date types, the following format can
be used for date initialization: <br>
> Date/Unit <br>

**Example 1: Simplified date initialization mode** <br>
```sql
1@d
1@h
1@M
20221011@yyMMdd
```

**Example 2: Relative date based on the current time** <br>
To address the common requirement of expressing "last 30 days," "last 7 days," etc., the simplified form now() can be
used to represent the current time. Examples include:<br>
```sql
+1@d
-1@d
+1@M
```

In addition to these simplified date expressions, there are also other date functions available.

#### 3.10.2 now

- Syntax: now()
- Description: A date calculation function that returns the current date.

Example:
```
now()
```

#### 3.10.3 date_format

- Syntax: date_format(time, to_format) / date_format(time, from_format, to_format)
- Description: A date formatting function that converts a date to a specified string format. The default format is
  yyyy-MM-dd HH:mm:ss or yyyyMMdd HH:mm:ss.

Example:
```
date1 = to_date('20220101', 'yyMMdd')
date_format(date1, 's') // Converts to a Unix timestamp, with a value of 1640966400
date_format(date1, 'yyMMdd hh:mm:ss') // Converts to the specified format, should be "20220101 00:00:00"
```

## 4 Basic Syntax

In this section, we will introduce and apply the syntax based on specific use cases.

### 4.1 Example Scenarios and Requirements

#### 4.1.1 Example Schema

Assuming the schema is as follows: <br>
![schema_example](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*hlQmQIuBBvwAAAAAAAAAAAAADtmcAQ/original) <br>

**User Entity**

| Property Name | Type           | Description    |
|---------------|----------------|----------------|
| id            | string         | Primary key ID |
| name          | string         | user name      |
| age           | int            | age            |
| gender        | Gender concept | Gender concept |

**Shop Entity**

| Property Name | Type                    | Description              |
|---------------|-------------------------|--------------------------|
| id            | string                  | Primary key ID           |
| name          | string                  | shop name                |
| category      | Classification Concepts | Classification for shops |

**(User)-[pay]->(User)  Relation**

the relation which represents the payment between users.

| Property Name | Type  | Description                |
|---------------|-------|----------------------------|
| amount        | float | The amount of the payment. |

**(User)-[visit]->(Shop)  Relation**

the relation which represents the user browsed a certain store

| Property Name | Type | Description                  |
|---------------|------|------------------------------|
| timestamp     | int  | The timestamp of the browse. |

**(User)-[own]->(Shop)  Relation**

The relation which represents the user owned a certain store. <br>
Has no properties.

**(User)-[consume]->(Shop)  Relation**

The relation which represents the user has made a purchase at a certain store.

| Property Name | Type  | Description                    |
|---------------|-------|--------------------------------|
| amount        | float | The amount of the purchase.    |
| timestamp     | int   | The timestamp of the purchase. |

#### 4.1.2 Requirements

| Requirement ID | Description | 
|----------------|---------------------------------------| 
| 1              | Determine if a User is a shop owner  |
| 3              | Calculate the number of times a Shop has been browsed in the last 7 and 30 days   |
| 4              | Classify Shops into high attention and low attention based on the number of times they were browsed in the last 7 days |
| 5              | Identify the top 3 Users with the highest spending based on the sales of a Shop in the last 7 days  |
| 6              | Validate if a user has received more money in transfers than they have spent   |
| 7              | Check if a user has made a transfer to themselvesxa   |
| 8              | Get the list of other users that a User has transferred money to in the last 7 days  |
| 9              | Users own their own shops and make purchases in their own shops |
| 10             | Count the number of shops a User has made purchases or browsed in the last 7 days  |
| 11             | Calculate the total expenditure of each user at a specific shop  |

### 4.2 Overall syntax description

Logic rules are represented in a three-part syntax, syntax structures are as follows:

```
#The Structure section defines the matched subgraph structure using a path description. It specifies the entities and relationships that need to be present in the subgraph.
Structure {
    // path desciption
}
#The Constraint section defines the constraints on entities and relationships within the Structure. It specifies the conditions that must be satisfied for a subgraph to be considered a valid match. It can also include expressions for rule calculations.
Constraint {
    // rule express
}
#The Action section specifies the post-processing to be performed on the results that conform to the Structure and Constraint. 
Action {
    // action desciption
}
```

The syntax structure for defining new logical predicates is as follows:

```
#Structure and Constraint are nested inside the Define section.
#The Define section is used to define a new logical predicate. It allows you to create a custom predicate with its own Structure and Constraint. 
Define (s:sType)-[p:pType]->(o:oType) {
    Structure {
        // path desciption
    }
    Constraint {
        // rule express
    }
}
```

In the following sections, we will provide a detailed explanation of the usage of Structure, Constraint,Action, and Define.

### 4.3 Structure

This section primarily describes path structures.

#### 4.3.1 Path Definition

The basic unit of a path is an edge. A path is formed by combining multiple edges in a connected graph. The Structure can describe multiple paths, making it convenient for use in different scenarios. Path descriptions can be done using the ISO GQL (Graph Query Language) format. Here are three examples:

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

> Note: The both edges must exist, indicated by a comma. <br>

```
Structure {
    (s:User)-[p:own|consume]->(o:Shop)
}
```

#### 4.3.2 Path Alias

The main purpose of Structure is to simplify path description. In most scenarios, we need to determine the existence of a path for subsequent rule calculations. To facilitate this, we use path alias as the parameter for judging the existence of a path in the Constraint, as follows.

```
Structure {
    path: (s:User)-[p:own]->(o:Shop)
}
```

> When the user "s" owns a store, the path is true; otherwise, it is false. <br>

```
Structure {
    path: (s:User)-[p:own]->(o:Shop), (s)-[c:consume]->(o)
}
```

> When the user "s" owns a store and has made a purchase in that store, the path is true; otherwise, it is false. <br>

```
Structure {
    not path: (s:User)-[p:own|consume]->(o:Shop)
}
```

> When the user "s" has not made any purchases in any store and does not own any store, the path is false; otherwise, it is true. <br>

The advantage of using aliases is that it simplifies the description of path paths. The above two can be described as follows:

```
Structure {
    ownPath: (s:User)-[p:own]->(o:Shop)
    consumePath: (s)-[c:consume]->(o)
}
```

Declare two paths: <br>

- "The user owns their own store and has made a purchase in their own store" can be expressed as "ownPath and
  consumePath".
- "The user owns their own store or has made a purchase in any store" can be expressed as "ownPath or consumePath".

#### 4.3.3 Path Operators

In path expressions, it is possible to specify that the path in Structure is not mandatory. ISO GQL's path expressions already include the expressions for "and," "or," "optional," and "not." We will maintain consistency with ISO GQL in this regard.

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

（Not implemented.）

```
Structure {
    not path: (s:User)-[p:own]->(o:Shop)
}
```

（Not implemented.）

```
Structure {
    optional path:(s:User)-[p:own]->(o:Shop), (s)-[c:consume]->(o)
}
```

### 4.4 Constraint

#### 4.4.1 Single Rule Syntax

In the Constraint statement, each line represents a separate rule, which can be classified into the following
categories:

- **Logical Rule**
  Expressed as: <br>
  **RuleName("Rule description"): expression** <br>
  The output of a logical rule is a boolean value. Commonly used operators include >, <, ==, >=, <=, !=, +, -, *, /, %, and so on. These operators can be extended as needed. <br>

- **Calculation Rule**
  Expressed as: <br>
  **RuleName("Rule description") = expression** <br>
  The output of a calculation rule are numbers or text, depending on the content of the expression. <br>

- **Assignment Rule**
  Expressed as: <br>
  **Alias.property = expression** <br>
  Assignment rules are used to assign values to properties that defined in the rule. These rules are only valid within specific predicate definitions. <br>

Using the example of ownPath and consumePath from section 4.3: <br>

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
    ownAndConsumeUser("User owns their own store or has made purchases in any store"): exist(ownPath) or exist(consumePath)
}
```

```
Structure {
    (s:Shop)<-[p:visit]-(o:User)
}
Constraint {
    R("Whether the user has visited within the last 7 days") : p.timestamp >= -7@d
}
```

> If there are multiple users accessing and we only want to consider edges within the last 7 days, the rule will be terminated processing for any vertex that does not satisfy the condition in the fifth line. <br>

#### 4.4.2 Rule Group

The rule group can combine logical rules, with the main purpose of hierarchizing logical calculations.

```
Structure {
    （s:User)
}
Constraint {
    R1("Adult"): s.age > 18
              
    R2("Male"): s.gender == "male"
    
    // The following sentence is correct: R3, composed of R1 and R2, is considered as a rule group.
    R3("Adult male"): R1 and R2
    
    // The following sentence is incorrect: Non-rule variables are not allowed in a rule group.
    R3("Adult male"): R1 and s.gender == "male"
}
```

#### 4.4.3 Aggregation syntax

Aggregation operators have the following features and limitations:

- The input of the operator must be a list.
- The group statement can be used to group the graph, aggregating multiple paths with the same pattern into groups. When using group, the aggregation operator performs aggregation operations on the nodes and edges of the grouped graph.
- Aggregation operators can only perform aggregation calculations on subgraphs generated by a single starting entity instance. **If calculations are needed for a batch of subgraphs generated by multiple starting points, it is not supported within the scope of this document**.

The list of aggregation and statistical requirements in section 4.1.2 is as follows:

| Requirement ID | Description | 
|----------------|---------------------------------| 
| 3              | Calculate the number of times a shop has been browsed in the past 7 days or 30 days  |
| 4              | Classify Shops into high attention and low attention based on the number of times they were browsed in the last 7 days |
| 5              | Identify the top 3 Users with the highest spending based on the sales of a Shop in the last 7 days |
| 6              | Validate if a user has received more money in transfers than he have spent |
| 10             | Count the number of shops a User has made purchases or browsed in the last 7 days  |
| 11             | Calculate the total expenditure of each user at a specific shop |

**Example 1：Requirement 10, Requirement 3 and Requirement 4** <br>
![group_4_4_3_p1](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*FROwTLCV4HcAAAAAAAAAAAAADtmcAQ/original) <br>

Assuming the current date is January 10, 2023, the number of shops that Alice has consumed or browsed in the past 7 days should be 2. The grammar expression is as follows. <br>

```
Structure {
    (s:User)-[p:visit|consume]->(o:Shop)
}
Constraint {
    R1("The shop has been consumed or browsed in the past 7 days") : p.timestamp >= -7@d
    // without group()
    visitOrConsumeShopNum("calculate the number of shops that a user has consumed or browsed in the past 7 days") = count(o)

    // with group
    visitOrConsumeShopNum("calculate the number of shops that a user has consumed or browsed in the past 7 days") = group(s).count(o)
}
```

**Example 2：Requirement 6** <br>
![group_4_4_3_p2](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*kJMiRbdw0BYAAAAAAAAAAAAADtmcAQ/original) <br>

In the given image, Jobs, Alice, and Mike have a surplus (income greater than expenses), while Bob has a
deficit (expenses greater than income). The rules can be expressed as follows. <br>

```
Structure {
    outPath: (s:User)-[outP:pay]->(outU:User)
    inPath: (inU:User)-[inP:pay]->(s)
}
Constraint {
    // If inPath does not exist, return 0. Otherwise, proceed with the aggregation calculation.
    inAmount("income") = rule_value(inPath, group(s).sum(inP.amount), 0)
    // If outPath does not exist, return 0. Otherwise, proceed with the aggregation calculation.
    outAmount("expenses") = rule_value(outPath, group(s).sum(outP.amount), 0)

    R2("surplus"): inAmount > outAmount
}
```

**Example 3：Requirement 5**（**Not implemented**）** <br>

![group_4_4_3_p3](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*e6ijSZWfOUEAAAAAAAAAAAAADtmcAQ/original) <br>
In the given data example, the top 3 are Jobs, Mike and Alice. <br>

```
Structure {
    (s:Shop)<-[p:consume]-(o:User)
}
Constraint {
    R1("Expenses within 7 days"): p.timestamp >= -7@d
    R2("top3 users"): group(s).desc(p.amount).limit(3) 
}
```

**Example 4：Requirement 11** <br>
Assuming the data is as follows: <br>

![group_4_4_3_p4](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*PsPlR40fUAEAAAAAAAAAAAAADtmcAQ/original) <br>

We need to calculate the number of times the shop has been browsed in the past 7 days. it is important to note that there are 2 edges for Bob, so they need to be aggregated for the statistics. <br>

```
Structure {
    (s:Shop)<-[p:consume]-(o:User)
}
Constraint {
    R("Expenses within 7 days"): p.timestamp >= -7@d
    // To assign the total amount of user expenses
    userConsumeAmount("the total amount of user expenses") = group(s,o).sum(p.amount) 
}
Action {
    get(s.name, userConsumeAmount)
}
```

### 4.5 Define predicate rule

The main purpose of the previous chapters was to describe paths and rules, while the focus of this section is to define predicates. Predicates are mainly expressed in three scenarios:

- Inductive semantic definition between entity types and concepts.
- Logical predicate definition between entity types.
- Logical predicate definition between entity types and basic types.

#### 4.5.1 Inductive semantic definition between entity types and concepts

For information about entities and concepts, please refer to the explanation in [the schema modeling manual](./spgschema_tutorial_en.md). <br>

Inductive semantics refers to the process of deriving general concepts from a group of entities with common characteristics. The relation between these individuals and concepts is known as an inductive relation.<br>

The inductive semantics between entity types and concepts can be expressed through the following syntactic rules:<br>
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

ConceptA belongs to the TaxonomyOfTypeA. The above rule expresses that the entity s, under the premise of satisfying the above rule expression, it can be linked to the ConceptA through the TypeP predicate. For example: <br>
According to the requirement in section 4.1.2, we can transform the following requirement into a concept definition.

| Requirement ID | Description | 
|----------------|-------------------------------------| 
| 1              | Determine if a User is a shop owner |
| 4              | Classify Shops into high attention and low attention based on the number of times they were browsed in the last 7 days |
| 7              | Check if a user has made a transfer to themselves |

Example 1：Determine if a User is a shop owner <br>
Assuming the concept of "ShopKeeper" has been modeled and created, as shown below: <br>
![concept_4_5_1_p1](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*LY8cSqBhYF8AAAAAAAAAAAAADtmcAQ/original) <br>

In the instance diagram, it can be observed that Bob does not have a store and does not belong to the "ShopKeeper" category. However, Alice has a Hotel, so he should be classified as a "ShopKeeper". We can establish a relation between Alice and the "ShopKeeper" concept. <br>

```
Define (s:User)-[p:belongTo]->(o:TaxonomyOfUser/ShopKeeper) {
    Structure {
        path: (s)-[ownP:own]->(shop:Shop)
    }
    Constraint {
        R1("own a shop or not"): path
    }
}
```

By applying the above rule, we can establish a relationship between concepts and entity instances.

Example 2: Based on the frequency of visits to the shop in the past 7 days, classify the shops into high-attention shops and low-attention shops. <br>
![concept_4_5_1_p2](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*RvHESr9YexsAAAAAAAAAAAAADtmcAQ/original) <br>

In the above instance diagram, the hotel has been visited frequently, while the drug store has been
visited very few times. According to business requirements, we need to classify them respectively as "PopularShop" and "NamelessShop". <br>

```
Define (s:Shop)-[p:belongTo]->(o:TaxonomyOfShop/PopularShop) {
    Structure {
        path  : (s)<-[vP:visit]-(u:User)
    }
    Constraint {
        R1("Expenses within 7 days"): vP.timestamp >= -7@d
        // When the path does not exist, the browsing count is 0. Otherwise, it is counted for "u".
        visitsNum("browsing count") = rule_value(path, group(s).count(u),0)
        R2("hot shop"): visitsNum > ${hot_shop_threashold}
  }
}
```

> Note: ${hot_shop_threshold} is a threshold parameter that needs to be filled in with a specific value when using the predicate. <br>

```
Define (s:Shop)-[p:belongTo]->(o:TaxonomyOfShop/NamelessShop) {
    Structure {
        path: (s)<-[vP:visit]-(u:User)
    }
    Constraint {
        R1("Expenses within 7 days"): vP.timestamp >= -7@d
        // When the path does not exist, the browsing count is 0. Otherwise, it is counted for "u".
        visitsNum("browsing count") = rule_value(path, group(s).count(u),0)
        R2("NamelessShop"): visitsNum < ${nameless_shop_threashold}
    }
}
```

> Note: ${nameless_shop_threashold} is a threshold parameter that needs to be filled in with a specific value when using the predicate. <br>

#### 4.5.2 Logical predicate definition between entity types

According to the requirement in section 4.1.2, we can define predicates between entity types in the following
requirement.

| Requirement ID | Description                                                                         | 
|----------------|-------------------------------------------------------------------------------------| 
| 7              | Check if a user has made a transfer to themselves                                   |
| 8              | Get the list of other users that a User has transferred money to in the last 7 days |
| 11             | Calculate the total expenditure of each user at a specific shop                     |

The schema definitions are largely consistent with those in section 4.5.1. We need to add new schema according to the requirements. <br>
![schema_4_5_2](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*3c--RL7N-9gAAAAAAAAAAAAADtmcAQ/original) <br>

There are mainly three types of relationships. <br>

- (s:User)-[p:transSelf]->(s)  : "User performing a self-transfer"
- (s:User)-[p:trans7Days]->(o:User) :  "Users who have made transfers within the past 7 days"
- (s:Shop)-[p:consumeAmount]->(o:User) : "Consumption amount of a particular user at a shop"

Example 1: User performing a self-transfer <br>

```
Define (s:User)-[p:transSelf]->(s) {
    Structure {
        path: (s)-[pp:pay]->(s)
    }
    Constraint {
        R1("self-transfer"): path
    }
}
```

Example 2: Users who have made transfers within the past 7 days <br>

```
Define (s:User)-[p:trans7Days]->(o:User) {
    Structure {
        path: (s)-[pp:pay]->(o)
    }
    Constraint {
        R1("Expenses within 7 days"): p.timestamp > -7@d
        R2("made transfers"): path
    }
}
```

Example 3: Consumption amount of a particular user at a shop <br>

```
Define (s:Shop)-[p:consumeAmount]->(o:User) {
    Structure {
        path: (s)<-[cp:consume]-(o)
    }
    Constraint {
        R1("There are consumers"): path
        p.amount = group(s,o).sum(cp.amount) //Calculate the total transaction amount
    }
}
```

#### 4.5.3 Logical predicate definition between entity types and basic types

In the previous two sections, the main focus was on establishing relations between entity types and concepts. However, there are some requirements that do not interact with any other types, such as the following example.

| Requirement ID | Description                                                                       | 
|----------------|-----------------------------------------------------------------------------------| 
| 1              | Determine if a User is a shop owner                                               |
| 3              | Calculate the number of times a Shop has been browsed in the last 7 and 30 days   |
| 6              | Validate if a user has received more money in transfers than they have spent      |
| 7              | Check if a user has made a transfer to themselves                                 |
| 9              | Users own their own shops and make purchases in their own shops                   |
| 10             | Count the number of shops a User has made purchases or browsed in the last 7 days |

For the given requirement, we need to add properties to the User entity:

| Property Name              | type    | Description                                                        |
|----------------------------|---------|--------------------------------------------------------------------|
| isShopOwner                | boolean | whether the user is a shop owner                                   |
| isIncomeLargeOutcome       | boolean | whether the user's income is greater than their expenses           |
| 7daysVisitOrConsumeShopNum | int     | Number of shops visited or consumed by the user in the past 7 days |

We need to add properties to the Shop entity:

| Property Name  | type | Description                            |
|----------------|------|----------------------------------------|
| 7daysVisitNum  | int  | Number of visitors in the past 7 days  |
| 30daysVisitNum | int  | Number of visitors in the past 30 days |

These additional properties can be defined through rules, without importing actual data.

Example 1: Number of shops visited or consumed by the user in the past 7 days <br>

```
Define (s:User)-[p:7daysVisitOrConsumeShopNum]->(o:int) {
    Structure {
        path: (s)-[vc:visit|consume]->(shop:Shop)
    }
    Constraint {
        R1("visited or consumed in the past 7 days"): p.timestamp > -7@d
        o = group(s).count(shop)   //assignment
    }
}
```

Example 2: Number of visitors in the past 7 days  <br>

```
Define (s:Shop)-[p:7daysVisitNum]->(o:int) {
    Structure {
        path: (s)<-[p:visit]-(u:User)
    }
    Constraint {
        R1("visited in the past 7 days"): p.timestamp > -7@d
        o = group(s).count(u)   //assignment
    }
}
```

Example 3: Number of visitors in the past 30 days  <br>

```
Define (s:Shop)-[p:30daysVisitNum]->(o:int) {
    Structure {
        path: (s)<-[p:visit]-(u:User)
    }
    Constraint {
        R1("visited in the past 30 days"): p.timestamp > -30@d
        o = group(s).count(u)    //assignment
    }
}
```

### 4.6 Action

Action supports multiple operations:
- createNodeInstance/createEdgeInstance: Used for the semantic expression of causal logic results.
- get: Outputs the matched results, including entities, relations, and properties.

The following examples will be shown.


#### 4.6.1 Causal logic semantics

In a knowledge graph, causal relations need to be established under certain conditions. This example refers to a case from the financial knowledge graph section of the SPG whitepaper. The causal description is as shown in the following diagram:<br>
![cau_4_6](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*Kt8mQpZQpfYAAAAAAAAAAAAADtmcAQ/original)
<br>

#### 4.6.1.1 createNodeInstance

When the conditions for causal semantics between concepts are met, createNodeInstance will create a new instance. In this example, a new event instance is created using the following syntax:<br>
```
Define (s: `ProductChain.TaxonomyOfCompanyAccident`/`周期性行业头部上市公司停产事故`)-[p: leadTo]->(o: `ProductChain.TaxonomyOfIndustryInfluence`/`成本上升`) {
    Structure {
        (s)-[:subject]->(c:ProductChain.Company)
        (c)-[:belongIndustry]->(d:ProductChain.Industry)
        (d)-[:downstream]->(down:ProductChain.Industry)
    }
    Constraint {
        // No constraint conditions have been defined here
    }
    Action {
        downEvent = createNodeInstance(
            type=ProductChain.IndustryInfluence,
            value={
                subject=down.id
                objectWho="Rise"
                influenceDegree="Rise"
                indexTag="Cost"
            }
        )
    }
}
```

**createNodeInstance Parameter Description:** <br>

- type: Specifies the type of entity instance to create.
- value: Represents the specific attribute values of the instance, consisting of key-value pairs. The key is the attribute name defined in the schema, and the value can be a constant or various variables from Structure and Constraint. Note: If the key does not exist in the schema or the value does not meet the schema definition, it is considered an invalid value.

**Return Value:** <br>

- Specific instance alias, which should not overlap with variables in Structure or Constraint.

In this example, we are creating a new event instance named "downEvent" with the event type "ProductChain.IndustryInfluence". The subject of the event is the "down" entity from the Structure, and the attributes represent the rising cost in that industry.

#### 4.6.1.2 createEdgeInstance

We can also create a new relation using createEdgeInstance to associate the triggered event instance with the event instance that has a causal relation. The specific usage is as follows:<br>

```
Define (s: `ProductChain.TaxonomyOfCompanyAccident`/`周期性行业头部上市公司停产事故`)-[p: leadTo]->(o: `ProductChain.TaxonomyOfIndustryInfluence`/`成本上升`) {
    Structure {
        (s)-[:subject]->(c:ProductChain.Company)
        (c)-[:belongIndustry]->(d:ProductChain.Industry)
        (d)-[:downstream]->(down:ProductChain.Industry)
    }
    Constraint {

    }
    Action {
        downEvent = createNodeInstance(
            type=ProductChain.IndustryInfluence,
            value={
                subject=down.id
                objectWho="Rise"
                influenceDegree="Rise"
                indexTag="Cost"
            }
        )
      #To establish a 'leadTo' edge between event 's' and the newly generated 'downEvent', representing that one event instance leads to another event instance.
      createEdgeInstance(
          src=s,
          dst=downEvent,
          type=leadTo,
          value={}
      )
    }
}
```

**createEdgeInstance Parameter Description:**<br>
- type: Specifies the type of the edge.
- src：Alias of the source node, which must exist in the Structure, or be an instance created through createNodeInstance in the Action.
- dst: Alias of the destination node, which must also comply with the constraints of 'src'.
- value: Attribute values of the edge, also in key-value pairs, can be empty.

**Return Value:**<br>
- None. The main reason is that edge instances are not referenced again in Action.


#### 4.6.2 get

The purpose of the 'get' operation is to retrieve entities, relations, properties, or temporary variables from a Structure or Constraint. The specific usage is as follows:

```
Structure {
    path: (s:Shop)<-[vP:visit]-(u:User)
}
Constraint {
    R1("Expenses within 7 days"): vP.timestamp >= -7@d
    visitsNum("visiting count") = group(s).count(u)
    R2("hot shop"): visitsNum > 1000
}
Action {
    // To retrieve the IDs of the shop and user nodes, and return the 'visitsNum' variable from the Constraint
    get(s.id, u.id, visitsNum)
}
```
