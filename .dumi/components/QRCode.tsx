import React from 'react';
import styled from 'styled-components';

const Flex = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Container = styled(Flex)`
  flex-direction: column;
  row-gap: 12px;
  width: 180px;
  height: 180px;
  background-image: linear-gradient(142deg, #20262e 2%, #0f141c 99%);
  box-shadow:
    0 2px 2px 0 #3e495f,
    inset 0 2px 3px 0 rgba(0, 0, 0, 0.4);
  border-radius: 8px;

  @media (max-width: 900px), (max-width: 480px) {
    width: 140px;
    height: 140px;
  }

  @media (max-width: 600px) {
    align-self: center;
  }
`;

const ImgContainer = styled(Flex)`
  width: 120px;
  height: 120px;
  font-size: 16px;
  border-radius: 8px;
  padding: 10px;
  background-color: var(--text-color);

  @media (max-width: 900px), (max-width: 480px) {
    width: 80px;
    height: 80px;
    row-gap: 2px;
    padding: 8px;
  }
`;

const Text = styled(Flex)`
  color: var(--text-color);
  font-weight: 400;
  font-size: 12px;
  opacity: 0.45;
  text-align: center;
`;

interface QRCodeProps {
  url: string;
  title: string;
}
const QRCode = React.memo<QRCodeProps>(({ url, title }) => (
  <Container>
    <ImgContainer>
      <img style={{ width: '100%', height: '100%' }} src={url} alt={title} />
    </ImgContainer>
    <Text>{title}</Text>
  </Container>
));

export default QRCode;
