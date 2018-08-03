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

import d3 from 'd3';
import _ from 'lodash';
import moment from 'moment';
import { getMonthFormat, getWeekdayFormat, getMonthShortFormat, getWeekdayShortFormat } from '../../../utils';

export const AXIS_SCALE_TYPE = {
  MONTHS: 'MONTHS',
  WEEKS: 'WEEKS'
};

export class CalendarAxisScale {
  constructor(axisConfig) {
    this.axisConfig = axisConfig;
    this.type = this.axisConfig.get('type');

    if(this.type === 'category') {
      this.scaleType = this.axisConfig.get('scale.type');
      const isShort = this.axisConfig.get('labels.truncate');
      this.extents = [];
      if (this.scaleType === AXIS_SCALE_TYPE.MONTHS) {
        if (isShort) {
          this.extents = moment.monthsShort();
        } else {
          this.extents = moment.months();
        }
      } else if (this.scaleType === AXIS_SCALE_TYPE.WEEKS) {
        if (isShort) {
          this.extents = moment.weekdaysShort();
        } else {
          this.extents = moment.weekdays();
        }
      }
    }
  }

  getExtents(data) {
    const min = this.getScaleMin(data);
    const max = this.getScaleMax(data);
    if(this.type === 'category') {
      return [min, max];
    }else if(this.type === 'value') {
      return [Math.min(0, min), Math.max(0, max)];
    }
  }

  getNumericScale(scale) {
    return this.extents.indexOf(scale) + 1;
  }

  setExtents({ scaleMin, scaleMax }) {
    let isSelected = false;
    this.extents = this.extents.filter(value => {
      if (value === scaleMin) {
        isSelected = true;
      }
      if (value === scaleMax) {
        isSelected = false;
        return true;
      }
      return isSelected;
    });
  }

  getScaleMin(data) {
    if(this.type === 'category') {
      const { values } = data.series[0];
      const startDate = _.head(values).x;
      const isShort = this.axisConfig.get('labels.truncate');
      if(this.scaleType === AXIS_SCALE_TYPE.MONTHS) {
        const formatter = isShort ? getMonthShortFormat() : getMonthFormat();
        return moment(startDate).format(formatter);
      } else if(this.scaleType === AXIS_SCALE_TYPE.WEEKS) {
        const formatter = isShort ? getWeekdayShortFormat() : getWeekdayFormat();
        return moment(startDate).format(formatter);
      } else {
        throw new TypeError(`invalid scale type: ${this.scaleType}`);
      }
    } else if(this.type === 'value') {
      if(data.constructor.name === 'CalendarDataObject') {
        return d3.min(this.getAllPoints(data));
      } else {
        throw new TypeError(`invalid data type ${data.constructor.name}, should be CalendarDataObject}`);
      }
    } else {
      throw new TypeError(`invalid axis type: ${this.type}, should be 'category' or 'value'`);
    }
  }

  getScaleMax(data) {
    if (this.type === 'category') {
      const { values } = data.series[0];
      const endDate = _.last(values).x;
      const isShort = this.axisConfig.get('labels.truncate');
      if (this.scaleType === AXIS_SCALE_TYPE.MONTHS) {
        const formatter = isShort ? getMonthShortFormat() : getMonthFormat();
        return moment(endDate).format(formatter);
      } else if (this.scaleType === AXIS_SCALE_TYPE.WEEKS) {
        const formatter = isShort ? getWeekdayShortFormat() : getWeekdayFormat();
        return moment(endDate).format(formatter);
      } else {
        throw new TypeError(`invalid scale type: ${this.scaleType}`);
      }
    } else if (this.type === 'value') {
      if (data.constructor.name === 'CalendarDataObject') {
        return d3.max(this.getAllPoints(data));
      } else {
        throw new TypeError(`invalid data type ${data.constructor.name}, should be CalendarDataObject`);
      }
    } else {
      throw new TypeError(`invalid axis type: ${this.type}, should be 'category' or 'value'`);
    }
  }

  getAllPoints(vislibData) {
    const data = vislibData.chartData();
    const chartPoints = _.reduce(data, (chartPoints, chart) => {
      const points = chart.series.reduce((points, seri) => {
        const axisPoints = seri.values.map(val => {
          if (val.y0) {
            return val.y0 + val.y;
          }
          return val.y;
        });
        return points.concat(axisPoints);
      }, []);
      return chartPoints.concat(points);
    }, []);

    return chartPoints;
  }

}
