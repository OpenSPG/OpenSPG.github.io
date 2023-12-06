import {
  FileTextOutlined,
  GithubOutlined,
  CloudDownloadOutlined,
} from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { useIntl } from '../../hooks/useIntl';
import { usePush } from '../../hooks/usePush';

const Container = styled.div`
  max-width: min(1200px, 90%);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin: 40px auto;

  @media (max-width: 768px) {
    margin: 30px auto;
    gap: 15px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    margin: 20px auto;
    gap: 10px;
  }
`;

const CommonButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 140px;
  height: 46px;
  color: var(--text-color);
  font-size: 1rem;

  @media (max-width: 480px) {
    width: 100%;
    height: 40px;
  }
`;

const PanelButton = React.memo(() => {
  const {
    intl,
    Messages: {
      BUTTON_GROUP: { Github, Documentation, WhitePaper },
    },
  } = useIntl();
  const push = usePush();

  return (
    <Container>
      {Github && (
        <CommonButton
          icon={<GithubOutlined />}
          type="primary"
          onClick={() => window.open(Github)}
        >
          GitHub
        </CommonButton>
      )}
      {Documentation && (
        <CommonButton
          icon={<FileTextOutlined />}
          onClick={() => push(Documentation)}
        >
          {intl('帮助文档', 'Document')}
        </CommonButton>
      )}
      {WhitePaper && (
        <CommonButton
          icon={<CloudDownloadOutlined />}
          onClick={() => push(WhitePaper)}
        >
          {intl('白皮书', 'WhitePaper')}
        </CommonButton>
      )}
    </Container>
  );
});

export default PanelButton;
