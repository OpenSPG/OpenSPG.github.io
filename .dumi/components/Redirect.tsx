import { Spin } from 'antd';
import { useLocale } from 'dumi';
import { useEffect } from 'react';

export const Redirect = ({ url, target, text }: { url: string; target?: string; text?: string; }) => {
  const { id: lang } = useLocale();
  const loading = target !== '_blank';

  useEffect(() => {
    if (target === '_blank') {
      window.open(url);
    }
    else window.location.replace(url);
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 15 }}>
      <Spin spinning={loading} />
      {text ? text : lang === 'zh-CN' ? '跳转中...' : 'Redirecting...'}
    </div>
  );
};
