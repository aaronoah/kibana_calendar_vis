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

import React from 'react';
import moment from 'moment';
import { findDOMNode } from 'react-dom';
import { mount } from 'enzyme';
import { ChartTitle } from './chart_title';
import { CalendarVisConfig, VIS_CHART_TYPE } from '../../../lib/calendar_vis_config';
import { defaultParams } from '../../../default_settings';
import aggResponse from '../../../__tests__/agg_response.json';
import { calculateBounds } from 'ui/timefilter/get_time';

describe('ChartTitle - default', () => {

  let visConfig;
  let visData;
  const fakeVis = {
    params: defaultParams,
    API: {
      timeFilter: {
        getBounds: function () {
          return calculateBounds({
            from: moment(1531026000000),
            to: moment(1531026000000 + 35 * 86400000)
          });
        }
      }
    }
  };

  beforeEach(() => {
    visConfig = new CalendarVisConfig(fakeVis, defaultParams);
    visData = aggResponse.rows[0];
  });

  afterEach(() => {
    visConfig = null;
    visData = null;
  });

  it('should render a full year overview chart title', () => {
    const renderComplete = jest.fn();
    const titleWrapper = mount(
      <ChartTitle
        gridConfig={visConfig.get('grid')}
        label={visData.yAxisLabel}
        dateRef={visData.series[0].values[0].x}
        chartType={VIS_CHART_TYPE.HEATMAP_YEAR}
        renderComplete={renderComplete}
      />
    );
    const title = titleWrapper.instance();
    expect(findDOMNode(title)).toMatchSnapshot();
  });

  it('should render a full month overview chart title', () => {
    const renderComplete = jest.fn();
    const titleWrapper = mount(
      <ChartTitle
        gridConfig={visConfig.get('grid')}
        label={visData.yAxisLabel}
        dateRef={visData.series[0].values[0].x}
        chartType={VIS_CHART_TYPE.HEATMAP_MONTH}
        renderComplete={renderComplete}
      />
    );
    const title = titleWrapper.instance();
    expect(findDOMNode(title)).toMatchSnapshot();
  });

});
