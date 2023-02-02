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
import CustomTable from '../custom_table/CustomTable';
import { getAppName } from '../custom_table/utils/formatStringToApp';
import { MagnetDataTable } from './MagnetDataTable';

interface Props {
  isReadonlyMode: boolean;
  isEditMode: boolean;
  uiSettings: IUiSettingsClient;
  http: HttpSetup;
  container?: any;
}

export const MagnetDataDashboard: FC<Props> = ({ container, http }) => {
  const appNames = ['cst-magnet-data', 'cst-table'];

  const margnetElements = useMemo<any[]>(() => {
    let elements: any[] = [];
    const panels = container?.getInput()?.panels || {};
    Object.values(panels).forEach((child: any) => {
      const name = getAppName(child?.explicitInput?.savedVis?.params?.markdown);
      if (appNames.includes(name)) {
        elements.push(child);
      }
    });
    return elements;
  }, [container]);

  const getContent = useCallback(
    (margnetElement: any) => {
      const name = getAppName(margnetElement?.explicitInput?.savedVis?.params?.markdown);
      if (name === 'cst-magnet-data') {
        return (
          <MagnetDataTable http={http} container={container} margnetElement={margnetElement} />
        );
      }
      if (name === 'cst-table') {
        return <CustomTable http={http} container={container} margnetElement={margnetElement} />;
      }
      return <div />;
    },
    [http, container]
  );

  useEffect(() => {
    try {
      const interval = setInterval(() => {
        margnetElements.forEach((margnetElement) => {
          const panelId = margnetElement?.explicitInput?.id;
          const name = getAppName(margnetElement?.explicitInput?.savedVis?.params?.markdown);
          if (panelId) {
            const el = document.querySelector(`[data-test-embeddable-id="${panelId}"]`);
            const existing = el?.querySelector(`.${name}`);
            if (existing) {
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
