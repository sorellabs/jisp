/******************************************************************************
 *                             ~jisp.lib.boolean~                             *
 *                           ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾                           *
 * Implements boolean stuff from R6RS                                         *
 *     _________________________________________________________________      *
 *        Copyright (c) 2011 Quildreen Motta // Licenced under MIT/X11        *
 ******************************************************************************/

var util = require('../util')

  , class_of = Object.prototype.toString
  , all_pair = util.all_pair


function not(obj) {
    return !obj }

function booleanp(obj) {
    return class_of.call(obj) == '[object Boolean]' }

function boolean_eqp() {
    return all_pair(arguments, function(l, r) {
        return booleanp(l) && l === r }, true) }


//// -Exports //////////////////////////////////////////////////////////////////
module.exports = { not:         not
                 , booleanp:    booleanp
                 , boolean_eqp: boolean_eqp }

