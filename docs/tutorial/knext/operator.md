---
title: 算子介绍
order: 3
---

如下表所示，knext提供共5类算子接口，用户可以通过继承对应基类，实现算子接口，来自定义算子执行逻辑。所有算子必须依赖组件执行，依赖关系参考
knext能力模型。

| 算子名称  | 伪代码表示                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 算子说明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ExtractOp | class CompanyBuild(BuilderJob):<br>&emsp;def build(self): <br>&emsp;&emsp;source = CSVReader(...) <br>&emsp;&emsp;extract = UserDefinedExtractor(extract_op=TestExtractOp()) <br>&emsp;&emsp;mappings = [...] <br>&emsp;&emsp;sink = KGWriter()<br>&emsp;&emsp;return source >> extract >> mappings >> sink</code>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 定义从非结构化文本中抽取得到结构化要素的<br>算法逻辑，绑定在UserDefinedExtractor组件上，<br>基于LLMBasedExtractor无需绑定ExtractOp。                                                                                                                                                                                                                                                                                                                                                                               |
| LinkOp    | Person(人): EntityType<br>&emsp;properties:<br>&emsp;&emsp;workAt(工作所在公司): Company<br><br>class CompanyLinkOp(LinkOp):<br>&emsp;# LinkOp需要绑定到实体/概念/事件类型上<br>&emsp;bind_to = Finance.Company<br>&emsp;...<br><br>class PersonBuild(BuilderJob):<br>&emsp;def build(self):<br>&emsp;&emsp;source = CSVReader(...)<br>&emsp;&emsp;person_mapping = (<br>&emsp;&emsp;&emsp;SPGTypeMapping(spg_type_name=ns.Person)<br>&emsp;&emsp;&emsp;.add_property_mapping("id", ns.Person.id)<br>&emsp;&emsp;&emsp;.add_property_mapping("workAt", ns.Person.workAt)<br>&emsp;&emsp;)<br>&emsp;;&emsp;sink = KGWriter()<br><br>&emsp;;&emsp;return source >> mappings >> sink                                                                                                                                | LinkOp只能绑定到特定的实体、事件、概念、<br>标准类型上(比如type1), 当type1被定义为<br>其他类型(如type2)的属性类型或关系的otype时，<br>在type2的构建阶段会自动激活对type1 LinkOP的调用。<br>如伪代码所示，CompanyLinkOp 绑定到了<br>Company类型上，在用户的构建任务中会自动<br>激活对CompanyLinkOp的调用。                                                                                                                                                                                                          |
| FuseOp    | Company(公司): EntityType<br>&emsp;properties:<br>&emsp;...<br><br>class CompanyFuseOp(P):<br>&emsp;#LinkOp需要绑定到实体/概念/事件类型上<br>&emsp;bind_to = Finance.Company<br>&emsp;...<br>class CompanyBuild(BuilderJob):<br>&emsp;def build(self):<br>&emsp;&emsp;source = CSVReader(...)<br>&emsp;&emsp;person_mapping = (<br>&emsp;&emsp;SPGTypeMapping(spg_type_name=ns.Company)<br>&emsp;&emsp;&emsp;.add_property_mapping("id", ns.Company.id)<br>&emsp;&emsp;&emsp;.add_property_mapping("name", ns.Company.name)<br>&emsp;&emsp;)<br>&emsp;&emsp;sink = KGWriter()<br><br>&emsp;&emsp;return source >> mappings >> sink                                                                                                                                                                               | LinkOp只能绑定到特定的实体、事件、概念、标准类型<br>上(比如type1), 它的作用是实现对type1实例的去重合，<br>在type1的构建阶段会自动激活对type1 <br>FuseOp的调用。如伪代码所示，CompanyFuseOp<br>绑定到了Company类型上，在Person的构建任务<br>中会自动激活对CompanyFuseOp的调用，<br>若图谱中存在相同/相似的实例，自动触发合并，<br>并更新写入到图谱中。                                                                                                                                                              |
| PredictOp | Company(公司): EntityType<br>&emsp;properties:<br>&emsp;&emsp;IND#belongTo TaxoOfCompany<br>class CompanyTypePredict(PredictOp):<br>&emsp;#LinkOp需要绑定到实体/概念/事件类型上<br>&emsp;bind_to = (Finance.Company, "IND#belongTo", Finance.TaxoOfCompany)<br>&emsp;...<br><br>class CompanyBuild(BuilderJob):<br>&emsp;def build(self):<br>&emsp;&emsp;source = CSVReader(...)<br>&emsp;&emsp;person_mapping = (<br>&emsp;&emsp;&emsp;SPGTypeMapping(spg_type_name=ns.Company)<br>&emsp;&emsp;&emsp;.add_property_mapping("id", ns.Company.id)<br>&emsp;&emsp;&emsp;.add_property_mapping("name", ns.Company.name)<br>&emsp;&emsp;&emsp;.add_predicting_relation("IND#belongTo", Finance.TaxoOfCompany)<br>&emsp;&emsp;)<br>&emsp;&emsp;sink = KGWriter()<br><br>&emsp;&emsp;return source >> mappings >> sink | PredictOp只能绑定到(SType, p, Otype)三元组上,<br> 它的作用是预测符合(SType, p)要求的Otype实例，<br>在type1的构建阶段会自动激活对PredictOp的调用。<br>如伪代码所示，CompanyTypePredict 绑定到了<br>(Finance.Company, "IND#belongTo", Finance.TaxoOfCompany)<br>上，在Company的构建任务中会自动激活对<br>CompanyTypePredict的调用，找到符合要求<br>的目标Otype实例后，生成三元组实例，并更新写入<br>到图谱中。它和链指算子的区别是，<br>链指算子解决的是文本与图谱实体对齐的问题，<br>预测算子则是预测新的类型实例。 |
| PromptOp  |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | 用于与大模型交互，定义特定任务的提示<br>，以及大模型输出的结果解析为SPGRecord的逻辑。                                                                                                                                                                                                                                                                                                                                                                                                                              |

下面给出各个算子的接口定义，以及示例实现。

### ExtractOp

```python
class ExtractOp:
    """
    【针对场景】用于将非结构化数据转成结构化
    【使用方法】设置在 UserDefinedExtractor 的 extract_op 参数中
    【bind_to】无
    【输入】非结构化数据
    【输出】抽取出的结构化数据
    """

    def invoke(self, record: Dict[str, str]) -> List[SPGRecord]:
        pass
```

下面是一个ExtracOp的示例：

```python
class TestExtractOp(ExtractOp):
    def invoke(self, record: Dict[str, str]) -> List[SPGRecord]:
        spg_type = record["type"]
        properties = json.loads(record["properties"])
        return [SPGRecord(spg_type, properties)]

```

该抽取算子可以从以下record中构造SPGRecord：

```python
    record = {
    "type": "Company",
    "properties": '{"phone": "+86-12345678", "addr": "China"}',
}

```

### LinkOp

```python
class LinkOp:
    """
    【针对场景】导入s时，根据o的属性值，链指o节点，用于拉边
    【使用方法】绑定在spg_type上，在mapping组件的property_normalizer阶段调用
    【bind_to】实体/概念/事件类型
    【输入】otype的属性值，stype的所有属性
    【输出】链指到的otype实例
    """

    bind_to: str

    def invoke(self, property: str, subject_record: SPGRecord) -> List[SPGRecord]:
        pass
```

下面是一个LinkOp的示例：

```python
class CompanyLinkOp(LinkOp):
    # LinkOp需要绑定到实体/概念/事件类型上
    bind_to = "Company"

    pass

```

### FuseOp

```python
class FuseOp:
    """
    【针对场景】属性融合/实体去重
    【使用方法】 绑定在spg_type上，在mapping组件的spg_type_fuser阶段调用
    【bind_to】实体/概念/事件类型
    【输入】新增待融合实体，可以为多个
    【输出】融合后的实体，可以为多个
    """

    bind_to: str

    def link(self, subject_record: SPGRecord) -> SPGRecord:
        pass

    def merge(self, subject_record: SPGRecord, linked_record: SPGRecord) -> SPGRecord:
        pass

```

下面是一个FuseOP的示例：

```python

class CompanyFuseOp(FuseOp):
    #FuseOp需要绑定到实体/概念/事件类型上
    bind_to = "Company"

    def jaccard_similarity(self, a: str, b: str):
        terms_reference = list(b.replace(" ", ""))
        terms_model = list(a.replace(" ", ""))
        grams_reference = set(terms_reference)
        grams_model = set(terms_model)
        temp = 0
        for i in grams_reference:
            if i in grams_model:
                temp = temp + 1
        denominator = len(grams_model) + len(grams_reference) - temp
        if denominator == 0:
            return 0
        return float(temp / denominator)

    def link(self, subject_record: SPGRecord) -> SPGRecord:
        name = subject_record.get_property("name")
        linked_record = self.search_client.fuzzy_search(subject_record, "name")
        return linked_record

    def merge(
            self, subject_record: SPGRecord, linked_record: SPGRecord
    ) -> SPGRecord:

        return linked_record

```

### PredictOp

```python
class PredictOp:
    """
    【针对场景】关系生成/概念上下位挂载
    【使用方法】绑定在spo三元组上，在mapping组件的link_predictor阶段调用
    【bind_to】实体/概念/事件类型
    【输入】stype的所有属性
    【输出】预测的otype实例
    """

    bind_to: Tuple(str, str, str)

    def invoke(self, subject_record: SPGRecord) -> List[SPGRecord]:
        pass

```

下面是一个PredictoOp的示例：

```python
class TestPredictOp(PredictOp):
    # PredictOp需要绑定在spo三元组上
    bind_to = ("Company", "isSubsidiaryOf", "Company")

    def invoke(self, subject_record: SPGRecord) -> List[SPGRecord]:
        name = subject_record.get_property("name")
        # 构造一些新的SPGRecord，与subject_record一起构成SPO三元组
        output = []
        for i in range(self.num_outputs):
            record = copy.deepcopy(subject_record)
            new_name = f"{name}{i + 1}"
            record.update_property("name", new_name)
            record.update_property("index", str(i + 1))
            output.append(record)
        return output

```

### PromptOp

knext针对RE/NER/EE任务，在`knext.api.operator`模块内置了对应的PromptOp。支持在组件内引入对应的PromptOp，设置抽取目标（SPG类型和属性名），自动通过schema信息进行模版渲染。

#### REPrompt

默认模版：

```python
    template: str = """
已知SPO关系包括:[${schema}]。从下列句子中提取定义的这些关系。最终抽取结果以json格式输出。
input:${input}
输出格式为:{"spo":[{"subject":,"predicate":,"object":},]}
"output":
    """
```

使用示例：

```python
from knext.api.operator import REPrompt

prompt_op = REPrompt(
    spg_type_name="Medical.Disease",
    property_names=["commonSymptom", "applicableDrug"])
```

算子初始化后，会通过以下规则生成schema信息并替换掉模版中的${schema}占位符：
[subject_type(subject description)-predicate(predicate description)-object_type(object description)]

- subject_type、predicate、object_type使用SPG的中文名
- subject/object description优先用类型的描述，如果描述为空，则取类型的中文名称
- predicate description优先用属性的描述，如果描述为空，则取属性的中文名称

> **示例** > [产品-同类(产品是同一类别)-产品,产品-上游(上游指产业链的上游原料、设备、技术服务等供应)-产品, ...]

#### NERPrompt

默认模版：
待补充
使用示例：

```python
from knext.api.operator import REPrompt

prompt_op = REPrompt(
    spg_type_name="Medical.Disease",
    property_names=["commonSymptom", "applicableDrug"])
```

算子初始化后，会通过以下规则生成schema信息并替换掉模版中的${schema}占位符：
[["entity_type1":"desc1", "entity_type2":"desc2", "entity_type3":"desc3"]

- entity_type使用SPG的英文名
- desc优先用类型的描述，如果描述为空，则取类型的中文名称

> **示例** > ["Medical.Disease": "疾病", "Medical.Symptom": "疾病过程中机体内的一系列机能、代谢和形态结构异常变化所引起的病人主观上的异常感觉或某些客观病态改变"]

#### EEPrompt

默认模版：
待补充
使用示例：
待补充
算子初始化后，会通过以下规则生成schema信息并替换掉模版中的${schema}占位符：
[{event_type:eventTypeName1(eventTypeDesc1),arguments:[arg1_name(desc1), ...]}, ...]

- event_type的值结构为：英文名(中文名)，如果事件类型描述不为空，则使用描述取到括号内内容
- arguments是属性列表，英文名(中文名)，如果属性的描述不为空，则使用描述取到括号内内容

> **示例**
> [{event_type:StockTransEvent(股份股权转让事件)
> ,arguments:[subject_company(股份股权转让公司),subject_person(股份股权转让人), ...]},]

#### 自定义Prompt

需要继承PromptOp基类，并实现以下接口：

```python
class PromptOp:
    """
    【针对场景】封装LLM需要的prompt模版和前置后置处理逻辑
    【使用方法】设置在 LLMBasedExtractor 的 prompt_ops 参数中
    【bind_to】无
    【输入】非结构化数据
    【输出】抽取出的结构化数据
    """

    template: str

    def build_prompt(self, variables: Dict[str, str]) -> str:
        """根据variables填充prompt。"""
        pass

    def parse_response(self, response: str) -> List[SPGRecord]:
        """将模型结果转化成生产链路所需的SPGRecord格式"""
        pass

    def build_next_variables(self, response: str, variables: Dict[str, str]) -> List[Dict[str, str]]:
        """生成variables，作为下一个promptOp的build_prompt的入参"""
        pass

```

### 一个案例

我们以一个经济指标抽取的任务为例，具体介绍上述几个Op完成的工作。该任务的目的是从研报、财经新闻中抽取经济指标并导入指标关系图谱。假设我们有一个可用的大模型服务，如ChatGPT，我们可以基于该服务完成抽取任务。
经济指标抽取的示例代码参见：[https://github.com/OpenSPG/openspg/tree/master/python/knext/knext/examples/finance](https://github.com/OpenSPG/openspg/tree/master/python/knext/knext/examples/finance)
该任务Operator相关代码在builder/operator目录，相关的ExtractOp、LinkOp、FuseOp、PredictOp、PromptOp分别执行如下工作：

- ExtractOp：从原始文本中执行NER，抽取指标实体
- LinkOp：定义其他实体属性挂载到Indicator的方式
- FuseOp：将抽取出的指标与图谱内指标融合（去重）
- PredictOp：构造Indicator的上下位关系
- PromptOp：构造不同任务的提示，并解析大模型输出结果
