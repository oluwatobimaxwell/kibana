import { getFields, getTableFilters } from '../utils/formatStringToApp';

const timeStampFiled = 'timestamp';

export type ColumnItem = {
  name: string;
  type: string;
  required: boolean;
};

export const getQuery = (
  markDown: any,
  timeRange: { from: string; to: string },
  filters: any[],
  queryString: any
) => {
  const fields = getFields(markDown);
  const tableFilters = getTableFilters(markDown);
  const fieldNames = fields.map((field) => field.name).filter(Boolean);
  const mustFields = fields
    .filter((field) => field.required)
    .map((field) => ({
      exists: {
        field: field.name,
      },
    }));
  const filtersQuery = filters.map(({ query }) => query);

  const queryStringQuery = queryString?.query
    ? [
        {
          query_string: {
            query: queryString?.query,
          },
        },
      ]
    : [];

  const query = {
    track_total_hits: true,
    _source: {
      includes: fieldNames,
    },
    query: {
      bool: {
        filter: [
          {
            bool: {
              must: [
                ...mustFields, 
                ...filtersQuery, 
                ...queryStringQuery, 
                ...tableFilters
              ],
            },
          },
          {
            range: {
              [timeStampFiled]: {
                gte: timeRange.from,
                lte: timeRange.to,
              },
            },
          },
        ],
      },
    },
  };
  return {
    query,
    fields,
  };
};
