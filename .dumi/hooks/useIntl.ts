import { useLocale } from 'dumi';
import { useCallback, useMemo } from 'react';

export const useIntl = () => {
  const { id: lang } = useLocale();
  const intl = useCallback(
    (zh: string, en?: string) => {
      if (!en) return zh;
      if (lang !== 'zh-CN') return en;
      return zh;
    },
    [lang],
  );

  const Messages = useMemo(() => {
    return {
      REPO: 'https://github.com/OpenSPG/openspg',
      TITLE: {
        abbr: 'SPG',
        full: intl(
          '语义增强可编程图谱框架',
          'Semantic-Enhanced Programmable Graph',
        ),
        sub: intl(
          '新一代企业级知识图谱语义框架',
          'A new generation of enterprise knowledge graph semantic framework',
        ),
      },
      BUTTON_GROUP: {
        Github: 'https://github.com/OpenSPG/openspg',
        Documentation: 'quick-start',
        WhitePaper: 'download',
      },
      ANNOUNCEMENT: [
        {
          title: intl(
            '蚂蚁集团 x OpenKG 联合发布',
            'Jointly Released by Ant Group and OpenKG',
          ),
          description: intl(
            '新一代《知识语义框架SPG》白皮书',
            'New Generation of "Knowledge Semantic Framework SPG" Whitepaper',
          ),
          link: 'https://mp.weixin.qq.com/s?__biz=MzIyOTkzNDczMw==&amp;mid=2247483709&amp;idx=1&amp;sn=8c778f9d35fdbfeb171f2fdd67168299&amp;chksm=e8ba52dfdfcddbc9d6cdb2cd99367c704601399f7b61f47e80094e226a65031856e3bc3a960c&token=2136960064&lang=zh_CN#rd',
          cover:
            'https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*i1HwQKSMFo0AAAAAAAAAAAAADtmcAQ/original',
        },
        {
          title: 'OpenSPG',
          description: intl('OpenSPG 开源发布', 'OpenSPG Open Source Release'),
          link: 'https://mp.weixin.qq.com/s?__biz=MzIyOTkzNDczMw==&amp;mid=2247483795&amp;idx=1&amp;sn=49e8ed1ee64fa7a2bd010387e11b3fb7&amp;chksm=e8ba5271dfcddb67a3c44fef86de32379b278a821568add62dbaf70dd1470f9c6e59e006f92e&token=2136960064&lang=zh_CN#rd',
          cover:
            'https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*uSgFTpFvMcEAAAAAAAAAAAAADtmcAQ/original',
        },
        {
          title: intl('“新KG”视点', 'Perspective of "New KG"'),
          description: intl(
            '知识图谱与大语言模型协同模式探究',
            'Exploring the Synergy Between Knowledge Graphs and Large Language Models',
          ),
          link: 'https://mp.weixin.qq.com/s?__biz=MzIyOTkzNDczMw==&mid=2247483916&idx=1&sn=62e852520ba45b30daff8bddb44a56c7&chksm=e8ba51eedfcdd8f8c90fa6646adc46ba291ea9e4cdab0562a40bbd371e17a43deab36269d1e2&token=2042662316&lang=zh_CN#rd',
          cover:
            'https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*9BZfR6NtkjYAAAAAAAAAAAAADtmcAQ/original',
        },
      ],
      PARAGRAPH: {
        TechnicalFeatures: intl('技术特性', 'Technical Features'),
        BusinessApplications: intl('业务应用', 'Business Applications'),
        WhitepaperDownload: intl('白皮书下载', 'Whitepaper Download'),
        CooperationPartner: intl('合作伙伴', 'Cooperation Partner'),
        QuickStart: intl('快速开始', 'Quick Start'),
        ContactUs: intl('联系我们', 'Contact Us'),
        CopiedToClipboard: intl('已复制到剪贴板', 'Copied to Clipboard'),
        FollowUs: intl('关注我们', 'Follow Us'),
        SPGFramework: intl('语义增强可编程图谱框架', 'SPG Framework'),
      },
      TECHNICAL_FEATURES: [
        {
          title: intl(
            '跨图谱零拷贝融合，连接数据孤岛',
            'Seamless Integration Across Knowledge Graphs, Bridging Data Silos',
          ),
          detail: intl(
            '通过标准化语义框架，可以实现将企业多源异构，时序动态，关联复杂的数据进行连接，打破数据孤岛',
            'By employing a standardized semantic framework, it becomes feasible to connect diverse, heterogeneous, sequential and intricately related data sources within an enterprise, thereby dismantling data silos',
          ),
          imgUrl:
            'https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*88JoRLde504AAAAAAAAAAAAADtmcAQ/original',
        },
        {
          title: intl(
            '深度语义上下文关联',
            'Deep Semantic Contextual Association',
          ),
          detail: intl(
            '通过对业务主体属性进行标准化语义增强，将数据进行知识化管理，丰富实体间语义关联，进而提升业务效果',
            'By standardizing semantic enrichment of business entity properties, data can be managed knowledge-based, thereby enriching semantic associations among entities and further improving business efficiency',
          ),
          imgUrl: intl(
            'https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*nwxSTrutpxkAAAAAAAAAAAAADtmcAQ/original',
            'https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*9walTIIM8PsAAAAAAAAAAAAADtmcAQ/original',
          ),
        },
        {
          title: intl(
            '知识符号化表示，与大模型双向驱动',
            'Knowledge Symbolic Representation, Bidirectionally Driven by Large Models',
          ),
          detail: intl(
            '通过可编程知识图谱框架，让领域知识图谱很容易和大模型进行结合，增强了大模型在实际应用中的可控性',
            'Leveraging a programmable knowledge graph framework makes it easy to combine domain knowledge graphs with large language models(LLM), thereby enhancing the controllability of LLMs in practical applications.',
          ),
          imgUrl: intl(
            'https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*WOcCS5fVEeAAAAAAAAAAAAAADtmcAQ/original',
            'https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*wsR8R7o7ysgAAAAAAAAAAAAADtmcAQ/original',
          ),
        },
      ],
      BUSINESS_APPLICATIONS: [
        {
          title: intl('支付黑产图谱', 'Anti-Black Market'),
          desc: intl(
            '基于用户和应用之间的设备、网络、交易等基础信息，发掘黑产应用背后的黑产人员线索',
            'Leveraging foundational information such as devices, networks, transactions, etc., between users and applications to uncover clues about the individuals behind illicit activities in the black market',
          ),
          details: [
            {
              point: intl(
                '语义增强，连接深度关系',
                'Semantic Enhancement, Connecting Deep Relationships',
              ),
              infoList: [
                intl(
                  '内置语义转换，支持多种数据源转换SPG模型，无需用户额外处理',
                  'Built-in Semantic Transformation, Supporting Multiple Data Source Conversions with SPG Models, Without the Need for Additional User Processing',
                ),
                intl(
                  '支持逻辑规则与基础事实知识的融合表示，支持知识要素之间逻辑传导并保障一致性',
                  'Supporting the Fusion Representation of Logical Rules and Foundational Facts, Enabling Logical Inference Between Knowledge Elements while Ensuring Consistency',
                ),
                intl(
                  '提供多种跨图谱融合算子能力，支持多种融合策略，支持跨图谱连接即可用',
                  'Offering Multiple Cross-Knowledge Graph Fusion Operator Capabilities, Supporting Various Fusion Strategies, and Enabling Seamless Cross-Knowledge Graph Connections',
                ),
              ],
            },
            {
              point: intl(
                '领域图谱自动构建',
                'Automated Construction of Domain Knowledge Graphs',
              ),
              infoList: [
                intl(
                  '属性语义类型替代基础类型定义，支持发掘更深度信息',
                  'Replacing Basic Type Definitions with Semantic Property Types to Enable Deeper Information Discovery',
                ),
                intl(
                  '知识建模和事实建模分层，基于业务领域知识定义逻辑点边类型，解决知识、事实建模混同导致图谱迭代演进困难的问题',
                  'Hierarchical Knowledge and Fact Modeling, Defining Logical Node-Edge Types Based on Business Domain Knowledge to Resolve the Challenges of Blurring Knowledge and Fact Modeling That Make Graph Evolution Difficult',
                ),
                intl(
                  '支持跨图谱知识融合建模，解决数据复用难题',
                  'Supporting Cross-Knowledge Graph Knowledge Fusion Modeling to Address the Challenge of Data Reusability',
                ),
              ],
            },
            {
              point: intl(
                '规则推理和神经网络模型深度结合',
                'Deep Integration of Rule-Based Reasoning and Neural Network Models',
              ),
              infoList: [
                intl(
                  '内置后向推理器，可基于事实数据+业务知识建模规则，派生出业务所需数据，有效降低数据管理和维护成本',
                  'Incorporating a Backward Reasoner, Capable of Deriving Business-Required Data Based on Fact Data and Business Knowledge Modeled Rules, Effectively Reducing Data Management and Maintenance Costs',
                ),
                intl(
                  '支持概念动态分类，实现OWL类似实体定义能力',
                  'Supporting Dynamic Concept Classification, Achieving Entity Definition Capabilities Similar to OWL (Web Ontology Language)',
                ),
                intl(
                  '具备和OWL DL相同逻辑表达能力，可进行神经符号融合学习',
                  'Possessing the Same Logical Expression Capability as OWL DL, Enabling Neuro-Symbolic Fusion Learning',
                ),
              ],
            },
          ],
          imgUrl: intl(
            'https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*LDh1RZH5OyQAAAAAAAAAAAAADtmcAQ/original',
            'https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*G0g5S5EJTmEAAAAAAAAAAAAADtmcAQ/original',
          ),
        },
        {
          title: intl('事理图谱', 'Eventic Graph'),
          desc: intl(
            '对宏观经济形势、政策，中观行业现象，微观公司事件综合分析，辅助针对特定产业链上下游公司的风控预警，辅助机构风险评级。',
            'Comprehensive analysis of macroeconomic conditions, policies, mid-range industry trends, and micro-level corporate events, assisting in risk warnings for specific companies along the industrial supply chain, and aiding in institutional risk assessment.',
          ),
          details: [
            {
              point: intl(
                '实例-概念分层的时空多元关系建模',
                'Modeling Spatiotemporal Multivariate Relationships with Instance - Concept Layering',
              ),
              infoList: [
                intl(
                  '实例事件及概念常识分层建模，支持事理逻辑-事实的归纳演绎',
                  'Layered modeling of instance events and conceptual knowledge to support inductive and deductive reasoning in causal logic',
                ),
                intl(
                  '事件主体时空多元关系表示，解决超图采样及计算难题',
                  'Representation of spatiotemporal multivariate relationships among event entities, addressing challenges related to hypergraph sampling and computation.',
                ),
                intl(
                  '事件概念设置语义逻辑表达式，辅助事件分类和一致性验证',
                  'Semantic logical expressions for event concept definitions, aiding in event classification and consistency verification.',
                ),
              ],
            },
            {
              point: intl(
                'Schema增强的事件抽取及语义标准化',
                'Schema enhanced event extraction and semantic standardization',
              ),
              infoList: [
                intl(
                  'Schema+概念语义增强的prompt，LLM辅助图谱构建',
                  'Schema-enhanced prompts with conceptual semantic augmentation, assisting in graph construction with Large Language Models (LLM)',
                ),
                intl(
                  '事件要素抽取结果语义标准化及概念链指，增加和补全事件间关联',
                  'Semantic standardization of event element extraction results and concept chaining to enhance and complete inter-event associations',
                ),
                intl(
                  '动态增量构建事件分类本体，以适应业务的多样性及变化',
                  'Dynamic incremental construction of event classification ontology to adapt to business diversity and change',
                ),
              ],
            },
            {
              point: intl(
                '语义知识与图结构协同的事件推理',
                'Event reasoning with synergies between semantic knowledge and graph structure',
              ),
              infoList: [
                intl(
                  '基于概念语义表达式的事件动态分类，辅助事件多维度聚类',
                  'Dynamic event classification based on conceptual semantic expressions, assisting in multi-dimensional event clustering',
                ),
                intl(
                  '基于概念规则定义的事理理逻辑演绎，挖掘产业链上下游潜在风险公司',
                  'Causal logic deduction based on conceptual rule definitions, uncovering potential risk companies in the industrial supply chain',
                ),
                intl(
                  'KG知识语义结合图结构特征，通过关系预测任务实现定量风险分析',
                  'Combining knowledge graph semantic information with graph structural characteristics, achieving quantitative risk analysis through relationship prediction tasks',
                ),
              ],
            },
          ],
          imgUrl: intl(
            'https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*cR-WT6jHC5IAAAAAAAAAAAAADtmcAQ/original',
            'https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*ltIqSZdIvcAAAAAAAAAAAAAADtmcAQ/original',
          ),
        },
      ],
      COOPERATION_PARTNER: [
        {
          title: intl('参与编写单位', 'Contributing Entities'),
          unitNames: [
            intl('同济大学', 'Tongji University'),
            intl(
              '浙江创邻科技有限公司',
              'Zhejiang Chuanglin Technology Co., Ltd.',
            ),
            intl('浙江大学', 'Zhejiang University'),
            intl('天津大学', 'Tianjin University'),
            intl('达观数据有限公司', 'Datagrand Inc.'),
            intl('之江实验室', 'Zhejiang Lab'),
            intl('恒生电子股份有限公司', 'Hundsun Technologies Inc.'),
            intl(
              '海乂知信息科技（南京）有限公司',
              'Haiyi Zhi Information Technology (Nanjing) Co., Ltd.',
            ),
            intl(
              '中国科学院计算技术研究所',
              'Institute of Computing Technology, Chinese Academy of Sciences',
            ),
          ],
          style: { flex: 1 },
        },
      ],
      CONTACT: {
        Github: {
          title: intl('资源', 'Resources'),
          name: 'GitHub',
          url: 'https://github.com/OpenSPG/openspg',
        },
        Community: {
          title: intl('社区', 'Community'),
          name: '',
          url: '',
        },
        Email: {
          title: intl('联系我们', 'Contact Us'),
          name: intl('邮箱', 'Email'),
          email: 'feidongni.fdn@antgroup.com',
        },
        QRCode: {
          title: intl(
            '语义增强可编程图谱框架',
            'Semantic-enhanced Programmable Graph',
          ),
          url: 'https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*FYxHT5WP0pUAAAAAAAAAAAAADtmcAQ/original',
        },
      },
    };
  }, [intl]);

  return {
    intl,
    Messages,
  };
};
