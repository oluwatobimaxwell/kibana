import { SearchDocumentsResponse, searchElastic } from './apiClients';
import { HttpSetup } from 'kibana/public';
import { useQuery, UseQueryOptions } from 'react-query';

export const useSearchDocuments = (
  http: HttpSetup,
  params: {
    query: any;
    start: number;
    size: number;
    indexName?: string;
  },
  options?: Omit<UseQueryOptions<SearchDocumentsResponse, any>, 'queryKey' | 'queryFn'>
) =>
  useQuery<SearchDocumentsResponse, any>(
    ['search-documents', params],
    () => searchElastic(http, params) as any,
    options as any
  );
