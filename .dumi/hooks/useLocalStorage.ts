import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // 从 localStorage 获取初始值
  const storedValue = localStorage.getItem(key);
  const initial = storedValue ? JSON.parse(storedValue) : initialValue;

  // 设置 state
  const [value, setValue] = useState<T>(initial);

  // 当 state 值改变时，保存到 localStorage
  const setStoredValue = (newValue: T | ((val: T) => T)) => {
    const valueToStore =
      newValue instanceof Function ? newValue(value) : newValue;
    setValue(valueToStore);
    localStorage.setItem(key, JSON.stringify(valueToStore));
  };

  useEffect(() => {
    // 当其他页面更改了 localStorage，此事件会触发
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== e.oldValue) {
        setValue(e.newValue ? JSON.parse(e.newValue) : initialValue);
      }
    };

    // 监听 storage 事件
    window.addEventListener('storage', handleStorageChange);

    // 在组件卸载时移除事件监听器
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, initialValue]);

  return [value, setStoredValue] as const;
}
