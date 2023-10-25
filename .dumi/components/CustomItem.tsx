import styled from 'styled-components';
import { Typography } from 'antd';

const { Title, Text } = Typography;

type Props = {
  title: string;
  detail: string;
  imgUrl: string;
};

const Card = styled.div`
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--background-color);
`;

const Cover = styled.div`
  height: 224px;
  display: flex;
  padding: 20px;
  justify-content: center;
  align-items: center;
  border-radius: 8px 8px 0 0;
  background-color: var(--image-background-color);
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: var(--image-background-color);
`;

const Content = styled.div`
  padding: 24px;
  text-align: center;
  background-color: var(--background-color);
`;

const CustomItem = (props: Props) => {
  const { title, detail, imgUrl } = props;
  return (
    <Card>
      <Cover>
        <Img src={imgUrl} />
      </Cover>
      <Content>
        <Title level={3}>{title}</Title>
        <Text type="secondary">{detail}</Text>
      </Content>
    </Card>
  );
};

export default CustomItem;
