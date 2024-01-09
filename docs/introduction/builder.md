知识构建过程是一个从数据到知识的生产过程。

知识生产由一系列的组件组成，一般而言从一个数据源到知识图谱需要经过以下流程：
![](https://intranetproxy.alipay.com/skylark/lark/0/2024/jpeg/765/1704634174101-ebc475dc-0102-4df5-84b1-2135b7f375ce.jpeg)

常见的知识生产组件有，用户可以根据自己的需要扩展组件以及组件能力。

| 组件 | 作用 |
| --- | --- |
| SourceReader | 定义源数据类型以及如何读取源数据 |
| ExtractProcessor | 抽取组件，从非结构数据中抽取结构化数据 |
| MappingProcessor | 映射组件，将结构化数据映射图谱schema |
| SinkWriter | 写入图谱数据 |

## 知识抽取(Extract)
知识抽取作用是从非结构化的数据中抽取出结构化数据。当数据源数据已经是结构化数据时，可以不使用该组件。

以大模型抽取实体子图为例，定义如下抽取流程：
```python
# 构造以Company为中心的关系抽取prompt，抽取该公司的企业证件号码、经营范围、注册区域等
# 其中Company是知识图谱schema的一个实体类型，企业证件号码、经营范围等是它的属性
prompt = REPrompt(
    spg_type_name=Company,
    property_names=[
        Company.orgCertNo,
        Company.regArea,
        Company.businessScope,
        Company.establishDate,
        Company.legalPerson,
        Company.regCapital,
    ],
    relation_names=[],
)

# 定义大模型抽取组件，传入大模型配置以及prompt
extract = LLMBasedExtractor(
    llm=NNInvoker.from_config("builder/model/openai_infer.json"),
    prompt_ops=[prompt],
)
```

输入一段文本：阿里巴巴（中国）有限公司是一家从事企业管理，计算机系统服务，电脑动画设计等业务的公司，成立于2007年03月26日，公司坐落在浙江省......。该组件会从该非结构化文本中抽取出Company的结构化知识：
![](https://intranetproxy.alipay.com/skylark/lark/0/2024/jpeg/147072/1704597201760-55df9b1e-7266-426a-a0ed-c84785bca19a.jpeg)

## 知识映射(Mapping)
知识映射作用是将结构化数据映射到图谱schema，执行图谱schema上绑定的各类算子。知识映射组件需要经过：

| 步骤 | 说明 |
| --- | --- |
| 映射(Mapping) | 将结构化数据映射到图谱schema |
| 链指(Linking) | 执行属性或关系上的链指算子，将属性或关系链指到对应实例 |
| 预测(Predicting) | 执行属性或关系上的预测算子，基于已知的知识预测新的属性或关系 |
| 融合(Fusing) | 执行类型上绑定的融合算子，将当前的实体与已存在的实体进行融合 |


继续以Company为例，下图展示了这些流程：
![](https://intranetproxy.alipay.com/skylark/lark/0/2024/jpeg/765/1704634466309-e4fc0d53-9908-4051-b600-c0cae4549215.jpeg)


















