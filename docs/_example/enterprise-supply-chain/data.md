---
title: 数据介绍
order: 2
---

## 1 数据目录

```
|_supplychain
    |_builder
    |_job
    |__data
        |_Company.csv                      // 存放公司数据
        |_Company_fundTrans_Company.csv    //公司转账关系
        |_Person.csv                       //人相关数据
        |_Industry.csv                     //行业类目概念数据
        |_Product.csv                      //产品类目概念数据
        |_Index.csv                        //指标类目概念数据
        |_Trend.csv                        //趋势类目概念数据
        |_ProductChainEvent.csv            //产业链事件
        |_TaxOfCompanyEvent.csv            //公司事件分类数据
        |_TaxOfProdEvent.csv               //产业链产品事件分类数据
```

分别抽样部分数据进行介绍。

## 2 公司数据（Company.csv）

```
id,name,products
CSF0000002238,三角*胎股*限公司,"轮胎,全钢子午线轮胎"
```

- id：公司在系统中的唯一id
- name：公司名
- products：公司生产的产品，使用逗号分隔

## 3 公司资金转账（Company_fundTrans_Company.csv）

```
src,dst,transDate,transAmt
CSF0000002227,CSF0000001579,20230506,73
```

- src：转出方
- dst：转入方
- transDate：转账日期
- transAmt：转账总金额

## 4 法人代表（Person.csv）

```
id,name,age,legalRep
0,路**,63,"新疆*花*股*限公司,三角*胎股*限公司,传化*联*份限公司"
```

- id：自然人在系统中唯一标识
- name：姓名
- age：年龄
- legalRep：法人代表公司名字

## 5 产业类目概念（Industry.csv）

```
fullname
能源
能源-能源
能源-能源-能源设备与服务
能源-能源-能源设备与服务-能源设备与服务
能源-能源-石油、天然气与消费用燃料
```

产业只有名字，其中段横线代表其上位概念，例如“能源-能源-能源设备与服务”的上位概念是“能源-能源”；“能源-能源-能源设备与服务-能源设备与服务”的上位概念为“能源-能源-能源设备与服务”。

## 6 产品类目概念（Product.csv）

```
fullname,belongToIndustry,hasSupplyChain
商品化工-橡胶-合成橡胶-顺丁橡胶,原材料-原材料-化学制品-商品化工,"化工商品贸易-化工产品贸易-橡塑制品贸易,轮胎与橡胶-轮胎,轮胎与橡胶-轮胎-特种轮胎,轮胎与橡胶-轮胎-工程轮胎,轮胎与橡胶-轮胎-斜交轮胎,轮胎与橡胶-轮胎-全钢子午线轮胎,轮胎与橡胶-轮胎-半钢子午线轮胎"
```

- fullname：产品名，同样通过段横线分隔上下位
- belongToIndustry：所归属的行业，例如本例中，顺丁橡胶属于商品化工
- hasSupplyChain：是其下游产业，例如顺丁橡胶下游产业有轮胎、橡塑制品贸易等

## 7 产业链事件（ProductChainEvent.csv）

```
id,name,subject,index,trend
1,顺丁橡胶成本上涨,商品化工-橡胶-合成橡胶-顺丁橡胶,价格,上升
```

- id：事件的id
- name：事件的名字
- subject：事件的主体，本例为顺丁橡胶
- index：指标，本例为价格
- trend：趋势，本例为上升

## 8 指标（Index.csv）和趋势（Trend.csv）

趋势、指标作为原子概念类目，可组合成产业链事件和公司事件。

- 趋势，值域为：上涨、下跌
- 指标，值域为：价格、成本、利润

## 9 事件分类（TaxOfCompanyEvent.csv、TaxOfProdEvent.csv）

事件分类包括产业链事件分类和公司事件分类，数据为：

- 产业链事件分类，值域：价格上涨
- 公司事件分类，值域：成本上升
