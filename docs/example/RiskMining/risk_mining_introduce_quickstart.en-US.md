# Risk Mining Knowledge Graph

Keywords: semantic attributes, dynamic multi-classification of entities, knowledge application in the context of hierarchical business knowledge and factual data.

![image.png](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*KGmMRJvQEdQAAAAAAAAAAAAADtmcAQ/original)

# Quick Start

## 1. Enter the directory of the project

```shell
 cd python/knext/examples/riskmining/
```

## 2. Initialize the project

Excuting the following command to initialize the project:

```cypher
knext project create --prj_path .
```

## 3. Commit the schema of the project

The schema file "[The schema of the risk mining knowledge graph](https://github.com/OpenSPG/openspg/blob/master/python/knext/examples/riskmining/schema/riskmining.schema)" has been created. Executing the following command to submit it:

```shell
knext schema commit
```

```shell
# Submit the classification concept of RiskUser and RiskApp
knext builder submit TaxOfRiskUser,TaxOfRiskApp
knext schema reg_concept_rule --file ./schema/concept.rule
```

## 4. Construct the knowledge

**Step 1: Publish the self-defined entity linking operator**

```shell
knext operator publish CertLinkerOperator
```

**Step 2: Submit knowledge importing task**

```bash
knext builder submit Cert,Company,CompanyHasCert
knext builder submit App,Device,Person,PersonFundTrans,PersonHasDevice,PersonHoldShare
```

## 5. Execute the query task

OpenSPG supports ISO GQL syntax and you can execute a query task using the following command line:

```cypher
knext reasoner query --dsl "${ql}"
```

### Scenario 1: Semantic attributes compared to text attributes.

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/354593/1695087470699-6a0e5867-20bf-487d-8542-1716c2dd8a3f.png#clientId=u9d466c63-e98d-4&from=paste&height=225&id=u2fde2a61&originHeight=450&originWidth=1314&originalType=binary&ratio=2&rotation=0&showTitle=false&size=70185&status=done&style=none&taskId=ueb978653-0a48-4acc-a3b1-f24fdb269eb&title=&width=657)

MobilePhone: "standard attribute" compare to "text attribute"

Edit the `dsl_task.txt` file and enter the following query:

```
MATCH
	(phone:STD.ChinaMobile)<-[:hasPhone]-(u:RiskMining.Person)
RETURN
	u.id,phone.id
```

Excute the query：

```
knext reasoner query --file ./reasoner/dsl_task.dsl
```

### Scenario 2: Dynamic multi-type entities

**Taxonomy of gambling apps**

```
Define (s:App)-[p:belongTo]->(o:`TaxOfRiskApp`/`赌博应用`) {
	GraphStructure {
  	(s)
  }
	Rule {
  	R1("风险标记为赌博") s.riskMark like "%赌博%"
  }
}
```

Wang Wu is a gambling app developer, and Li Si is the owner of a gambling app. These two user entities correspond to different concept types.

Gambling Developer's Identification Rule:

Rule: If a user has more than 5 devices, and these devices have the same app installed, then there exists a development relation.

```
Define (s:Person)-[p:developed]->(o:App) {
	GraphStructure {
  	(s)-[:hasDevice]->(d:Device)-[:install]->(o)
  }
	Rule {
  	deviceNum = group(s,o).count(d)
  	R1("设备超过5"): deviceNum > 5
  }
}
```

```
Define (s:Person)-[p:belongTo]->(o:`TaxOfRiskUser`/`赌博App开发者`) {
	GraphStructure {
  	(s)-[:developed]->(app:`TaxOfRiskApp`/`赌博应用`)
  }
	Rule {
  }
}
```

**Identifying the owner of a gambling app.**

Rule 1: There exists a publishing relation between a person and the app.

```
Define (s:Person)-[p:release]->(o:App) {
	GraphStructure {
  	(s)-[:holdShare]->(c:Company),
  	(c)-[:hasCert]->(cert:Cert)<-[useCert]-(o)
  }
	Rule {
  }
}
```

Rule 2: The user transfers money to the gambling app developer, and there exists a relation of publishing gambling app.

```
Define (s:Person)-[p:belongTo]->(o:`TaxOfRiskApp`/`赌博App老板`) {
	GraphStructure {
  	(s)-[:release]->(a:`TaxOfRiskApp`/`赌博应用`),
  	(u:Person)-[:developed]->(a),
  	(s)-[:fundTrans]->(u)
  }
	Rule {
  }
}
```

### Scenario 3: Knowledge Application in the Context of hierarchical Business Knowledge and Factual Data.

We can use GQL to query the criminal group information corresponding to black market applications.

**Retrieve all gambling applications**

Edit dsl_task1.txt and enter the following query:

```
MATCH (s:`RiskMining.TaxOfRiskApp`/`赌博应用`) RETURN s.id
```

Excute the query:

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

Excute the query:

```
knext reasoner query --file ./reasoner/dsl_task2.dsl
```
