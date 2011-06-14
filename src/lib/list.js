/******************************************************************************
 *                              ~jisp.lib.list~                               *
 *                            ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾                             *
 * List handling stuff                                                        *
 *     _________________________________________________________________      *
 *        Copyright (c) 2011 Quildreen Motta // Licenced under MIT/X11        *
 ******************************************************************************/

var slice = Array.prototype.slice
  , util  = require('../util')

  , foldl = util.foldl


// Type checking
function pairp(obj) {
    return Array.isArray(obj)
        && obj.length }

function nullp(obj) {
    return obj == null }

function listp(obj) {
    return Array.isArray(obj) }


// Making objects
function cons(obj1, obj2) {
    return [obj1, obj2] }

function list() {
    return slice.call(arguments) }

// Accessors
function car(obj) {
    return obj[0] }

function cdr(obj) {
    return obj.slice(1) }

// Composed
function caar(obj)  { return car(car(obj)) }
function cadr(obj)  { return car(cdr(obj)) }
function cddr(obj)  { return cdr(cdr(obj)) }
function caaar(obj) { return car(car(car(obj))) }
function caadr(obj) { return car(car(cdr(obj))) }
function cadar(obj) { return car(cdr(car(obj))) }
function cdaar(obj) { return cdr(car(car(obj))) }
function caddr(obj) { return car(cdr(cdr(obj))) }
function cddar(obj) { return cdr(cdr(car(obj))) }
function cdddr(obj) { return cdr(cdr(cdr(obj))) }
function caaaar(obj){ return car(car(car(car(obj)))) }
function caaadr(obj){ return car(car(car(cdr(obj)))) }
function caadar(obj){ return car(car(cdr(car(obj)))) }
function cadaar(obj){ return car(cdr(car(car(obj)))) }
function cdaaar(obj){ return cdr(car(car(car(obj)))) }
function caaddr(obj){ return car(car(cdr(cdr(obj)))) }
function caddar(obj){ return car(cdr(cdr(car(obj)))) }
function cddaar(obj){ return cdr(cdr(car(car(obj)))) }
function cadddr(obj){ return car(cdr(cdr(cdr(obj)))) }
function cdddar(obj){ return cdr(cdr(cdr(car(obj)))) }
function cddddr(obj){ return cdr(cdr(cdr(cdr(obj)))) }


// List manipulation
function length(obj) {
    return obj.length }

function append() {
    return foldl(arguments, function(tgt, src) {
        tgt.push.apply(tgt, src)
        return tgt }, []) }
        
function reverse(obj) {
    return obj.concat().reverse() }

function list_tail(obj, index) {
    if (index > length(obj)) throw new Error("index out of list bounds")
    return obj.slice(index) }

function list_ref(obj, index) {
    if (index >= length(obj)) throw new Error("index out of list bounds")
    return obj[index] }


// TODO: support multiple lists
function map(proc, obj) {
    return obj.map(proc) }

function for_each(proc, obj) {
    obj.forEach(proc) }


//// -Exports //////////////////////////////////////////////////////////////////
module.exports = { pairp:     pairp
                 , listp:     listp
                 , nullp:     nullp

                 , cons:      cons
                 , list:      list
                 , car:       car
                 , cdr:       cdr
                 
                 , length:    length
                 , append:    append
                 , reverse:   reverse
                 , list_tail: list_tail
                 , list_ref:  list_ref

                 , map:       map
                 , for_each:  for_each
                 }