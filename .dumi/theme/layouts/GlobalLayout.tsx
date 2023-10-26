import { ConfigProvider, Result, theme, Modal } from 'antd';
import { useOutlet, usePrefersColor } from 'dumi';
import React, { useEffect } from 'react';
import { isMobile } from 'react-device-detect';

const GlobalLayout: React.FC = () => {
  const outlet = useOutlet();
  const [color] = usePrefersColor();
  const [isBtnVisible, setIsBtnVisible] = React.useState(true);
  const isCompact = isMobile && isBtnVisible;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsBtnVisible(true);
          } else {
            setIsBtnVisible(false);
          }
        });
      },
      {
        threshold: 0.5,
      },
    );

    const element = document.getElementsByClassName(
      'dumi-default-header-menu-btn',
    )?.[0];
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  return (
    <ConfigProvider
      prefixCls="spg"
      theme={{
        algorithm:
          color === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <Modal open={false} footer={null} closeIcon={false}>
        <Result
          status="error"
          title={'不兼容的浏览器\nUnsupported browser!'}
          subTitle={
            <>
              <div>请更换浏览器访问</div>
              <div>Please change your browser</div>
            </>
          }
        />
      </Modal>
      {outlet}
    </ConfigProvider>
  );
};

export default GlobalLayout;
