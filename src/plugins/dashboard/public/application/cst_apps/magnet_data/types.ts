/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

export interface LooseObject {
  [key: string]: any;
}

export interface DateRange {
  [key: string]: {
    gte: string;
    lte: string;
  };
}

export interface TableDataType {
  type: string;
  data: LooseObject[];
  fields: string[];
}

export enum EnrichmentType {
  Twitter = 'Twitter',
  NIMC = 'NIMC',
  NCC = 'NCC',
  TrueCaller = 'True-Caller',
}

export interface Column {
  [key: string]: any;
  field?: string;
  name?: string;
  id?: string;
  isCheckbox?: boolean;
  textOnly?: boolean;
  width?: string;
}

export interface TBPagination {
  pageIndex: number;
  pageSize: number;
  totalItemCount: number;
}

export interface TableClassDataType {
  [key: string]: any;
  displayedColumns: Column[];
  columns: Column[];
  data: any[];
  displayedData: any[];
  loading: boolean;
}

export enum COLORS {
  success = '#00BFA5',
  warning = '#FFB300',
  danger = '#DD2C00',
  primary = '#6200EE',
}

export interface ExpandObjectProps {
  [key: string]: JSX.Element;
}

export interface TableColumnType {
  [key: string]: any;
  field?: string;
  name?: string;
  value?: string;
  hidden?: boolean;
  render?: (value: any) => JSX.Element;
}
