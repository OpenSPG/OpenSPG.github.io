import styled from 'styled-components';
import { Space, Typography } from 'antd';

const { Title, Text } = Typography;

const Container = styled.div``;

const ContentContainer = styled.div`
  display: grid;
  grid-template: repeat(1, 1fr) / repeat(2, 1fr);
  gap: 15px;

  @media (max-width: 900px) {
    grid-template: repeat(1, 1fr) / repeat(1, 1fr);
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  gap: 15px;
`;

const ItemBackground = styled.div`
  border-radius: 15px;
`;

const ItemContainer = styled.div`
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: left;
`;

const Point = styled.div`
  width: 100%;
  display: flex;
  gap: 5px;
  color: var(--text-color-light);
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const Circle = styled.div`
  margin: 0.3rem 0;
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 0.4rem;
  border: 0.15rem solid var(--color-circle);
  flex-shrink: 0;
`;

const ItemList = styled.div`
  position: relative;
`;

const Item = styled.div`
  font-size: 14px;
  color: var(--text-color);
`;

const ImgContainer = styled.div`
  border-radius: 16px;
  img {
    border: 1px solid var(--border-color);
    border-radius: 16px;
    background-color: var(--image-background-color);
    padding: 20px;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

export type BusinessApplicationItemProps = {
  title: string;
  desc: string;
  details: {
    point: string;
    infoList: string[];
  }[];
  imgUrl: string;
  reverse?: boolean;
};

const BusinessApplicationItem = (props: BusinessApplicationItemProps) => {
  const { desc, details, imgUrl, reverse } = props;
  return (
    <Container>
      <Space direction="vertical" align="center">
        <Text type="secondary">{desc}</Text>
        <ContentContainer>
          <Content>
            {details.map((item) => {
              return (
                <ItemBackground key={item.point}>
                  <ItemContainer>
                    <Point>
                      <Circle />
                      {item.point}
                    </Point>
                    <ItemList>
                      {item.infoList.map((info) => {
                        return <Item key={info}>• {info}</Item>;
                      })}
                    </ItemList>
                  </ItemContainer>
                </ItemBackground>
              );
            })}
          </Content>
          <ImgContainer style={{ order: -1 }}>
            <img src={imgUrl} alt="" />
          </ImgContainer>
        </ContentContainer>
      </Space>
    </Container>
  );
};

export default BusinessApplicationItem;
