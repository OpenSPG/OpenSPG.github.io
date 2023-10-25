###### 1 Directory Structure

```
|_supplychain
	|_builder
  	|_job
      |__data
        	|_Company.csv // The company instances
        	|_Company_fundTrans_Company.csv	// Transfer relation between companys
        	|_Person.csv			// The Person instances
        	|_Industry.csv		// The industry concepts
        	|_Product.csv			// The product concepts
        	|_Index.csv				// The index categories concepts
        	|_Trend.csv			  // The trend categories concepts
        	|_ProductChainEvent.csv // The industry chain events
        	|_TaxOfCompanyEvent.csv // The categorization of company events
          |_TaxOfProdEvent.csv		// The categorization of product events
```

Introducing a sample of the data separately:

###### 2 The company instances (Company.csv)

```
id,name,products
CSF0000002238,三角*胎股*限公司,"轮胎,全钢子午线轮胎"
```

- id: The unique ID of the company.
- name: The name of the company.
- products: The products produced by the company, separated by ','.
-

###### 3 Transfer relation between companys (Company_fundTrans_Company.csv)

```
src,dst,transDate,transAmt
CSF0000002227,CSF0000001579,20230506,73
```

- src: The source of the fund transfer.
- dst: The destination of the fund transfer.
- transDate: The date of the fund transfer.
- transAmt: The total amount of the fund transfer.

###### 4 The person instances (Person.csv)

```
id,name,age,legalRep
0,路**,63,"新疆*花*股*限公司,三角*胎股*限公司,传化*联*份限公司"
```

- id: The unique identifier of the person.
- name: The name of the person.
- age: The age of the person.
- legalRep: The name of the company where the person serves as the legal representative.

###### 5 The industry concepts (Industry.csv)

```
fullname
能源
能源-能源
能源-能源-能源设备与服务
能源-能源-能源设备与服务-能源设备与服务
能源-能源-石油、天然气与消费用燃料
```

The industry chain concepts is represented by its name, with dashes indicating its higher-level concepts.
For example, the higher-level concept of "Energy-Energy-Energy Equipment and Services" is "Energy-Energy", and the higher-level concept of "Energy-Energy-Energy Equipment and Services-Energy Equipment and Services" is "Energy-Energy-Energy Equipment and Services".

###### 6 The product concepts (Product.csv)

```
fullname,belongToIndustry,hasSupplyChain
商品化工-橡胶-合成橡胶-顺丁橡胶,原材料-原材料-化学制品-商品化工,"化工商品贸易-化工产品贸易-橡塑制品贸易,轮胎与橡胶-轮胎,轮胎与橡胶-轮胎-特种轮胎,轮胎与橡胶-轮胎-工程轮胎,轮胎与橡胶-轮胎-斜交轮胎,轮胎与橡胶-轮胎-全钢子午线轮胎,轮胎与橡胶-轮胎-半钢子午线轮胎"
```

- fullname: The name of the product, with dashes used to separate higher-level and lower-level concepts.
- belongToIndustry: The industry which the product belongs to. For example, in this case, "Butadiene rubber" belongs to the "commodity chemicals industry".
- hasSupplyChain: The downstream industries related to the product. For example, the downstream industries of "Butadiene rubber" may include "tire manufacturing", "rubber and plastic product trading", and so on.

###### 7 The industry chain events (ProductChainEvent.csv)

```
id,name,subject,index,trend
1,顺丁橡胶成本上涨,商品化工-橡胶-合成橡胶-顺丁橡胶,价格,上升
```

- id: The ID of the event.
- name: The name of the event.
- subject: The subject of the event. In this example, it is "Butadiene rubber".
- index: The index related to the event. In this example, it is "price".
- trend: The trend of the event. In this example, it is "rising".

###### 8 The index concepts(Index.csv) and the trend concepts(Trend.csv)

Trend and index are atomic conceptual categories that can be combined to form industrial chain events and company events.

- trend: The trend of the event, with possible values of "rising" or "falling".
- index: The index related to the event, with possible values of "price," "cost," or "profit".

###### 9 The event categorization(TaxOfCompanyEvent.csv、TaxOfProdEvent.csv)

Event classification includes industrial chain event classification and company event classification with the following data:

- Industrial chain event classification: "Price increase".
- Company event classification: "Cost increase".
