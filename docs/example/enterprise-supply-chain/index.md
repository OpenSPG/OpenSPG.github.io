---
title: 企业供应链
order: 1
---

# 1、背景

信贷机构对企业的财务状况、经营状况、市场地位、管理能力等进行综合分析，给予企业一个评级等级，反映其信用状况的好坏，以便支撑信贷业务。在实践中基本依赖被评估企业自身提供的信息，例如企业年报、各类资质文件、资产证明等，这一类信息只能围绕企业自身提供微观层面的信息，不能体现企业在整个产业链上下游市场情况，也无法得到证明之外的信息。
本例基于SPG构建产业链企业图谱，挖掘出企业之间基于产业链的深度信息，支持企业信用评级。

# 2 总览

建模参考文件[企业供应链图谱schema](https://github.com/OpenSPG/openspg/blob/master/python/knext/examples/supplychain/schema/supplychain.schema)，如下图实例  
![产业链企业图谱深度语义关联](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*d4uJRq3hOCMAAAAAAAAAAAAADtmcAQ/original)

<center style="font-size:14px;color:#C0C0C0;text-decoration:underline">图1：产业链企业图谱深度语义关联 </center>

概念知识维护着产业链相关数据，包括上下位层级、供应关系；实体实例仅有法人代表、转账信息，公司实例通过生产的产品属性和概念中的产品节点挂载，实现了公司实例之间的深度信息挖掘，例如供应商、同行业、同法人代表等关系。基于深度上下文信息，可提供更多的信用评估因子。
![产业链事件归纳演绎  ](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*mJWRQJek1BsAAAAAAAAAAAAADtmcAQ/original)

<center style="font-size:14px;color:#c0c0c0;text-decoration:underline">图2：产业链事件归纳演绎  </center>

产业链中建立了产品和公司事件类别，该类别属于指标和趋势的一种组合，例如价格上涨，是由指标：价格，趋势：上涨两部分构成。  
事理知识设定了产品价格上涨引起公司利润下降及公司成本上涨事件，当发生某个具体事件时，例如橡胶价格大涨事件，被归类在产品价格上涨，由于事理知识中定义产品价格上涨会引起公司利润下降/公司成本上涨两个事件类型，会产出新事件，三角
**轮胎公司成本上涨事件、三角**轮胎公司利润下跌。

# 3、quickstart

## step1：进入案例目录

```shell
 cd python/knext/examples/supplychain/
```

## step2：项目初始化

先对项目进行初始化动作

```cypher
knext project create --prj_path .
```

## step3：知识建模

schema文件已创建好，可执行如下命令提交

```shell
knext schema commit
```

```shell
# 提交公司事件分类数据
knext builder submit TaxOfCompanyEvent
# 提交产品事件分类数据
knext builder submit TaxOfProdEvent
```

执行查询任务命令，等待任务完成

```shell
knext builder get --id ${jobId}
```

其中jobId为提交后返回的id

```shell
# 提交导致关系逻辑规则
knext schema reg_concept_rule --file ./schema/concept.rule
```

schema建模详细内容可参见 [基于SPG建模的产业链企业图谱](model)

## step4：知识构建

知识构建将数据导入到系统中，数据介绍参见文档[产业链案例数据介绍](data)。
本例主要为结构化数据，故演示结构化数据转换和实体链指，具体细节可参见文档[产业链案例知识构建](builder)

**第一步：提交自定义实体链指算子**

```shell
knext operator publish CompanyLinkerOperator
```

**第二步：提交知识导入任务**

```shell
knext builder submit Index,Trend
knext builder submit Industry,Product,ProductHasSupplyChain
knext builder submit Company,CompanyFundTrans,Person
```

最后提交事件

```shell
knext builder submit ProductChainEvent
```

## step5：执行图谱任务

SPG支持ISO GQL写法，可用如下命令行执行查询任务

```cypher
knext reasoner query --dsl "${ql}"
```

具体任务详情可参见文档[产业链企业信用图谱查询任务](query)
信用评级因子获取：

```cypher
knext reasoner query --dsl "
MATCH
	(s:SupplyChain.Company)
RETURN
  s.id, s.name, s.fundTrans1Month, s.fundTrans3Month,
  s.fundTrans6Month, s.fundTrans1MonthIn, s.fundTrans3MonthIn,
  s.fundTrans6MonthIn, s.cashflowDiff1Month, s.cashflowDiff3Month,
  s.cashflowDiff6Month
"
```

```cypher
knext reasoner query --dsl "
MATCH
	(s:SupplyChain.Company)-[:mainSupply]->(o:SupplyChain.Company)
RETURN
	s.name, o.name
"
```

```cypher
knext reasoner query --dsl "
MATCH
	(s:SupplyChain.Company)-[:belongToIndustry]->(o:SupplyChain.Industry)
RETURN
	s.name, o.name
"
```

```cypher
knext reasoner query --dsl "
MATCH
	(s:SupplyChain.Company)-[:sameLegalRepresentative]->(o:SupplyChain.Company)
RETURN
	s.name, o.name
"
```

事件影响分析：

```cypher
knext reasoner query --dsl "
MATCH
	(s:SupplyChain.ProductChainEvent)-[:leadTo]->(o:SupplyChain.CompanyEvent)
RETURN
	s.id,s.subject,o.subject
"
```
