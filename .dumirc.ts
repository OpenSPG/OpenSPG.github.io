import { defineConfig } from 'dumi';

export default defineConfig({
  themeConfig: {
    socialLinks: {
      github: 'https://github.com/OpenSPG/openspg',
    },
    footer: false,
    // nav: {
    //   'zh-CN': [
    //     { title: '快速开始', link: '/Guide' },
    //     {
    //       title: '案例',
    //       link: '/example/enterprise-supply-chain/enterprise_supply_chain_introduce_quickstart',
    //     },
    //   ],
    //   'en-US': [
    //     { title: 'Quick Start', link: '/en-US/Guide' },
    //     {
    //       title: 'Case Study',
    //       link: '/en-US/example/enterprise-supply-chain/enterprise_supply_chain_introduce_quickstart',
    //     },
    //   ],
    // },
    // sidebar: {
    //   '/example': [
    //     {
    //       children: [
    //         {
    //           title: 'A',
    //           link: '/example/enterprise-supply-chain/enterprise_supply_chain_introduce_quickstart',
    //         },
    //         {
    //           title: 'B',
    //           link: '/example/medical/medical_introduce_quickstart',
    //         },
    //       ],
    //     },
    //   ],
    // },
  },
  favicons: [
    'https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*JiTDRaNWTQkAAAAAAAAAAAAADtmcAQ/original',
  ],
  analytics: {
    ga_v2: 'G-7XLKHE56WW',
  },
  metas: [
    {
      name: 'keywords',
      content:
        'knowledge graph, 知识图谱, 可编程知识图谱, SPG, Semantic-Enhanced Programming Graph',
    },
    {
      name: 'description',
      content: '语义增强可编程知识图谱SPG',
    },
  ],
  locales: [
    { id: 'zh-CN', name: '中文' },
    { id: 'en-US', name: 'English' },
  ],
  logo: 'https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*D5uYQpLS8dsAAAAAAAAAAAAADtmcAQ/original',
});
