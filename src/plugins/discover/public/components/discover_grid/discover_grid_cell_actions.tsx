/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React, { useContext } from 'react';
import { EuiDataGridColumnCellActionProps } from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import { DataViewField } from '../../../../data_views/public';
import { flattenHit } from '../../../../data/public';
import { DiscoverGridContext, GridContext } from './discover_grid_context';

function onFilterCell(
  context: GridContext,
  rowIndex: EuiDataGridColumnCellActionProps['rowIndex'],
  columnId: EuiDataGridColumnCellActionProps['columnId'],
  mode: '+' | '-'
) {
  const row = context.rows[rowIndex];
  const flattened = flattenHit(row, context.indexPattern);
  const field = context.indexPattern.fields.getByName(columnId);

  if (flattened && field) {
    context.onFilter(field, flattened[columnId], mode);
  }
}

export const FilterInBtn = ({
  Component,
  rowIndex,
  columnId,
}: EuiDataGridColumnCellActionProps) => {
  const context = useContext(DiscoverGridContext);
  const buttonTitle = i18n.translate('discover.grid.filterForAria', {
    defaultMessage: 'Filter for this {value}',
    values: { value: columnId },
  });

  return (
    <Component
      onClick={() => {
        onFilterCell(context, rowIndex, columnId, '+');
      }}
      iconType="plusInCircle"
      aria-label={buttonTitle}
      title={buttonTitle}
      data-test-subj="filterForButton"
    >
      {i18n.translate('discover.grid.filterFor', {
        defaultMessage: 'Filter for',
      })}
    </Component>
  );
};

export const FilterOutBtn = ({
  Component,
  rowIndex,
  columnId,
}: EuiDataGridColumnCellActionProps) => {
  const context = useContext(DiscoverGridContext);
  const buttonTitle = i18n.translate('discover.grid.filterOutAria', {
    defaultMessage: 'Filter out this {value}',
    values: { value: columnId },
  });

  return (
    <Component
      onClick={() => {
        onFilterCell(context, rowIndex, columnId, '-');
      }}
      iconType="minusInCircle"
      aria-label={buttonTitle}
      title={buttonTitle}
      data-test-subj="filterOutButton"
    >
      {i18n.translate('discover.grid.filterOut', {
        defaultMessage: 'Filter out',
      })}
    </Component>
  );
};

export function buildCellActions(field: DataViewField) {
  if (!field.filterable) {
    return undefined;
  }

  return [FilterInBtn, FilterOutBtn];
}
