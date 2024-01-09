---
title: NN4K介绍
order: 3
---

NN4K(Neural Network for Knowledge Graph)是一个神经网络模型的开发、管理、服务框架，为OpenSPG提供简单易用、模式统一的大模型服务。
NN4K主要分为三大部分：

1.模型Executor。模型的生产侧，主要针对不同的基座模型，由模型生产者提供模型使用逻辑，包括sft、inference等能力。executor是NN4K中对大模型的可操作的功能封装，而非module本身，在结构层次上，executor "
has a" module。因此executor不会包含模型层面的操作，诸如forward、backward之类的方法，而是提供更高层次的方法抽象封装。2. 模型Invoker。统一的模型服务接入方法。用户只需要提供基本的模型使用参数，以极小的成本切换模型基座、使用模型服务，而无需关心模型内部细节。3. 模型Hub（可选）。在一些场景下，用户有统一管理模型的需求。在这里预留模型Hub的定义和接口，方便用户基于不同的平台管理模型。

通过NN4K，用户可以一键切换大模型基座，一键唤起大模型服务，同时可以很容易的把大模型服务嵌入OpenSPG的算子中，降低开发和使用难度。
整体类架构:

![](https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*DQ_2RZ1lVrkAAAAAAAAAAAAADtmcAQ/original)

## 发布规划

第一版NN4K以支持SPG知识自动化抽取为核心，自动化的接入openai服务，用户无需担心大模型的使用细节。
大模型所扮演的角色，自然远远不止一个openai服务这么简单。大模型在预期的设计中，会和SPG图谱联动起来，从图谱获取数据用于训练模型、可控生成答案等。之后会对一些主流的常用模型，例如huggingface注册的llama，llama2，包括一些中文模型，例如baichuan等模型做一些诸如sft、rhlf的默认实现。用户在没有特殊需求的情况下，可以依赖我们的默认实现，仅需提供数据+配置文件，就可以轻松在全流程享受大模型带来的便利。
随着模型支持的增多，以及用户sft后的模型增加，模型的管理了分享慢慢会成为一个基础需求。NN4K预留了Hub接口并会提供一些基础实现。这些接口会充分考虑复杂场景下的模型管理和使用。这是一个可选模块，用户可自由选择何时使用、怎么使用。这个将在主流模型的默认实现提供完成后，发布默认的实现。

## 如何开发

### Invoker

如果你只是一个是模型的使用者，invoker是你唯一需要关心的程序入口。一般来说，如果需要使用NN4K提供的默认大模型实现任务，使用NNInvoker就已经足够了。
Invoker是执行、提交大模型任务的统一入口，提供和对应executor配套的submit_sft,submit_inference等方法。通常来说，invoker会提供提交任务到本地和提交任务到远程集群的能力，用户也可以自行实现invoker以提交任务到不同的环境。

#### 使用具备默认实现的Invoker

NN4K现在提供了调用远端inference服务的invoker默认实现，即OpenAIInvoker。如果需要使用OpenAIInvoker调用OpenAI服务，你只需：

1. 准备一个config文件，例如：remote_inference.json

```yaml
{
  'nn_name': 'gpt-3.5-turbo',
  'openai_api_key': 'EMPTY',
  'openai_api_base': 'http://127.0.0.1:38080/v1',
  'openai_max_tokens': 2000,
}
```

其中 openai_api_base 指定 OpenAI API 服务的 URL，若要使用 OpenAI 官方的 API，应将 openai_api_base
设为 `https://api.openai.com/v1`，并将 openai_api_key 设为从 [API keys](https://platform.openai.com/api-keys) 获取的 key，类似 `
sk-xxx`。

2. 在任意python文件中调用NNInvoker

```python
NNInvoker.from_config("remote_inference.json").remote_inference("你的输入")
```

NN4K框架程序会自动判断并且使用OpenAIInvoker来执行remote_inference方法。如果需要知道更多细节，可以参阅 nn4k.invoker
中的 [openai_invoker.py](https://github.com/OpenSPG/openspg/blob/master/python/nn4k/nn4k/invoker/openai.py) 了解详情。
OpenAIInvoker的使用比较简单。未来对于复杂的Invoker和参数，我们都会有详细的example和文档说明，用户可以在已有的example基础上做少量的修改，所以不必过分担忧。

#### 开发自定义Invoker

有些时候，你可能需要开发自己的invoker来满足你的自定义需求。一旦你选择开发自己的invoker，你就可以完全控制代码的执行流程和推理/训练使用框架。我们强烈建议你从NNInvoker或者LLMInvoker(
如果你开发的是基于大模型的任务）来继承开发你的自定义Invoker，这样你的Invoker得以更简单的和他人分享。同时，使用你自己的的invoker也只需要在from_config方法的config参数文件（参见上一节的remote_inference.json文件）中加上nn_invoker配置即可。

```json
{
  ...
  "nn_invoker": "package.path.to.your.Invoker"
  ...
}
```

##### NNInvoker

是所有Invoker的基类，这里简单描述一下每个方法的作用：

###### from_config

必须实现的方法。原则上所有的初始化动作都需要通过此方法完成。此方法中主要完成不同格式的输入args的解析和记录，同时，如果发现自身类无法完成目标invoker的任务（例如NNInvoker无法完成OpenAIInvoker的具体任务），则会把调用代理到其他可处理的Invoker中去执行。

###### submit_inference

发送批量inference任务到集群中运行

###### remote_inference

发送input到远端inference服务来执行inference。

###### local_inference

在本地装载模型并且在本地执行inference任务。一般来说，大模型的本地任务需要本地高性能显卡。

###### warmup_local_model

在起一个大模型服务时，有时需要一些warmup的动作。如果需要，则在这个方法中统一执行。

##### LLMInvoker

继承自NNInvoker。除了NNInvoker具备的能力，还具备大模型训练具备的一些能力定义。例如：

###### submit_sft

提交一个大模型sft任务。

###### submit_rl_tuning

提交一个rl_turing任务。
如上所述，我们将会很快提供一些常用模型的sft和rlhf训练的默认实现，敬请期待。
