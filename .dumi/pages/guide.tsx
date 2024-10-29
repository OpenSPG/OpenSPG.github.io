/**
 * title: 用户手册
 * nav:
 *  order: 2
 */
import { Redirect } from '../components/Redirect';
import { Button, Typography, Flex } from 'antd';
import { useLocale } from 'dumi';

const { Title } = Typography;

export default () => {
  const { id: locale } = useLocale();
  const intl = (zh: string, en: string) => (locale === 'zh-CN' ? zh : en);

  return <div>
    <Title level={4}>{intl('版本', 'Version')}</Title>
    <Redirect url={intl('https://openspg.yuque.com/ndx6g9/0.5', 'https://openspg.yuque.com/ndx6g9/wc9oyq')} target='_blank' text=" " />
    <Flex vertical align={'flex-start'}>
      <Button type="link" target="_blank" href={intl('https://openspg.yuque.com/ndx6g9/ooil9x', 'https://openspg.yuque.com/ndx6g9/ns5nw2')}>0.0.2</Button>
      <Button type="link" target="_blank" href={intl('https://openspg.yuque.com/ndx6g9/nmwkzz', 'https://openspg.yuque.com/ndx6g9/wc9oyq')}>0.0.3</Button>
      <Button type="link" target="_blank" href={intl('https://openspg.yuque.com/ndx6g9/0.5', 'https://openspg.yuque.com/ndx6g9/wc9oyq')}>0.5</Button>
    </Flex>
  </div>;
};
