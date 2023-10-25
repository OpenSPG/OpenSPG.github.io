/**
 * title: 白皮书
 * order: 4
 * nav:
 *  title: 下载白皮书
 *  order: 4
 */
import { LoadingOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Col, Row, Steps, Tooltip, Typography } from 'antd';
import { useSearchParams } from 'dumi';
import { useEffect, useMemo, useState } from 'react';
import { useIntl } from '../hooks/useIntl';
import { useLocalStorage } from '../hooks/useLocalStorage';

const { Title } = Typography;

const AllowKey = '__Allow_Download_SPG__';
const TimeStampKey = '__Allow_Download_SPG_TimeStamp__';
const TokenKey = 'token';

const expireTime = 1000 * 60 * 60 * 24;

function Download() {
  const token = '0a735e9a-72ea-11ee-b962-0242ac120002';
  const { intl } = useIntl();
  const [searchParams] = useSearchParams();
  const tokenFromUrl = searchParams.get(TokenKey);
  const [showBackup, setShowBackup] = useState(false);
  const [waitingForResult, setWaitingForResult] = useState(false);
  const [downloadImmediately, setDownloadImmediately] = useState(false); // 是否立即下载
  const [allow, setAllow] = useLocalStorage(AllowKey, false);
  const [timeStamp, setTimeStamp] = useLocalStorage(TimeStampKey, 0);
  const [currentStep, setCurrentStep] = useState(0);

  const isExpired = useMemo(() => {
    const now = new Date().getTime();
    return now - timeStamp > expireTime;
  }, [timeStamp]);

  useEffect(() => {
    if (tokenFromUrl === token) {
      setAllow(true);
      setTimeStamp(new Date().getTime());
      window.close();
    }
  }, [tokenFromUrl]);

  useEffect(() => {
    if (!isExpired && allow) {
      setWaitingForResult(false);
      setCurrentStep(1);
      downloadImmediately &&
        setTimeout(() => {
          download();
        }, 1000);
    }
  }, [allow, timeStamp]);

  const goToQuestionnaire = (isBackup?: boolean) => {
    setWaitingForResult(true);
    setDownloadImmediately(true);
    setCurrentStep(1);
    window.open(
      isBackup
        ? 'https://survey.alipay.com/apps/zhiliao/K7MilJd4E'
        : 'https://survey.aliyun.com/apps/zhiliao/wUwnL6sPC',
    );

    setTimeout(() => {
      setShowBackup(true);
    }, 5000);
  };

  const download = () => {
    const url =
      'https://mdn.alipayobjects.com/huamei_xgb3qj/afts/file/A*SgrORp9OJAMAAAAAAAAAAAAADtmcAQ/%E3%80%8A%E8%AF%AD%E4%B9%89%E5%A2%9E%E5%BC%BA%E5%8F%AF%E7%BC%96%E7%A8%8B%E7%9F%A5%E8%AF%86%E5%9B%BE%E8%B0%B1SPG%E3%80%8B%E7%99%BD%E7%9A%AE%E4%B9%A6%20v1.0.pdf';
    window.open(url);
  };

  return (
    <div>
      <Title level={3}>填写完成后方可下载白皮书</Title>
      <Steps
        current={currentStep}
        direction="vertical"
        items={[
          {
            title: (
              <Row gutter={10}>
                <Col>{intl('问卷调查', 'Questionnaire Survey')}</Col>
                {
                  <Col>
                    <Button
                      size="small"
                      type="primary"
                      onClick={() => goToQuestionnaire()}
                    >
                      {intl('前往填写', 'Go to Fill')}
                    </Button>
                  </Col>
                }
                {showBackup && (
                  <Col>
                    <Button
                      size="small"
                      onClick={() => goToQuestionnaire(true)}
                    >
                      {intl('备用渠道', 'Backup Channel')}
                    </Button>
                  </Col>
                )}
              </Row>
            ),
          },
          {
            title: allow ? (
              <Row gutter={10}>
                <Col>
                  {downloadImmediately
                    ? intl('下载即将开始', 'Download will start soon')
                    : intl('点击开始下载', 'Click to download')}
                </Col>
                <Col>
                  <Button type="primary" size="small" onClick={download}>
                    {downloadImmediately
                      ? intl('再次下载', 'Download again')
                      : intl('下载', 'Download')}
                  </Button>
                </Col>
              </Row>
            ) : (
              <Col>
                {intl(
                  '等待问卷填写完成',
                  'Waiting for the questionnaire to be completed',
                )}
              </Col>
            ),
            icon: waitingForResult ? <LoadingOutlined /> : null,
          },
        ]}
      />
    </div>
  );
}

Download.hide = true;

export default Download;
