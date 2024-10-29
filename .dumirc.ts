import { defineConfig } from 'dumi';

const ProductionConfig = {
  headScripts: [
    'https://gw.alipayobjects.com/os/lib/react/18.2.0/umd/react.production.min.js',
    'https://gw.alipayobjects.com/os/lib/react-dom/18.2.0/umd/react-dom.production.min.js'
  ],
  externals: {
    react: "React",
    reactDom: "ReactDOM",
  }
}

export default defineConfig({
  themeConfig: {
    prefersColor: {
      default: 'dark',
      switch: false,
    },
    socialLinks: {
      github: 'https://github.com/OpenSPG/openspg',
    },
    footer: false,
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
  logo: 'https://mdn.alipayobjects.com/huamei_ukv101/afts/img/z4srRIWNIzoAAAAAAAAAAAAADisxAQFr/original',
  ...(process.env.NODE_ENV === 'production' ? ProductionConfig : {}),
});
