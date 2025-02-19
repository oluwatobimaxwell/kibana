/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import * as Rx from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import type { ReportingCore } from '../../../';
import type { LocatorParams, PdfMetrics, UrlOrUrlLocatorTuple } from '../../../../common/types';
import type { PdfScreenshotOptions } from '../../../types';
import { getFullRedirectAppUrl } from '../../common/v2/get_full_redirect_app_url';
import { getTracker } from '../../common/pdf_tracker';
import type { TaskPayloadPDFV2 } from '../types';

interface PdfResult {
  buffer: Uint8Array | null;
  metrics?: PdfMetrics;
  warnings: string[];
}

export function generatePdfObservable(
  reporting: ReportingCore,
  job: TaskPayloadPDFV2,
  locatorParams: LocatorParams[],
  options: Omit<PdfScreenshotOptions, 'urls'>
): Rx.Observable<PdfResult> {
  const tracker = getTracker();
  tracker.startScreenshots();

  /**
   * For each locator we get the relative URL to the redirect app
   */
  const urls = locatorParams.map((locator) => [
    getFullRedirectAppUrl(reporting.getConfig(), job.spaceId, job.forceNow),
    locator,
  ]) as UrlOrUrlLocatorTuple[];
  const screenshots$ = reporting.getScreenshots({ ...options, urls }).pipe(
    tap(({ metrics }) => {
      if (metrics) {
        tracker.setCpuUsage(metrics.cpu);
        tracker.setMemoryUsage(metrics.memory);
      }
    }),
    mergeMap(async ({ metrics, result }) => {
      tracker.endScreenshots();
      const warnings: string[] = [];
      if (result.errors) {
        warnings.push(...result.errors.map((error) => error.message));
      }
      if (result.renderErrors) {
        warnings.push(...result.renderErrors);
      }

      return {
        buffer: result.data,
        warnings,
        metrics: {
          ...metrics,
          pages: metrics.pageCount,
        },
      };
    })
  );

  return screenshots$;
}
