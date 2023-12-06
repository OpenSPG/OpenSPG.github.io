import { useState, useEffect } from 'react';

const defaultTheme = 'dark';

export function useTheme() {
  const [theme, setTheme] = useState(
    document.documentElement.getAttribute('data-prefers-color') || defaultTheme,
  );

  useEffect(() => {
    const observer = new MutationObserver((mutationsList) => {
      for (let mutation of mutationsList) {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'data-prefers-color'
        ) {
          setTheme(
            (mutation.target as HTMLElement).getAttribute(
              'data-prefers-color',
            ) || defaultTheme,
          );
        }
      }
    });

    const config = {
      attributes: true,
      attributeFilter: ['data-prefers-color'],
    };
    observer.observe(document.documentElement, config);

    return () => observer.disconnect();
  }, []);

  return theme;
}
