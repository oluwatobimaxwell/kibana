import { useCallback, useEffect, useState } from 'react';
import { getQuery } from './get_query';

export const useGlobalData = (container: any, tableFields: any) => {
  const kbn = document.body as HTMLElement;
  const [timeRange, setTimeRange] = useState<any>({});
  const [filters, setFilters] = useState<any>([]);
  const [query, setQuery] = useState<any>({});

  const getGlobalQuery = useCallback(() => {
    const { query, timeRange, filters } = container?.input as any;
    setTimeRange(timeRange);
    setFilters(filters);
    setQuery(query);
  }, [container]);

  const trackClickEvent = useCallback(
    () =>
      setTimeout(() => {
        getGlobalQuery();
      }, 1000),
    [getGlobalQuery]
  );

  useEffect(() => {
    kbn.addEventListener('click', trackClickEvent);
    kbn.addEventListener('keydown', trackClickEvent);
    kbn.click();
    return () => {
      kbn.removeEventListener('click', trackClickEvent);
      kbn.removeEventListener('keydown', trackClickEvent);
    };
  }, [kbn, trackClickEvent]);

  const tableColumns = tableFields.map((field: any) => field.name).filter(Boolean);
  return { query: getQuery(tableColumns, timeRange, filters, query) };
};
