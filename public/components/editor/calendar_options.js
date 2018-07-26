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

import { uiModules } from 'ui/modules';
import calendarOptionsTemplate from './calendar_options.html';

uiModules.get('kibana')
  .directive('calendarOptions', function () {
    return {
      restrict: 'E',
      template: calendarOptionsTemplate,
      replace: true,
      link: function ($scope) {

        $scope.collections = $scope.vis.type.editorConfig.collections;

        const startingDay = [];
        if ($scope.editorState.params.locale === 'en_US') {
          $scope.firstDayOfWeek = 'Sunday';
        } else if ($scope.editorState.params.locale === 'en_GB') {
          $scope.firstDayOfWeek = 'Monday';
        }
        $scope.collections.locales.forEach(locale => {
          if (locale === 'en_GB') {
            startingDay.push('Monday');
          } else if (locale === 'en_US') {
            startingDay.push('Sunday');
          }
        });
        $scope.startingDay = startingDay;

        $scope.$watch('firstDayOfWeek', () => {
          if ($scope.firstDayOfWeek === 'Monday') {
            $scope.editorState.params.locale = 'en_GB';
          } else if ($scope.firstDayOfWeek === 'Sunday') {
            $scope.editorState.params.locale = 'en_US';
          }
        });

        $scope.showColorRange = false;
        $scope.showLabels = false;
        $scope.customColors = false;
        $scope.valueAxis = $scope.editorState.params.valueAxes[0];

        $scope.resetColors = function () {
          $scope.uiState.set('vis.colors', null);
          $scope.customColors = false;
        };

        $scope.uiState.on('colorChanged', () => {
          $scope.customColors = true;
        });
      }
    };
  });