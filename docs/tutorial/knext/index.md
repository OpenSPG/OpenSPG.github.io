---
title: KNext命令使用
order: 1
---

本文将会介绍OpenSPG中python SDK -- KNext的使用方法，包括命令行工具，以及可编程SDK。
使用KNext命令行工具，可以完成创建图谱项目、schema变更和查询、图谱查询和推理等功能。

## 1 安装指南

### 1.2 支持的Python版本

python>=3.8

### 1.3 安装 knext

建议创建虚拟环境后安装knext，避免knext依赖包与系统包的冲突问题。
使用pip工具安装knext指定版本：

```bash
pip install openspg-knext
```

检验knext是否安装成功，使用以下命令查看knext版本：

```bash
knext --version
```

## 2 快速开始

该示例可以帮助快速开始一个简单的图谱数据导入和分析推理。

### 2.1 设置服务端地址

执行以下命令，设置OpenSPG服务端地址（默认为本地地址 [http://127.0.0.1:8887](http://127.0.0.1:8887) ）：

```bash
knext config edit --global host_addr=http://127.0.0.1:8887
```

### 2.2 创建一个示例项目

执行以下命令，创建一个项目，会在当前目录下生成示例项目文件夹，文件夹名为namespace的小写：

```bash
knext project create --name 示例项目 --namespace Prj --desc 这是一个示例项目
```

### 2.3 切换项目

执行以下命令，进入项目目录，所有对于该项目的操作需要在项目目录内进行：

```bash
cd prj
```

项目内包含：

- 一个示例实体 `Prj.Demo`，声明在 `/schema/prj.schema`，用于创建项目schema：

```
namespace Prj

Demo(示例实体): EntityType
    properties:
        demoProperty(示例属性): Text
```

- 一个构建任务 `Demo`，定义在`builder/job/demo.py` ，用于导入 `Prj.Demo`实体：

```python
# -*- coding: utf-8 -*-

from knext.core.builder.job.model.builder_job import BuilderJob
from knext.core.builder.job.model.component import SourceCsvComponent, EntityMappingComponent, SinkToKgComponent
from schema.prj_schema_helper import Prj


class Demo(BuilderJob):

    def build(self):
        source = SourceCsvComponent(
            local_path="./builder/job/data/Demo.csv",
            columns=["id", 'prop'],
            start_row=2
        )

        mapping = EntityMappingComponent(
            spg_type_name=Prj.Demo
        ).add_field("id", Prj.Demo.id)
        .add_field("prop", Prj.Demo.demoProperty)

    sink = SinkToKgComponent()

    return source >> mapping >> sink

```

- 一个抽取算子 `DemoExtractOp`，定义在 `builder/operator/demo_extract.py` ：

```python
# -*- coding: utf-8 -*-

from typing import List, Dict

from knext.core.builder.operator import Vertex
from knext.core.builder.operator.model.op import KnowledgeExtractOp


class DemoExtractOp(KnowledgeExtractOp):

    def __init__(self, params: Dict[str, str] = None):
        super().__init__(params)

    def eval(self, record: Dict[str, str]) -> List[Vertex]:

        return [Vertex(properties=record)]

```

- 一个DSL查询语句，声明在 `reasoner/demo.dsl`，用于查询所有 `Prj.Demo`实体：
```
MATCH (s:Prj.Demo)
RETURN s.id, s.demoProperty
```

### 2.4 创建schema

```bash
knext schema commit
```

- 执行此命令后，会将`/schema/prj.schema`内的schema声明，提交到服务端。

### 2.5 发布算子

```bash
knext operator publish DemoExtractOp
```

- 执行此命令后，会扫描 `builder/operator`下的所有算子，并将 `DemoExtractOp` 发布到服务端。

### 2.6 知识加工

```bash
knext builder submit Demo
```

- 执行此命令后，会扫描 `builder/job`下的所有加工任务（需要继承`BuilderJob`类），并将 `Demo`提交到服务端。

### 2.7 dsl查询

```bash
knext reasoner query --file reasoner/demo.dsl
```

- 执行此命令后，会将 `--file` 指定的文件中的dsl查询语句，提交到服务端进行查询，并同步返回查询结果。

## 3 命令行工具

通过`knext`命令行工具，以及定义的多个子命令，实现完整的图谱构建与使用流程。

```bash
Usage: knext [OPTIONS] COMMAND [ARGS]...

Options:
  --version  Show the version and exit.
  --help     Show this message and exit.

Commands:
  builder   Builder client.
  config    Knext config.
  operator  Operator client
  project   Project client.
  reasoner  Reasoner client.
  schema    Schema client.

```

### 3.1 config

```bash
Usage: knext config [OPTIONS] COMMAND [ARGS]...

  Knext config.

Options:
  --help  Show this message and exit.

Commands:
  list  List global and local knext configs.
  set   Edit global or local configs.

```

#### 3.1.1 修改配置

```bash
knext config set [--help]
                 [--global key=value]
                 [--local key=value]
```

- 【选填】--global 全局配置设置，将在`~/.config`下生成`.knext.cfg`配置文件，并将`key=value`配置写入文件中。该文件配置对所有项目生效。
- 【选填】--local 项目配置设置，将在项目目录下生成`.knext.cfg`配置文件，并将`key=value`配置写入文件中。该文件配置仅对当前项目生效。

使用实例：

```bash
knext config set --global host_addr=http://127.0.0.1:8887
```

结果：
执行`cat ~/.config/.knext.cfg`展示全局配置信息：

```bash
[global]
host_addr = http://127.0.0.1:8887
```

#### 3.1.2 展示配置

```bash
knext config list [--help]
```

使用实例：

```bash
knext config list
```

结果：

```bash
[global]
host_addr = http://127.0.0.1:8887
[local]

```

### 3.2 project

```bash
Usage: knext project [OPTIONS] COMMAND [ARGS]...

  Project client.

Options:
  --help  Show this message and exit.

Commands:
  create   Create new project with a demo case.
  list     List all project information.

```

#### 3.2.1 创建项目

```bash
knext project create [--help]
                     [--name name] 
                     [--namespace namespace]
                     [--desc desc]
                     [--prj_path prj_path]
```

- 【必填】--name 项目名
- 【必填】--namespace 项目内schema的前缀，限制以大写字母开头，仅包含字母或数字，长度最大为16。
- 【选填】--desc 项目介绍
- 【选填】--prj_path 项目路径，用于根据本地项目目录在服务端恢复项目。

使用实例：

```bash
knext project create --name 示例项目 --namespace Prj --desc 这是一个示例项目
```

结果：
执行成功后会在当前目录下创建出prj目录，执行`cd prj`进入示例项目。

```
.
└── prj
    ├── builder
    │   ├── model
    │   ├── operator
    │   │   └── demo_extract_op.py
    │   └── job
    │       ├── data
    │       │   └── Demo.csv
    │       └── demo.py
    ├── reasoner
    │   └── demo.dsl
    ├── schema
    │   ├── prj.schema
    └── README.md
```

#### 3.2.2 展示所有项目

```bash
knext project list [--help]
```

执行该命令，会列出当前所有已创建的项目信息。
使用实例：

```bash
knext project list
```

结果：

```bash
|   ID | Name           | Namespace   | Description    |
|------|----------------|-------------|----------------|
|    1 | defaultProject | DEFAULT     | defaultProject |
|    2 | 示例项目        | Prj         | 这是一个示例项目  |
```

### 3.3 schema

```bash
Usage: knext schema [OPTIONS] COMMAND [ARGS]...

  Schema client.

Options:
  --help  Show this message and exit.

Commands:
  commit            Commit local schema and generate schema helper.
  diff              Print differences of schema between local and server.
  reg_concept_rule  Register a concept rule according to DSL file.

```

#### 3.3.1 提交schema

```bash
knext schema commit [--help]
```

使用实例：

```bash
knext schema commit
```

结果：

```
Create type: Prj.Demo
Schema is successfully committed.
SchemaHelper is created in schema/prj_schema_helper.py.
```

#### 3.3.2 展示schema diff（不提交）

```bash
knext schema diff [--help]
```

#### 3.3.3 提交概念规则

```bash
knext schema reg_concept_rule [--help]
                              [--file file]
```

- 【必填】--file concept rule文件路径

使用实例：

schema/concept.rule
```
namespace DEFAULT

`TaxOfRiskApp`/`赌博应用`:
    rule: [[
        ...
    ]]

```

执行命令：
```bash
knext schema reg_concept_rule --file schema/concept.rule
```

结果：

```
Defined belongTo rule for ...
...
Concept rule is successfully registered.
```

### 3.4 operator

```bash
Usage: knext operator [OPTIONS] COMMAND [ARGS]...

  Operator client

Options:
  --help  Show this message and exit.

Commands:
  list     List all server-side operators.
  publish  Publish an operator to server.

```

#### 3.4.1 发布算子

```bash
knext operator publish [OP_NAMES]
```

- 【必填】OP_NAMES 发布的算子名，多个算子间用`,`分隔开。所有算子必须实现在 `builder/operator/`下，且需要继承`BaseOp`
  的子类，算子名默认为类名。

使用实例：

builder/operator/demo_extract_op.py
```python
...


class DemoExtractOp(KnowledgeExtractOp):


...
```

执行命令：
```bash
knext operator publish DemoExtractOp
```

结果：

```bash
Operator [DemoExtractOp] has been successfully published. The latest version is 1.
```

#### 3.4.2 展示所有算子

```bash
knext operator list [--help]
```

使用实例：

```bash
knext operator list
```

### 3.5 builder

```bash
Usage: knext builder [OPTIONS] COMMAND [ARGS]...

  Builder client.

Options:
  --help  Show this message and exit.

Commands:
  get     Query submitted job status.
  submit  Submit asynchronous builder jobs to server by providing job names.

```

#### 3.5.1 提交构建任务

```bash
knext builder submit [JOB_NAMES]
```

- 【必填】JOB_NAMES 提交的构建任务名，多个任务间用`,`分隔开。所有任务必须实现在 `builder/job/`下，且需要继承`BuilderJob`
  ，任务名默认为类名。

使用实例：

builder/job/demo.py
```python
...


class Demo(BuilderJob):


...
```
执行命令：
```bash
knext builder submit Demo
```

结果：

```bash
Operator [DemoExtractOp] has been successfully published. The latest version is 1.
```

#### 3.5.2 查询构建任务

```bash
knext builder get [--help]
                  [--id id]
```

- 【必填】--id 查询的任务id（成功提交任务后会返回），结果返回单个任务实例。

### 3.6 reasoner

```bash
Usage: knext reasoner [OPTIONS] COMMAND [ARGS]...

  Reasoner client.

Options:
  --help  Show this message and exit.

Commands:
  get     Query submitted reasoner job status.
  query   Query dsl by providing a string or file.
  submit  Submit asynchronous reasoner jobs to server by providing DSL file or string.

```

#### 3.6.1 DSL查询
提交DSL查询任务，结果同步返回，查询任务耗时超过3分钟会报错。
```bash
knext reasoner query [--help]
                     [--file file]
                     [--dsl file]
```

- 【二选一】--file 查询的dsl文件。
- 【二选一】--dsl 查询的dsl语法，用双引号括起来。

使用实例：

reasoner/demo.dsl:
```bash
MATCH (s:Prj.Demo)
RETURN s.id, s.demoProperty
```
执行命令：
```bash
knext reasoner query --file reasoner/demo.dsl
```

结果：

```bash
|   s_id | s_demoProperty   |
|--------|------------------|
|     00 | demo             |
```
#### 3.6.2 提交DSL推理任务
提交查询任务，结果异步生成。
```bash
knext reasoner submit [--help]
                      [--file file]
                      [--dsl file]
```
- 【二选一】--file 查询的dsl文件。
- 【二选一】--dsl 查询的dsl语法，用双引号括起来。

#### 3.6.3 查询推理任务
```bash
knext reasoner get [--help]
                  [--id id]
```
【必填】--id 查询的任务id（成功提交任务后会返回），结果返回单个任务实例。

## 4 默认项目结构

```
.
└── riskmining
    ├── builder # 知识加工
    │   ├── model # 算法模型目录
    │   ├── operator # 算子目录
    │   |   ├── demo_link_op.py
    │   |   ├── demo_extract_op.py
    │   │   └── ...
    │   └── job # 加工任务目录
    │       ├── demo1.py 
    │       ├── demo2.py 
    │       ├── data # 数据目录
    │       │   ├── Demo1.csv
    │       │   ├── Demo2.csv
    │       │   └── ...
    │       └── error_record # 错误信息目录
    │           ├── spgbuilder_Demo1_1_errorRecord.csv
    │           ├── spgbuilder_Demo1_2_errorRecord.csv
    │           └── ...
    ├── reasoner # 规则推理
    │   ├── demo.dsl
    │   └── result
    │       ├── spgreasoner_job_1_result.csv 
    │       ├── spgreasoner_job_2_result.csv 
    │       └── ...
    ├── schema # schema定义
    │   ├── riskmining.schema 
    │   ├── riskmining_schema_helper.py 
    │   └── concept.rule 
    ├── README.md
    └── .knext.cfg
```

- `.knext.cfg`
  文件为整个项目的配置文件。配置信息大部分情况下固定，当调整项目目录结构时，需要通过`knext config set --local key=value`
  命令修改配置。 在新建项目时会自动生成，并写入默认配置如下：

```bash
[local]
project_name = 风险挖掘
description = 风险挖掘项目
project_id = 2
namespace = RiskMining
project_dir = riskmining
schema_dir = schema
schema_file = riskmining.schema
builder_dir = builder
builder_operator_dir = builder/operator
builder_record_dir = builder/error_record
builder_job_dir = builder/job
builder_model_dir = builder/model
reasoner_dir = reasoner
reasoner_result_dir = reasoner/result
```

- `project_name` 项目名，新建项目时通过[--name]参数指定，不可修改。
- `description` 项目介绍，新建项目时通过[--desc]参数指定。
- `project_id` 项目id，新建项目时自动分配。若使用`knext project create [--prj_pth]`命令，会生成新的id并覆盖原id。
- `namespace` 项目schema前缀，新建项目时通过[--namespace]参数指定，不可修改。
- `project_dir` 项目根目录，新建项目时默认为`namespace.lower()`。若文件夹重命名，需要修改此配置。
- `schema_dir` schema目录，新建项目时默认为`schema`。
- `schema_file` schema声明文件名，新建项目时默认为 `${namespace.lower()}.schema`。若文件重命名，需要修改此配置。
- `builder_dir` 加工任务目录，新建项目时默认为 `builder`。若目录变动，需要修改此配置。
- `builder_operator_dir` 算子目录，新建项目时默认为 `builder/operator`。若目录变动，需要修改此配置。
- `builder_record_dir` 加工任务记录目录，新建项目时默认为 `builder/record`。若目录变动，需要修改此配置。
- `builder_job_dir` 算子目录，新建项目时默认为 `builder/job`。若目录变动，需要修改此配置。
- `builder_model_dir` 算法模型目录，新建项目时默认为 `builder/model`。若目录变动，需要修改此配置。
- `reasoner_dir` 规则推理目录，新建项目时默认为 `reasoner`。若目录变动，需要修改此配置。
- `reasoner_result_dir` 规则推理结果目录，新建项目时默认为 `reasoner/result`。若目录变动，需要修改此配置。
- `builder` 目录用来保存所有知识加工任务以及依赖的源数据、自定义算子、算法模型、执行错误记录。
- `reasoner` 目录用来保存规则推理相关的DSL语法文件和执行结果。
  - DSL语法文件以`.dsl`为结尾，用来保存DSL查询语句。
- `schema` 目录用来保存项目schema声明和概念规则。
  - 项目schema声明文件以`.schema`为结尾，通过`knext schema commit`解析schema文件，并提交到服务端。每个项目只允许唯一的schema声明文件。
  - 概念规则以`.rule` 为结尾，通过`knext schema reg_concept_rule [--file]`，将文件中定义的规则注册到对应概念上。

## 5 python SDK

### 5.1 编写一个加工任务

`Builderjob`是所有知识加工任务的基类。
所有在`{builder_job_dir}`下继承了`BuilderJob`
的类，都会被knext识别为一个加工任务。加工任务可以通过`knext builder submit [name]`命令提交到服务端异步执行。
所有加工任务**必须**实现`build`方法，用来定义任务的执行流程。

#### 5.1.1 参数

| 参数                 | 类型                | 是否必填 | 示例值                      | 描述                                |
|--------------------|-------------------|------|--------------------------|-----------------------------------|
| **parallelism**    | int               | 否    | 1                        | 加工任务执行并发度【默认为1】                   |
| **operation_type** | OperationTypeEnum | 否    | OperationTypeEnum.Create | 加工任务操作类型【默认为Create，即数据以增量更新的方式写入】 |
| **lead_to**        | bool              | 否    | True                     | 加工任务是否执行因果关系【默认为False】            |

#### 5.1.2 接口

##### build(self)

用来编写加工任务的执行逻辑，本质上是定义各个执行节点间的pipeline流程，每个执行节点都是一个继承了`Component`基类的组件。
通过`>>`右移符号（knext对`__rshift__`实现了重载），定义各个组件之间的依赖关系，build方法需要返回pipeline结构，以下为示例：

```python
class App(BuilderJob):

    def build(self):
        source = SourceCsvComponent(...)

        mapping = EntityMappingComponent(...)

        sink = SinkToKgComponent(...)

        return source >> mapping >> sink
```

### 5.2 组件

#### 5.2.1 SourceCsvComponent（CSV数据源）

csv数据源组件，用来上传本地csv文件，并逐行读取数据

##### 5.2.1.1 参数

| 名称             | 类型        | 是否必填 | 示例值                            | 描述                                    |
|----------------|-----------|------|--------------------------------|---------------------------------------|
| **local_path** | str       | 是    | './builder/job/data/App.csv'  | 文件路径                                  |
| **columns**    | list[str] | 是    | ['id', 'riskMark', 'useCert'] | 输入列                                   |
| **start_row**  | int       | 是    | 2                              | 数据读取起始行数【若希望从csv第一行开始读取，则start_row=1】 |

##### 5.2.1.2 接口

无

#### 5.2.2 KnowledgeExtractComponent（知识抽取）

将非结构化数据转化为结构化数据。抽取组件上必须设置`KnowledgeExtractOp`抽取类型算子。

##### 5.2.2.1 参数

| 名称                | 类型        | 是否必填 | 示例值                            | 描述   |
|-------------------|-----------|------|--------------------------------|------|
| **output_fields** | List[str] | 是    | ['id', 'riskMark', 'useCert'] | 输出字段 |

##### 5.2.2.2 接口

###### set_operator

设置抽取算子，取已发布的最新版本的算子。

| 参数          | 类型             | 是否必填 | 示例值                              | 描述                            |
|-------------|----------------|------|----------------------------------|-------------------------------|
| **op_name** | str            | 是    | Operator("DemoKnowledgeExtract") | 抽取算子名                         |
| **params**  | Dict[str, str] | 否    | {"": ""}                         | 抽取算子参数，在算子内可以通过self.params获取。 |

##### 5.2.2.3 示例

```python
extract = KnowledgeExtractComponent(
    output_fields=["id", 'riskMark', 'useCert']
).set_operator("DemoExtractOp")
```

#### 5.2.3 EntityMappingComponent（实体映射组件）

将非标准输入字段映射到SPG实体（EntityType/EventType/ConceptType/StandardType）的属性上（**必须包含到**`**id**`**属性的映射
**）。若SPG实体的属性类型上绑定了 `EntityLinkOp/PropertyNormalizeOp`，会在字段映射后执行链指拉边和概念标化挂载；否则，会以属性值作为id，召回出目标实体进行拉边和概念挂载。

##### 5.2.3.1 参数

| 名称                  | 类型  | 是否必填 | 示例值         | 描述      |
|---------------------|-----|------|-------------|---------|
| **spg_type_name** | str | 是    | DEFAULT.App | SPG实体类型 |

##### 5.2.3.2 接口

###### add_field

添加从源数据字段到SPG属性之间的映射关系。

| 参数               | 类型  | 是否必填 | 示例值                  | 描述      |
|------------------|-----|------|----------------------|---------|
| **source_field** | str | 是    | "useCert"           | 源字段     |
| **target_field** | str | 是    | DEFAULT.App.useCert | SPG实体属性 |

###### add_filter

添加字段筛选条件，数据满足`column_name=column_value`条件的会执行映射。若不设置筛选条件，则全部数据会执行映射。

| 参数                | 类型  | 是否必填 | 示例值    | 描述   |
|-------------------|-----|------|--------|------|
| **column_name**  | str | 是    | "type" | 筛选字段 |
| **column_value** | str | 是    | "App"  | 筛选值  |

##### 5.2.3.3 示例

```python
mapping = EntityMappingComponent(
    spg_type_name=DEFAULT.App
).add_field("id", DEFAULT.App.id)
.add_field("id", DEFAULT.App.name)
.add_field("riskMark", DEFAULT.App.riskMark)
.add_field("useCert", DEFAULT.App.useCert)
```

#### 5.2.4 RelationMappingComponent（关系映射组件）

将非标准输入字段映射到SPG关系的属性上（**必须包含到**`**srcId**`**和**`**dstId**`**的映射**）。

##### 5.2.4.1 参数

| 名称                  | 类型  | 是否必填 | 示例值                  | 描述   |
|---------------------|-----|------|----------------------|------|
| **subject_name**   | str | 是    | DEFAULT.App          | 主体类型 |
| **predicate_name** | str | 是    | DEFAULT.App.useCert | 谓词关系 |
| **object_name**    | str | 是    | DEFAULT.Cert        | 客体类型 |

##### 5.2.4.2 接口

同EntityMappingComponent

##### 5.2.4.3 示例代码

```python
mapping = RelationMappingComponent(
    subject_name=DEFAULT.App,
    predicate_name=DEFAULT.App.useCert,
    object_name=DEFAULT.Cert,
).add_field("src_id", "srcId")
.add_field("dst_id", "dstId")
```

#### 5.2.5 SPGMappingComponent（SPG映射组件）

指定SPG类型作为主体类型，根据schema定义，从长文本中抽取SPO关系组，即以SPG类型为中心的关系子图。
SPG映射组件需要设置知识抽取算子。

##### 5.2.5.1 参数

| 名称                  | 类型  | 是否必填 | 示例值         | 描述      |
|---------------------|-----|------|-------------|---------|
| **spg_type_name** | str | 是    | DEFAULT.App | SPG实体类型 |

##### 5.2.5.2 接口

###### set_operator

设置抽取算子，取已发布的最新版本的算子。

| 参数          | 类型             | 是否必填 | 示例值               | 描述                            |
|-------------|----------------|------|-------------------|-------------------------------|
| **op_name** | str            | 是    | "DemoExtractOp"   | 抽取算子名                         |
| **params**  | Dict[str, str] | 否    | {"hit_num": "10"} | 抽取算子参数，在算子内可以通过self.params获取。 |

#### 5.2.6 SinkToKgComponent（图谱写入）

##### 5.2.6.1 参数

无

##### 5.2.6.2 接口

无

##### 5.2.6.3 示例

```python
sink = SinkToKgComponent()
```

### 5.3 算子

`BaseOp`是所有算子的基类，`KnowledgeExtractOp/EntityLinkOp/PropertyNormalizeOp/EntityFuseOp` 继承自`BaseOp`
，用于区分不同类型的算子。
所有在`{builder_operator_dir}`下继承了`BaseOp`
的四个子类的类，都会被knext识别为一个算子。算子可以通过`knext operator publish [op_name]`命令发布到服务端。
所有算子**必须**实现`eval`方法，用来定义算子的执行逻辑。

#### 5.3.1 参数

| 参数          | 类型  | 是否必填 | 示例值               | 描述                               |
|-------------|-----|------|-------------------|----------------------------------|
| **desc**    | str | 否    | "证书链指算子"          | 算子描述【默认为空】                       |
| **bind_to** | str | 否    | "RiskMining.Cert" | 算子绑定的实体类型名，抽取类型算子不支持绑定实体类型【默认为空】 |

#### 5.3.2 接口

##### 5.3.2.1 __init__(self, params: Dict[str, str] = None)

所有算子的初始化方法，仅在加工任务提交后的初始化阶段执行一次。不同算子类型继承当前`__init__`方法。
若自定义算子内不复写初始化方法，默认执行`self.params=params`。当组件通过`set_operator`方法设置了算子参数`params`
时，在算子内可以通过`self.params[key]`获取到对应参数的`value`，从而实现同个算子针对不同加工任务的复用。
当自定义算子内需要初始化一些外部Client，例如`SearchClient`，可以复写`__init__`方法，避免Client的重复初始化。

##### 5.3.2.2 eval(self, *args)

所有自定义算子都需要复写`eval` 方法，用来实现你的算子执行逻辑。
不同算子类型的`eval`方法，输入参数和输出结果类型也存在不同。

#### 5.3.3 数据结构

##### 5.3.3.1 Vertex

将算子输入以及输出的实体信息（包括实体id、实体类型、实体属性）封装在`Vertex`类型中。

| 名称              | 类型             | 是否必填 | 示例值                                                                      | 描述   |
|-----------------|----------------|------|--------------------------------------------------------------------------|------|
| **biz_id**      | str            | 否    | "1"                                                                      | 实体id |
| **vertex_type** | str            | 否    | DEFAULT.Cert                                                             | 实体类型 |
| **properties**  | Dict[str, str] | 是    | {"id": "1", "name": "1", "certNum": "68802adde35845d76eeb172ff8ea6825"} | 实体属性 |

#### 5.3.4 示例

```python
class CertLinkerOperator(EntityLinkOp):
    bind_to = "DEFAULT.Cert"

    def __init__(self):
        super().__init__()
        self.search_client = SearchClient("DEFAULT.Cert")

    def eval(self, property: str, record: Vertex) -> List[Vertex]:
        query = {"match": {"certNum": property}}
        recall_certs = self.search_client.search(query, 0, 10)
        if recall_certs is not None:
            return [Vertex(biz_id=recall_certs[0].doc_id, vertex_type="RiskMining.Cert")]
        return [Vertex(biz_id=has_cert, vertex_type="RiskMining.Cert")]
```

执行`knext operator publish CertLinkerOperator`命令，算子将发布一个新版本到服务端，并根据`bind_to`
参数绑定算子新版本到`DEFAULT.Cert`实体schema上。
在执行包含映射到`DEAFAULT.Cert`类型属性的加工任务时，会在映射后执行eval方法进行链指拉边。


#### 5.3.5 KnowledgeExtractOp（知识抽取算子）

所有知识抽取算子需要继承`KnowledgeExtractOp`，其功能是从非结构化数据中抽取结构化数据，也可进行数据的预处理。

##### 5.3.5.1 接口

###### eval(self, record: Dict[str, str]) -> List[Vertex]:

#### 5.3.6 PropertyNormalizeOp（属性标化算子）

属性标化算子一般绑定在概念类型`ConceptType`上，其功能是将概念属性值标准化后，进行概念挂载。
`knext.api`提供属性标化算子基础类`PropertyNormalizeOp`，可通过继承并实现`eval`方法，来完成自定义标化算子的开发。knext
pipeline支持在知识映射组件的实体属性上配置链指算子，在当前任务中覆盖schema上已绑定的算子。

##### 5.3.6.1 接口

###### eval(self, property: str, record: Vertex) -> str:

输入：

- property 待标化属性值
- record 实体信息

返回：

- 标化后的属性值


#### 5.3.7 EntityLinkOp（实体链指算子）

实体链指算子一般绑定在实体类型`EntityType`或事件类型`EventType`上，其功能是根据实体属性值，召回链指目标，并在源实体和目标实体之间生成关系。
实体链指算子也可用于实体融合去重中，在算子中召回出同类型的实体，根据规则或执行融合算子，进行属性融合或实体去重。
`knext.api`提供实体链指算子基础类`EntityLinkOp`，可通过继承并实现`eval`方法，来完成链指算子的开发。

#####  5.3.7.1 接口

##### eval(self, property: str, record: Vertex) -> List[Vertex]:

输入：

- property 待链指的实体类型属性值
- record 实体信息

返回：

- 链指出的实体列表

####  5.3.8 EntityFuseOp（实体融合算子）

暂未支持
