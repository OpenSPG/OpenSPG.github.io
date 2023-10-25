import styled from 'styled-components';

const Container = styled.div`
  margin-bottom: 45px;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
`;

const Desc = styled.div`
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
  margin-bottom: 24px;
`;

const ContentContainer = styled.div`
  display: grid;
  grid-template: repeat(1, 1fr) / repeat(2, 1fr);
  gap: 15px;

  @media (max-width: 814px) {
    grid-template: repeat(1, 1fr) / repeat(1, 1fr);
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  gap: 15px;

  @media (max-width: 1280px) {
  }
  @media (max-width: 768px) {
  }
`;

const ItemBackground = styled.div`
  background-color: rgba(255, 255, 255, 0.5);
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
  color: #1a1b25;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const Circle = styled.div`
  margin: 0.3rem 0;
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 0.4rem;
  border: 0.15rem solid #2f54eb;
  flex-shrink: 0;
`;

const ItemList = styled.div`
  position: relative;
`;

const Item = styled.div`
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
`;

const ImgContainer = styled.div`
  border-radius: 16px;
  img {
    border: 1px solid rgba(47, 84, 235, 0.2);
    border-radius: 16px;
    background-color: #fff;
    padding: 20px;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

export type CaseItemProps = {
  title: string;
  desc: string;
  details: {
    point: string;
    infoList: string[];
  }[];
  imgUrl: string;
  reverse?: boolean;
};

const SpgCaseItem = (props: CaseItemProps) => {
  const { title, desc, details, imgUrl, reverse } = props;
  return (
    <Container>
      <Title>{title}</Title>
      <Desc>{desc}</Desc>
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
        <ImgContainer style={{ order: reverse ? -1 : 0 }}>
          <img src={imgUrl} alt="" />
        </ImgContainer>
      </ContentContainer>
    </Container>
  );
};

export default SpgCaseItem;
