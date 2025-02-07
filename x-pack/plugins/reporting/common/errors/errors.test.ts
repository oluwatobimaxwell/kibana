/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import * as errors from '.';

describe('ReportingError', () => {
  it('provides error code when stringified', () => {
    expect(new errors.AuthenticationExpiredError() + '').toBe(
      `ReportingError(code: authentication_expired_error)`
    );
  });
  it('provides details if there are any and error code when stringified', () => {
    expect(new errors.AuthenticationExpiredError('some details') + '').toBe(
      `ReportingError(code: authentication_expired_error) "some details"`
    );
  });
  it('has the expected code structure', () => {
    const { ReportingError: _, ...nonAbstractErrors } = errors;
    Object.values(nonAbstractErrors).forEach((Ctor) => {
      expect(new Ctor().code).toMatch(/^[a-z_]+_error$/);
    });
  });
});
