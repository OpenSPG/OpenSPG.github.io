import React from 'react';
import { useOutlet, usePrefersColor } from 'dumi';
import { ConfigProvider, theme } from 'antd';

const GlobalLayout: React.FC = () => {
  const outlet = useOutlet();
  const [color] = usePrefersColor();

  return (
    <ConfigProvider
      prefixCls="spg"
      theme={{
        algorithm:
          color === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      {outlet}
    </ConfigProvider>
  );
};

export default GlobalLayout;
