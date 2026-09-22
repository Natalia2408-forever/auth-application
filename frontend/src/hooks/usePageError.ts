import { useEffect, useState } from 'react';

export const usePageError = (
  initialError = '',
): [string, (value: string) => void] => {
  const [error, setError] = useState(initialError);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timerId = setTimeout(() => {
      setError('');
    }, 1600);

    return () => {
      clearTimeout(timerId);
    };
  }, [error]);

  return [error, setError];
};
