const timeStampFiled = 'timestamp';

export const getQuery = (
  fields: string[],
  timeRange: { from: string; to: string },
  filters: any[],
  queryString: any
) => {


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
    _source: {
      includes: fields,
    },
    query: {
      bool: {
        filter: [
          {
            bool: {
              must: [...filtersQuery, ...queryStringQuery],
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
  return query;
};
