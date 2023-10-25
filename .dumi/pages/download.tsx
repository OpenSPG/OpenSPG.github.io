import { useEffect, useRef } from 'react';

function Download() {
  const url =
    'https://mdn.alipayobjects.com/huamei_xgb3qj/afts/file/A*SgrORp9OJAMAAAAAAAAAAAAADtmcAQ/%E3%80%8A%E8%AF%AD%E4%B9%89%E5%A2%9E%E5%BC%BA%E5%8F%AF%E7%BC%96%E7%A8%8B%E7%9F%A5%E8%AF%86%E5%9B%BE%E8%B0%B1SPG%E3%80%8B%E7%99%BD%E7%9A%AE%E4%B9%A6%20v1.0.pdf';

  const aRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (aRef.current) {
      aRef.current.click();
    }
  }, []);

  return <a ref={aRef} href={url} download={url}></a>;
}

Download.hide = true;

export default Download;
