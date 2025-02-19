/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { getOr } from 'lodash/fp';

import type { IEsSearchResponse } from '../../../../../../../../../../src/plugins/data/common';
import {
  HostsKpiQueries,
  HostsKpiAuthenticationsStrategyResponse,
  HostsKpiAuthenticationsRequestOptions,
} from '../../../../../../../common/search_strategy/security_solution/hosts';
import { inspectStringifyObject } from '../../../../../../utils/build_query';
import { SecuritySolutionFactory } from '../../../types';
import { buildHostsKpiAuthenticationsQuery } from './query.hosts_kpi_authentications.dsl';
import {
  formatAuthenticationsHistogramData,
  formatAuthenticationsHistogramDataEntities,
} from './helpers';
import { buildHostsKpiAuthenticationsQueryEntities } from './query.hosts_kpi_authentications_entities.dsl';

export const hostsKpiAuthentications: SecuritySolutionFactory<HostsKpiQueries.kpiAuthentications> =
  {
    buildDsl: (options: HostsKpiAuthenticationsRequestOptions) =>
      buildHostsKpiAuthenticationsQuery(options),
    parse: async (
      options: HostsKpiAuthenticationsRequestOptions,
      response: IEsSearchResponse<unknown>
    ): Promise<HostsKpiAuthenticationsStrategyResponse> => {
      const inspect = {
        dsl: [inspectStringifyObject(buildHostsKpiAuthenticationsQuery(options))],
      };

      const authenticationsSuccessHistogram = getOr(
        null,
        'aggregations.authentication_success_histogram.buckets',
        response.rawResponse
      );
      const authenticationsFailureHistogram = getOr(
        null,
        'aggregations.authentication_failure_histogram.buckets',
        response.rawResponse
      );

      return {
        ...response,
        inspect,
        authenticationsSuccess: getOr(
          null,
          'aggregations.authentication_success.doc_count',
          response.rawResponse
        ),
        authenticationsSuccessHistogram: formatAuthenticationsHistogramData(
          authenticationsSuccessHistogram
        ),
        authenticationsFailure: getOr(
          null,
          'aggregations.authentication_failure.doc_count',
          response.rawResponse
        ),
        authenticationsFailureHistogram: formatAuthenticationsHistogramData(
          authenticationsFailureHistogram
        ),
      };
    },
  };

export const hostsKpiAuthenticationsEntities: SecuritySolutionFactory<HostsKpiQueries.kpiAuthentications> =
  {
    buildDsl: (options: HostsKpiAuthenticationsRequestOptions) =>
      buildHostsKpiAuthenticationsQueryEntities(options),
    parse: async (
      options: HostsKpiAuthenticationsRequestOptions,
      response: IEsSearchResponse<unknown>
    ): Promise<HostsKpiAuthenticationsStrategyResponse> => {
      const inspect = {
        dsl: [inspectStringifyObject(buildHostsKpiAuthenticationsQueryEntities(options))],
      };

      const authenticationsSuccessHistogram = getOr(
        null,
        'aggregations.authentication_success_histogram.buckets',
        response.rawResponse
      );
      const authenticationsFailureHistogram = getOr(
        null,
        'aggregations.authentication_failure_histogram.buckets',
        response.rawResponse
      );

      return {
        ...response,
        inspect,
        authenticationsSuccess: getOr(
          null,
          'aggregations.authentication_success.value',
          response.rawResponse
        ),
        authenticationsSuccessHistogram: formatAuthenticationsHistogramDataEntities(
          authenticationsSuccessHistogram
        ),
        authenticationsFailure: getOr(
          null,
          'aggregations.authentication_failure.value',
          response.rawResponse
        ),
        authenticationsFailureHistogram: formatAuthenticationsHistogramDataEntities(
          authenticationsFailureHistogram
        ),
      };
    },
  };
