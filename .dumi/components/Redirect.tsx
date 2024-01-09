import { Spin } from 'antd';
import { useLocale } from 'dumi';
import { useEffect } from 'react';

export const Redirect = ({ url }: { url: string }) => {
  const { id: lang } = useLocale();

  useEffect(() => {
    window.location.replace(url);
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 15 }}>
      <Spin />
      {lang === 'zh-CN' ? '跳转中...' : 'Redirecting...'}
    </div>
  );
};
