/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { FileLayer } from '@elastic/ems-client';
import type { ExpressionsSetup } from 'src/plugins/expressions/public';
import type { CoreSetup, CoreStart } from 'src/core/public';
import type { LensPublicSetup } from '../../../../lens/public';
import type { MapsPluginStartDependencies } from '../../plugin';
import { getExpressionFunction } from './expression_function';
import { getExpressionRenderer } from './expression_renderer';

export function setupLensChoroplethChart(
  coreSetup: CoreSetup<MapsPluginStartDependencies>,
  expressions: ExpressionsSetup,
  lens: LensPublicSetup
) {
  expressions.registerRenderer(() => {
    return getExpressionRenderer(coreSetup);
  });

  expressions.registerFunction(getExpressionFunction);

  lens.registerVisualization(async () => {
    const [coreStart, plugins]: [CoreStart, MapsPluginStartDependencies, unknown] =
      await coreSetup.getStartServices();
    const { getEmsFileLayers } = await import('../../util');
    const { getVisualization } = await import('./visualization');

    let emsFileLayers: FileLayer[] = [];
    try {
      emsFileLayers = await getEmsFileLayers();
    } catch (error) {
      // ignore error, lack of EMS file layers will be surfaced in dimension editor
    }

    return getVisualization({
      theme: coreStart.theme,
      emsFileLayers,
      paletteService: await plugins.charts.palettes.getPalettes(),
    });
  });
}
