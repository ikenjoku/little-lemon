import { useRef, useEffect } from 'react';

export function getSectionListData(data) {
  const uniqueCategories = [
    ...new Set(data.map((item) => item.category)),
  ];
  return uniqueCategories.map((category) => {
    return {
      title: category,
      data: data.filter((item) => item.category === category),
    };
  });
}

export function useUpdateEffect(effect, dependencies = []) {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      return effect();
    }
  }, dependencies);
}
