'use strict';

const t = require('@aso/tcomb');
const _ = require('lodash');

function typedFunc (obj) {
   return t.func(obj.inputs || [], obj.outputs || t.Any).of(obj.fn);
}

exports.typedFunc = typedFunc({
   inputs: [t.struct({
      inputs: t.maybe(t.Array),
      output: t.maybe(t.irreducible(t.isType, 'TcombType')),
      fn: t.Function
   })],
   output: t.Function,
   fn: typedFunc
});
