/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
import React from 'react';
import { versionCode } from '../utils/constants';

export const CSTLogoName = () => {
  return (
    <p style={{ color: '#fff', marginLeft: 8, fontWeight: 'bold', fontSize: 18 }}>CST Analytics ({versionCode})</p>
  );
};
