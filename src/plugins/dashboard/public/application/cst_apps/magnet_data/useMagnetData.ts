/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
/* eslint-disable @typescript-eslint/no-shadow */
import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { HttpSetup } from 'kibana/public';
import isEqual from 'lodash/isEqual';
import { TableColumnType, LooseObject } from './types';
import QueryBuilder from './QueryBuilder';

export const useMagnetData = (container: any, query: any, http: HttpSetup) => {
  
  const artifactListQuery = useRef<QueryBuilder>(new QueryBuilder()).current;
  const artifactDataQuery = useRef<QueryBuilder>(new QueryBuilder()).current;

  const [data, setData] = useState<LooseObject[]>([]);
  const [artifacts, setArtifacts] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [columns, setColumns] = useState<TableColumnType[]>([]);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [artifactId, setArtifactId] = useState<string>('');
  const [globalQuery, setGlobalQuery] = useState<any>(query);
  const [pagination, setPagination] = useState<any>({
    pageIndex: 0,
    pageSize: 10,
    totalItemCount: 0,
    pageSizeOptions: [10, 20, 50],
  });

  const setTableColumns = (data: LooseObject[]) => {
    const columns: TableColumnType[] = [];
    if (data.length > 0) {
      const column = '{' + data[0].column_names + '}';
      const columnNames = JSON.parse(column);
      Object.keys(columnNames).forEach((key) => {
        columns.push({
          field: key,
          name: columnNames[key],
          hidden: false,
        });
      });
    }
    setColumns(columns);
  };

  const onPageIndexChange = (pageIndex: number) => {
    setPagination((prevPagination: any) => ({
      ...prevPagination,
      pageIndex,
    }));
  };

  const onPageSizeChange = (pageSize: number) => {
    setPagination((prevPagination: any) => ({
      ...prevPagination,
      pageSize,
      pageIndex: 0,
    }));
  };

  const hideOrShowColumn = (column: TableColumnType) => {
    const newColumns = [...columns];
    const index = newColumns.findIndex((col) => col.name === column.name);
    newColumns[index].hidden = !newColumns[index].hidden;
    setColumns(newColumns);
  };

  const getTableData = useCallback(async () => {
    if (artifactId && http) {
      setLoading(true);
      const data: LooseObject[] = await http.post(`/api/magnet_data/artifact_data`, {
        body: JSON.stringify(artifactDataQuery.build()),
      });
      setData(data);
      setPagination((prevPagination: any) => ({
        ...prevPagination,
        totalItemCount: data?.length,
      }));
      setTableColumns(data);
      onPageIndexChange(0);
      setLoading(false);
    }
  }, [artifactId, globalQuery, http]);

  const getArtifacts = useCallback(async () => {
    if (http) {
      setLoading(true);
      const data = await http.post(`/api/magnet_data/artifacts`, {
        body: JSON.stringify(artifactListQuery.build()),
      });
      setArtifacts(data as string[]);
      setLoading(false);
    }
  }, [http]);

  const getGlobalQuery = useCallback(() => {

    artifactListQuery.reset();
    artifactDataQuery.reset();

    const { query, timeRange, filters } = container?.input;

    if (filters.length > 0) {
      artifactListQuery.addFilters(filters);
      artifactDataQuery.addFilters(filters);
    }
    if (query) {
      artifactListQuery.addQueryString(query.query);
      artifactDataQuery.addQueryString(query.query);
    }
    if (timeRange) {
      artifactListQuery.addTimeRange(timeRange);
      artifactDataQuery.addTimeRange(timeRange);
    }

    const _globalQuery = artifactDataQuery.build();
    if (!isEqual(_globalQuery, globalQuery)) {
      setGlobalQuery(_globalQuery);
    }
  }, [container, globalQuery]);

  const trackClickEvent = useCallback(() => setTimeout(getGlobalQuery, 500), [getGlobalQuery]);

  const kbn = document.querySelector('#kibana-body') as HTMLElement;

  useEffect(() => {
    kbn.addEventListener('click', trackClickEvent);
    kbn.addEventListener('keydown', trackClickEvent);
    return () => {
      kbn.removeEventListener('click', trackClickEvent);
      kbn.removeEventListener('keydown', trackClickEvent);
    };
  }, [kbn, trackClickEvent]);

  useEffect(() => {
    if (artifactId) {
      artifactDataQuery.addArtifactName(artifactId);
      getTableData();
    }
  }, [artifactId, getTableData]);

  useEffect(() => {
    getArtifacts();
  }, [globalQuery, getArtifacts]);

  const displayedColumns = useMemo(() => columns.filter((col) => !col.hidden), [columns]);

  const showPaginationData = (data: LooseObject[]) => {
    const { pageIndex, pageSize } = pagination;
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    return data.slice(start, end);
  };

  const displayedData = useMemo(() => {
    if (searchKeyword) {
      return data.filter((item) => {
        return Object.keys(item).some((key) => {
          return item[key].toString().toLowerCase().includes(searchKeyword.toLowerCase());
        });
      });
    }
    return data;
  }, [data, searchKeyword]);

  return {
    data,
    artifacts,
    loading,
    columns,
    displayedColumns,
    pagination,
    displayedData: showPaginationData(displayedData),
    searchKeyword,
    artifactId,
    onPageIndexChange,
    onPageSizeChange,
    setTableColumns,
    hideOrShowColumn,
    setSearchKeyword,
    setArtifactId,
  };
};

