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

import path from 'path';

const kbnDir = path.resolve(__dirname, '../../../../kibana');

export default {
  rootDir: path.resolve(__dirname, '../..'),
  roots: [
    '<rootDir>/public',
  ],
  modulePaths: [
    `${kbnDir}/node_modules`
  ],
  collectCoverageFrom: [
    `${kbnDir}/packages/kbn-ui-framework/src/components/**/*.js`,
    `${kbnDir}/!packages/kbn-ui-framework/src/components/index.js`,
    `${kbnDir}/!packages/kbn-ui-framework/src/components/**/*/index.js`,
    `${kbnDir}/packages/kbn-ui-framework/src/services/**/*.js`,
    `${kbnDir}/!packages/kbn-ui-framework/src/services/index.js`,
    `${kbnDir}/!packages/kbn-ui-framework/src/services/**/*/index.js`,
  ],
  moduleNameMapper: {
    '^ui/(.*)': `${kbnDir}/src/ui/public/$1`,
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': `${kbnDir}/src/dev/jest/mocks/file_mock.js`,
    '\\.(css|less|scss)$': `${kbnDir}/src/dev/jest/mocks/style_mock.js`,
  },
  setupFiles: [
    `${kbnDir}/src/dev/jest/setup/babel_polyfill.js`,
    `${kbnDir}/src/dev/jest/setup/enzyme.js`,
    `${kbnDir}/src/dev/jest/setup/throw_on_console_error.js`,
  ],
  coverageDirectory: `${kbnDir}/target/jest-coverage`,
  coverageReporters: [
    'html',
  ],
  globals: {
    'ts-jest': {
      skipBabel: true,
    },
  },
  moduleFileExtensions: [
    'js',
    'json',
    'ts',
    'tsx',
  ],
  modulePathIgnorePatterns: [
    '__fixtures__/',
    'target/',
  ],
  testMatch: [
    '**/*.test.{js,ts,tsx}'
  ],
  transform: {
    '^.+\\.js$': `${kbnDir}/src/dev/jest/babel_transform.js`,
    '^.+\\.tsx?$': `${kbnDir}/src/dev/jest/ts_transform.js`,
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.js$',
  ],
  snapshotSerializers: [
    `${kbnDir}/node_modules/enzyme-to-json/serializer`,
  ],
  reporters: [
    'default',
    `${kbnDir}/src/dev/jest/junit_reporter.js`,
  ],
};
