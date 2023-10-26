/**
 * title: 语义增强可编程知识图谱
 */

import { Button, Descriptions, Tabs } from 'antd';
import { history, useLocale, usePrefersColor } from 'dumi';
import { useEffect } from 'react';
import styled from 'styled-components';
import AboutUs from '../components/AboutUs';
import CustomItem from '../components/CustomItem';
import SpgCaseItem from '../components/SpgCaseItem';
import { useIntl } from '../hooks/useIntl';

const Banner = styled.div`
  height: 400px;
  background-image: url('https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*ZgvDRofu-FsAAAAAAAAAAAAADtmcAQ/original');
  background-size: cover;
  background-repeat: no-repeat;
  background-position-x: center;
  background-position-y: center;
  user-select: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 120px;
  @media (max-width: 768px) {
    padding: 0px 60px;
  }
  @media (max-width: 480px) {
    padding: 0px 20px;
  }
`;

const Middle = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 768px) {
    padding: 0 40px;
  }

  @media (max-width: 480px) {
    padding: 0 20px;
  }
`;

const LeftTitleContainer = styled.div`
  max-width: 680px;
  margin-bottom: 20px;
`;

const BaseTitle = styled.div`
  font-size: 32px;
  font-weight: 600;
  color: var(--text-color);
  text-align: center;

  @media (max-width: 768px) {
    font-size: 24px;
  }

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const Title = styled(BaseTitle)`
  text-align: left;
  color: var(--color-dark);
`;

const BtnGroup = styled.div`
  display: flex;
  gap: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 50%;
  }

  @media (max-width: 480px) {
    width: 60%;
  }

  @media (max-width: 360px) {
    width: 100%;
  }
`;

const BaseInfo = styled.div`
  color: var(--text-color-light);
  font-size: 14px;
`;

const Info = styled(BaseInfo)``;

const SPG = styled.div`
  width: 100%;
  padding: 72px 120px;
  text-align: center;
  background-color: var(--background-color-pure);
  @media (max-width: 768px) {
    padding: 50px 40px;
  }
  @media (max-width: 480px) {
    padding: 30px 20px;
  }
`;

const SPGContent = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
`;

const SPGTitle = styled(BaseTitle)`
  margin-bottom: 37px;
`;

const SPGList = styled.div`
  display: grid;
  grid-gap: 45px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  width: 100%;
`;

const Point = styled.div`
  background-color: var(--background-color);
  padding: 40px 120px;
  text-align: center;
  @media (max-width: 768px) {
    padding: 40px 40px;
  }
  @media (max-width: 480px) {
    padding: 40px 20px;
  }
`;

const PointContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;

  img {
    background-color: var(--image-background-color);
    border-radius: 16px;
    min-height: 500px;
    max-height: 500px;
    width: 100%;
    height: 100%;
    object-fit: contain;

    @media (max-width: 768px) {
      min-height: 300px;
    }
    @media (max-width: 480px) {
      min-height: 200px;
    }
  }
`;

const PointTitle = styled(BaseTitle)`
  margin-bottom: 15px;
`;

const Framework = styled.div`
  text-align: center;
  padding: 38px 120px 72px;
  background-color: var(--background-color-pure);

  @media (max-width: 768px) {
    padding: 38px 40px 72px;
  }

  @media (max-width: 480px) {
    padding: 38px 20px 72px;
  }
`;

const FrameworkContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  img {
    border: 1px solid var(--border-color);
    border-radius: 16px;
    background-color: var(--image-background-color);
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const FrameworkTitle = styled(BaseTitle)`
  margin-bottom: 15px;
`;

const FrameworkInfo = styled(BaseInfo)`
  margin-bottom: 16px;
`;

const Case = styled.div<{ theme: string }>`
  text-align: center;
  padding: 56px 120px 36px;
  background-size: cover;

  ${(props) =>
    props.theme === 'light' &&
    `background: url(https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*-dj1SrmD6XQAAAAAAAAAAAAADtmcAQ/original) no-repeat;`}

  ${(props) =>
    props.theme === 'dark' && `background-color: var(--background-color);`}

  @media (max-width: 768px) {
    padding: 36px 40px 36px;
  }

  @media (max-width: 480px) {
    padding: 20px 20px 36px;
  }
`;

const CaseContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const CaseTitle = styled(BaseTitle)`
  margin-bottom: 40px;

  @media (max-width: 768px) {
    margin-bottom: 30px;
  }

  @media (max-width: 480px) {
    margin-bottom: 20px;
  }
`;

const Footer = styled.div`
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--background-color);
  background-image: url('https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*Rs5FTKaUgTIAAAAAAAAAAAAADtmcAQ/original');
  background-repeat: no-repeat;
  user-select: none;
`;

const Bottom = styled.div<{ theme: string }>`
  padding: 40px 120px;
  background-color: var(--background-color-invert);
  background-repeat: no-repeat;
  user-select: none;

  ${(props) =>
    props.theme === 'light' &&
    `background-image: url('https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*pv4jRp2PihQAAAAAAAAAAAAADtmcAQ/original');`}

  @media (max-width: 768px) {
    padding: 40px 40px;
  }

  @media (max-width: 480px) {
    padding: 40px 20px;
  }
`;

const BottomContent = styled.div`
  display: flex;
  @media (max-width: 768px) {
    flex-direction: column;
  }
  .spg-descriptions-title {
    color: var(--text-color-invert);
    font-size: 14px;
  }
  .spg-descriptions-item-content {
    color: var(--text-color-invert-light);
  }
`;

const MainPage = () => {
  const {
    Messages: {
      COPYRIGHT_INFORMATION_CONFIG,
      PARAGRAPH,
      SPG_CASE_CONFIG,
      SPG_POINT_CONFIG,
    },
  } = useIntl();
  const locale = useLocale();

  const [prefersColor] = usePrefersColor();
  console.log(locale);

  const push = (link: string) => {
    // @ts-ignore
    const base = locale.base;
    if (base === '/') history.push(`/${link}`);
    else history.push(`${base}/${link}`);
  };

  useEffect(() => {
    const main = document.querySelector('body .dumi-default-doc-layout > main');

    main &&
      main.setAttribute(
        'style',
        'margin-top: -76px; padding: 0; max-width: 100%;',
      );

    return () => {
      main &&
        main.setAttribute(
          'style',
          'margin-top: 0; padding: 0 24px; max-width: 1392px;',
        );
    };
  }, []);

  const handleDownload = () => {
    push('download');
  };

  return (
    <div className="home">
      <Banner>
        <Middle>
          <LeftTitleContainer>
            <Title>
              <div>语义增强可编程知识图谱SPG</div>
              <div>(Semantic-enhanced Programmable Graph)</div>
            </Title>
          </LeftTitleContainer>
          <BtnGroup>
            <Button size="large" type="primary" onClick={handleDownload}>
              {PARAGRAPH.WhitepaperDownload}
            </Button>
            <Button
              size="large"
              onClick={() => {
                push('quick-start');
              }}
            >
              {PARAGRAPH.QuickStart}
            </Button>
          </BtnGroup>
        </Middle>
      </Banner>

      <SPG>
        <SPGContent>
          <SPGTitle>{PARAGRAPH.whyChooseSPG}</SPGTitle>
          <SPGList>
            {SPG_POINT_CONFIG.map((item) => {
              return <CustomItem key={item.title} {...item} />;
            })}
          </SPGList>
        </SPGContent>
      </SPG>
      <Point>
        <PointContent>
          <PointTitle>{PARAGRAPH.SPGFeaturesSemanticExamples}</PointTitle>
          <Info>{PARAGRAPH.DeepSemanticNetworking}</Info>
          <Tabs
            defaultActiveKey="1"
            centered
            size="large"
            animated
            items={[
              {
                key: '1',
                label: PARAGRAPH.SemanticEnhancedProperties,
                children: (
                  <img
                    style={{ padding: 10 }}
                    src={PARAGRAPH.SemanticEnhancedPropertiesImg}
                  />
                ),
              },
              {
                key: '2',
                label: PARAGRAPH.DataToKnowledgeProcess,
                children: <img src={PARAGRAPH.DataToKnowledgeProcessImg} />,
              },
            ]}
          />
        </PointContent>
      </Point>
      <Framework>
        <FrameworkContent>
          <FrameworkTitle>{PARAGRAPH.SPGSemanticFramework}</FrameworkTitle>
          <FrameworkInfo>{PARAGRAPH.AccelerateDataIntegration}</FrameworkInfo>
          <img src={PARAGRAPH.AccelerateDataIntegrationImg} />
        </FrameworkContent>
      </Framework>
      <Case theme={prefersColor}>
        <CaseContent>
          <CaseTitle>{PARAGRAPH.SPGCaseStudies}</CaseTitle>
          {SPG_CASE_CONFIG.map((item, index) => {
            return (
              <SpgCaseItem
                key={item.title}
                reverse={index % 2 === 0}
                {...item}
              />
            );
          })}
        </CaseContent>
      </Case>
      <Footer>
        <Button size="large" type="primary" onClick={handleDownload}>
          {PARAGRAPH.WhitepaperDownload}
        </Button>
      </Footer>
      <Bottom theme={prefersColor}>
        <BottomContent>
          {COPYRIGHT_INFORMATION_CONFIG.map((item) => {
            return (
              <Descriptions
                title={item.title}
                key={item.title}
                style={item.style}
              >
                {item.unitNames.map((unit) => {
                  return (
                    <Descriptions.Item key={unit}>{unit}</Descriptions.Item>
                  );
                })}
              </Descriptions>
            );
          })}
        </BottomContent>
      </Bottom>
      <AboutUs />
    </div>
  );
};

export default MainPage;
