import { HttpSetup } from 'kibana/public';

export const getSettings = async (http: HttpSetup): Promise<any> => {
  return await http.get('/api/cst_theme_service/settings');
};

export type SearchDocumentsResponse = {
  total: number;
  data: any[];
};

export const searchElastic = async (
  http: HttpSetup,
  params: {
    query: any;
    start: number;
    size: number;
    indexName?: string;
  }
): Promise<SearchDocumentsResponse> => {
  return await http.post(
    "/api/cst_search_service/search_documents",
    {
      body: JSON.stringify(params),
    }
  );
};
