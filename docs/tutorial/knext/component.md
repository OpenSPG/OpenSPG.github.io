---
title: 组件介绍
order: 2
---

### SourceReader
> 所有知识加工任务的第一步，从数据源逐行读取数据，将数据转化成`Dict[str, str]`格式。

#### CSVReader
从本地csv文件读取数据。
##### 参数
| 名称 | 类型 | 是否必填 | 示例值 | 描述 |
| --- | --- | --- | --- | --- |
| **local_path** | str | 是 | './builder/job/data/App.csv' | 文件路径 |
| **columns** | list[str] | 否 | ['id', 'riskMark', 'useCert'] | 输入列 |
| **start_row** | int | 否 | 2 | 数据读取起始行数【若希望从csv第一行开始读取，则start_row=1】 |

### SPGExtractor
> 在知识加工任务中，用于从非结构化数据中抽取出结构化知识。

#### UserDefinedExtractor
> 执行用户自定义的抽取算子。需要用户实现`ExtractOp`，并将算子设置在组件上。

##### 参数
| 名称 | 类型 | 是否必填 | 示例值 | 描述 |
| --- | --- | --- | --- | --- |
| **extract_op** | ExtractOp | 是 | DiseaseExtractOp(params={"config": "test"}) | 抽取算子实例 |

#### LLMBasedExtractor
> 调用大模型进行知识抽取。借助`NN4K`，设置用于进行抽取的llm模型。同时，需要用户实现`PromptOp`，自定义用于抽取的prompt模版，以及前置处理和后置处理逻辑。当前抽取组件会将前后置处理和调用模型一系列流程串联起来，将非结构化`Dict[str, str]`类型数据，转化为结构化`SPGRecord`类型数据。
> 
> 如果设置了多个`PromptOp`，会按照顺序依次执行。

##### 参数
| 名称 | 类型 | 是否必填 | 示例值 | 描述 |
| --- | --- | --- | --- | --- |
| **llm** | NNInvoker | 是 | NNInvoker.from_config("./openai_infer.json") | 抽取模型 |
| **prompt_ops** | List[PromptOp] | 是 | [NERPromptOp("Medical.Disease")] | prompt算子 |

### Mapping
#### SPGTypeMapping
> SPG映射节点由四个执行步骤组成：
> 
> STEP1（**Mapping**)：根据配置的字段映射关系，将非标准数据字段映射到subject类型的属性字段上。
> 
> STEP2（**Object Linking**）：对于映射后的属性，若object类型上绑定或设置了**LinkOp**，则执行基于属性值生成object的链指流程。
> 
> STEP3（**Predicate Predicting**）：对于映射后的属性，若属性值为空，且当前(subject,predicate,object)上绑定了**PredictOp**，则执行基于subject所有属性生成object的预测流程。
> 
> STEP4（**Subject Fusing**）：若当前subject类型上绑定了**FuseOp**，则执行基于subject的融合流程。

##### 参数
| 名称 | 类型 | 是否必填 | 示例值 | 描述 |
| --- | --- | --- | --- | --- |
| **spg_type_name** | str | 是 | DEFAULT.App | SPG类型名 |

##### 接口
**add_property_mapping**
> 添加从非标准数据字段到SPG属性之间的映射关系，并执行绑定到属性所属于的类型schema上的链指策略。

| 参数 | 类型 | 是否必填 | 示例值 | 描述 |
| --- | --- | --- | --- | --- |
| **source_name** | str | 是 | "useCert" | 源字段 |
| **target_name** | PropertyName | 是 | DEFAULT.App.useCert | SPG属性名 |
| **target_type** | SPGTypeName | 否 | DEFAULT.Cert | SPG属性类型。当前未支持属性多类型，暂不需要填。 |
| **link_strategy** | LinkingStrategy | 否 | CertLinkOp() | 链指策略。当前支持的链指策略：
1、`LinkingStrateEnum.IDEquals`
2、`LinkOp`类型算子
若设置，会在当前任务覆盖schema上绑定的链指策略。 |

**add_relation_mapping**
> 添加从非标准数据字段到SPG关系之间的映射关系，并执行绑定到关系所属于的类型schema上的链指策略。

| 参数 | 类型 | 是否必填 | 示例值 | 描述 |
| --- | --- | --- | --- | --- |
| **source_name** | str | 是 | "belongTo" | 源字段 |
| **target_name** | RelationName | 是 | DEFAULT.App.belongTo | SPG关系名 |
| **target_type** | SPGTypeName | 是 | DEFAULT.Company | SPG关系类型。关系映射上必填。 |
| **link_strategy** | LinkingStrategy | 否 | CertLinkOp() | 链指策略。当前支持的链指策略：
1、`LinkingStrateEnum.IDEquals`
2、`LinkOp`类型算子
若设置，会在当前任务覆盖schema上绑定的链指策略。 |

**add_predicting_property**
> 添加需要预测的SPG属性字段，并执行绑定到spo三元组上的预测策略。

| 参数 | 类型 | 是否必填 | 示例值 | 描述 |
| --- | --- | --- | --- | --- |
| **target_name** | PropertyName | 是 | DEFAULT.App.useCert | SPG属性名 |
| **target_type** | SPGTypeName | 否 | DEFAULT.Cert | SPG属性类型。当前未支持属性多类型，暂不需要填。 |
| **predicting_strategy** | PredictingStrategy | 否 | CertPredictOp() | 预测策略。当前支持的预测策略：
1、`PredictOp`类型算子
若设置，会在当前任务覆盖schema上绑定的预测策略。 |

**add_predicting_relation**
> 添加需要预测的SPG关系字段，并执行绑定到spo三元组上的预测策略。

| 参数 | 类型 | 是否必填 | 示例值 | 描述 |
| --- | --- | --- | --- | --- |
| **target_name** | RelationName | 是 | DEFAULT.App.belongTo | SPG属性名 |
| **target_type** | SPGTypeName | 是 | DEFAULT.Company | SPG关系类型。关系映射上必填。 |
| **predicting_strategy** | PredictingStrategy | 否 | CertPredictOp() | 预测策略。当前支持的预测策略：
1、`PredictOp`类型算子
若设置，会在当前任务覆盖schema上绑定的预测策略。 |

**add_filter**
> 添加字段筛选条件，数据满足`column_name=column_value`条件的会执行映射。若不设置筛选条件，则全部数据会执行映射。

| 参数 | 类型 | 是否必填 | 示例值 | 描述 |
| --- | --- | --- | --- | --- |
| **column_name** | str | 是 | "type" | 筛选字段 |
| **column_value** | str | 是 | "App" | 筛选值 |

#### RelationMapping
> 用于将数据映射到SPG关系以及关系上的子属性。

##### 参数
| 名称 | 类型 | 是否必填 | 示例值 | 描述 |
| --- | --- | --- | --- | --- |
| **subject_name** | SPGTypeName | 是 | DEFAULT.App | SPG类型名 |
| **predicate_name** | RelationName | 是 | DEFAULT.App.belongTo | SPG关系名 |
| **object_name** | SPGTypeName | 是 | DEFAULT.Company | SPG类型名 |

##### 接口
**add_sub_property_mapping**
> 添加从源数据字段到SPG关系子属性之间的映射关系。

| 参数 | 类型 | 是否必填 | 示例值 | 描述 |
| --- | --- | --- | --- | --- |
| **source_name** | str | 是 | "confidence" | 源字段 |
| **target_name** | SubPropertyName | 是 | DEFAULT.App.belongTo.confidence | SPG关系子属性 |

**add_filter**
> 添加字段筛选条件，数据满足`column_name=column_value`条件的会执行映射。若不设置筛选条件，则全部数据会执行映射。

| 参数 | 类型 | 是否必填 | 示例值 | 描述 |
| --- | --- | --- | --- | --- |
| **column_name** | str | 是 | "type" | 筛选字段 |
| **column_value** | str | 是 | "App" | 筛选值 |

### SinkWriter
> 所有知识加工任务的最后一步，将数据导入到目标存储中

#### KGWriter
##### 参数
无
