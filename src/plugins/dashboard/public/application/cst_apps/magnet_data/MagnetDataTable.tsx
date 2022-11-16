/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React, { ChangeEvent, FC, useEffect, useMemo, useRef, useState } from 'react';
import {
  CENTER_ALIGNMENT,
  EuiBasicTable,
  EuiButtonIcon,
  EuiFieldSearch,
  EuiLoadingChart,
  EuiScreenReaderOnly,
  EuiSelect,
  RIGHT_ALIGNMENT,
} from '@elastic/eui';
import { HttpSetup } from 'kibana/public';
import { ExpandObjectProps } from './types';
import { useMagnetData } from './useMagnetData';
import './index.scss';
import SingleDocumentView from './components/SingleDocumentView';
import ViewEnrichedData from './components/ViewEnrichedData';
import CustomDisplay from './components/CustomDisplay';

interface Props {
  container?: any;
  margnetElement?: any;
  http: HttpSetup;
}

export const MagnetDataTable: FC<Props> = ({ container, margnetElement, http }) => {
  const flyoutView = useRef<{ open: (T: any) => void }>(null);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

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

  const formattedColumns = useMemo(() => {
    const expand = {
      align: CENTER_ALIGNMENT,
      render: (item: any) => (
        <EuiButtonIcon
          onClick={() => flyoutView.current?.open(item)}
          aria-label="Open"
          iconType="expand"
        />
      ),
    };

    const columns = displayedColumns.map((column: any) => {
      const customDisplay = column?.name?.split(',');
      if (customDisplay?.length > 1) {
        return {
          ...column,
          name: customDisplay[0],
          render: (value: any, item: any) => (
            <CustomDisplay data={item} value={value} type={customDisplay[1]} />
          ),
        };
      }
      return column;
    });

    return [expand, ...columns];
  }, [displayedColumns]);

  return (
    <div className="cst-magnet-data">
      <div className="head-section">
        <EuiSelect
          style={{
            marginRight: 10,
            maxWidth: 'calc(100% - 10px)',
          }}
          id="magnet-data-artifactId"
          value={artifactId}
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
        <div className=" loading">
          <EuiLoadingChart size="l" />
          <p>Loading...</p>
        </div>
      ) : (
        <EuiBasicTable
          items={displayedData}
          itemId="id"
          // @ts-ignore everywhere
          columns={formattedColumns}
          responsive={true}
          onChange={onTableChange}
          loading={loading}
          pagination={pagination}
          // itemIdToExpandedRowMap={itemIdToExpandedRowMap}
          // isExpandable={true}
          // hasActions={true}
        />
      )}
      <ViewEnrichedData ref={flyoutView} />
    </div>
  );
};
