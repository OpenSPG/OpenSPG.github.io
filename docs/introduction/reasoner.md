---
title: 知识推理
order: 4
---

知识推理是OpenSPG框架中的逻辑规则执行引擎，它将图谱的事实知识抽象并关联到具有实际的商业价值的逻辑知识。

如下图所示的知识分层结构中，在基础事实知识的基础上，我们可以通过Reasoner表达逻辑谓词、超图事件、时空关联，以及它们之间形成的逻辑规则链条，满足业务上动态分类，事理归因等推理需求。Reasoner也提供高性能的执行引擎，满足实时分析和批量推理计算等各种计算需求。

![image.png](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*I6TMTrDULT4AAAAAAAAAAAAADtmcAQ/original)

## 规则定义

有业务需求：找出至少使用两部相同手机的用户对。已有Schema定义如下：

```
User(自然人): EntityType
	properties:
		age(年龄): Integer
		hasPhone(电话号码): STD.ChinaMobile
```

那么，我们可以在Schema实体类型User上创建一条逻辑边，其中的规则定义如下：

```
Define (s:User)-[p:samePhone]->(o:User) {
	GraphStructure {
  	(s)-[:useDevice]->(p:STD.ChinaMobile)<-(:useDevice)-(o)
	}
  Rule {
		use_device_num("使用设备数目") = group(s, o).count(p.id)
    R1("使用设备至少超过两个"): use_device_num >= 2
    R2("双方年龄都大于 18 岁"): s.age > 18 and o.age > 18
    p.num = use_device_num // 在边上定义属性num
	}
}
```

通过这样的定义，我们在Schema上添加了一条逻辑边。

## 规则推理

通过上一节的规则定义，我们在Schema上创建了逻辑边，逻辑边的使用与数据边相同。
Schema变更后，如下图所示，在图中可以看到新的逻辑边。

![image.png](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*aUXYS4FAAOMAAAAAAAAAAAAADtmcAQ/original)

假设我需要查询用户张三是否与其他用户共用了手机号，可以通过如下查询语句获取。

```
MATCH
    (u1:User)-[p:samePhone]->(u2:User)
WHERE
    u1.name == '张三'
RETURN
    u1.name, u2.name, p.num
```

数据如下：

![image.png](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*IX6vQLVH7V0AAAAAAAAAAAAADtmcAQ/original)

我可以得到结果：

| u1_name | u2_name | p_num |
| ------- | ------- | ----- |
| 张三    | 王五    | 2     |
