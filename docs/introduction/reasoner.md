# 简介

知识推理Reasoner模块是OpenSPG框架中的逻辑规则执行引擎，它将图谱的事实知识抽象并关联到具有实际的商业价值的逻辑知识。如下图所示的知识分层结构中，在基础事实知识的基础上，我们可以通过Reasoner表达逻辑谓词、超图事件、时空关联，以及它们之间形成的逻辑规则链条，满足业务上动态分类，事理归因等推理需求。Reasoner也提供高性能的执行引擎，满足实时分析和批量推理计算等各种计算需求。
![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/1062/1704717960163-c38bc455-ae9d-4db2-8688-f3455dcf9568.png#clientId=u8d123083-7722-4&from=paste&height=257&id=u3a2d253e&originHeight=514&originWidth=1092&originalType=binary&ratio=2&rotation=0&showTitle=false&size=175213&status=done&style=none&taskId=u7479126c-96b2-4fbf-b8a0-851de9cf053&title=&width=546)

# 规则定义

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

# 推理

通过上一节的规则定义，我们在Schema上创建了逻辑边，逻辑边的使用与数据边相同。
Schema变更后，如下图所示，在图中可以看到新的逻辑边。
![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/19043/1704685629368-8bd9bb83-d0f1-40d9-a80c-54f62540c58c.png#clientId=u94a4462f-40a1-4&from=paste&height=265&id=u380392b3&originHeight=530&originWidth=482&originalType=binary&ratio=2&rotation=0&showTitle=false&size=30758&status=done&style=none&taskId=ufe752cd1-d0ce-4f18-9bad-2e6757f8629&title=&width=241)
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
![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2024/png/19043/1704685431071-35626386-4495-491c-a859-8aa910fb1971.png#clientId=ud9a5afaf-4bb5-4&from=paste&height=371&id=uad9fa176&originHeight=742&originWidth=962&originalType=binary&ratio=2&rotation=0&showTitle=false&size=64041&status=done&style=none&taskId=ufa966380-22cf-4ac3-8ae3-f7ed3a955ce&title=&width=481)
我可以得到结果：

| u1_name | u2_name | p_num |
|---------|---------|-------|
| 张三      | 王五      | 2     |






