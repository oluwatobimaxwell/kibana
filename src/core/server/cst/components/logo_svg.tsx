/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
import React from 'react';

export const LogoSVG = ({ height = 25 }) => {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 20 315 115"
      enableBackground="new -308.745 -164.747 1032 729"
      xmlSpace="preserve"
      style={{ height, width: 'auto' }}
    >
      <defs />
      <g>
        <defs>
          <polygon id="SVGID_2_" points="64.154,77.866 64.154,141.309 127.601,77.866 		" />
        </defs>
        <use xlinkHref="#SVGID_2_" overflow="visible" />
        <clipPath id="SVGID_3_">
          <use xlinkHref="#SVGID_2_" overflow="visible" />
        </clipPath>
        <rect
          x="64.154"
          y="77.866"
          clipPath="url(#SVGID_3_)"
          stroke="#000000"
          strokeMiterlimit={10}
          width="63.447"
          height="63.443"
        />
        <use
          xlinkHref="#SVGID_2_"
          overflow="visible"
          fill="none"
          stroke="#000000"
          strokeMiterlimit={10}
        />
      </g>
      <g>
        <defs>
          <polygon id="SVGID_1_" points="0.707,77.866 64.154,141.309 64.154,14.419 		" />
        </defs>
        <use xlinkHref="#SVGID_1_" overflow="visible" />
        <clipPath id="SVGID_4_">
          <use xlinkHref="#SVGID_1_" overflow="visible" />
        </clipPath>
        <use
          xlinkHref="#SVGID_1_"
          overflow="visible"
          fill="none"
          stroke="#FFFFFF"
          strokeMiterlimit={10}
        />
      </g>
      <rect x="244.83" y="21.963" fill="none" width="50.127" height="111.801" />
      <text
        transform="matrix(0.743 0 0 1 244.8296 125.0386)"
        stroke="#000000"
        strokeMiterlimit={10}
        fontFamily="'A750SansCdMedium'"
        fontSize={146}
      >
        T
      </text>
      <rect x="199.3" y="21.963" fill="none" width="45.529" height="111.801" />
      <text
        transform="matrix(0.743 0 0 1 199.3003 125.0386)"
        stroke="#000000"
        strokeMiterlimit={10}
        fontFamily="'A750SansCdMedium'"
        fontSize={146}
      >
        S
      </text>
      <rect x="143.905" y="21.962" fill="none" width="46.757" height="111.804" />
      <text
        transform="matrix(0.743 0 0 1 143.9048 125.0376)"
        stroke="#000000"
        strokeMiterlimit={10}
        fontFamily="'A750SansCdMedium'"
        fontSize={146}
      >
        C
      </text>
    </svg>
  );
};
