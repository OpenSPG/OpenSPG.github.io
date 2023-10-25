---
title: Enterprise Supply Chain
order: 1
---

# 1 Background

Credit institutions conduct comprehensive analysis of a company's financial condition, operating condition, market position, and management capabilities, and assign a rating grade to reflect the credit status of the company, in order to support credit business. In practice, it heavily relies on the information provided by the evaluated company itself, such as annual reports, various qualification documents, asset proofs, etc. This type of information can only provide micro-level information about the company itself and cannot reflect the company's market situation along the entire industry chain or obtain information beyond what is proven.
This example is based on the SPG framework to construct an industry chain enterprise Knowledge graph and extract in-depth information between companies based on the industry chain, to support company credit ratings.

# 2 Overview

Please refer to the document for knowledge modeling: [Enterprise Supply Chain Knowledge Graph Schema](https://github.com/OpenSPG/openspg/blob/master/python/knext/examples/supplychain/schema/supplychain.schema), As shown in the example below:

![Deep Semantic Associations in the Industry Chain Enterprise Graph](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*J_NpRoNbO-YAAAAAAAAAAAAADtmcAQ/original)

<center style="font-size:14px;color:#C0C0C0;text-decoration:underline">Figure 1: Deep Semantic Associations in the Industry Chain Enterprise Knowledge Graph. </center>

Concept knowledge maintains industry chain-related data, including hierarchical relations, supply relations. Entity instances consist of only legal representatives and transfer information. Company instances are linked to product instances based on the attributes of the products they produce, enabling deep information mining between company instances, such as supplier relationships, industry peers, and shared legal representatives. By leveraging deep contextual information, more credit assessment factors can be provided.

![Inductive Deduction of Industrial Chain Events](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*X2TES7hf9ycAAAAAAAAAAAAADtmcAQ/original)

<center style="font-size:14px;color:#c0c0c0;text-decoration:underline">Figure 2：Inductive Deduction of Industrial Chain Events  </center>

Within the industrial chain, categories of product and company events are established. These categories are a
combination of indicators and trends. For example, an increase in price consists of the indicator "price" and the trend "upward". Causal knowledge sets the events of a company's profit decrease and cost increase due to a rise in product prices. When a specific event occurs, such as a significant increase in rubber prices, it is categorized under the event of a price increase. As per the causal knowledge, a price increase in a product leads to two event types: a decrease in company profits and an increase in company costs. Consequently, new events are generated:"Triangle** Tire Company cost increase" and "Triangle** Tire Company profit decrease".

# 3 Quick Start

## Step 1: Accessing the Case Directory

```shell
 cd python/knext/examples/supplychain/
```

## Step 2: Project Initialization

Initiate the project with the following commands:

```cypher
knext project create --prj_path .
```

## Step 3: Create Knowledge Schema

The schema file has been created and you can execute the following command to submit it:

```shell
knext schema commit
```

```shell
# Submitting company event classification data
knext builder submit TaxOfCompanyEvent
# Submitting product event classification data
knext builder submit TaxOfProdEvent
# Submitting causal relationship logical rules
knext schema reg_concept_rule --file ./schema/concept.rule
```

You can refer to [The Schemas of Enterprise Supply Chain Knowledge Graph](detail/model) for detailed information on schema modeling.

## Step 4: Knowledge Construction

Knowledge construction involves importing data into the knowledge graph storage. For data introduction, please refer to the document:[Introduction to Enterprise Supply Chain Case Data](detail/data). In this example, we will demonstrate the conversion of structured data and entity linking. For specific details, please refer to the document: [Enterprise Supply Chain Case Knowledge Construction](detail/builder).

**First：submit a self-defined entity linking operator**

```shell
knext operator publish CompanyLinkerOperator
```

**Second：submit a knowledge import task**

```shell
knext builder submit Index,Trend
knext builder submit Industry,Product,ProductHasSupplyChain
knext builder submit Company,CompanyFundTrans
knext builder submit Person
knext builder submit ProductChainEvent
```

## Step 5: Excuting a query task for knowledge graph

OpenSPG supports the ISO GQL syntax. You can use the following command-line to execute a query task:

```cypher
knext reasoner query --dsl "${ql}"
```

For specific task details, please refer to the document：[Enterprise Credit Graph Query Tasks in Supply Chain](detail/query).

For example:

Querying Credit Rating Factors：

```cypher
knext reasoner query --dsl "
MATCH
	(s:SupplyChain.Company)
RETURN
  s.id, s.fundTrans1Month, s.fundTrans3Month,
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
	s.id, o.id
"
```

```cypher
knext reasoner query --dsl "
MATCH
	(s:SupplyChain.Company)-[:belongToIndustry]->(o:SupplyChain.Industry)
RETURN
	s.id, o.id
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

Analyzing the Impact of an Event：

```cypher
knext reasoner query --dsl "
MATCH
	(s:SupplyChain.ProductChainEvent)-[:leadTo]->(o:SupplyChain.CompanyEvent)
RETURN
	s.id, o.id
"
```
