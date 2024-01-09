---
title: 扩展RDG
order: 2
---

## 1. RDG简介

RDG（Resilient Distributed Graph）的设计灵感来源于Apache Spark的核心编程抽象——弹性分布式数据集RDD（Resilient Distributed
Dataset）。RDG模型继承了RDD的设计理念，通过将复杂的图操作抽象化为一系列标准算子（如Map、Filter、ReduceByKey等）来简化图数据操作的表达和处理。
RDG是一个高级的图计算抽象层，旨在提供一个统一的接口以对接多种物理执行引擎。通过适配RDG接口，可以将LPG转化为SPG，极大的提高已有系统的应用价值。

![image.png](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*ZUG-S7YafPsAAAAAAAAAAAAADtmcAQ/original)

## 2. 适配方法

将OpenSPG适配到一个新的物理引擎，最主要的工作是实现自己的RDG类。下面我先介绍RDG的核心接口：

### 1. RDG接口

RDG接口代码可参考[链接](https://github.com/OpenSPG/openspg/blob/master/reasoner/lube-physical/src/main/scala/com/antgroup/kg/reasoner/lube/physical/rdg/RDG.scala)
，接口说明如下：

| 接口                                                       | 参数                                                         | 说明                                                                |
| ---------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------- |
| patternScan                                                | pattern: Pattern                                             | 通过给定起点，匹配图结构。其中Pattern可以是点、边也可以是一度子图。 |
| expandInto                                                 | target: PatternElement                                       |
| pattern: Pattern                                           | 扩展当前图中间结果。target是当前图结构与待匹配结构中重叠的点 |
| filter                                                     | expr: Rule                                                   | 按照Rule表达式过滤图中间结果                                        |
| groupBy                                                    | by: List[Var]                                                |
| aggregations: Map[Var, Aggregator]                         | 聚合计算。                                                   |
| 与表数据聚合不同，图数据聚合需要安装子图结构进行点边去重。 |
| addFields                                                  | fields: Map[Var, Expr]                                       | 计算表达式，将结果添加到图中                                        |
| dropFields                                                 | fields: Set[Var]                                             | 去除不需要的数据和属性，以降低中间结果大小                          |
| orderBy                                                    | groupKey: List[Var]                                          |

sortItems: List[SortItem]
limit: Int | 聚合后排序并截断 |
| linkedExpand | pattern: EdgePattern[LinkedPatternConnection] | 逻辑链接。
在推理过程中，某些边是通过逻辑计算或模型预测得到的。该接口常用于时空推理和概念树挂载中。 |
| cache | 无 | 缓存当前RDG数据。
一般用于挂起当前推理任务，进入子推理任务时。 |
| join | other: RDG
joinType: JoinType
onAlias: List[(String, String)]
lhsSchemaMapping: Map[Var, Var]
rhsSchemaMapping: Map[Var, Var] | 将两个RDG结果join起来。
需要支持多种JoinType，同时由于命名空间重叠的可能，还需要对别名进行映射。 |
| ddl | ddlOps: List[DDLOp] | 产出新的知识，包括点，边和属性。 |
| select | cols: List[Var], as: List[String] | 从子图结构中选择感兴趣的信息，输出为表数据结构。 |
| fold和unfold | mapping: List[(RichVar, List[Var]) | 用于repeat场景中，将repeat边进行合并与展开。 |

### 2. PropertyGraph和LocalReasonerSession

当你完成了RDG代码的实现后，可以通过PropertyGraph类创建RDG，并通过LocalReasonerSession关联到自己的图存储。你需要实现的接口如下：

| 接口                        | 参数                                 | 说明                                       |
| --------------------------- | ------------------------------------ | ------------------------------------------ |
| KGReasonerSession.loadGraph | graphLoaderConfig: GraphLoaderConfig | 加载属性图，返回PropertyGraph              |
| PropertyGraph.createRDG     | alias: String                        |
| types: Set[String]          | 给定推理起点类型，创建RDG            |
| PropertyGraph.createRDG     | alias: String, rdg: RDG              | 给定RDG以及起点别名，创建一个子推理任务RDG |

## LocalRunner示例

LocalRunner是一个在单机上实现的，具备完整推理能力的引擎。其代码已经开源，具体可以参考：

| 模块                 | 实现链接                                                                                                                                                                                                                                                                                                                                   |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| LocalRDG             | [https://github.com/OpenSPG/openspg/blob/master/reasoner/runner/local-runner/src/main/java/com/antgroup/openspg/reasoner/runner/local/rdg/LocalRDG.java](https://github.com/OpenSPG/openspg/blob/master/reasoner/runner/local-runner/src/main/java/com/antgroup/openspg/reasoner/runner/local/rdg/LocalRDG.java)                           |
| LocalPropertyGraph   | [https://github.com/OpenSPG/openspg/blob/master/reasoner/runner/local-runner/src/main/java/com/antgroup/openspg/reasoner/runner/local/impl/LocalPropertyGraph.java](https://github.com/OpenSPG/openspg/blob/master/reasoner/runner/local-runner/src/main/java/com/antgroup/openspg/reasoner/runner/local/impl/LocalPropertyGraph.java)     |
| LocalReasonerSession | [https://github.com/OpenSPG/openspg/blob/master/reasoner/runner/local-runner/src/main/java/com/antgroup/openspg/reasoner/runner/local/impl/LocalReasonerSession.java](https://github.com/OpenSPG/openspg/blob/master/reasoner/runner/local-runner/src/main/java/com/antgroup/openspg/reasoner/runner/local/impl/LocalReasonerSession.java) |

## 基于Spark适配RDG（伪代码）

在Spark的适配中，我们像GraphX一样，使用RDD存储图数据的方案。推理中间结果，我们也使用RDD存储。下面写一些伪代码来展示适配过程。

### 1. SparkRDG

```
public class SparkRDG extends RDG<SparkRDG> {
    private SparkContext sc;
    private RDD<Result>  rstRdd;
    private RDD<String>  startIds;

    public SparkRDG(SparkContext sc, RDD<String> ids) {
        this.sc = sc;
        this.startIds = ids;
    }

    @Override
    public SparkRDG patternScan(Pattern pattern) {
        rstRdd = startIds.map(
            // 实现map，匹配对应的pattern
        )
    }

    /**
     * expand graph pattern
     */
    @Override
    public SparkRDG expandInto(PatternElement target, Pattern pattern) {
        rstRdd = rstRdd.keyBy(
            // 将之前匹配的子图，keyBy target，以便进行下一轮匹配
        ).map(
            // 实现匹配函数，完成pattern的匹配
        )
    }
}
```

### 2. SparkPropertyGraph

```
public class SparkPropertyGraph implements PropertyGraph<SparkRDG> {
    private SparkContext sc;
    private RDD<VertexGraph> graph;   //VertexGraph是一个自定义的图结构表示

  public class SparkPropertyGraph(SparkContext sc) {
		  this.sc = sc;
	}

	public void loadGraph(Map<String, Object> config) {
    	this.graph = ...     //图加载，可以考虑像graphx一样，使用RDD存储图
    	this.graph.persist();
	}

	@Override
	public SparkRDG createRDG(Set<String> types) {
    	// 从graph中寻找类型为types的点构造RDG
	}

	@Override
	public SparkRDG createRDG(Object id, String alias) {
    	// 从其他RDG中寻找某个alias作为起点，构造RDG
	}
}
```
