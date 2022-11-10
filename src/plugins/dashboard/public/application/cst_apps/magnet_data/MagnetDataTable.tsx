/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React, { ChangeEvent, FC, useState } from 'react';
import { EuiBasicTable, EuiFieldSearch, EuiLoadingChart, EuiSelect } from '@elastic/eui';
import { HttpSetup } from 'kibana/public';
import { ExpandObjectProps } from './types';
import { useMagnetData } from './useMagnetData';
import './index.scss';

interface Props {
  container?: any;
  margnetElement?: any;
  http: HttpSetup;
}

export const MagnetDataTable: FC<Props> = ({ container, margnetElement, http }) => {
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [itemIdToExpandedRowMap, setItemIdToExpandedRowMap] = useState<ExpandObjectProps>();

  const {
    data,
    artifacts,
    loading,
    displayedColumns,
    displayedData,
    artifactId,
    pagination,
    setSearchKeyword,
    setArtifactId,
    onPageIndexChange,
    onPageSizeChange,
  } = useMagnetData(container, margnetElement, http);

  const onTableChange = ({ page = {} }: any) => {
    const { index: pageIndex, size: pageSize } = page;
    if (pagination?.pageIndex !== pageIndex) onPageIndexChange(pageIndex);
    if (pagination?.pageSize !== pageSize) onPageSizeChange(pageSize);
  };

  const selection = {
    selectable: (item: any) => item?.data?.id,
    selectableMessage: (selectable: any) => (!selectable ? 'User is currently offline' : undefined),
    onSelectionChange: (selected: any[]) => setSelectedItems(selected),
    initialSelected: [],
  };

  return (
    <div className="cst-magnet-data">
      <div className="head-section">
        <EuiSelect
          style={{
            marginRight: 10,
            maxWidth: 'calc(100% - 10px)',
          }}
          id="magnet-data-artifactId"
          defaultValue={artifactId}
          options={[
            { value: '', text: '-- Select Artifact --' },
            ...artifacts.map((name) => ({
              value: name,
              text: name,
            })),
          ]}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setArtifactId(e?.target?.value || '')}
        />
        <EuiFieldSearch
          fullWidth
          placeholder="Search..."
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
      </div>
      {loading ? (
        <div className="loading">
          <EuiLoadingChart size="l" />
          <p>Loading...</p>
        </div>
      ) : (
        <EuiBasicTable
          items={displayedData}
          itemId="id-1"
          // @ts-ignore everywhere
          columns={displayedColumns}
          responsive={true}
          onChange={onTableChange}
          // @ts-ignore everywhere
          selection={selection}
          loading={loading}
          pagination={pagination}
          itemIdToExpandedRowMap={itemIdToExpandedRowMap}
          isExpandable={true}
          hasActions={true}
        />
      )}
    </div>
  );
};
