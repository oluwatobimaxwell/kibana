/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { has } from 'lodash/fp';
import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { AuthenticationsEdges } from '../../../../common/search_strategy/security_solution/hosts/authentications';

import { getEmptyTagValue } from '../../../common/components/empty_value';
import { FormattedRelativePreferenceDate } from '../../../common/components/formatted_date';
import {
  HostDetailsLink,
  NetworkDetailsLink,
  UserDetailsLink,
} from '../../../common/components/links';
import { Columns, ItemsPerRow, PaginatedTable } from '../../../common/components/paginated_table';
import { getRowItemDraggables } from '../../../common/components/tables/helpers';
import { useDeepEqualSelector } from '../../../common/hooks/use_selector';
import { useIsExperimentalFeatureEnabled } from '../../../common/hooks/use_experimental_features';

import { hostsActions, hostsModel, hostsSelectors } from '../../store';

import * as i18n from './translations';

const tableType = hostsModel.HostsTableType.authentications;

interface AuthenticationTableProps {
  data: AuthenticationsEdges[];
  fakeTotalCount: number;
  loading: boolean;
  loadPage: (newActivePage: number) => void;
  id: string;
  isInspect: boolean;
  setQuerySkip: (skip: boolean) => void;
  showMorePagesIndicator: boolean;
  totalCount: number;
  type: hostsModel.HostsType;
}

export type AuthTableColumns = [
  Columns<AuthenticationsEdges>,
  Columns<AuthenticationsEdges>,
  Columns<AuthenticationsEdges>,
  Columns<AuthenticationsEdges>,
  Columns<AuthenticationsEdges>,
  Columns<AuthenticationsEdges>,
  Columns<AuthenticationsEdges>,
  Columns<AuthenticationsEdges>,
  Columns<AuthenticationsEdges>
];

const rowItems: ItemsPerRow[] = [
  {
    text: i18n.ROWS_5,
    numberOfRow: 5,
  },
  {
    text: i18n.ROWS_10,
    numberOfRow: 10,
  },
];

const AuthenticationTableComponent: React.FC<AuthenticationTableProps> = ({
  data,
  fakeTotalCount,
  id,
  isInspect,
  loading,
  loadPage,
  setQuerySkip,
  showMorePagesIndicator,
  totalCount,
  type,
}) => {
  const dispatch = useDispatch();
  const getAuthenticationsSelector = useMemo(() => hostsSelectors.authenticationsSelector(), []);
  const { activePage, limit } = useDeepEqualSelector((state) =>
    getAuthenticationsSelector(state, type)
  );

  const updateLimitPagination = useCallback(
    (newLimit) =>
      dispatch(
        hostsActions.updateTableLimit({
          hostsType: type,
          limit: newLimit,
          tableType,
        })
      ),
    [type, dispatch]
  );

  const updateActivePage = useCallback(
    (newPage) =>
      dispatch(
        hostsActions.updateTableActivePage({
          activePage: newPage,
          hostsType: type,
          tableType,
        })
      ),
    [type, dispatch]
  );

  const usersEnabled = useIsExperimentalFeatureEnabled('usersEnabled');
  const columns = useMemo(
    () => getAuthenticationColumnsCurated(type, usersEnabled),
    [type, usersEnabled]
  );

  return (
    <PaginatedTable
      activePage={activePage}
      columns={columns}
      dataTestSubj={`table-${tableType}`}
      headerCount={totalCount}
      headerTitle={i18n.AUTHENTICATIONS}
      headerUnit={i18n.UNIT(totalCount)}
      id={id}
      isInspect={isInspect}
      itemsPerRow={rowItems}
      limit={limit}
      loading={loading}
      loadPage={loadPage}
      pageOfItems={data}
      setQuerySkip={setQuerySkip}
      showMorePagesIndicator={showMorePagesIndicator}
      totalCount={fakeTotalCount}
      updateLimitPagination={updateLimitPagination}
      updateActivePage={updateActivePage}
    />
  );
};

AuthenticationTableComponent.displayName = 'AuthenticationTableComponent';

export const AuthenticationTable = React.memo(AuthenticationTableComponent);

const getAuthenticationColumns = (usersEnabled: boolean): AuthTableColumns => [
  {
    name: i18n.USER,
    truncateText: false,
    mobileOptions: { show: true },
    render: ({ node }) =>
      getRowItemDraggables({
        rowItems: node.user.name,
        attrName: 'user.name',
        isAggregatable: true,
        fieldType: 'keyword',
        idPrefix: `authentications-table-${node._id}-userName`,
        render: (item) => (usersEnabled ? <UserDetailsLink userName={item} /> : <>{item}</>),
      }),
  },
  {
    name: i18n.SUCCESSES,
    field: 'node.successes',
    truncateText: false,
    mobileOptions: { show: true },
    width: '8%',
  },
  {
    name: i18n.FAILURES,
    field: 'node.failures',
    truncateText: false,
    mobileOptions: { show: true },
    width: '8%',
  },
  {
    name: i18n.LAST_SUCCESSFUL_TIME,
    truncateText: false,
    mobileOptions: { show: true },
    render: ({ node }) =>
      has('lastSuccess.timestamp', node) && node.lastSuccess?.timestamp != null ? (
        <FormattedRelativePreferenceDate value={node.lastSuccess?.timestamp} />
      ) : (
        getEmptyTagValue()
      ),
  },
  {
    name: i18n.LAST_SUCCESSFUL_SOURCE,
    truncateText: false,
    mobileOptions: { show: true },
    render: ({ node }) =>
      getRowItemDraggables({
        rowItems: node.lastSuccess?.source?.ip || null,
        isAggregatable: true,
        fieldType: 'ip',
        attrName: 'source.ip',
        idPrefix: `authentications-table-${node._id}-lastSuccessSource`,
        render: (item) => <NetworkDetailsLink ip={item} />,
      }),
  },
  {
    name: i18n.LAST_SUCCESSFUL_DESTINATION,
    truncateText: false,
    mobileOptions: { show: true },
    render: ({ node }) =>
      getRowItemDraggables({
        rowItems: node.lastSuccess?.host?.name ?? null,
        isAggregatable: true,
        fieldType: 'keyword',
        attrName: 'host.name',
        idPrefix: `authentications-table-${node._id}-lastSuccessfulDestination`,
        render: (item) => <HostDetailsLink hostName={item} />,
      }),
  },
  {
    name: i18n.LAST_FAILED_TIME,
    truncateText: false,
    mobileOptions: { show: true },
    render: ({ node }) =>
      has('lastFailure.timestamp', node) && node.lastFailure?.timestamp != null ? (
        <FormattedRelativePreferenceDate value={node.lastFailure?.timestamp} />
      ) : (
        getEmptyTagValue()
      ),
  },
  {
    name: i18n.LAST_FAILED_SOURCE,
    truncateText: false,
    mobileOptions: { show: true },
    render: ({ node }) =>
      getRowItemDraggables({
        rowItems: node.lastFailure?.source?.ip || null,
        attrName: 'source.ip',
        isAggregatable: true,
        fieldType: 'ip',
        idPrefix: `authentications-table-${node._id}-lastFailureSource`,
        render: (item) => <NetworkDetailsLink ip={item} />,
      }),
  },
  {
    name: i18n.LAST_FAILED_DESTINATION,
    truncateText: false,
    mobileOptions: { show: true },
    render: ({ node }) =>
      getRowItemDraggables({
        rowItems: node.lastFailure?.host?.name || null,
        attrName: 'host.name',
        isAggregatable: true,
        fieldType: 'keyword',
        idPrefix: `authentications-table-${node._id}-lastFailureDestination`,
        render: (item) => <HostDetailsLink hostName={item} />,
      }),
  },
];

export const getAuthenticationColumnsCurated = (
  pageType: hostsModel.HostsType,
  usersEnabled: boolean
): AuthTableColumns => {
  const columns = getAuthenticationColumns(usersEnabled);

  // Columns to exclude from host details pages
  if (pageType === hostsModel.HostsType.details) {
    return [i18n.LAST_FAILED_DESTINATION, i18n.LAST_SUCCESSFUL_DESTINATION].reduce((acc, name) => {
      acc.splice(
        acc.findIndex((column) => column.name === name),
        1
      );
      return acc;
    }, columns);
  }

  return columns;
};
