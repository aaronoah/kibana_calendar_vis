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

import moment from 'moment';

export function localeEnProvider({ dow }) {

  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const weekdaysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekdayIndex = weekdays.indexOf(dow);
  for (let i = 0; i < weekdayIndex; ++i) {
    weekdays.push(weekdays.shift());
    weekdaysShort.push(weekdaysShort.shift());
  }

  let doy = 1;
  if (weekdayIndex === 1) { //in France, the week with Jan 4th is the first week of the year
    doy = 4;
  }

  moment.updateLocale(`en-calendar-dow-${dow}`, {
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
    monthsParseExact: true,
    weekdays: weekdays,
    weekdaysShort: weekdaysShort,
    weekdaysParseExact: true,
    meridiem: function (hours) {
      return hours < 12 ? 'AM' : 'PM';
    },
    week: {
      dow: weekdayIndex, // set the first day of the week.
      doy: doy // set the day for the first week of the year
    }
  });

}