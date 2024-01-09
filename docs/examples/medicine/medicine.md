## 从文本构建医疗图谱

本示例旨在展示如何基于SPG-Schema的定义，利用大模型实现对图谱实体和关系的抽取和构建到图谱。
![](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*-PKySKstgy8AAAAAAAAAAAAADtmcAQ/original#id=NGInL&originHeight=1374&originWidth=2876&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

## 1 Quick Start

### Step1：进入案例目录

```shell
 cd python/knext/knext/examples/medicine/
```

### Step2：项目初始化

先对项目进行初始化动作

```shell
knext project create --prj_path .
```

### Step3：知识建模

schema文件已创建好[医疗SPG Schema模型](https://github.com/OpenSPG/openspg/blob/master/python/knext/knext/examples/medicine/schema/medicine.schema)
，可执行如下命令提交

```shell
knext schema commit
```

```shell
# 提交人体部位和医院部门概念导入任务
knext builder execute BodyPart,HospitalDepartment
```

### step4：知识抽取构建

该图谱中“Disease”实体类型，需要从非结构化的本文数据中抽取，最终得到结构化的知识。
输入原始数据参考[Disease原始文本](https://github.com/OpenSPG/openspg/blob/master/python/knext/knext/examples/medicine/builder/job/data/Disease.csv)
，如下面例子所示：

```shell
甲状腺结节是指在甲状腺内的肿块，可随吞咽动作随甲状腺而上下移动，是临床常见的病症，可由多种病因引起。临床上有多种甲状腺疾病，如甲状腺退行性变、炎症、自身免疫以及新生物等都可以表现为结节。甲状腺结节可以单发，也可以多发，多发结节比单发结节的发病率高，但单发结节甲状腺癌的发生率较高。患者通常可以选择在普外科，甲状腺外科，内分泌科，头颈外科挂号就诊。有些患者可以触摸到自己颈部前方的结节。在大多情况下，甲状腺结节没有任何症状，甲状腺功能也是正常的。甲状腺结节进展为其它甲状腺疾病的概率只有1%。有些人会感觉到颈部疼痛、咽喉部异物感，或者存在压迫感。当甲状腺结节发生囊内自发性出血时，疼痛感会更加强烈。治疗方面，一般情况下可以用放射性碘治疗，复方碘口服液(Lugol液)等，或者服用抗甲状腺药物来抑制甲状腺激素的分泌。目前常用的抗甲状腺药物是硫脲类化合物，包括硫氧嘧啶类的丙基硫氧嘧啶(PTU)和甲基硫氧嘧啶(MTU)及咪唑类的甲硫咪唑和卡比马唑。
```

下面的抽取示例中，我们通过抽取算子，调用了“gpt-3.5”模型完成抽取任务，具体步骤：
**第一步：配置模型服务，配置文件参考**[**builder/model/openai_infer.json
**](https://github.com/OpenSPG/openspg/blob/master/python/knext/knext/examples/medicine/builder/model/openai_infer.json)
**，这里使用openai的gpt-3.5模型，内容格式如下。**

```shell
{
    "nn_name": "gpt-3.5-turbo",
    "openai_api_key": "***input your api key***",
    "openai_api_base": "***input your service addr****",
    "openai_max_tokens": 1000
}
```

**第二步：编写Disease的构建任务代码，本案例的代码可以参考**[**builder/job/disease.py**]()**。**
**在Disease的BuildJob代码中，使用了LLMBasedExtractor算子：**

```shell
from nn4k.invoker import NNInvoker

from knext.api.component import CSVReader, LLMBasedExtractor, SPGTypeMapping, KGWriter
from knext.api.auto_prompt import REPrompt
from knext.client.model.builder_job import BuilderJob


from schema.medicine_schema_helper import Medicine


class Disease(BuilderJob):
    def build(self):
        # 数据源
        source = CSVReader(
            local_path="builder/job/data/Disease.csv",
            columns=["input"],
            start_row=1,
        )

        # 使用默认的LLMBasedExtractor抽取算子
        # NNInvoker封装了对gpt模型服务的调用
        # REPrompt根据schema自动生成prompt
        extract = LLMBasedExtractor(
            llm=NNInvoker.from_config("builder/model/openai_infer.json"),
            prompt_ops=[
                REPrompt(
                    spg_type_name=Medicine.Disease,
                    property_names=[
                        Medicine.Disease.complication,
                        Medicine.Disease.commonSymptom,
                        Medicine.Disease.applicableDrug,
                        Medicine.Disease.department,
                        Medicine.Disease.diseaseSite,
                    ],
                    relation_names=[(Medicine.Disease.abnormal, Medicine.Indicator)],
                )
            ],
        )

        #抽取结果与schema的映射
        mappings = [
            SPGTypeMapping(spg_type_name=Medicine.Disease),
            SPGTypeMapping(spg_type_name=Medicine.BodyPart),
            SPGTypeMapping(spg_type_name=Medicine.Drug),
            SPGTypeMapping(spg_type_name=Medicine.HospitalDepartment),
            SPGTypeMapping(spg_type_name=Medicine.Symptom),
            SPGTypeMapping(spg_type_name=Medicine.Indicator),
        ]

        sink = KGWriter()

        return source >> extract >> mappings >> sink
```

**第三步：提交知识抽取任务**

```bash
knext builder execute Disease
```

### step5：执行图谱任务

SPG支持ISO GQL写法，可用如下命令行执行查询任务

```cypher
knext reasoner execute --dsl "
MATCH
    (s:Medical.Disease)-[p]->(o)
RETURN
    s
"
```
