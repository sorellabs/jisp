/******************************************************************************
 *                               ~jisp.numeric~                               *
 *                             ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾                             *
 * Implements numeric procedures from R6RS.                                   *
 *     _________________________________________________________________      *
 *        Copyright (c) 2011 Quildreen Motta // Licenced under MIT/X11        *
 ******************************************************************************/

var util = require('../util')
 
  , foldl    = util.foldl
  , all_pair = util.all_pair


//// -Arithmetic predicates ////////////////////////////////////////////////////

// Type checking
function numberp(obj) {
    return !isNaN(obj) }

function integerp(obj) {
    return parseInt(obj, 10) === parseInt(obj, 10) }


// Comparisons
function equalp() {
    return all_pair(arguments, function(l, r) {
        return l === r }, true) }

function less_thanp() {
    return all_pair(arguments, function(l, r) {
        return l < r }, true) }

function greater_thanp() {
    return all_pair(arguments, function(l, r) {
        return l > r }, true) }

function less_or_eqp() {
    return all_pair(arguments, function(l, r) {
        return l <= r }, true) }

function greater_or_eqp() {
    return all_pair(arguments, function(l, r) {
        return l >= r }, true) }


// Value checking
function zerop(obj) {
    return obj === 0 }

function positivep(obj) {
    return obj > 0 }

function negativep(obj) {
    return obj < 0 }

function oddp(obj) {
    return obj % 2 != 0 }

function evenp(obj) {
    return obj % 2 == 0 }

function finitep(obj) {
    return isFinite(obj) }

function infinitep(obj) {
    return !isFinite(obj) }

function nanp(obj) {
    return isNaN(obj) }


// Max/min
function max() {
    return Math.max.apply(this, arguments) }

function min() {
    return Math.min.apply(this, arguments) }


// General arithmetic operations
function sum() {
    return foldl(arguments, function(l, r) {
        return l + r }, 0)}

function sub() {
    return foldl(arguments, function(l, r) {
        return l - r }, 0)}

function div() {
    return foldl(arguments, function(l, r) {
        return l / r }, 1)}

function mul() {
    return foldl(arguments, function(l, r) {
        return l * r }, 1)}


//// -Exports //////////////////////////////////////////////////////////////////
module.exports = { numberp:  numberp
                 , integerp: integerp

                 , equalp:         equalp
                 , less_thanp:     less_thanp
                 , greater_thanp:  greater_thanp
                 , less_or_eqp:    less_or_eqp
                 , greater_or_eqp: greater_or_eqp
                 , zerop:          zerop
                 , positivep:      positivep
                 , negativep:      negativep
                 , oddp:           oddp
                 , evenp:          evenp
                 , finitep:        finitep
                 , infinitep:      infinitep
                 , nanp:           nanp
                 
                 , max: max
                 , min: min

                 , sum: sum
                 , sub: sub
                 , mul: mul
                 , div: div
                 }