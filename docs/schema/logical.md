概念之间只允许定义以下7大类的语义谓词（属性和关系），具体定义形式为：分类简写#谓词，比如HYP#isA
![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2023/png/53323/1701768835821-80286d65-550f-471f-b38e-374a873a40c0.png#clientId=uf9772733-386c-4&from=paste&height=515&id=u8a68b2c0&originHeight=515&originWidth=1200&originalType=binary&ratio=1&rotation=0&showTitle=false&size=288772&status=done&style=none&taskId=ub768ab04-6810-4e9a-b4b8-a2b139149d9&title=&width=1200)

### HYP: 上位关系(Hypernym)

是指一种更广泛或更一般的概念包含或包括另一种更具体或更特定的概念的关系。

- **isA**

是...一种

- **locateAt**

位于

- **mannerOf**

A 是 B 的一种特定实现方式。类似于 "IsA"，但用于动词。比如 “拍卖” → “销售”

### SYNANT: 同义反义关系(Synonymy/Antonymy)

表达概念之间是同义还是反义的关系。

- **synonym**

表达同义词

- **antonym**

表达反义词

- **symbolOf**

A 象征性地代表了 B。比如：“红色” → “热情”

- **distinctFrom**

A 和 B 是一个集合中不同的成员，是 A 的东西绝对不是 B。比如：“八月”→ “九月”

- **definedAs**

A 和 B 在意义上有相当大的重叠，但 B 是 A 的更具解释性的版本。比如：“和平”→ “没有战争”

- **locatedNear**

A 和 B 通常会被发现靠近彼此。比如：“椅子” → “桌子”

- **similarTo**

A 和 B 相似。比如：“搅拌器” → “食物处理器”

- **etymologicallyRelatedTo**

A和B有共同的来源。比如：“folkmusiikki” → “folk music”

### CAU: 因果关系(Causal)

表示指一个事件或行为（原因）导致另一个事件或行为（结果）发生的一类关系。

- **leadTo**

表达事件通过逻辑规则实现传递，比如A事件实例会在满足指定规则的前提下生成一个B事件实例。此谓词在系统上会被识别为实例生成的意图，用于实现事件的实例传递。

- **causes**

表达恒定的因果关系，没有条件约束

- **obstructedBy**

A 是一个可能被 B 阻止的目标，B 是阻碍 A 实现的障碍。比如：“睡觉” → “噪音”

- **causesDesire**

A使人想要B，其中A的状态或事件激发了对B的欲望或需求。比如：“没吃的”→“去商店”

- **createdBy**

B 是一个创造 A 的过程或者动因。比如：“蛋糕”→“烘焙”

### SEQ: 顺承关系(Sequential)

是连续发生的事情或动作，这些事情或动作有先后顺序。

- **happendedBefore**

A先于B发生

- **hasSubevent**

A和B是事件，B作为A的子事件发生。比如：“吃” → “咀嚼”

- **hasFirstSubevent**

A 是一个以子事件 B 开始的事件。比如：“睡觉” → “闭眼”

- **hasLastSubevent**

A 是一个以子事件 B 结束的事件。比如：“烹饪” → “收拾厨房”

- **hasPrerequisite**

为了让 A 发生，需要发生 B；B 是 A 的前提条件。比如：“做梦” → “睡觉”

### IND: 归纳关系(Induction)

是指从一类有共同特征的实体中得出对这些实体概括性的概念，这种个体和概念之间的关系就是归纳关系。

- **belongTo**

该关系一般在SPG里用于实体类型到概念类型的分类关系描述，比如“公司事件” → “公司事件分类”

### INC: 包含组成关系(Inclusion)

表达部分与整体的关系。

- **isPartOf**

A是B的一个部分

- **hasA**

B 属于 A，作为固有部分或由于占有的社会构造。HasA 往往是 PartOf 的反向关系。比如：“鸟”→“翅膀”

- **madeOf**

A是由B组成的。比如：“瓶子”→“塑料”

- **derivedFrom**

A衍生/源自于B，用于表达组合概念

- **hasContext**

A 是在 B 上下文中使用的一个词，B 可以是一个主题领域、技术领域或区域方言。比如：“astern”→“ship”

### USE: 用途关系(Usage)

表达作用/用途的关系。

- **usedFor**

A 被用于 B，A 的目的是 B。比如：“桥”→“通过水域”

- **capableOf**

A 通常能做的事是 B。比如：“刀”→“切割”

- **receivesAction**

B可以对A做的动作。比如：“按钮”→“按”

- **motivatedByGoal**

某人做 A 是因为他们想要结果 B；A 是实现目标 B 的一个步骤。比如：“竞争”→“赢”
