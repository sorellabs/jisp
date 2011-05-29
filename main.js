function parse(data){
    var lparen = /\s*\(\s*/g
      , rparen = /\s*\)\s*/g
      , param  = /([\[\],])([^\]\[,]+?)(?=[\[\],])/g

    return JSON.parse(data.trim()
                          .replace(lparen,  '[')      // start sexp
                          .replace(rparen,  ']')      // ends sexp
                          .replace(/\s+/g,  ',')      // param separator
                          .replace(param,   '$1"$2"') // sanitize parms
                          .replace(/"\[/g,  '",[')    // \ 
                          .replace(/\]"/g,  '],"')    //  ~ sanitize subsexps
                          .replace(/\]\[/g, '],['))}  // /

function numberp(sexp){
    return !isNaN(+sexp)}

function strp(sexp){
    return Object.prototype.toString.call(sexp) == '[object String]'}

function variablep(sexp){
    return strp(sexp) && /[a-z:!@#$%&*+=_^?><.\-\/|]/.test(sexp)}

function symbolp(sexp){
    return strp(sexp) && /^'/.test(sexp)}

function lambdap(sexp){
    return car(sexp) == 'λ' }

function procp(sexp){
    return car(sexp) && car(sexp).procp }

function applicablep(sexp){
    return Array.isArray(sexp)}

function eval(sexp, env){
    return numberp(sexp)?     +sexp
         : symbolp(sexp)?     resolve_symbol(sexp)
         : variablep(sexp)?   map_value(sexp, env)
         : lambdap(sexp)?     make_proc(sexp, env)
         : applicablep(sexp)? apply(operator(sexp, env)
                                   ,operands(sexp, env))
         : error(sexp)}

function eval_sequence(sexp, env){
    return sexp.map(function(val){
        return eval(val, env)})}

function operator(sexp, env){
    return eval(car(sexp), env)}

function operands(sexp, env){
    return eval_sequence(cdr(sexp), env)}

function resolve_symbol(sexp){
    return cdr(sexp)}

function make_proc(sexp, env){var binds, body
    binds = cadr(sexp)
    body  = caddr(sexp)
    return function(){var args
        args = [].slice.call(arguments)
        env  = extend(clone(env), zip(binds, args))
        return eval(body, env)}}

function apply(fn, args){
    return fn.apply(fn, args)}

function error(sexp){
    throw new Error("Error: couldn't parse the following shit:\n\n"
                   +JSON.stringify(sexp))}

function car(list){
    return list[0]}

function cdr(list){
    return list.slice(1)}

function cadr(list){
    return car(cdr(list))}

function cddr(list){
    return cdr(cdr(list))}

function caddr(list){
    return car(cddr(list))}

function map_value(key, env){
    return env[key]}

function clone(obj){
    return extend({}, obj)}

function zip(keys, values){var x
    x = {}
    keys.forEach(function(key, idx){
        x[key] = values[idx]})
    return x}

function extend(tgt, src){
    Object.keys(src).forEach(function(key){
        tgt[key] = src[key]})
    return tgt}

function fold(list, fn, start){
    list  = [].slice.call(list)
    start = car(list) == null ? 0 : car(list)
    return cdr(list).reduce(fn, start)}

function map(list, fn){
    return [].slice.call(list).map(fn)}

// Env functions
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

function def(name, value){
    return env[name] = value}


// test code
var env = {'+': add
          ,'-': sub
          ,'/': div
          ,'*': mul
          ,'%': mod
          ,'|': abs
          ,'def': def}

function e(exp){
    return eval(parse(exp), env)}


console.log(e('(+ 137 349)'),  486)
console.log(e('(- 1000 333)'), 667)
console.log(e('(* 5 99)'),     495)
console.log(e('(/ 10 5)'),     2)
console.log(e('(+ 2.7 10)'),   12.7)

console.log(e('(+ 21 35 12 7)'), 75)
console.log(e('(* 25 4 12)'),    1200) 

console.log(e('(+ (* 3 5) (- 10 6))'), 19)
console.log(e('(+ (* 3 (+ (* 2 4) (+ 3 5))) (+ (- 10 7) 6))'), 57)

e('(def \'pi 3.14)')
e('(def \'radius 10)')
console.log(e('(* pi (* radius radius))'))

console.log(e('((λ(x y)(* x y)) 3 4)'), 12)

e('(def \'square (λ (x) (* x x)))')
console.log(e('(square 3)'), 9)

console.log(e('(| -3)'))