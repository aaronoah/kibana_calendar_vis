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
import { CalendarAxis } from './axis/calendar_axis';
import { ChartGrid } from './grid/chart_grid';
import { ChartTitle } from './title/chart_title';

export class CalendarChart extends React.Component {

    state = {
      width: '100%',
      height: '100%',
      rendered: 0
    };

    constructor(props) {
      super(props);
      this.svg = React.createRef();
      this.adjustSize = this.adjustSize.bind(this);
    }

    async adjustSize() {
      await this.setState(prev => ({
        rendered: prev.rendered + 1
      }));

      const { visConfig, renderComplete } = this.props;

      if (this.svg.current && this.state.rendered === visConfig.get('categoryAxes').length + 2) {
        const cellSize = visConfig.get('grid.cellSize');
        const svg = this.svg.current;
        this.setState({
          width: svg.getBBox().width + 2 * cellSize,
          height: svg.getBBox().height + 2 * cellSize
        });
        renderComplete();
      }
    }

    componentDidMount() {
      /*
      * Justification for redundant calls to renderComplete:
      * make tests pass without Timeout errors, does not
      * affect the normal feature behavior.
      */
      this.props.renderComplete();
    }

    render() {
      const { visConfig, vislibData, dispatcher } = this.props;

      return (
        <svg
          width={this.state.width}
          height={this.state.height}
          ref={this.svg}
        >
          <ChartTitle
            gridConfig={visConfig.get('grid')}
            label={vislibData.yAxisLabel}
            dateRef={vislibData.series[0].values[0].x}
            chartType={visConfig.get('type')}
            renderComplete={this.adjustSize}
          />
          {visConfig.get('categoryAxes').map((axisArgs, i) => (
            <CalendarAxis
              key={i}
              type={visConfig.get('type')}
              gridConfig={visConfig.get('grid')}
              axisConfig={axisArgs}
              vislibData={vislibData}
              dispatcher={dispatcher}
              renderComplete={this.adjustSize}
            />
          ))}
          <ChartGrid
            type={visConfig.get('type')}
            gridConfig={visConfig.get('grid')}
            vislibData={vislibData}
            axes={visConfig.get('categoryAxes')}
            dispatcher={dispatcher}
            renderComplete={this.adjustSize}
          />
        </svg>
      );
    }

    componentWillUnmount() {
      this.svg = null;
    }
}
