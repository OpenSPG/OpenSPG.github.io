import { ConfigProvider, Result, theme, Modal } from 'antd';
import { useOutlet, usePrefersColor } from 'dumi';
import React, { useState, useEffect } from 'react';
import { useIntl } from '../../hooks/useIntl';
import { PREFIX } from '../../constants/prefix';
import { isMobile as isMobileDevice } from 'react-device-detect';

// insert github and openKG in navbar
const createLink = (name: string, link: string, index: number) => {
  const nav = document.getElementsByClassName('dumi-default-navbar')?.[0];
  if (!nav) return;

  const xpath = `//*[text()='${name}']`;
  const element = document.evaluate(
    xpath,
    nav,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null,
  ).singleNodeValue;
  if (element) return;

  const li = document.createElement('li');
  const a = document.createElement('a');
  a.innerText = name;
  a.href = link;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  li.appendChild(a);
  nav.insertBefore(li, nav.childNodes[index]);

  return true;
};

const GlobalLayout: React.FC = () => {
  const { intl } = useIntl();
  const outlet = useOutlet();
  const createLinkIntervalRef = React.useRef<number>();
  const [color] = usePrefersColor();
  const [screenWidth, setScreenWidth] = useState(window.screen.availWidth);
  const [isBtnVisible, setIsBtnVisible] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const isMobileScreen = screenWidth < 900;
  const isMobile = isMobileDevice && isMobileScreen;

  useEffect(() => {
    createLinkIntervalRef.current = window.setInterval(() => {
      createLink('GitHub', 'https://github.com/OpenSPG/openspg', 1);
      const result = createLink('OpenKG', 'http://openkg.cn/', 5);
      if (result) clearInterval(createLinkIntervalRef.current);
    }, 50);
  }, []);

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
      { threshold: 0.5 },
    );

    const handleResize = () => {
      setScreenWidth(window.screen.availWidth);
    };

    const element = document.getElementsByClassName(
      'dumi-default-header-menu-btn',
    )?.[0];
    if (element) {
      setTimeout(() => {
        observer.observe(element);
      }, 1000);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      if (element) observer.unobserve(element);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (isMobile) setShowModal(!isBtnVisible);
  }, [isMobile, isBtnVisible]);

  return (
    <ConfigProvider
      prefixCls={PREFIX}
      theme={{
        algorithm:
          color === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
        components: {
          Button: {
            defaultBg: 'transparent',
          },
        },
      }}
    >
      <Modal
        open={showModal}
        footer={null}
        onCancel={() => setShowModal(false)}
      >
        <Result
          status="warning"
          title={intl('兼容性报告', 'Compatibility report')}
          subTitle={intl(
            '你的浏览器可能无法完整显示内容，请尝试更换浏览器访问。你仍可在关闭此窗口后继续访问，但可能会影响阅读体验。',
            'Your browser may not be able to display the full content. Please try to change your browser. You can still continue to access after closing this window, but it may affect the reading experience.',
          )}
        />
      </Modal>
      {outlet}
    </ConfigProvider>
  );
};

export default GlobalLayout;
