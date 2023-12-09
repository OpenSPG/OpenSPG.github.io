/**
 * title: 语义增强可编程知识图谱
 */

import { Descriptions, Tabs, Typography } from 'antd';
import { usePrefersColor } from 'dumi';
import { useEffect } from 'react';
import styled from 'styled-components';
import Announcement from '../components/Announcement';
import BusinessApplicationItem from '../components/BusinessApplicationItem';
import ButtonGroup from '../components/ButtonGroup';
import Contact from '../components/Contact';
import CustomItem from '../components/CustomItem';
import GitHub from '../components/GitHub';
import { PREFIX } from '../constants/prefix';
import { useIntl } from '../hooks/useIntl';

const Container = styled.div`
  background: #0f151d;
`;

const Abbr = styled.span`
  color: rgba(67, 155, 255, 1);
`;

const FullTitle = styled.span``;

const SubTitle = styled(Typography.Text)`
  font-size: 1rem;
  opacity: 0.45;
  color: var(--text-color);
`;

const Banner = styled.div`
  position: relative;
  user-select: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 120px;

  @media (max-width: 768px) {
    padding: 0 40px;
  }

  @media (max-width: 480px) {
    padding: 0 20px;
  }
`;

const BaseTitle = styled.div`
  font-size: 32px;
  font-weight: 600;
  color: var(--text-color);
  text-align: center;
  margin: 60px 0 20px 0;

  @media (max-width: 768px) {
    font-size: 24px;
    margin: 40px 0 15px 0;
  }

  @media (max-width: 480px) {
    font-size: 20px;
    margin: 20px 0 10px 0;
  }
`;

const TechnicalFeatures = styled.div`
  position: relative;
  width: 100%;
  max-width: min(1200px, 90%);
  margin: auto;
  text-align: center;
`;

const TechnicalFeaturesContent = styled.div`
  width: 100%;
  margin: 0 auto;
`;

const TechnicalFeaturesTitle = styled(BaseTitle)``;

const TechnicalFeaturesList = styled.div`
  display: grid;
  grid-gap: 45px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  width: 100%;

  @media (max-width: 768px) {
    grid-gap: 30px;
  }

  @media (max-width: 480px) {
    grid-gap: 20px;
  }
`;

const BusinessApplications = styled.div`
  position: relative;
  max-width: min(1200px, 90%);
  margin: 0 auto;
`;

const BusinessApplicationsTitle = styled(BaseTitle)``;

/** 飞碟装饰 */
const UFODecorate = styled.div`
  position: relative;
  background-image: linear-gradient(
    113deg,
    rgba(255, 255, 255, 0.06) 0%,
    rgba(255, 255, 255, 0.04) 100%
  );
  border-radius: 16px;
  padding: 0 20px 20px 20px;

  &:after {
    position: absolute;
    top: -20px;
    right: -15px;
    z-index: 999;
    width: 86px;
    height: 63px;
    content: '';
    background: url('https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*vAHuSbAD7jQAAAAAAAAAAAAADtmcAQ/original')
      no-repeat;
    background-size: 100%;
  }
`;

const CooperationPartner = styled.div<{ theme: string }>`
  position: relative;
  max-width: min(1200px, 90%);
  margin: 0 auto;
  background-repeat: no-repeat;
  user-select: none;

  ${(props) =>
    props.theme === 'light' &&
    `background-image: url('https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*pv4jRp2PihQAAAAAAAAAAAAADtmcAQ/original');`}
`;

const CooperationPartnerTitle = styled(BaseTitle)`
  margin: 60px 0 0 0;
`;

const CooperationOrganization = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0;
`;

const CooperationPartnerContent = styled.div`
  display: flex;
  @media (max-width: 768px) {
    flex-direction: column;
  }
  .${PREFIX}-descriptions-title {
    color: var(--text-color-invert);
    font-size: 14px;
  }
  .${PREFIX}-descriptions-item-content {
    color: var(--text-color-invert-light);
  }
`;

const TopBackground = styled.div`
  background: url('https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*O-WRT6y0kVQAAAAAAAAAAAAADtmcAQ/original')
    no-repeat;
  background-size: cover;
  background-position: bottom;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

const MiddleBackground = styled.div`
  background: url('https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*5vvRRZY-PoQAAAAAAAAAAAAADtmcAQ/original')
    no-repeat;
  background-size: cover;
  background-position: top;
  height: 50%;
  width: 100%;
  position: absolute;
  top: 100%;
  left: 0;
  opacity: 0.2;
`;

const BottomBackground = styled.div`
  background: url('https://mdn.alipayobjects.com/huamei_xgb3qj/afts/img/A*umu0Q6JaXs8AAAAAAAAAAAAADtmcAQ/original')
    no-repeat;
  background-size: cover;
  background-position: center;
`;

const MainPage = () => {
  const {
    Messages: {
      TITLE,
      COOPERATION_PARTNER,
      PARAGRAPH,
      BUSINESS_APPLICATIONS,
      TECHNICAL_FEATURES,
      ORGANIZATION,
    },
  } = useIntl();

  const [prefersColor] = usePrefersColor();

  useEffect(() => {
    const main = document.querySelector('body .dumi-default-doc-layout > main');

    main && main.setAttribute('style', 'padding: 0; max-width: 100%;');

    return () => {
      main &&
        main.setAttribute(
          'style',
          'margin-top: 0; padding: 0 24px; max-width: 1392px;',
        );
    };
  }, []);

  return (
    <Container>
      <TopBackground />
      <MiddleBackground />
      <BottomBackground />

      <GitHub />

      <Banner>
        <Typography.Title level={2}>
          <Abbr>{TITLE.abbr}</Abbr>
          <span>·</span>
          <FullTitle>{TITLE.full}</FullTitle>
        </Typography.Title>
        <SubTitle>{TITLE.sub}</SubTitle>
      </Banner>

      <ButtonGroup />

      <Announcement />

      <TechnicalFeatures>
        <TechnicalFeaturesContent>
          <TechnicalFeaturesTitle>
            {PARAGRAPH.TechnicalFeatures}
          </TechnicalFeaturesTitle>
          <TechnicalFeaturesList>
            {TECHNICAL_FEATURES.map((item) => {
              return <CustomItem key={item.title} {...item} />;
            })}
          </TechnicalFeaturesList>
        </TechnicalFeaturesContent>
      </TechnicalFeatures>

      <BusinessApplications>
        <BusinessApplicationsTitle>
          {PARAGRAPH.BusinessApplications}
        </BusinessApplicationsTitle>

        <UFODecorate>
          <Tabs
            defaultActiveKey="1"
            centered
            size="large"
            animated
            items={BUSINESS_APPLICATIONS.map((item, index) => ({
              key: `${index}`,
              label: item.title,
              children: (
                <BusinessApplicationItem
                  key={item.title}
                  reverse={index % 2 === 0}
                  {...item}
                />
              ),
            }))}
          />
        </UFODecorate>
      </BusinessApplications>

      <BottomBackground>
        <CooperationPartner theme={prefersColor}>
          <CooperationPartnerTitle>
            {PARAGRAPH.CooperationPartner}
          </CooperationPartnerTitle>
          <CooperationOrganization>
            <Typography.Text>({ORGANIZATION.join(' × ')})</Typography.Text>
          </CooperationOrganization>
          <CooperationPartnerContent>
            {COOPERATION_PARTNER.map((item) => {
              return (
                <Descriptions key={item.title} style={item.style}>
                  {item.unitNames.map((unit) => {
                    return (
                      <Descriptions.Item key={unit}>{unit}</Descriptions.Item>
                    );
                  })}
                </Descriptions>
              );
            })}
          </CooperationPartnerContent>
        </CooperationPartner>

        <Contact />
      </BottomBackground>
    </Container>
  );
};

export default MainPage;
