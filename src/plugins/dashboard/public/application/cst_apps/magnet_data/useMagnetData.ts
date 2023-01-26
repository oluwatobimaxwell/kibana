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
    pageSizeOptions: [10, 20, 50, 100],
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

  const updateTableData = useCallback((data: LooseObject[], total: number) => {
      setData(data);
      setPagination((prevPagination: any) => ({
        ...prevPagination,
        totalItemCount: total,
      }));
      setTableColumns(data);
  }, []);

  const getTableData = useCallback(async (start = 0, size = 10) => {
    if (artifactId && http) {
      setLoading(true);
      const {
        data,
        total
      }: {
        data: LooseObject[];
        total: number;
      } = await http.post(`/api/magnet_data/artifact_data`, {
        body: JSON.stringify({
          query: artifactDataQuery.build(),
          start,
          size,
        }),
      });
      updateTableData(data, total);
      setLoading(false);
    }
  }, [artifactId, globalQuery, http, updateTableData]);



  const getArtifacts = useCallback(async () => {
    if (http) {
      setLoading(true);
      const data = await http.post(`/api/magnet_data/artifacts`, {
        body: JSON.stringify(artifactListQuery.build()),
      }) as string[];
      setArtifacts(data as string[]);
      if (data.length  === 1) {
        setArtifactId(data[0]);
        getTableData();
      }
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
      if (!JSON.stringify(_globalQuery).includes(artifactId)) {
        setArtifactId('');
        updateTableData([], 0);
        onPageIndexChange(0);
      }
      setGlobalQuery(_globalQuery);
    }
  }, [container, globalQuery]);

  const trackClickEvent = useCallback(() => setTimeout(() => {
    setLoading(true);
    getGlobalQuery();
    setLoading(false);
  }, 1000), [getGlobalQuery]);

  const kbn = document.body as HTMLElement;

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


  const { start, size } = useMemo(
    () => ({
      start: pagination.pageIndex * pagination.pageSize,
      size: pagination.pageSize,
    }),
    [pagination]
  );

  useEffect(() => {
    artifactDataQuery.addArtifactName(artifactId);
    getTableData(start, size);
  }, [start, size]);

  useEffect(() => {
    getArtifacts();
  }, [globalQuery, getArtifacts]);

  const displayedColumns = useMemo(() => columns.filter((col) => !col.hidden), [columns]);

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
    displayedData: displayedData,
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

