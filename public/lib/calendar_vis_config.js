/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import _ from 'lodash';
import { BaseConfig } from './base_config';
import { AXIS_SCALE_TYPE } from '../components/chart/axis/axis_scale';

export const VIS_CHART_TYPE = {
  HEATMAP_YEAR: 'heatmap_year',
  HEATMAP_MONTH: 'heatmap_month'
};

const DEFAULT_VIS_CONFIG = {
  type: VIS_CHART_TYPE.HEATMAP_YEAR,
  style: {
    margin: { top: 10, right: 3, bottom: 5, left: 3 }
  },
  alerts: [],
  categoryAxes: [],
  valueAxes: [],
  grid: {}
};

export class CalendarVisConfig extends BaseConfig {
  constructor(visConfigArgs) {
    super(visConfigArgs);
    this._values = _.defaultsDeep({}, this._values, DEFAULT_VIS_CONFIG);
  }

  update(vis) {
    const { params } = vis;
    /*
      * Justification for setting params changes:
      * they should be managed outside of visualization and visualization should only handle rendering
      */
    const { timeFilter } = vis.API;
    const {
      min: from,
      max: to
    } = timeFilter.getBounds();
    const diff = to.diff(from, 'days');
    if (diff <= 1) {
      // render a day view
    } else if (diff > 1 && diff < 32 && new Date(from).getMonth() === new Date(to).getMonth()) {
      // render a month view
      params.type = VIS_CHART_TYPE.HEATMAP_MONTH;
      params.categoryAxes = [{
        id: 'CategoryAxis-1',
        type: 'category',
        position: 'top',
        scale: {
          type: AXIS_SCALE_TYPE.WEEKS
        },
      }];
      params.grid = Object.assign(params.grid, {
        cellSize: 40,
        xOffset: 20,
        yOffset: 20
      });
    } else if (diff > 31) {
      // render a year view
      params.type = VIS_CHART_TYPE.HEATMAP_YEAR;
      params.categoryAxes = [{
        id: 'CategoryAxis-1',
        type: 'category',
        position: 'top',
        scale: {
          type: AXIS_SCALE_TYPE.MONTHS
        },
      }, {
        id: 'CategoryAxis-2',
        type: 'category',
        position: 'left',
        scale: {
          type: AXIS_SCALE_TYPE.WEEKS
        },
      }];
      params.grid = Object.assign(params.grid, {
        cellSize: 15,
        xOffset: 20,
        yOffset: 20
      });
    }
    this._values = _.cloneDeep(params);
  }
}
