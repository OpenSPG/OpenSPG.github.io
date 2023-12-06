import { GithubOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import styled from 'styled-components';
import { useIntl } from '../hooks/useIntl';
import QRCodeComponent from './QRCode';

const { Title, Link } = Typography;

const ItemTitle = styled(Title).attrs({
  level: 5,
})`
  margin-top: 0;
`;

const ItemLink = styled(Link).attrs({
  type: 'secondary',
  target: '_blank',
})``;

const ContactContainer = styled.div`
  position: relative;
  max-width: min(1200px, 90%);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;
  gap: 10px;
  margin: 0 auto;
  padding: 30px 0;

  @media (max-width: 480px) {
    gap: 20px;
    flex-direction: column;
    align-items: start;
  }
`;

const GitHubContent = styled.div``;

const CommunityContent = styled.div``;

const EmailContent = styled.div``;

const Contact = () => {
  const {
    Messages: {
      CONTACT: { Github, Community, Email, QRCode },
    },
  } = useIntl();

  return (
    <ContactContainer>
      {Github.url && (
        <GitHubContent>
          <ItemTitle>{Github.title}</ItemTitle>
          <ItemLink href={Github.url}>
            <GithubOutlined /> {Github.name}
          </ItemLink>
        </GitHubContent>
      )}
      {Community.url && (
        <CommunityContent>
          <ItemTitle>{Community.title}</ItemTitle>
          <ItemLink href={Community.url}>{Community.name}</ItemLink>
        </CommunityContent>
      )}
      {Email.email && (
        <EmailContent>
          <ItemTitle>{Email.title}</ItemTitle>
          <div>
            <ItemLink href={`mailto:${Email.email}`}>
              {Email.name}: {Email.email}
            </ItemLink>
          </div>
        </EmailContent>
      )}
      {QRCode.url && <QRCodeComponent title={QRCode.title} url={QRCode.url} />}
    </ContactContainer>
  );
};

export default Contact;
