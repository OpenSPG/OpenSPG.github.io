import React from 'react';
import styled from 'styled-components';
import { GithubOutlined, ForkOutlined, StarOutlined } from '@ant-design/icons';
import { Flex } from 'antd';
import { useGithubRepoStats } from '../hooks/useGitHubRepoStats';
import { useIntl } from '../hooks/useIntl';

const Container = styled(Flex).attrs({ justify: 'end' })`
  position: relative;
  width: min(1200px, 90%);
  padding: 10px 0;
  margin: 0 auto;
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  justify-items: center;
  width: 196px;
  height: 55px;
  gap: 5px;
  padding: 5px;
  border-radius: 8px;
  background-image: linear-gradient(
    105deg,
    rgba(255, 255, 255, 0.06) 0%,
    rgba(255, 255, 255, 0.04) 100%
  );

  @media (max-width: 900px), (max-width: 480px) {
    width: 150px;
    height: 45px;
  }
`;

const Item = styled(Flex)``;

const Text = styled.span`
  margin-left: 4px;
  color: var(--text-color);
`;

const GitHub = React.memo(() => {
  const {
    Messages: { REPO },
  } = useIntl();

  const url = REPO;
  const parts = url.split('/');
  const groupName = parts[3];
  const repoName = parts[4];
  const { stars, forks } = useGithubRepoStats(groupName, repoName);

  const handleOpenLink = () => {
    if (!url) return;
    window.open(url, '_blank', 'noopener=yes,noreferrer=yes');
  };

  return (
    <Container>
      <Content>
        <Item>
          <GithubOutlined onClick={handleOpenLink} />
        </Item>
        <Item>
          <ForkOutlined />
          <Text>{forks ?? 0}</Text>
        </Item>
        <Item>
          <StarOutlined />
          <Text>{stars ?? 0}</Text>
        </Item>
      </Content>
    </Container>
  );
});

export default GitHub;
