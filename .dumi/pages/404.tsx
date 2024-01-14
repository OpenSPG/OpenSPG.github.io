import { useEffect } from 'react';

export default () => {
  useEffect(() => {
    location.href = location.origin;
  }, []);

  return <></>;
};
