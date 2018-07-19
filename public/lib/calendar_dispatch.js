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
import { VislibLibDispatchProvider as vislibDispatch } from 'ui/vislib/lib/dispatch';

export function calendarDispatchProvider(config) {
  const Dispatch = vislibDispatch(null, config);

  class CalendarDispatch extends Dispatch {
    constructor(handler) {
      super(handler);
    }

    eventResponse(d) {
      return {
        datum: d,
        value: +d.y
      };
    }

    removeEvent(event) {
      return function (selection) {
        selection.each(function () {
          const element = d3.select(this);
          return element.on(event, null);
        });
      };
    }

    removeHoverEvent() {
      this.handler.highlight = null;
      return this.removeEvent('mouseover');
    }

    removeMouseoutEvent() {
      this.handler.unHighlight = null;
      return this.removeEvent('mouseout');
    }

  }

  return CalendarDispatch;
}
