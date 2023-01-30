const timeStampFiled = 'timestamp';

export const getQuery = (
  fields: string[],
  timeRange: { from: string; to: string },
  filters: any[],
  queryString: any
) => {
  const fieldsQuery = fields.map((field) => ({
    exists: {
      field,
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
    query: {
      bool: {
        filter: [
          {
            bool: {
              must: [...fieldsQuery, ...filtersQuery, ...queryStringQuery],
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
