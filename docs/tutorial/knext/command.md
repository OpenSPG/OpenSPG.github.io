---
title: KNext
order: 1
nav:
  second:
    order: 4
    title: KNext
---

## 1 快速开始

该示例可以帮助快速开始一个简单的图谱数据导入和分析推理。

### 1.1 设置服务端地址

执行以下命令，设置OpenSPG服务端地址（默认为本地地址 [http://127.0.0.1:8887](http://127.0.0.1:8887) ）：

```bash
knext config set --global host_addr=http://127.0.0.1:8887
```

### 1.2 创建一个示例项目

执行以下命令，创建一个项目，会在当前目录下生成示例项目文件夹，文件夹名为namespace的小写：

```bash
knext project create --name 示例项目 --namespace Demo --desc 这是一个示例项目
```

### 1.3 切换项目

执行以下命令，进入项目目录，所有对于该项目的操作需要在项目目录内进行：

```bash
cd demo
```

项目内包含：

- 一个示例实体 `Demo.Company`，声明在 `schema/demo.schema`，用于创建项目schema：

```
namespace Demo

Company(公司): EntityType
    properties:
        address(地址): Text
```

- 一个加工任务 `Company`，定义在`builder/job/company.py` ，用于导入 `Demo.Company`实体：

```python
# -*- coding: utf-8 -*-
from knext.client.model.builder_job import BuilderJob
from knext.api.component import CSVReader, UserDefinedExtractor, SPGTypeMapping, KGWriter
try:
    from schema.demo_schema_helper import Demo
except:
    pass


class Company(BuilderJob):

    def build(self):
        source = CSVReader(
            local_path="./builder/job/data/company.csv",
            columns=["id", "name", "province", "city", "district"],
            start_row=2
        )

        from operator.address_extract_op import AddressExtractOp
        extract = UserDefinedExtractor(extract_op=AddressExtractOp())

        mapping = SPGTypeMapping(
            spg_type_name=Demo.Company
        ).add_mapping_field("id", Demo.Company.id) \
        .add_mapping_field("name", Demo.Company.name) \
        .add_mapping_field("address", Demo.Company.address)

        sink = KGWriter()

        return source >> extract >> mapping >> sink
```

- 一个抽取算子 `AddressExtractOp`，定义在 `builder/operator/address_extract_op.py` ：

```python
from typing import List, Dict

from knext.api.record import SPGRecord
from knext.api.operator import ExtractOp
try:
    from schema.demo2_schema_helper import Demo2
except:
    pass


class AddressExtractOp(ExtractOp):
    def __init__(self, params: Dict[str, str] = None):
        super().__init__(params)

    def invoke(self, record: Dict[str, str]) -> List[SPGRecord]:
        province = record.get("province", "")
        city = record.get("city", "")
        district = record.get("district", "")

        record.update({"address": province + city + district})
        return [SPGRecord(Demo.Company).upsert_properties(record)]
```

- 一个DSL查询语句，声明在 `reasoner/company.dsl`，用于查询所有 `Demo.Company`实体：

```
MATCH (s:Demo2.Company)
RETURN s.id, s.address
```

### 1.4 创建schema

```bash
knext schema commit
```

- 执行此命令后，会将`schema/demo.schema`内的schema声明，提交到SPG服务端。


### 1.5 知识加工

```bash
knext builder execute Company
```

- 执行此命令后，会扫描 `builder/job`下的所有加工任务（需要继承`BuilderJob`类），并执行 `Company`加工任务。

### 1.6 dsl查询

```bash
knext reasoner execute --file reasoner/company.dsl
```

- 执行此命令后，会执行 `--file` 指定的文件中的dsl查询语句。

## 2 命令行工具

通过`knext`命令行工具，以及定义的多个子命令，实现完整的图谱构建与使用流程。

```bash
Usage: knext [OPTIONS] COMMAND [ARGS]...

Options:
  --version  Show the version and exit.
  --help     Show this message and exit.

Commands:
  builder   Builder client.
  config    Knext config.
  project   Project client.
  reasoner  Reasoner client.
  schema    Schema client.
```

### 2.1 config

```bash
Usage: knext config [OPTIONS] COMMAND [ARGS]...

  Knext config.

Options:
  --help  Show this message and exit.

Commands:
  list  List global and local knext configs.
  set   Edit global or local configs.
```

#### 2.1.1 修改配置

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

#### 2.1.2 展示配置

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

### 2.2 project

```bash
Usage: knext project [OPTIONS] COMMAND [ARGS]...

  Project client.

Options:
  --help  Show this message and exit.

Commands:
  create   Create new project with a demo case.
  list     List all project information.
```

#### 2.2.1 创建项目

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
knext project create --name 示例项目 --namespace Demo --desc 这是一个示例项目
```

结果：
执行成功后会在当前目录下创建出demo目录，执行`cd demo`进入示例项目。

```
demo
├── README.md
├── builder
│   ├── job
│   │   ├── company.py
│   │   └── data
│   │       └── company.csv
│   └── operator
│       └── address_extract_op.py
├── reasoner
│   └── company.dsl
└── schema
    └── demo.schema
```

使用实例：

```bash
knext project create --prj_path demo
```

结果：
执行成功后会根据`demo/.knext.cfg`配置文件创建项目。
 

#### 2.2.2 展示所有项目

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

### 2.3 schema

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

#### 2.3.1 提交schema

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

#### 2.3.2 展示schema diff（不提交）

```bash
knext schema diff [--help]
```

#### 2.3.3 提交概念规则

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


### 2.4 builder

```bash
Usage: knext builder [OPTIONS] COMMAND [ARGS]...

  Builder client.

Options:
  --help  Show this message and exit.

Commands:
  execute  Submit asynchronous builder jobs to server by providing job names.
```

#### 2.4.1 执行加工任务

```bash
knext builder execute [JOB_NAMES]
```

- 【必填】JOB_NAMES 提交的加工任务名，多个任务间用`,`分隔开。所有任务必须实现在 `builder/job/`下，且需要继承`BuilderJob`
  ，任务名默认为类名。

使用实例：
builder/job/company.py

```python
...


class Company(BuilderJob):


...
```

执行命令：

```bash
knext builder execute Company
```


### 2.5 reasoner

```bash
Usage: knext reasoner [OPTIONS] COMMAND [ARGS]...

  Reasoner client.

Options:
  --help  Show this message and exit.

Commands:
  execute   Query dsl by providing a string or file.
```

#### 2.5.1 执行推理任务

```bash
knext reasoner execute [--help]
                     [--file file]
                     [--dsl file]
```

- 【二选一】--file 查询的dsl文件。
- 【二选一】--dsl 查询的dsl语法，用双引号括起来。

使用实例：
reasoner/demo.dsl:

```bash
MATCH (s:Demo2.Company)
RETURN s.id, s.address
```

执行命令：

```bash
knext reasoner execute --file reasoner/demo.dsl
```

结果：

```csv
"s.id","s.address"
"00","浙江省杭州市西湖区"
```

## 3 默认项目结构

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
    │           └── ...
    ├── reasoner # 规则推理
    │   └── demo.dsl
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
builder_job_dir = builder/job
builder_model_dir = builder/model
reasoner_dir = reasoner
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
- `builder_job_dir` 算子目录，新建项目时默认为 `builder/job`。若目录变动，需要修改此配置。
- `builder_model_dir` 算法模型目录，新建项目时默认为 `builder/model`。若目录变动，需要修改此配置。
- `reasoner_dir` 规则推理目录，新建项目时默认为 `reasoner`。若目录变动，需要修改此配置。
- `builder` 目录用来保存所有知识加工任务以及依赖的源数据、自定义算子、算法模型、执行错误记录。
- `reasoner` 目录用来保存规则推理相关的DSL语法文件和执行结果。
  - DSL语法文件以`.dsl`为结尾，用来保存DSL查询语句。
- `schema` 目录用来保存项目schema声明和概念规则。
  - 项目schema声明文件以`.schema`为结尾，通过`knext schema commit`解析schema文件，并提交到服务端。每个项目只允许唯一的schema声明文件。
  - 概念规则以`.rule` 为结尾，通过`knext schema reg_concept_rule [--file]`，将文件中定义的规则注册到对应概念上。
