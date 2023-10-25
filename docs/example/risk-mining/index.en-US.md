---
title: Risk Mining
order: 3
---

## Risk Mining Knowledge Graph

Keywords: semantic attributes, dynamic multi-classification of entities, knowledge application in the context of hierarchical business knowledge and factual data.

![image.png](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*KGmMRJvQEdQAAAAAAAAAAAAADtmcAQ/original)

## Quick Start

### 1. Enter the directory of the project

```shell
 cd python/knext/examples/riskmining/
```

### 2. Initialize the project

Excuting the following command to initialize the project:

```cypher
knext project create --prj_path .
```

### 3. Commit the schema of the project

The schema file "[The schema of the risk mining knowledge graph](https://github.com/OpenSPG/openspg/blob/master/python/knext/examples/riskmining/schema/riskmining.schema)" has been created. Executing the following command to submit it:

```shell
knext schema commit
```

```shell
# Submit the classification concept of RiskUser and RiskApp
knext builder submit TaxOfRiskUser,TaxOfRiskApp
knext schema reg_concept_rule --file ./schema/concept.rule
```

### 4. Construct the knowledge

**Step 1: Publish the self-defined entity linking operator**

```shell
knext operator publish CertLinkerOperator
```

**Step 2: Submit knowledge importing task**

```bash
knext builder submit Cert,Company,CompanyHasCert
knext builder submit App,Device,Person,PersonFundTrans,PersonHasDevice,PersonHoldShare
```

### 5. Execute the query task

OpenSPG supports ISO GQL syntax and you can execute a query task using the following command line:

```cypher
knext reasoner query --dsl "${ql}"
```

#### Scenario 1: Semantic attributes compared to text attributes.

![image.png](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*uKcjRqTdy7cAAAAAAAAAAAAADtmcAQ/original)


MobilePhone: "standard attribute" compare to "text attribute".

Edit the `dsl_task.txt` file and enter the following query:

```
MATCH
    (phone:STD.ChinaMobile)<-[:hasPhone]-(u:RiskMining.Person)
RETURN
    u.id,phone.id
```

Execute the query：

```
knext reasoner query --file ./reasoner/dsl_task.dsl
```

#### Scenario 2: Dynamic multi-type entities

Note: The classification rules defined in this section have been submitted in the previous "3. Commit the schema of the project" chapter using the command `knext schema reg_concept_rule`.

The detailed content of the following rules can also be found in the file: [The concept rules](https://github.com/OpenSPG/openspg/blob/master/python/knext/examples/riskmining/schema/concept.rule).

**Taxonomy of gambling apps**

```
Define (s:App)-[p:belongTo]->(o:`TaxOfRiskApp`/`赌博应用`) {
    Structure {
        (s)
    }
    Constraint {
        R1("风险标记为赌博") s.riskMark like "%赌博%"
  }
}
```

Wang Wu is a gambling app developer, and Li Si is the owner of a gambling app. These two user entities correspond to different concept types.

Gambling Developer's Identification Rule:

Rule: If a user has more than 5 devices, and these devices have the same app installed, then there exists a development relation.

```
Define (s:Person)-[p:developed]->(o:App) {
    Structure {
        (s)-[:hasDevice]->(d:Device)-[:install]->(o)
    }
    Constraint {
        deviceNum = group(s,o).count(d)    
        R1("设备超过5"): deviceNum > 5
    }
}
```

```
Define (s:Person)-[p:belongTo]->(o:`TaxOfRiskUser`/`赌博App开发者`) {
    Structure {
        (s)-[:developed]->(app:`TaxOfRiskApp`/`赌博应用`)
    }
    Constraint {
    }
}
```

**Identifying the owner of a gambling app.**

Rule 1: There exists a publishing relation between a person and the app.

```
Define (s:Person)-[p:release]->(o:App) {
    Structure {
        (s)-[:holdShare]->(c:Company),
        (c)-[:hasCert]->(cert:Cert)<-[useCert]-(o)
    }
    Constraint {
    }
}
```

Rule 2: The user transfers money to the gambling app developer, and there exists a relation of publishing gambling app.

```
Define (s:Person)-[p:belongTo]->(o:`TaxOfRiskApp`/`赌博App老板`) {
    Structure {
        (s)-[:release]->(a:`TaxOfRiskApp`/`赌博应用`),
        (u:Person)-[:developed]->(a),
        (s)-[:fundTrans]->(u)
    }
    Constraint {
    }
}
```

#### Scenario 3: Knowledge Application in the Context of hierarchical Business Knowledge and Factual Data.

We can use GQL to query the criminal group information corresponding to black market applications.

**Retrieve all gambling applications**

Edit dsl_task1.txt and enter the following query:

```
MATCH (s:`RiskMining.TaxOfRiskApp`/`赌博应用`) RETURN s.id
```

Execute the query:

```
knext reasoner query --file ./reasoner/dsl_task1.dsl
```

**Retrieve the developers and owners of the gambling apps**

Edit dsl_task2.txt and enter the following query:

```
MATCH
    (u:`RiskMining.TaxOfRiskUser`/`赌博App开发者`)-[:developed]->(app:`RiskMining.TaxOfRiskApp`/`赌博应用`),
    (b:`RiskMining.TaxOfRiskUser`/`赌博App老板`)-[:release]->(app)
RETURN
    u.id, b.id ,app.id
```

Execute the query:

```
knext reasoner query --file ./reasoner/dsl_task2.dsl
```
