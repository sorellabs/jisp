/******************************************************************************
 *                                   ~jisp~                                   *
 *                                 ‾‾‾‾‾‾‾‾‾‾                                 *
 * Small lisp subset interpreter in JavaScript                                *
 *     _________________________________________________________________      *
 *        Copyright (c) 2011 Quildreen Motta // Licenced under MIT/X11        *
 ******************************************************************************/
var slice   = Array.prototype.slice
  , classOf = Object.prototype.toString


// Parse a string containing Lisp code
function parse(data){
    var lparen = /\s*\(\s*/g
      , rparen = /\s*\)\s*/g
      , param  = /([\[\],])([^\]\[,]+?)(?=[\[\],])/g

    if (/["\[\]]/.test(data)) error(data)
    return JSON.parse(data.trim()
                          .replace(lparen,  '[')      // start sexp
                          .replace(rparen,  ']')      // ends sexp
                          .replace(/\s+/g,  ',')      // param separator
                          .replace(param,   '$1"$2"') // sanitize parms
                          .replace(/"\[/g,  '",[')    // \ 
                          .replace(/\]"/g,  '],"')    //  ~ sanitize sexps
                          .replace(/\]\[/g, '],['))}  // /

// Checks if something is a Number (or rather, can be treated as one)
function numberp(sexp){
    return !isNaN(+sexp)}

// Checks if something is a String
function strp(sexp){
    return classOf.call(sexp) == '[object String]'}

// Check if something is a valid Lisp identifier
function variablep(sexp){
    return strp(sexp) && /[^\s\()']/.test(sexp)}

// Check if something is a symbol
function symbolp(sexp){
    return strp(sexp) && /^'/.test(sexp)}

// Check if something is a lambda
function lambdap(sexp){
    return car(sexp) == 'λ'}

// Check if something is a procedure
function procp(sexp){
    return car(sexp) && car(sexp).procp}

// Check if something is a function application
function applicablep(sexp){
    return Array.isArray(sexp)}

// Checks if something is freaking quoted
function quotedp(sexp){
    return pairp(sexp) && car(sexp) == "'"}

// Evals a Lisp s-expression
function eval(sexp, env){
    return numberp(sexp)?     +sexp
         : quotedp(sexp)?     cdr(sexp)
         : symbolp(sexp)?     resolve_symbol(sexp)
         : variablep(sexp)?   map_value(sexp, env)
         : lambdap(sexp)?     make_proc(sexp, env)
         : applicablep(sexp)? apply(operator(sexp, env)
                                   ,operands(sexp, env))
         : error(sexp)}

// Evals a list of S-expressions
function eval_sequence(sexp, env){
    return sexp.map(function(val){
        return eval(val, env)})}

// Evaluates and returns an operator
function operator(sexp, env){
    return eval(car(sexp), env)}

// Evaluates and returns operands
function operands(sexp, env){
    return eval_sequence(cdr(sexp), env)}

// Resolves a symbol to it's text
function resolve_symbol(sexp){
    return cdr(sexp)}

// Constructs a procedure
function make_proc(sexp, env){var binds, body
    binds = cadr(sexp)
    body  = caddr(sexp)
    return function(){var args
        args = list.apply(this, arguments)
        env  = extend(clone(env), zip(binds, args))
        return eval(body, env)}}

// Applies a function/procedure to some argument list
function apply(fn, args){
    return fn.apply(fn, args)}

// Throws a parsing error
function error(sexp){
    throw new Error("Error: couldn't parse the following shit:\n\n"
                   +JSON.stringify(sexp))}

//// Helper functions //////////////////////////////////////////////////////
function car(l){
    return l[0]}

function cdr(l){
    return l.slice(1)}

function cadr(l){
    return car(cdr(l))}

function cddr(l){
    return cdr(cdr(l))}

function caddr(l){
    return car(cddr(l))}

// Maps a list a key to their value
function map_value(key, env){
    return env[key]}

// Clones an object
function clone(obj){
    return extend({}, obj)}

// Creates a dictionary with the given keys and values
function zip(keys, values){var x
    x = {}
    keys.forEach(function(key, idx){
        x[key] = values[idx]})
    return x}

// Extend an object with the given dictionary
function extend(tgt, src){
    Object.keys(src).forEach(function(key){
        tgt[key] = src[key]})
    return tgt}

// reduce from left -> right
function fold(l, fn, start){
    l     = list.apply(this, l)
    start = car(l) == null ? 0 : car(l)
    return cdr(l).reduce(fn, start)}

// Maps values using the given function
function map(l, fn){
    return list.apply(this, l).map(fn)}

function every(l, fn){
    return list.apply(this, l).every(fn)}

///// Functions used for the environment ///////////////////////////////////
function append(){
    return list.apply(this, arguments).reduce(function(l, item){
        return l.concat(item) }, [])}

function assoc(key, l){
    return l.reduce(function(result, item){
        return car(item) === key? item : result })}

function atomp(obj){
    return !pairp(obj)}

function pairp(obj){
    return Array.isArray(obj)}

function average(){
    return add.apply(this, arguments) / arguments.length}

function booleanp(){
    return every(arguments, function(item){
        return classOf.call(item) == '[object Boolean]'})}

function charp(){
    return every(arguments, function(item){
        strp(item) && item.length == 1})}

function cons(l, r){
    return list(l, r)}

function cos(){
    return map(arguments, function(item){
        return Math.cos(item)})}

function def(name, value){
    return jisp.env[name] = value}

function display(){
    console.log.apply(console, arguments)
    return list.apply(this, arguments)}

function emptyp(exp){
    return pairp(exp) && !exp.length}

function equalp(){
    return fold(arguments, function(l, r){
        return l === r}, true)}

function equivp(){
    return fold(arguments, function(l, r){
        return l == r}, true)}

function flatten(){
    return list.apply(this, arguments).reduce(function(acc, l){
        pairp(l)? acc.push.apply(acc, flatten.apply(this, l))
                : acc.push(l)
        return acc}, [])}

function fnp(exp){
    return typeof exp == 'function'}

function not(exp){
    return !exp || !nullp(exp)}

function nth_cdr(l, start, count){
    return l.slice(start, count)}

function nullp(exp){
    return exp == null || emptyp(exp)}

function quote(exp){
    return ["'", exp]}

function add(){
    return fold(arguments, function(l, r){
        return l + r })}

function sub(){
    return fold(arguments, function(l, r){
        return l - r })}

function div(){
    return fold(arguments, function(l,r){
        return l / r })}

function mul(){
    return fold(arguments, function(l,r){
        return l * r})}

function mod(){
    return fold(arguments, function(l, r){
        return l % r})}

function abs(){
    return Math.abs(arguments[0])}

function list(){
    return slice.call(arguments)}

var env = 
    { 'abs':     abs
    , 'append':  append
    , 'assoc':   assoc
    , 'atom?':   atomp
    , 'average': average
    , 'bool?':   booleanp
    , 'car':     car
    , 'cdr':     cdr
    , 'cadr':    cadr
    , 'cddr':    cddr
    , 'char?':   charp
    , 'cons':    cons
    , 'def':     def
    , 'display': display
    , 'empty?':  emptyp
    , 'flatten': flatten
    , 'list':    list
    , 'map':     map
    , 'nth-cdr': nth_cdr
    , 'number?': numberp
    , 'null?':   nullp
    , 'not':     not
    , 'pair?':   pairp
    , 'proc?':   fnp
    , 'reduce':  fold
    , '=':       equalp
    , '≃':       equivp
    , '+':       add
    , '-':       sub
    , '/':       div
    , '*':       mul
    , '%':       mod
    }


exports.eval = eval
exports.parse = parse
exports.env   = env
