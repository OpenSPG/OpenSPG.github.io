---
title: KNext
order: 5
---

KNext是OpenSPG可编程框架，期望提供一套可扩展，流程化，对用户友好的组件化能力。

KNext包含以下几个功能模块：

![](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*W1roTaX50QMAAAAAAAAAAAAADtmcAQ/original)

其中，各模块详细功能说明如下：

| 功能模块               | 作用                                      |
| ---------------------- | ----------------------------------------- |
| Python SDK             | OpenSPG的Python SDK                       |
| Programmable Framework | OpenSPG的可编程框架，包含各种组件能力抽象 |
| Command Line Tools     | OpenSPG命令行工具，基于命令与图谱做交互   |

更进一步，可编程框架包括以下几个抽象：

| 可编程框架抽象  | 作用                                                     |
| --------------- | -------------------------------------------------------- |
| Model(模型）    | 抽象模型微调服务等流程，提供基于OpenSPG的模型外挂能力    |
| Operator(算子） | 提供抽取、链指、预测、融合等算子接口，用户可以自定义实现 |
| Component(组件) | 对图谱能力的抽象，比如推理、映射、抽取等                 |
| Chain(组件链)   | 一系列组件组成的流程                                     |

基于KNext可编程框架，整体的OpenSPG架构如下：

![](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*4JptQaPtPjEAAAAAAAAAAAAADtmcAQ/original)
