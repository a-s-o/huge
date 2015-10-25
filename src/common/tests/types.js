'use strict';

const t = require('@aso/tcomb');
const types = require('../types.js');


describe('types.EnvironmentVariable', () => {
   it('is a Type', () => {
      t.test(types.EnvironmentVariable, t.Type);
   });

   it('allows uppercase letters and underscores', () => {
      t.test('SOME_VARIABLE', types.EnvironmentVariable);
   });

   it('rejects lower case strings', () => {
      t.test.not('SOME-VARIABLE', types.EnvironmentVariable);
      t.test.not('SOME_VARIABLe', types.EnvironmentVariable);
      t.test.not('SOME_VARIABL#', types.EnvironmentVariable);
      t.test.not('SOME_VARIABL$', types.EnvironmentVariable);
   });
});

describe('types.Logger', () => {
   const logger = require('bunyan').createLogger({ name: 'test' });

   it('is a tcomb Type', () => {
      t.test(types.Logger, t.Type);
   });

   it('allows top-level bunyan loggers', () => {
      t.test(logger, types.Logger);
   });

   it('allows child loggers', () => {
      t.test(logger.child({ some: 'component' }), types.Logger);
   });
});
