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

import { expect } from 'chai';
import sinon from 'sinon';
import { Dispatcher } from '../../lib';

describe('Dispatcher', () => {

  let dispatcher;
  const callback = sinon.spy();

  beforeEach(() => {
    dispatcher = new Dispatcher();
  });

  afterEach(() => {
    dispatcher = null;
  });

  it('should reject calls to addEvent and removeEvent if source and dataTarget not set', () => {
    let errorAdd;
    try {
      dispatcher.addEvent('click', callback);
    } catch (e) {
      errorAdd = e.message;
    }

    expect(errorAdd).to.equal('source or dataTarget is not defined');

    let errorRemove;
    try {
      dispatcher.removeEvent('click', callback);
    } catch (e) {
      errorRemove = e.message;
    }

    expect(errorRemove).to.equal('source or dataTarget is not defined');
  });

  it('should reject when invalid container is added', () => {
    let error;
    try {
      dispatcher.addContainer('wrongType');
    } catch (e) {
      error = e.message;
    }

    expect(error).to.equal('invalid type wrongType, should be HTMLElement');
  });

  it('should reject when invalid dataTarget is added', () => {
    let error;
    try {
      dispatcher.addDataTarget('wrong');
    } catch (e) {
      error = e.message;
    }

    expect(error).to.equal('invalid type string, should be in a form [data-...]');
  });

  it('should add and remove event', () => {
    const targets = document.createDocumentFragment();
    for (let i = 0; i < 3; ++i) {
      const elem = document.createElement('div');
      targets.appendChild(elem);
      elem.setAttribute('data-test', i);
    }
    const div = document.createElement('div');
    div.appendChild(targets);
    document.body.appendChild(div);

    dispatcher.addContainer(div).addDataTarget('[data-test]').addEvent('click', callback);
    document.querySelector('[data-test]').click();
    expect(callback.calledOnce).to.equal(true);
  });

});