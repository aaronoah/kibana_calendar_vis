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
import { shallow } from 'enzyme';
import { CalendarChart } from './calendar_chart';
import { CalendarVisConfig, Dispatcher } from '../../lib';
import { defaultParams, monthViewParams } from '../../default_settings';
import aggResponse from '../../__tests__/agg_response.json';
import { truncateUnusable, replicateDate } from '../../../test/jest/utils';
import { calculateBounds } from 'ui/timefilter/get_time';

describe('CalendarChart', () => {

  let visConfig;
  let visData;
  let dispatcher;
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
    dispatcher = new Dispatcher().addContainer(document.createElement('div'));
    visData = truncateUnusable(aggResponse.rows[0]);
  });

  afterEach(() => {
    visConfig = null;
    visData = null;
  });

  it('should render a year view chart with two category axes, one grid and a title', () => {
    visConfig = new CalendarVisConfig(fakeVis, defaultParams);
    // replicate data
    visData = replicateDate(visData);

    const renderComplete = jest.fn();
    const chartWrapper = shallow(<CalendarChart
      id={`chart_${visData.label.slice(0, 4)}`}
      visConfig={visConfig}
      vislibData={visData}
      dispatcher={dispatcher}
      renderComplete={renderComplete}
    />);
    expect(chartWrapper).toMatchSnapshot();
  });

  it('should render a month view chart with one category axis, one grid and a title', () => {
    visConfig = new CalendarVisConfig(fakeVis, monthViewParams);
    // replicate data
    visData = replicateDate(visData, 3);

    const renderComplete = jest.fn();
    const chartWrapper = shallow(<CalendarChart
      id={`chart_${visData.label.slice(0, 4)}`}
      visConfig={visConfig}
      vislibData={visData}
      dispatcher={dispatcher}
      renderComplete={renderComplete}
    />);
    expect(chartWrapper).toMatchSnapshot();
  });
});
