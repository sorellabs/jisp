/******************************************************************************
 *                              ~jisp.lib.core~                               *
 *                            ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾                             *
 * Base R6RS-like core library for Jisp.                                      *
 *     _________________________________________________________________      *
 *        Copyright (c) 2011 Quildreen Motta // Licenced under MIT/X11        *
 ******************************************************************************/
/// Module jisp.lib.core ///////////////////////////////////////////////////////

var util = require('../util')
  , eval = require('../evaluator')

  , car  = util.car
  , cadr = util.cadr

  , make_proc = eval.make_proc


// Defines a variable in the environment
function define(name, value) {
    return this[name] = value }

// Creates local bindings
function _let(binds, body) { var args, values
    args = values = []
    binds.forEach(function(exp) {
        args.push(car(exp))
        values.push(cadr(exp)) })

    return make_proc(args, body).apply(this, values) }


//// -Exports //////////////////////////////////////////////////////////////////
module.exports = { define: define
                 , _let:   _let
                 }

