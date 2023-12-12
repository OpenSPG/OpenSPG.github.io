/**
 * title: 白皮书
 * order: 4
 * nav:
 *  title: 下载白皮书
 *  order: 4
 */
import { LoadingOutlined } from '@ant-design/icons';
import { Alert, Button, Col, Row, Steps, Typography, message } from 'antd';
import { useSearchParams } from 'dumi';
import { useEffect, useMemo, useRef, useState } from 'react';
import { instantiate } from '../components/release';
import { useLocale } from 'dumi';
import { useLocalStorage } from '../hooks/useLocalStorage';

const { Title } = Typography;

const AllowKey = '__Allow_Download_SPG__';
const TimeStampKey = '__Allow_Download_SPG_TimeStamp__';
const TokenKey = 'token';
const expireTime = 1000 * 60 * 60 * 24;

type ValidateFn = (value: string) => [string, string];

function Download() {
  const { id: locale } = useLocale();
  const intl = (zh: string, en: string) => (locale === 'zh-CN' ? zh : en);
  const [searchParams] = useSearchParams();
  const [url, setUrl] = useState<[string, string] | []>([]);
  const validateRef = useRef<ValidateFn>();
  const [moduleLoaded, setModuleLoaded] = useState(false);
  const tokenFromUrl = searchParams.get(TokenKey) || '';
  const [showBackup, setShowBackup] = useState(false);
  const [waitingForResult, setWaitingForResult] = useState(false);
  const [downloadImmediately, setDownloadImmediately] = useState(false);
  const [allow, setAllow] = useLocalStorage(AllowKey, false);
  const [timeStamp, setTimeStamp] = useLocalStorage(TimeStampKey, 0);
  const [token, setToken] = useLocalStorage(TokenKey, '');
  const [currentStep, setCurrentStep] = useState(0);

  const isExpired = useMemo(() => {
    const now = new Date().getTime();
    return now - timeStamp > expireTime;
  }, [timeStamp]);
  const ableToDownload = !isExpired && allow && url.length;

  useEffect(() => {
    fetch('/release.wasm')
      .then((response) => response.arrayBuffer())
      .then((bytes) => instantiate(bytes))
      .then(({ validate }) => {
        validateRef.current = (...args) => {
          return validate(...args)
            .split('\n')
            .filter(Boolean);
        };
        setModuleLoaded(true);
      });
  }, []);

  useEffect(() => {
    if (!moduleLoaded || !validateRef.current) return;
    const result = validateRef.current(tokenFromUrl);
    if (result.length) {
      setUrl(result);
      setAllow(true);
      setToken(tokenFromUrl);
      setTimeStamp(new Date().getTime());

      const host = 'openspg.openfinai.org';
      if (location.host !== host) {
        window.location.href = window.location.href.replace(
          window.location.host,
          host,
        );
      }
      window.close();
    }
  }, [moduleLoaded, tokenFromUrl]);

  useEffect(() => {
    if (!token || !moduleLoaded || !validateRef.current) return;
    const result = validateRef.current(token);
    if (result.length) {
      setUrl(result);
      setAllow(true);
    }
  }, [moduleLoaded, token]);

  useEffect(() => {
    if (ableToDownload) {
      setWaitingForResult(false);
      setCurrentStep(1);
      downloadImmediately &&
        setTimeout(() => {
          download();
        }, 1000);
    }
  }, [ableToDownload, downloadImmediately]);

  const goToQuestionnaire = (isBackup?: boolean) => {
    setWaitingForResult(true);
    setDownloadImmediately(true);
    setCurrentStep(1);
    window.open(
      !isBackup
        ? intl(
            'https://survey.alipay.com/apps/zhiliao/K7MilJd4E',
            'https://survey.alipay.com/apps/zhiliao/n33nRj5OV',
          )
        : intl(
            'https://survey.aliyun.com/apps/zhiliao/wUwnL6sPC',
            'https://survey.aliyun.com/apps/zhiliao/u7K_sLhva',
          ),
    );

    setTimeout(() => {
      setShowBackup(true);
    }, 5000);
  };

  const download = () => {
    if (!url.length) {
      message.error(
        intl(
          '下载链接获取失败，请稍后再试',
          'Download link acquisition failed, please try again later',
        ),
      );
      return;
    }
    const a = document.createElement('a');
    a.href = intl(...url);
    a.target = '_blank';
    a.download = intl(
      '《语义增强可编程知识图谱SPG》白皮书 v1.0.pdf',
      'Semantic-enhanced Programmable Knowledge Graph (SPG)  White Paper.pdf',
    );
    a.click();
  };

  return (
    <div>
      <Title level={3}>
        {intl(
          '填写完成后方可下载白皮书',
          'The whitepaper can be downloaded after completing the questionnaire',
        )}
      </Title>
      <Alert
        type="warning"
        message={intl(
          '下载的白皮书语言版本取决于当前的语言设置',
          'The language of the white paper being downloaded depends on the current language settings',
        )}
        style={{ marginBottom: 20 }}
      />
      <Steps
        current={currentStep}
        direction="vertical"
        items={[
          {
            title: (
              <Row gutter={10}>
                <Col>{intl('问卷调查', 'Questionnaire Survey')}</Col>
                {!ableToDownload && (
                  <Col>
                    <Button
                      size="small"
                      type="primary"
                      onClick={() => goToQuestionnaire()}
                    >
                      {intl('前往填写', 'Go to Fill')}
                    </Button>
                  </Col>
                )}
                {!ableToDownload && showBackup && (
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
