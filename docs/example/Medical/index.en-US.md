---
title: Medical
order: 2
---

# Building a medical knowledge graph from text

This example aims to demonstrate how to extract and construct entities and relations in a knowledge graph based on the SPG-Schema using LLMs.

![image.jpg](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*-PKySKstgy8AAAAAAAAAAAAADtmcAQ/original)

# Quick Start

## 1. Enter the directory of the project

```shell
 cd python/knext/examples/medical/
```

## 2. Initialize the project

Excuting the following command to initialize the project:

```shell
knext project create --prj_path .
```

## 3. Commit the schema of the project

The schema file "[The schema of the medical knowledge graph](https://github.com/OpenSPG/openspg/blob/master/python/knext/examples/medical/schema/medical.schema)" has been created. Executing the following command to submit it:

```shell
knext schema commit
```

```shell
# Submit the task of importing concepts for "BodyPart" and "HospitalDepartment".
knext builder submit BodyPart,HospitalDepartment
```

## 4. Extract and Construct the knowledge

**Step 1: Publish the self-defined extraction operator for disease entity type**

```shell
knext operator publish DiseaseExtractor
```

**Step 2 [Optional]: Fine-tune the large language model (ChatGLM2)**

**1. Prepare training samples**

For the ChatGLM2 model, you need to prepare the structured samples. You can use the provided sample conversion tool `convert_util.py` to pull the SPG schema information and automatically generate training samples that can be accepted for model fine-tuning.

```shell
python builder/model/dataset/convert_util.py \
    --entity_type Medical.Disease \
    --task_type RE \
    --src_path builder/model/dataset/RE/sample.json \
    --tgt_path builder/model/dataset/RE/processed.json \
    --template_path schema/prompt.json
```

**2. Model fine-tuning**

To fine-tune the model using [p-tuning-v2](https://github.com/THUDM/ChatGLM2-6B/tree/main/ptuning#p-tuning-v2), execute the following command:

```shell
sh builder/model/train.sh
```

Step 3: Deploy the large model (ChatGLM2) inference service
Step 4: Submit the knowledge extraction task
Step 5: Execute the graph task

**Step 3: Deploy the inference service for ChatGLM2**

To deploy the model service after replacing the model file with the p-tuning result, execute the following command:

```bash
sh builder/model/deploy.sh
```

**Step 4: Submit the knowledge extraction task**

```bash
knext builder submit Disease
```

## 5. Execute the query task

OpenSPG supports ISO GQL syntax and you can execute a query task using the following command line:

```cypher
knext reasoner query --dsl "
MATCH
	(s:Medical.Disease)-[p]->(o)
RETURN
	s
"
```
