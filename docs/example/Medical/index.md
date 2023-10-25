---
title: 医疗领域
order: 2
---

## 从文本构建医疗图谱

本示例旨在展示如何基于SPG-Schema的定义，利用大模型实现对图谱实体和关系的抽取和构建到图谱。
![image.jpg](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*-PKySKstgy8AAAAAAAAAAAAADtmcAQ/original)

## 1 Quick Start

### Step1：进入案例目录

```shell
 cd python/knext/examples/medical/
```

### Step2：项目初始化

先对项目进行初始化动作

```shell
knext project create --prj_path .
```

### Step3：知识建模

schema文件已创建好[医疗SPG Schema模型](https://github.com/OpenSPG/openspg/blob/master/python/knext/examples/medical/schema/medical.schema)，可执行如下命令提交

```shell
knext schema commit
```

```shell
# 提交人体部位和医院部门概念导入任务
knext builder submit BodyPart,HospitalDepartment
```

### step4：知识抽取构建

**第一步：提交自定义的疾病实体类型的抽取算子**

```shell
knext operator publish DiseaseExtractor
```

**第二步【可选】：大模型(ChatGLM2)微调**

**1、训练样本准备**

针对ChatGLM2模型，只需要准备相对结构化的sample数据，可以通过提供的sample转换工具`convert_util.py`，拉取spg schema信息，自动生成模型微调可接收的训练样本。

```shell
python builder/model/dataset/convert_util.py \
    --entity_type Medical.Disease \ 
    --task_type RE \
    --src_path builder/model/dataset/RE/sample.json \
    --tgt_path builder/model/dataset/RE/processed.json \
    --template_path schema/prompt.json
```

**2、模型微调**

执行以下命令，使用 [p-tuning-v2](https://github.com/THUDM/ChatGLM2-6B/tree/main/ptuning#p-tuning-v2) 对模型参数进行微调
```shell
sh builder/model/train.sh
```

**第三步：部署大模型(ChatGLM2)推理服务**

将p-tuning的结果参数文件覆盖原模型参数文件，并执行以下命令部署模型服务
```bash
sh builder/model/deploy.sh
```

**第四步：提交知识抽取任务**

```bash
knext builder submit Disease
```

### step5：执行图谱任务

SPG支持ISO GQL写法，可用如下命令行执行查询任务

```cypher
knext reasoner query --dsl "
MATCH
    (s:Medical.Disease)-[p]->(o)
RETURN
    s
"
```
