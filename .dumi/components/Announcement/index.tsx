import React from 'react';
import styled from 'styled-components';
import { useIntl } from '../../hooks/useIntl';
import HoverCard from './HoverCard';
import { Flex, Typography } from 'antd';

const { Text } = Typography;

const FlexContainer = styled(Flex)`
  display: flex;
  flex-wrap: wrap;
  max-width: min(1200px, 90%);
  gap: 24px;
  margin: 0 auto;

  @media (max-width: 900px), (max-width: 480px) {
    gap: 16px;
    flex-direction: column;
  }
`;

const HoverCardContainer = styled(HoverCard)`
  height: 100%;
  border: none;
  background-image: linear-gradient(
    106deg,
    rgba(255, 255, 255, 0.12) 0%,
    rgba(255, 255, 255, 0.1) 100%
  );
  border-radius: 16px;

  .openagl-card-body {
    height: 100%;

    @media (max-width: 900px) {
      padding: 16px;
    }

    @media (max-width: 480px) {
      padding: 12px;
    }
  }
`;

const Title = styled(Flex)`
  overflow: hidden;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: 0.95;
  font-weight: 500;
`;

const Description = styled(Text)`
  display: inline-block;
  width: 100%;
  font-size: 14px;
  font-weight: 400;
  opacity: 0.45;
  margin-top: 9px;
  text-align: center;
`;

const Announcement = React.memo(() => {
  const {
    Messages: { ANNOUNCEMENT },
  } = useIntl();

  const handleOpenLink = (linkUrl?: string) => {
    if (!linkUrl) return;
    window.open(linkUrl, '_blank', 'noopener=yes,noreferrer=yes');
  };

  if (ANNOUNCEMENT.length === 0) {
    return <div style={{ padding: 20 }} />;
  }

  return (
    <FlexContainer justify="space-between">
      {ANNOUNCEMENT.map(({ cover, title, description, link }) => (
        <HoverCardContainer key={title} onClick={() => handleOpenLink(link)}>
          <Title>
            <img src={cover} />
            <span>{title}</span>
          </Title>
          <Description>{description}</Description>
        </HoverCardContainer>
      ))}
    </FlexContainer>
  );
});

export default Announcement;
