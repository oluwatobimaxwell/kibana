/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/* eslint-disable jsx-a11y/alt-text */

import React, { useMemo } from 'react';

interface Props {
  size?: string;
}

export const CSTLogoIcon: React.FC<Props> = ({ size = 'small' }) => {
  const logoSize = useMemo(() => {
    if (size === 'small') return 35;
    else if (size === 'medium') return 50;
    else return 80;
  }, [size]);

  return (
    <img
      src="https://res.cloudinary.com/dzghxcq0j/image/upload/v1708402318/cst/cst-logo.svg"
      style={{ width: logoSize, height: logoSize, margin: 'auto' }}
    />
  );
};
