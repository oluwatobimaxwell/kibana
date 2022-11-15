/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/* eslint-disable no-console */

import { HttpSetup, IUiSettingsClient } from 'kibana/public';
import React, { FC, useCallback, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { MagnetDataTable } from './MagnetDataTable';

interface Props {
  isReadonlyMode: boolean;
  isEditMode: boolean;
  uiSettings: IUiSettingsClient;
  http: HttpSetup;
  container?: any;
}

export const MagnetDataDashboard: FC<Props> = ({ container, http }) => {
  const margnetElements = useMemo<any[]>(() => {
    let elements: any[] = [];
    const panels = container?.getInput()?.panels || {};
    Object.values(panels).forEach((child: any) => {
      if (child?.explicitInput?.savedVis?.params?.markdown === '[cst-magnet-data]') {
        elements.push(child);
      }
    });
    return elements;
  }, [container]);

  const getContent = useCallback((margnetElement: any) => {
    if (margnetElements?.length === 0) return <div />;
    return <MagnetDataTable http={http} container={container} margnetElement={margnetElement} />;
  }, [http, container]);

  useEffect(() => {
    try {
      const interval = setInterval(() => {
        margnetElements.forEach((margnetElement) => {
        const panelId = margnetElement?.explicitInput?.id;
        if (panelId) {
          const el = document.querySelector(`[data-test-embeddable-id="${panelId}"]`);
          const existing = el?.querySelector('.cst-magnet-data');
          if (existing) {
            console.log('existing', existing);
            ReactDOM.unmountComponentAtNode(existing);
          }
          if (el) {
            const panel = el.querySelector('.visualization.markdownVis');
            ReactDOM.render(getContent(margnetElement), panel);
            clearInterval(interval);
          }
        }
      });
      }, 1000);
    } catch (e) {
      console.log(e?.message);
    }
  }, [getContent, margnetElements]);

  return <div />;
};
