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

export const truncateUnusable = (visData) => {
  const toDelete = ['xAxisField', 'xAxisLabel', 'series[0].values[0].aggConfigResult', 'series[0].values[0].aggConfig'];
  return _.cloneDeep(_.omit(visData, toDelete));
};

export const replicateDate = (visData, times = 35) => {
  const step = 86400000;
  const dates = [...visData.series[0].values];
  for (let i = 0; i < times; ++i) {
    const newDate = _.cloneDeep(_.last(dates));
    newDate.x += step;
    newDate.y = i;
    dates.push(newDate);
  }
  visData.series[0].values = dates;
  return visData;
};