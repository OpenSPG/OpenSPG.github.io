---
title: 黑产挖掘
order: 3
---

# 黑产挖掘图谱

关键词：语义属性，实体动态多分类，面向业务知识和事实数据分层下的知识应用

![image.png](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*KGmMRJvQEdQAAAAAAAAAAAAADtmcAQ/original)

# Quick Start

## step1：进入案例目录

```shell
 cd python/knext/examples/riskmining/
```

## step2：项目初始化

先对项目进行初始化动作

```cypher
knext project create --prj_path .
```

## step3：知识建模

schema文件已创建好[黑产SPG Schema模型](https://github.com/OpenSPG/openspg/blob/master/python/knext/examples/riskmining/schema/riskmining.schema)，可执行如下命令提交

```shell
knext schema commit
```

```shell
# 提交风险用户、风险APP的分类概念
knext builder submit TaxOfRiskUser,TaxOfRiskApp
knext schema reg_concept_rule --file ./schema/concept.rule
```

## step4：知识构建

**第一步：提交自定义实体链指算子**

```shell
knext operator publish CertLinkerOperator
```

**第二步：提交知识导入任务**

```bash
knext builder submit Cert,Company,CompanyHasCert
knext builder submit App,Device,Person,PersonFundTrans,PersonHasDevice,PersonHoldShare
```

## step5：执行图谱任务

SPG支持ISO GQL写法，可用如下命令行执行查询任务

```cypher
knext reasoner query --dsl "${ql}"
```

### 场景1：语义属性对比文本属性

![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/354593/1695087470699-6a0e5867-20bf-487d-8542-1716c2dd8a3f.png#clientId=u9d466c63-e98d-4&from=paste&height=225&id=u2fde2a61&originHeight=450&originWidth=1314&originalType=binary&ratio=2&rotation=0&showTitle=false&size=70185&status=done&style=none&taskId=ueb978653-0a48-4acc-a3b1-f24fdb269eb&title=&width=657)

电话号码：标准属性 vs 文本属性

编辑dsl_task.txt，输入如下内容：

```
MATCH
	(phone:STD.ChinaMobile)<-[:hasPhone]-(u:RiskMining.Person)
RETURN
	u.id,phone.id
```

执行脚本：

```
knext reasoner query --file ./reasoner/dsl_task.dsl
```

### 场景2：实体动态多类型

**赌博App的分类**

```
Define (s:App)-[p:belongTo]->(o:`TaxOfRiskApp`/`赌博应用`) {
	STRUCTURE {
  	(s)
  }
	CONSTRAINT {
  	R1("风险标记为赌博") s.riskMark like "%赌博%"
  }
}
```

王武为赌博应用开发者，李四为赌博应用老板，两个用户实体对应了不同的概念类型。
赌博开发者认定规则：
rule： 用户存在大于5台设备，且这些设备中安装了相同的APP，则存在开发关系。

```
Define (s:Person)-[p:developed]->(o:App) {
	STRUCTURE {
  	(s)-[:hasDevice]->(d:Device)-[:install]->(o)
  }
	CONSTRAINT {
  	deviceNum = group(s,o).count(d)
  	R1("设备超过5"): deviceNum > 5
  }
}
```

```
Define (s:Person)-[p:belongTo]->(o:`TaxOfRiskUser`/`赌博App开发者`) {
	STRUCTURE {
  	(s)-[:developed]->(app:`TaxOfRiskApp`/`赌博应用`)
  }
	CONSTRAINT {
  }
}
```

**认定赌博APP老板**

规则1：人和APP存在发布关系。

```
Define (s:Person)-[p:release]->(o:App) {
	STRUCTURE {
  	(s)-[:holdShare]->(c:Company),
  	(c)-[:hasCert]->(cert:Cert)<-[useCert]-(o)
  }
	CONSTRAINT {
  }
}
```

规则2：用户给该赌博App开发者转账，并且存在发布赌博应用行为。

```
Define (s:Person)-[p:belongTo]->(o:`TaxOfRiskApp`/`赌博App老板`) {
	STRUCTURE {
  	(s)-[:release]->(a:`TaxOfRiskApp`/`赌博应用`),
  	(u:Person)-[:developed]->(a),
  	(s)-[:fundTrans]->(u)
  }
	CONSTRAINT {
  }
}
```

### 场景3：面向业务知识和事实数据分层下的知识应用

基于GQL获取黑产应用对应的团伙信息。

**获取所有的赌博应用**

编辑dsl_task1.txt，输入如下内容：

```
MATCH (s:`RiskMining.TaxOfRiskApp`/`赌博应用`) RETURN s.id
```

执行脚本：

```
knext reasoner query --file ./reasoner/dsl_task1.dsl
```

**获取赌博APP背后的开发者和老板**

编辑dsl_task2.txt，输入如下内容：

```
MATCH
	(u:`RiskMining.TaxOfRiskUser`/`赌博App开发者`)-[:developed]->(app:`RiskMining.TaxOfRiskApp`/`赌博应用`),
	(b:`RiskMining.TaxOfRiskUser`/`赌博App老板`)-[:release]->(app)
RETURN
	u.id, b.id ,app.id
```

执行脚本：

```
knext reasoner query --file ./reasoner/dsl_task2.dsl
```
