/******************************************************************************
 *                              ~jisp.evaluator~                              *
 *                            ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾                            *
 * The meta-circular Jisp evaluator.                                          *
 *     _________________________________________________________________      *
 *        Copyright (c) 2011 Quildreen Motta // Licenced under MIT/X11        *
 ******************************************************************************/

/// Module jisp.evaluator //////////////////////////////////////////////////////
var parser = require('./parser')
  , util   = require('./util')

  , numeric = require('./lib/numeric')

  , error  = parser.error

  , car    = util.car
  , cdr    = util.cdr
  , cadr   = util.cadr
  , caddr  = util.caddr
  , list   = util.list
  , zip    = util.zip
  , clone  = util.clone
  , extend = util.extend

  , numberp      = numeric.numberp
  , quotedp      = util.quotedp
  , symbolp      = util.symbolp
  , identp       = util.identp
  , lambdap      = util.lambdap
  , conditionalp = util.conditionalp
  , applicablep  = util.applicablep
  , booleanp     = util.booleanp


//// Function eval /////////////////////////////////////////////////////////////
//
//   (Array:sexp, Object:env) -> mixed
// 
// Evaluates the given s-expression in the given environment.
//
function eval(sexp, env) {
    return booleanp(sexp)?      sexp
         : numberp(sexp)?       +sexp
         : symbolp(sexp)?       resolve_symbol(sexp)
         : quotedp(sexp)?       unquote(sexp)
         : identp(sexp)?        map_value(sexp, env)
         : lambdap(sexp)?       make_proc(sexp, env)
         : conditionalp(sexp)?  apply_condition(cdr(sexp), env)
         : applicablep(sexp)?   apply.call( env
                                          , operator(sexp, env)
                                          , operands(sexp, env) )
         : error(sexp) }


//// Function apply ////////////////////////////////////////////////////////////
//
//   (fn, args) -> mixed
// 
// Applies a procedure to some argument list.
//
function apply(fn, args) {
    return fn.apply(this, args) }



//// -Input transformation /////////////////////////////////////////////////////

// Resolves a symbol to its text
function resolve_symbol(obj) {
    return obj.slice(1) }

// Unquotes something
function unquote(obj) {
    return cdr(obj) }

// Maps a key to its value in the environment
function map_value(key, env) {
    return env[key] }

// Constructs a procedure
function make_proc(sexp, env) { var binds, body
    binds = cadr(sexp)
    body  = caddr(sexp)
    return function() { var args
        args = list.apply(env, arguments)
        env  = extend(clone(env), zip(binds, args))
        return eval(body, env) }}

// Applies a condition (if <predicate> <consequent> [<alternate>])
function apply_condition(sexp, env) { var pred, pass, fail
    pred = eval(car(sexp), env)
    pass = cadr(sexp)
    fail = caddr(sexp)

    return pred? eval(pass, env)
               : fail && eval(fail, env) }

// Evaluates and returns the operator of a s-expression
function operator(sexp, env) {
    return eval(car(sexp), env) }

// Evaluates and returns the operands of a s-expression
function operands(sexp, env) {
    return eval_sequence(cdr(sexp), env) }

// Evaluates a list of s-expressions
function eval_sequence(sexp, env) {
    return sexp.map(function(val) {
        return eval(val, env) })}


//// -Exports //////////////////////////////////////////////////////////////////
module.exports = { eval:      eval
                 , apply:     apply 
                 , make_proc: make_proc 
                 }