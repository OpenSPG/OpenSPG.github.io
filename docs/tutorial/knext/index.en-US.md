---
title: KNext Command Line Tool
nav:
  second:
    title: KNext Command Line Tool
    order: 1
---

This article will introduce the usage of KNext, the Python SDK in OpenSPG, including both the command line tool and the programmable SDK.

With the KNext command line tool, you can perform various tasks such as creating graph projects, schema modifications, knowledge building, querying knowledge data, and performing inference.

## 1 Installation Guide

### 1.1 Supported Python Versions

python>=3.8

### 1.2 Installing KNext

It is recommended to install KNext in a virtual environment to avoid conflicts between KNext dependencies and system packages. You can use the pip tool to install a specific version of KNext:

```bash
pip install openspg-knext
```

Verify the installation by checking the KNext version:

```bash
knext --version
```

## 2 Quick Start

This example can help you quickly start with importing and analyzing inference on a simple knowledge graph.

### 2.1 Set Server Address

Execute the following command to set the server address of OpenSPG (by default it's http://127.0.0.1:8887 for local address):

```bash
knext config edit --global host_addr=http://127.0.0.1:8887
```

### 2.2 Create Project

Execute the following command to create a project. It will generate an example project folder in the current directory with the folder name in lowercase, which is the namespace:

```bash
knext project create --name example_project --namespace Prj --desc "this is an example project"
```

### 2.3 Switch Project

Execute the following command to enter the project directory. All operations related to this project should be performed within the project directory:

```bash
cd prj
```

The project includes:

- An example entity `Prj.Demo`, declared in `/schema/prj.schema`, used for creating the schema of the project.

```
namespace Prj

Demo("example entity"): EntityType
    properties:
        demoProperty("example property"): Text
```

- A build job `Demo`, defined in `builder/job/demo.py`, used for importing the `Prj.Demo` entity.

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

- An extraction operator `DemoExtractOp`, defined in `builder/operator/demo_extract.py`.

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

- A DSL query statement, declared in `reasoner/demo.dsl`, used to query all `Prj.Demo` entities.

```
MATCH (s:Prj.Demo)
RETURN s.id, s.demoProperty
```

### 2.4 Create Schema

```bash
knext schema commit
```

- After executing this command, the schema declaration in `/schema/prj.schema` will be submitted to the server.

### 2.5 Publish Operator

```bash
knext operator publish DemoExtractOp
```

- After executing this command, it will scan all the operators under `builder/operator` and publish the `DemoExtractOp` operator to the server.

### 2.6 Knowledge Builder

```bash
knext builder submit Demo
```

- After executing this command, it will scan all the knowledge building jobs under `builder/job` (that inherit from the `BuilderJob` class) and submit `Demo` to the server.

### 2.7 Knowledge Query

```bash
knext reasoner query --file reasoner/demo.dsl
```

- After executing this command and specifying the `--file` option with the file containing KGDSL query statements, the queries will be submitted to the server for execution. The server will process the queries and return the query results synchronously.

## 3 Command Line Tool

using the `knext` command-line tool, you can achieve a complete process for knowledge graph construction and usage.

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
  set  Edit global or local configs.

```

#### 3.1.1 Configuration Setting

```bash
knext config set [--help]
                 [--global key=value]
                 [--local key=value]
```

- [Optional] --global Global configuration setting. It generates a `.knext.cfg` configuration file under `~/.config` and writes the `key=value` configuration into the file. This configuration file applies to all projects.
- [Optional] --local Project configuration setting. It generates a `.knext.cfg` configuration file in the project directory and writes the `key=value` configuration into the file. This configuration file only applies to the current project.

Example:

```bash
knext config set --global host_addr=http://127.0.0.1:8887
```

Result：
execute the command `cat ~/.config/.knext.cfg` to display the content of the global configuration file:

```bash
[global]
host_addr = http://127.0.0.1:8887
```

#### 3.1.2 Display Configuration

```bash
knext config list [--help]
```

Example:

```bash
knext config list
```

Result:

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

#### 3.2.1 Create project

```bash
knext project create [--help]
                     [--name name]
                     [--namespace namespace]
                     [--desc desc]
                     [--prj_path prj_path]
```

- [Required] --name Project name
- [Required] --namespace Prefix for schemas within the project. It must start with an uppercase letter and can only contain letters or numbers. The maximum length is 16.
- [Optional] --desc Project description
- [Optional] --prj_path Project path, used to restore the project on the server based on the local project directory.

Example:

```bash
knext project create --name example_project --namespace Prj --desc "this is an example project"
```

Result:
After a successful execution, a "prj" directory will be created in the current directory. You can navigate to the example project by executing `cd prj`.

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

#### 3.2.2 Display all projects

```bash
knext project list [--help]
```

This command will display information about all the existing projects.
Example:

```bash
knext project list
```

Result:

```bash
|   ID | Name           | Namespace   | Description    |
|------|----------------|-------------|----------------|
|    1 | defaultProject | DEFAULT     | defaultProject |
|    2 | example_project  | Prj         | this is an example project |
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

#### 3.3.1 Commit schema

```bash
knext schema commit [--help]
```

Example：

```bash
knext schema commit
```

Result：

```
Create type: Prj.Demo
Schema is successfully committed.
SchemaHelper is created in schema/prj_schema_helper.py.
```

#### 3.3.2 Display the schema diff（without committing）

```bash
knext schema diff [--help]
```

Executing the commands will display the schema differences between the local project and the server.

#### 3.3.3 Register concept rules

```bash
knext schema reg_concept_rule [--help]
                              [--file file]
```

- [Required] --file Path of the concept rule file

Example:

schema/concept.rule

```
namespace DEFAULT

`TaxOfRiskApp`/`赌博应用`:
    rule: [[
        ...
    ]]

```

Command:

```bash
knext schema reg_concept_rule --file schema/concept.rule
```

Result:

```
Defined belongTo rule for ...
...
Concept rule is successfully registered.
```

### 3.4 Operator

```bash
Usage: knext operator [OPTIONS] COMMAND [ARGS]...

  Operator client

Options:
  --help  Show this message and exit.

Commands:
  list     List all server-side operators.
  publish  Publish an operator to server.

```

#### 3.4.1 Publish operator

```bash
knext operator publish [OP_NAMES]
```

- [Required] OP_NAMES Names of the operators to be published, separated by `,`. All operators must be implemented in the `builder/operator/` directory and inherit from the `BaseOp` class. By default, the operator name is the same as the class name.

Example:

builder/operator/demo_extract_op.py

```python
...


class DemoExtractOp(KnowledgeExtractOp):


...
```

Command:

```bash
knext operator publish DemoExtractOp
```

Result:

```bash
Operator [DemoExtractOp] has been successfully published. The latest version is 1.
```

#### 3.4.2 Display all operators

```bash
knext operator list [--help]
```

Example:

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
  get     Query status of the submitted job.
  submit  Submit asynchronous builder jobs to the server by providing job names.

```

#### 3.5.1 Submit knowledge building job

```bash
knext builder submit [JOB_NAMES]
```

- [Required] JOB_NAMES Names of the building jobs to be submitted, separated by `,`. All jobs must be implemented in the `builder/job/` directory and inherit from the `BuilderJob` class. By default, the job name is the same as the class name.

Example:

builder/job/demo.py

```python
...


class Demo(BuilderJob):


...
```

Command:

```bash
knext builder submit Demo
```

Result:

```bash
Operator [DemoExtractOp] has been successfully published. The latest version is 1.
```

#### 3.5.2 Query knowledge building job status

```bash
knext builder get [--help]
                  [--id id]
```

- [Required] --id Query the job by its ID (returned after successfully submitting the job). This will return a single job instance.

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

#### 3.6.1 KGDSL query

Submit a KGDSL query job and generate result synchronously.
If the query job takes more than 3 minutes, an exception will be thrown.

```bash
knext reasoner query [--help]
                     [--file file]
                     [--dsl file]
```

- [Optional] --file The KGDSL file to query.
- [Optional] --dsl The KGDSL syntax to query, enclosed in double quotation marks.

Example:

reasoner/demo.dsl:

```bash
MATCH (s:Prj.Demo)
RETURN s.id, s.demoProperty
```

Command:

```bash
knext reasoner query --file reasoner/demo.dsl
```

Result：

```bash
|   s_id | s_demoProperty   |
|--------|------------------|
|     00 | demo             |
```

#### 3.6.2 Submit KGDSL job

Submit KGDSL query job and generate result asynchronously.

```bash
knext reasoner submit [--help]
                      [--file file]
                      [--dsl file]
```

- [Optional] --file The KGDSL file to query.
- [Optional] --dsl The KGDSL syntax to query, enclosed in double quotation marks.

#### 3.6.3 Query KGDSL job status

```bash
knext reasoner get [--help]
                  [--id id]
```

- [Required] --id Query the job by its ID (returned after successfully submitting the job). This will return a single job instance.

## 4 Default directory structure of the project

```
.
└── riskmining
    ├── builder # Knowledge buliding
    │   ├── model # Algorithm models directory
    │   ├── operator # Operator directory
    │   |   ├── demo_link_op.py
    │   |   ├── demo_extract_op.py
    │   │   └── ...
    │   └── job # Building job directory
    │       ├── demo1.py
    │       ├── demo2.py
    │       ├── data # Data directory
    │       │   ├── Demo1.csv
    │       │   ├── Demo2.csv
    │       │   └── ...
    │       └── error_record # Error information directory
    │           ├── spgbuilder_Demo1_1_errorRecord.csv
    │           ├── spgbuilder_Demo1_2_errorRecord.csv
    │           └── ...
    ├── reasoner # reasoning job
    │   ├── demo.dsl
    │   └── result
    │       ├── spgreasoner_job_1_result.csv
    │       ├── spgreasoner_job_2_result.csv
    │       └── ...
    ├── schema # Schema definition
    │   ├── riskmining.schema
    │   ├── riskmining_schema_helper.py
    │   └── concept.rule
    ├── README.md
    └── .knext.cfg
```

- `.knext.cfg`
  It is the configuration file for the project. Most of the configuration information remains fixed, but when adjusting the project directory structure, it needs to be modified using the `knext config set --local key=value` command. It is automatically generated and populated with default configurations when creating a new project. The default configurations are as follows:

```bash
[local]
project_name = RiskMining
description = "risk mining project"
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

- `project_name` The name of the project, specified when creating the project using the [--name] parameter. It cannot be modified.
- `description` The description of the project, specified when creating the project using the [--desc] parameter.
- `project_id` The project ID, automatically assigned when creating the project. If using the `knext project create [--prj_pth]` command, a new ID will be generated and replace the original one.
- `namespace` The prefix for project schemas, specified when creating the project using the [--namespace] parameter. It cannot be modified.
- `project_dir` The root directory of the project, defaulting to `namespace.lower()` when creating the project. If the folder already exists, this configuration needs to be modified.
- `schema_dir` The directory for schemas, defaulting to `schema` when creating the project.
- `schema_file` The file name for the schema declaration, defaulting to `${namespace.lower()}.schema` when creating the project. If the file already exists, this configuration needs to be modified.
- `builder_dir` The directory for building jobs, defaulting to `builder` when creating the project. If the directory changes, this configuration needs to be modified.
- `builder_operator_dir` The directory for operators, defaulting to `builder/operator` when creating the project. If the directory changes, this configuration needs to be modified.
- `builder_record_dir` The directory for storing records of building jobs, defaulting to `builder/record` when creating the project. If the directory changes, this configuration needs to be modified.
- `builder_job_dir` The directory for jobs, defaulting to `builder/job` when creating the project. If the directory changes, this configuration needs to be modified.
- `builder_model_dir` The directory for algorithm models, defaulting to `builder/model` when creating the project. If the directory changes, this configuration needs to be modified.
- `reasoner_dir` The directory for reasoning jobs, defaulting to `reasoner` when creating the project. If the directory changes, this configuration needs to be modified.
- `reasoner_result_dir` The directory for storing rule inference results, defaulting to `reasoner/result` when creating the project. If the directory changes, this configuration needs to be modified.
- `builder` The directory used to store all the knowledge building jobs, source data dependencies, self-defined operators, algorithm models, and error records.
- `reasoner` The directory used to store KGDSL syntax files and execution results.
  - KGDSL syntax files have the `.dsl` extension and are used to store KGDSL query statements.
- `schema` The directory used to store the schema declarations and concept rules of the project.
  - Project schema declaration files have the `.schema` extension. They are parsed and committed to the server using the `knext schema commit` command. Each project can have only one unique schema declaration file.
  - Concept rules have the `.rule` extension and can be registered to corresponding concepts using the `knext schema reg_concept_rule [--file]` command.

## 5 python SDK

### 5.1 Writing a Knowledge Building Job

`BuilderJob` is the base class for all knowledge building jobs.
Any class that inherits from `BuilderJob` under `{builder_job_dir}` will be recognized by knext as a building job. Building jobs can be submitted to the server for asynchronous execution using the `knext builder submit [name]` command.
All building jobs must implement the `build` method, which defines the execution flow of the job.

#### 5.1.1 Parameters

| Parameter          | Type              | Required or not | Example                  | Description                                                                                                           |
| ------------------ | ----------------- | --------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| **parallelism**    | int               | no              | 1                        | Concurrency level for executing building jobs [default is 1].                                                         |
| **operation_type** | OperationTypeEnum | no              | OperationTypeEnum.Create | Operation type for the building job [default is Create, which means data is written in an incremental update manner]. |
| **lead_to**        | bool              | no              | True                     | Whether to execute CAU(causality) [default is False].                                                                 |

#### 5.1.2 Interface

##### 5.1.2.1 build(self)

The interface implements the execution logic of a knowledge building job, essentially defining the pipeline flow between each execution node, where each execution node is a component that inherits from the `Component` base class.

The dependency relationship between components is defined using the `>>` right shift operator (knext has overloaded the `__rshift__` method), and the build method should return the pipeline structure. The example is as follows:

```python
class App(BuilderJob):

    def build(self):
        source = SourceCsvComponent(...)

        mapping = EntityMappingComponent(...)

        sink = SinkToKgComponent(...)

        return source >> mapping >> sink
```

### 5.2 Component

#### 5.2.1 SourceCsvComponent

CSVDataSource component, used to upload local CSV files and read data line by line.

##### 5.2.1.1 Parameters

| Parameter      | Type      | Required or not | Example                       | Description                                                                                                       |
| -------------- | --------- | --------------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **local_path** | str       | yes             | './builder/job/data/App.csv'  | path of the data file                                                                                             |
| **columns**    | list[str] | yes             | ['id', 'riskMark', 'useCert'] | the names of the input columns                                                                                    |
| **start_row**  | int       | yes             | 2                             | Starting row number for data reading [if you want to start reading from the first row of a CSV, then start_row=1] |

##### 5.2.1.2 Interface

None

#### 5.2.2 KnowledgeExtractComponent

Convert unstructured data into structured knowledge. The Extraction component must be set with the `KnowledgeExtractOp` which is an extraction type operator.

##### 5.2.2.1 Parameters

| Parameter         | Type      | Required or not | Example                       | Description   |
| ----------------- | --------- | --------------- | ----------------------------- | ------------- |
| **output_fields** | List[str] | yes             | ['id', 'riskMark', 'useCert'] | output fields |

##### 5.2.2.2 Interface

###### set_operator

设置抽取算子，取已发布的最新版本的算子。

| Parameter   | Type           | Required or not | Example                          | Description                                                                                              |
| ----------- | -------------- | --------------- | -------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **op_name** | str            | yes             | Operator("DemoKnowledgeExtract") | the name of the extraction operator                                                                      |
| **params**  | Dict[str, str] | no              | {"": ""}                         | the parameters of the extraction operator, which can be accessed within the operator using `self.params` |

##### 5.2.2.3 Example

```python
extract = KnowledgeExtractComponent(
    output_fields=["id", 'riskMark', 'useCert']
).set_operator("DemoExtractOp")
```

#### 5.2.3 EntityMappingComponent

Mapping the non-standard input fields to the properties of the SPG entities (EntityType/EventType/ConceptType/StandardType), and mapping to the "id" attribute is mandatory. If the property of the SPG entity is bound to `EntityLinkOp/PropertyNormalizeOp`, the operator will be excuted after field mapping. Otherwise, the property value will be used as the ID to retrieve the target entity for entity linking and concept attachment.

##### 5.2.3.1 Parameters

| Parameter         | Type | Required or not | Example     | Description              |
| ----------------- | ---- | --------------- | ----------- | ------------------------ |
| **spg_type_name** | str  | yes             | DEFAULT.App | the name of the SPG type |

##### 5.2.3.2 Interface

###### add_field

Add mapping relationships between source data fields and SPG properties.

| Parameter        | Type | Required or not | Example             | Description              |
| ---------------- | ---- | --------------- | ------------------- | ------------------------ |
| **source_field** | str  | yes             | "useCert"           | the name of source field |
| **target_field** | str  | yes             | DEFAULT.App.useCert | the name of SPG property |

###### add_filter

Add filtering conditions where data that satisfies the condition `column_name=column_value` will undergo mapping. If no filtering conditions are set, all data will undergo mapping.

| Parameter        | Type | Required or not | Example | Description                    |
| ---------------- | ---- | --------------- | ------- | ------------------------------ |
| **column_name**  | str  | yes             | "type"  | the column need to be filtered |
| **column_value** | str  | yes             | "App"   | filter value                   |

##### 5.2.3.3 Example

```python
mapping = EntityMappingComponent(
    spg_type_name=DEFAULT.App
).add_field("id", DEFAULT.App.id)
.add_field("id", DEFAULT.App.name)
.add_field("riskMark", DEFAULT.App.riskMark)
.add_field("useCert", DEFAULT.App.useCert)
```

#### 5.2.4 RelationMappingComponent

Mapping non-standard input fields to properties of SPG relationships, and mapping to the `srcId` and `dstId` are mandatory.

##### 5.2.4.1 Parameters

| Parameter          | Type | Required or not | Example             | Description  |
| ------------------ | ---- | --------------- | ------------------- | ------------ |
| **subject_name**   | str  | yes             | DEFAULT.App         | subject type |
| **predicate_name** | str  | yes             | DEFAULT.App.useCert | predicate    |
| **object_name**    | str  | yes             | DEFAULT.Cert        | object name  |

##### 5.2.4.2 Interface

Same as EntityMappingComponent.

##### 5.2.4.3 Example

```python
mapping = RelationMappingComponent(
    subject_name=DEFAULT.App,
    predicate_name=DEFAULT.App.useCert,
    object_name=DEFAULT.Cert,
).add_field("src_id", "srcId")
.add_field("dst_id", "dstId")
```

#### 5.2.5 SPGMappingComponent

Specify an SPG type as the subject type and extract SPO triples from long texts based on the schema definition, i.e., subgraphs centered around the SPG type.

The SPG Mapping component must set a knowledge extraction operator.

##### 5.2.5.1 Parameters

| Parameter         | Type | Required or not | Example     | Description |
| ----------------- | ---- | --------------- | ----------- | ----------- |
| **spg_type_name** | str  | yes             | DEFAULT.App | SPG type    |

##### 5.2.5.2 Interface

###### set_operator

Set the extraction operator, which is the latest published.

| Parameter   | Type           | Required or not | Example           | Description                                                                                             |
| ----------- | -------------- | --------------- | ----------------- | ------------------------------------------------------------------------------------------------------- |
| **op_name** | str            | yes             | "DemoExtractOp"   | the name of the operator                                                                                |
| **params**  | Dict[str, str] | no              | {"hit_num": "10"} | The parameters of the extraction operator which can be accessed within the operator using `self.params` |

#### 5.2.6 SinkToKgComponent

##### 5.2.6.1 Parameters

None

##### 5.2.6.2 Interface

None

##### 5.2.6.3 Example

```python
sink = SinkToKgComponent()
```

### 5.3 Operators

`BaseOp` is the base class for all operators, while `KnowledgeExtractOp/EntityLinkOp/PropertyNormalizeOp/EntityFuseOp` inherit from `BaseOp` to differentiate different types of operators.

All classes that inherit from `BaseOp` under `{builder_operator_dir}` will be recognized as an operator by Knext. Operators can be published to the server using the command `knext operator publish [op_name]`.

All operators must implement the `eval` method, which defines the execution logic of the operator.

#### 5.3.1 Parameters

| Parameter   | Type | Required or not | Example                                       | Description                                                                                                                                   |
| ----------- | ---- | --------------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| **desc**    | str  | no              | "The operator for certificate entity linking" | The description of the operator. <br> [Default is empty]                                                                                      |
| **bind_to** | str  | no              | "RiskMining.Cert"                             | The entity type which is bounded to the operator. <br> The extraction operator does not support binding entity types. <br> [Default is empty] |

#### 5.3.2 Interface

##### 5.3.2.1 **init**(self, params: Dict[str, str] = None)

The initialization method for the operators, which is executed only once during the initialization stage after the building job is submitted. Different operators inherit the `__init__` method.

If the self-defined operator does not override the initialization method, it will default to `self.params=params`. When the component sets operator parameters `params` using the `set_operator` method, the operator can access the corresponding parameter `value` using `self.params[key]`, enabling reuse of the same operator for different building jobs.

If the self-defined operator needs to initialize external clients such as `SearchClient`, you can override the `__init__` method to avoid repeated initialization of the client.

##### 5.3.2.2 eval(self, \*args)

The self-defined operators need to override the `eval` method to implement the execution logic. The `eval` method of different operators may have different input parameters and output result.

#### 5.3.3 Data structure

##### 5.3.3.1 Vertex

The input and output entity information (including entity ID, entity type, and entity properties) of the operator is encapsulated in the `Vertex` type.

| Parameter       | Type           | Required or not | Example                                                                 | Description       |
| --------------- | -------------- | --------------- | ----------------------------------------------------------------------- | ----------------- |
| **biz_id**      | str            | no              | "1"                                                                     | entity ID         |
| **vertex_type** | str            | no              | DEFAULT.Cert                                                            | entity type       |
| **properties**  | Dict[str, str] | yes             | {"id": "1", "name": "1", "certNum": "68802adde35845d76eeb172ff8ea6825"} | entity properties |

#### 5.3.4 Example

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

Executing the command `knext operator publish CertLinkerOperator` will publish a new version of the operator to the server, and bind the new version of the operator named "CertLinkerOperator" to the `DEFAULT.Cert` entity type.

When executing a building job of the `DEFAULT.Cert` entity type, the `eval` method will be executed to perform certificate linking.

#### 5.3.5 KnowledgeExtractOp

The knowledge extraction operators need to inherit `KnowledgeExtractOp`, which is responsible for extracting structured data from unstructured data and can also perform data preprocessing.

##### 5.3.5.1 Interface

###### eval(self, record: Dict[str, str]) -> List[Vertex]:

#### 5.3.6 PropertyNormalizeOp

The property normalization operators are typically bound to the `ConceptType`. They are responsible for standardizing the properties of the concept and performing concept mounting.

The `knext.api` provides the base class `PropertyNormalizeOp` for the property normalization operators. By inheriting and implementing the `eval` method, you can develop self-defined normalization operators. The KNext pipeline supports configuring linking operators on entity properties in the knowledge mapping component, overriding the operators bound to the entity type in the current job.

##### 5.3.6.1 Interface

###### eval(self, property: str, record: Vertex) -> str:

Input:

- property The property to be normalized
- record The entity instance

Output:

- The normalized property

#### 5.3.7 EntityLinkOp

The entity linking operators are generally bound to the `EntityType` or the `EventType`. They are responsible for recalling the target entity based on the property of the source entity and generating relations between source and target entities.

The entity linking operators can also be used in entity fusion and deduplication. In the operator, entities of the same type can be recalled, and attribute fusion or entity deduplication can be performed based on rules or by executing fusion operators.

The `knext.api` provides the base class `EntityLinkOp` for the entity linking operators. You can develop a linking operators by inheriting and implementing the `eval` method.

##### 5.3.7.1 Interface

###### eval(self, property: str, record: Vertex) -> List[Vertex]:

Input:

- property The property for linking
- record The entity instance

Output:

- The list of entities retrieved from the linking

#### 5.3.8 EntityFuseOp

Not supported yet.
