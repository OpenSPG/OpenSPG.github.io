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
      PARAGRAPH: {
        whyChooseSPG: intl('为什么选择SPG', 'Why Choose SPG'),
        SPGFeaturesSemanticExamples: intl(
          'SPG特性-语义增强示例',
          'SPG Features - Semantic Enhancement Examples',
        ),
        DeepSemanticNetworking: intl(
          '离散实体要素深度语义网络化，稀疏关系自动补全显性稠密',
          'Deep Semantic Networking of Discrete Entity Elements, Automatic Completion of Sparse Relationships for Enhanced Density',
        ),
        SemanticEnhancedProperties: intl(
          '属性图语义增强',
          'Semantic Enhancement of Property Graphs',
        ),
        SemanticEnhancedPropertiesImg: intl(
          'https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*TdfeRIfHnisAAAAAAAAAAAAADtmcAQ/original',
          'https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*tzHwTJy7TDIAAAAAAAAAAAAADtmcAQ/original',
        ),
        DataToKnowledgeProcess: intl(
          '数据到知识生产过程',
          'The Data-to-Knowledge Production Process',
        ),
        DataToKnowledgeProcessImg: intl(
          'https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*DcYSS7qaYJkAAAAAAAAAAAAADtmcAQ/original',
          'https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*a3i2T4w41AMAAAAAAAAAAAAADtmcAQ/original',
        ),
        SPGSemanticFramework: intl('SPG语义框架', 'SPG Semantic Framework'),
        AccelerateDataIntegration: intl(
          '加速企业海量数据知识化集成，无缝衔接AI技术框架应用落地',
          'Accelerating Enterprise-Scale Data Knowledge Integration, Seamless Integration with AI Technology Frameworks for Real-World Applications',
        ),
        AccelerateDataIntegrationImg: intl(
          'https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*9BKUQYrL56IAAAAAAAAAAAAADtmcAQ/original',
          'https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*eK3wTqkCHnAAAAAAAAAAAAAADtmcAQ/original',
        ),
        SPGCaseStudies: intl('SPG案例', 'SPG Case Studies'),
        WhitepaperDownload: intl('白皮书下载', 'Whitepaper Download'),
        QuickStart: intl('快速开始', 'Quick Start'),
        ContactUs: intl('联系我们', 'Contact Us'),
        CopiedToClipboard: intl('已复制到剪贴板', 'Copied to Clipboard'),
        FollowUs: intl('关注我们', 'Follow Us'),
        SPGFramework: intl('语义增强可编程图谱框架', 'SPG Framework'),
      },
      SPG_FEATURE: {},
      SPG_POINT_CONFIG: [
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
      SPG_CASE_CONFIG: [
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
      /**页面底部版权信息配置 */
      COPYRIGHT_INFORMATION_CONFIG: [
        {
          title: intl('牵头编写单位', 'Lead Writing Entity'),
          unitNames: [intl('蚂蚁科技集团股份有限公司', 'Ant Group Co., Ltd.')],
          style: { flex: 0.5 },
        },
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
    };
  }, [intl]);

  return {
    intl,
    Messages,
  };
};
