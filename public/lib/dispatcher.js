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

export class Dispatcher {
  constructor() {
    this.container = null;
    this.src = null;
    this.dataTarget = null;
    this.config = null;
    this.API = null;
  }

  newMapping() {
    this.src = null;
    this.dataTarget = null;
    return this;
  }

  addAPI(API) {
    this.API = API;
    return this;
  }

  addConfig(config) {
    this.config = config;
    return this;
  }

  addContainer(container) {
    if (container instanceof HTMLElement) {
      this.container = container;
    } else {
      throw new TypeError(`invalid type ${container.toString()}, should be HTMLElement`);
    }

    return this;
  }

  addSource(src) {
    this.src = src;
    return this;
  }

  addDataTarget(dataTarget) {
    if (!/^\[data-.*\]$/.test(dataTarget)) {
      throw new TypeError(`invalid type ${typeof dataTarget}, should be in a form [data-...]`);
    }
    this.dataTarget = dataTarget;
    return this;
  }

  addEvent(event, callback) {
    if (this.source === null || this.dataTarget === null) {
      throw new TypeError(`source or dataTarget is not defined`);
    }

    const selection = d3.selectAll(this.dataTarget);
    const self = this;
    const nodes = this.src !== null ? [].slice.call(this.container.querySelectorAll(this.src)) : [];
    selection.each(function () {
      const element = d3.select(this);
      if (nodes.length !== 0 && !nodes.includes(this)) {
        return;
      }

      if (typeof callback === 'function') {
        const options = {
          API: self.API,
          config: self.config,
          container: self.container,
          source: self.src,
          dataTarget: self.dataTarget
        };
        return element.on(event, callback.bind(this, options));
      }
    });

    return this;
  }

  removeEvent(event) {
    if (this.source === null || this.dataTarget === null) {
      throw new TypeError(`source or dataTarget is not defined`);
    }

    const selection = d3.selectAll(this.dataTarget);
    selection.each(function () {
      const element = d3.select(this);
      element.on(event, null);
    });

    return this;
  }

}
