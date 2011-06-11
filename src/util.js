/******************************************************************************
 *                                ~jisp.util~                                 *
 *                              ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾                               *
 * Utilities for the parser/meta-circular evaluator.                          *
 *     _________________________________________________________________      *
 *        Copyright (c) 2011 Quildreen Motta // Licenced under MIT/X11        *
 ******************************************************************************/

/// Module jisp.util ///////////////////////////////////////////////////////////

var slice    = Array.prototype.slice
  , class_of = Object.prototype.toString


//// -List helpers /////////////////////////////////////////////////////////////

// Basic car/cdr accessors
function car(seq) {
    return seq[0] }

function cdr(seq) {
    return seq.slice(1) }

function cadr(seq) {
    return car(cdr(seq)) }

function cddr(seq) {
    return cdr(cdr(seq)) }

function caddr(seq) {
    return car(cddr(seq)) }

function nth(seq, idx) {
    return seq.slice(idx) }

function nth_car(seq, idx) {
    return car(nth(seq, idx)) }

function nth_cadr(seq, idx) {
    return cadr(nth(seq, idx)) }

// Converts the positional arguments to a list
function list() {
    return slice.call(arguments) }


//// -Type checking ////////////////////////////////////////////////////////////

// Checks if something is a String
function strp(obj) {
    return class_of.call(obj) == '[object String]' }

// Checks if something is freaking quoted
function quotedp(obj) {
    return pairp(obj) && car(obj) == "quote" }

// Checks if something is a symbol
function symbolp(obj) {
    return strp(obj) && /^'/.test(obj) }

// Checks if something is a valid Lisp identifier
function identp(obj) {
    return strp(obj) && /[^\s\()']/.test(obj) }

// Checks if something is a lambda
function lambdap(obj) {
    return car(obj) == 'λ'
        || car(obj) == 'lambda'}

// Checks if something is an if-condition
function conditionalp(obj) {
    return car(obj) == 'if' }

// Checks if something is usable as a function application
function applicablep(obj) {
    return pairp(obj) }

// Checks if something is a pair
function pairp(obj) {
    return Array.isArray(obj) }

// Checks if something is a procedure
function procp(obj) {
    return typeof obj == 'function' }

// Checks if something is a boolean
function booleanp(obj) {
    return class_of.call(obj) == '[object Boolean]' }

// Checks if something is null (or undefined)
function nullp(obj) {
    return obj == null }


//// -Object helpers ///////////////////////////////////////////////////////////

// Extends an object with the given dictionary
function extend(tgt, src) {
    return Object.keys(src).reduce(function(obj, key) {
        obj[key] = src[key]
        return obj }, tgt) }

// Creates a shallow-clone of an Object
function clone(obj) {
    return extend({}, obj) }

// Creates a dictionary with the given keys and values
function zip(keys, values) {
    return keys.reduce(function(obj, key, idx) {
        obj[key] = values[idx]
        return obj }, {}) }

// Reduce left -> right
function foldl(seq, fn, start) {
    seq   = list.apply(this, seq)
    start = start == null? car(seq)
                         : start

    return cdr(seq).reduce(fn, start) }

// Array#every
function all(seq, fn) {
    return list.apply(this, seq).every(fn) }

// Array#every for pairs
function all_pair(seq, fn) {
    return all(seq, function(_, idx, seq) { var left, right
        left  = nth_car(seq, idx)
        right = nth_cadr(seq, idx)
        
        return left && right? fn.call(this, left, right, idx, seq)
                            : true })}



//// -Exports //////////////////////////////////////////////////////////////////
module.exports = { car:   car
                 , cdr:   cdr
                 , cadr:  cadr
                 , cddr:  cddr
                 , caddr: caddr
                 , list:  list

                 , strp:         strp
                 , symbolp:      symbolp
                 , quotedp:      quotedp
                 , identp:       identp
                 , lambdap:      lambdap
                 , conditionalp: conditionalp
                 , applicablep:  applicablep
                 , procp:        procp
                 , booleanp:     booleanp
                 , nullp:        nullp

                 , extend:   extend
                 , clone:    clone
                 , zip:      zip 
                 , foldl:    foldl
                 , all:      all
                 , all_pair: all_pair
                 }