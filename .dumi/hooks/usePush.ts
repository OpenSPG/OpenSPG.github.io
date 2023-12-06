import { history, useLocale } from 'dumi';

export const usePush = () => {
  const locale = useLocale();

  return (link: string) => {
    // @ts-ignore
    const base = locale.base;
    if (base === '/') history.push(`/${link}`);
    else history.push(`${base}/${link}`);
  };
};
