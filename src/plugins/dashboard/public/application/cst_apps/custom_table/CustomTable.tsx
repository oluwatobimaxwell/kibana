import React, { FC, useMemo, useState } from 'react';
import { HttpSetup } from 'kibana/public';
import { EuiBasicTable, EuiLoadingChart, EuiTableSortingType } from '@elastic/eui';
import { useSearchDocuments } from './hooks/queries';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import { formatColumnName } from './utils/formatColumnName';
import RenderCell from './components/RenderCell';
import { DashboardContainer } from '../../embeddable';
import { getFields } from './utils/formatStringToApp';
import { useGlobalData } from './hooks/useGlobalData';

interface Props {
  container?: DashboardContainer;
  margnetElement?: any;
  http: HttpSetup;
}

const CustomTable: FC<Props> = ({ container, margnetElement, http }) => {



  const { isLoading: preLoading } = useQuery(
    'preLoading',
    () =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 3000);
      })
  );

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('case_id');
  const [sortDirection, setSortDirection] = useState('asc');
    
  const markDown = margnetElement?.explicitInput?.savedVis?.params?.markdown;
  const { query, fields } = useGlobalData(container, markDown);

  const { data, isLoading, error } = useSearchDocuments(http, {
    start: pageIndex * pageSize,
    size: pageSize,
    indexName: 'cases',
    query,
  });

  const tableData = (data?.data || []).map((item: any) => item._source);

  const columns = useMemo(() => {
    return fields.map((field) => {
      return {
        field,
        name: formatColumnName(field.name),
        sortable: true,
        render: (value: any, row: any) => {
          return <RenderCell value={value || row[field.name]} type={field.type} />;
        },
      };
    });
  }, [fields]);

  const pagination = {
    pageIndex: pageIndex,
    pageSize: pageSize,
    totalItemCount: data?.total || 0,
    pageSizeOptions: [10, 20, 50, 100],
  };

  const sorting: EuiTableSortingType<any> = {
    sort: {
      field: sortField,
      direction: sortDirection as any,
    },
  };

  const onTableChange = ({ page = {}, sort = {} }: any) => {
    const { index: pageIndex, size: pageSize } = page;

    const { field: sortField, direction: sortDirection } = sort;

    setPageIndex(pageIndex);
    setPageSize(pageSize);
    setSortField(sortField);
    setSortDirection(sortDirection);
  };

  if (error) {
    return (
      <div>
        <h1>error</h1>
        <p>
          A problem occurred while loading the data. Please try again. If the problem persists,
          please contact your administrator.
        </p>
      </div>
    );
  }

  return (
    <div className="cst-magnet-data">
      {preLoading ? (
        <div className=" loading">
          <EuiLoadingChart size="l" />
          <p>Loading...</p>
        </div>
      ) : (
        <EuiBasicTable
          items={tableData}
          itemId="id"
          columns={columns as any[]}
          responsive={true}
          onChange={onTableChange}
          loading={isLoading}
          pagination={pagination}
          sorting={sorting}
        />
      )}
    </div>
  );
};

const queryClient = new QueryClient();

export default (props: any) => {
  return (
    <QueryClientProvider client={queryClient}>
      <CustomTable {...props} />
    </QueryClientProvider>
  );
};
