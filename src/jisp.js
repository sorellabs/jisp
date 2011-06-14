/******************************************************************************
 *                                   ~jisp~                                   *
 *                                 ‾‾‾‾‾‾‾‾‾‾                                 *
 * The entry-point for the Jisp evaluator.                                    *
 *     _________________________________________________________________      *
 *        Copyright (c) 2011 Quildreen Motta // Licenced under MIT/X11        *
 ******************************************************************************/
/// Module jisp ////////////////////////////////////////////////////////////////
var parser    = require('./parser')
  , evaluator = require('./evaluator')
  , util      = require('./util')

  // Libraries
  , core      = require('./lib/core')
  , numeric   = require('./lib/numeric')

  , clone     = util.clone

  , parse     = parser.parse
  , eval      = evaluator.eval
  , apply     = evaluator.apply


//// Object Jisp ///////////////////////////////////////////////////////////////
function Jisp(env) {
    this.env = env || clone(default_env)
}
Jisp.prototype = function() {
    return { parse: parse
           , run:   run 
           , test:  test
           }

    function run(sexp) {
        return eval(parse(sexp), this.env)
    }

    function test(sexp, expected) {
        try {
            console.log('>>>',         this.parse(sexp)
                       ,'\n\n',        this.run(sexp)
                       ,'\nExpected:', expected )
        } catch(e) {
            console.log('>>>',         sexp
                       ,'\nExpected:', expected
                       ,'\n\nError:',  e.message, '\n' + e.stack)
        }
        console.log('-------------------------------------------------------\n')
    }
}()

//// -Default environment //////////////////////////////////////////////////////
var default_env = { 'boolean?':   util.booleanp
                  , 'pair?':      util.pairp
                  , 'symbol?':    util.quotedp
                  , 'number?':    util.numberp
                  , 'procedure?': util.procp
                  , 'null?':      util.nullp

                  // Syntax
                  , '#f':   false
                  , '#t':   true
                  , 'nil':  null
                  , '+inf': Infinity
                  , '-inf': -Infinity
                  , 'nan':  NaN

                  // Core
                  , 'define':     core.define
                  , 'let':        core._let
                  , 'set!':       core.define

                  // Numeric
                  , 'number?':    numeric.numberp
                  , 'integer?':   numeric.integerp

                  , '=':          numeric.equalp
                  , '<':          numeric.less_thanp
                  , '>':          numeric.greater_thanp
                  , '<=':         numeric.less_or_eqp
                  , '>=':         numeric.greater_or_eqp

                  , 'zero?':      numeric.zerop
                  , 'positive?':  numeric.positivep
                  , 'negative?':  numeric.negativep
                  , 'odd?':       numeric.oddp
                  , 'even?':      numeric.evenp
                  , 'finite?':    numeric.finitep
                  , 'infinite?':  numeric.infinitep
                  , 'nan?':       numeric.nanp

                  , 'max':        numeric.max
                  , 'min':        numeric.min

                  , '+':          numeric.sum
                  , '-':          numeric.sub
                  , '*':          numeric.mul
                  , '/':          numeric.div

                  , 'div':         numeric.div0
                  , 'mod':         numeric.mod0
                  , 'div_and_mod': numeric.div_and_mod
                  
                  , 'abs':        Math.abs
                  , 'floor':      Math.floor
                  , 'ceiling':    Math.ceil
                  , 'round':      Math.round
                  , 'truncate':   numeric.truncate

                  , 'exp':        Math.exp
                  , 'log':        Math.log
                  , 'sin':        Math.sin
                  , 'cos':        Math.cos
                  , 'tan':        Math.tan
                  , 'asin':       Math.asin
                  , 'acos':       Math.acos
                  , 'atan':       numeric.atan

                  , 'sqrt':       Math.sqrt
                  , 'expt':       Math.pow
                  }

//// -Exports //////////////////////////////////////////////////////////////////
module.exports = { Jisp: Jisp
                 , env:  default_env }

/*
boolean?          pair?
symbol?           number?
char?             string?
vector?           procedure?
null?
*/