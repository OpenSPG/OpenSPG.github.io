import { useIntl } from '../hooks/useIntl';
import { WechatOutlined } from '@ant-design/icons';
import { Typography, message } from 'antd';
import copy from 'copy-to-clipboard';
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const ImgContainer = styled.div`
  position: fixed;
  right: 20px;
  bottom: 20px;
  border-radius: 8px;
  transition: all 0.3s ease;
  overflow: hidden;
  z-index: 9;
  background-color: #fff;
  overflow: hidden;
  white-space: nowrap;
  background-color: var(--background-color);
  box-shadow:
    0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 9px 28px 8px rgba(0, 0, 0, 0.05);
`;

const Content = styled.div`
  padding: 10px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const Icon = styled(WechatOutlined)`
  width: 40px;
  height: 40px;
  position: fixed;
  right: 20px;
  bottom: 20px;
  cursor: pointer;
  color: #7bb32e;
  font-size: 40px;
  z-index: 10;
`;

const { Text } = Typography;

const AboutUs = () => {
  const [showQRCode, setShowQRCode] = React.useState(window.innerWidth >= 1280);
  const {
    Messages: { PARAGRAPH },
  } = useIntl();
  const QRCodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const attributes = showQRCode
      ? { width: '220px', padding: '10px', opacity: 1 }
      : { width: '100px', padding: 0, opacity: 0 };
    if (QRCodeRef.current) {
      Object.assign(QRCodeRef.current?.style || {}, attributes);
    }
  }, [showQRCode]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        QRCodeRef.current &&
        !QRCodeRef.current.contains(e.target as HTMLElement)
      ) {
        setShowQRCode(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <>
      <ImgContainer ref={QRCodeRef}>
        <div>
          <Text strong>{PARAGRAPH.ContactUs}</Text>
          <br />
          <Text
            onClick={() => {
              copy('feidongni.fdn@antgroup.com', {
                onCopy: () => {
                  message.success(PARAGRAPH.CopiedToClipboard);
                },
              });
            }}
          >
            feidongni.fdn@antgroup.com
          </Text>
          <br />
          <Text strong>{PARAGRAPH.FollowUs}</Text>
          <br />
          <Text>{PARAGRAPH.SPGFramework}</Text>
        </div>
        <Content>
          <img src="https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*FYxHT5WP0pUAAAAAAAAAAAAADtmcAQ/original" />
        </Content>
      </ImgContainer>
      {!showQRCode && (
        <Icon
          onClick={(e) => {
            e.stopPropagation();
            setShowQRCode(true);
          }}
        />
      )}
    </>
  );
};

export default AboutUs;
