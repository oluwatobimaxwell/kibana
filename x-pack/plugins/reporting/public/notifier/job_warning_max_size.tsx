/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { FormattedMessage } from '@kbn/i18n-react';
import React from 'react';
import { ThemeServiceStart, ToastInput } from 'src/core/public';
import { toMountPoint } from '../../../../../src/plugins/kibana_react/public';
import { JobId, JobSummary } from '../../common/types';
import { DownloadButton } from './job_download_button';
import { ReportLink } from './report_link';

export const getWarningMaxSizeToast = (
  job: JobSummary,
  getReportLink: () => string,
  getDownloadLink: (jobId: JobId) => string,
  theme: ThemeServiceStart
): ToastInput => ({
  title: toMountPoint(
    <FormattedMessage
      id="xpack.reporting.publicNotifier.maxSizeReached.partialReportTitle"
      defaultMessage="Created partial {reportType} for '{reportObjectTitle}'"
      values={{ reportType: job.jobtype, reportObjectTitle: job.title }}
    />,
    { theme$: theme.theme$ }
  ),
  text: toMountPoint(
    <>
      <p>
        <FormattedMessage
          id="xpack.reporting.publicNotifier.maxSizeReached.partialReportDescription"
          defaultMessage="The report reached the max size and contains partial data."
        />
      </p>
      <p>
        <ReportLink getUrl={getReportLink} />
      </p>
      <DownloadButton getUrl={getDownloadLink} job={job} />
    </>,
    { theme$: theme.theme$ }
  ),
  'data-test-subj': 'completeReportMaxSizeWarning',
});
