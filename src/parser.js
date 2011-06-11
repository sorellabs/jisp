/******************************************************************************
 *                               ~jisp.parser~                                *
 *                             ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾                              *
 * The parser for Jisp.                                                       *
 *     _________________________________________________________________      *
 *        Copyright (c) 2011 Quildreen Motta // Licenced under MIT/X11        *
 ******************************************************************************/

/// Module jisp.parser /////////////////////////////////////////////////////////

//// Function parse ////////////////////////////////////////////////////////////
//
//   (String:data) -> Array
// 
// Transform a string containing into an Array of Strings.
//
function parse(data) {
    var lparen = /\s*\(\s*/g
      , rparen = /\s*\)\s*/g
      , param  = /([\[\],])([^\]\[,]+?)(?=[\[\],])/g
      , single = /^([^\[]+)/

    if (/["\[\]]/.test(data)) error(data)
    data = data.trim()
               .replace(lparen,  '[')      // start sexp
               .replace(rparen,  ']')      // ends sexp
               .replace(/\s+/g,  ',')      // param separator
               .replace(param,   '$1"$2"') // sanitize parms
               .replace(single,  '"$1"')
               .replace(/"\[/g,  '",[')    // \ 
               .replace(/\]"/g,  '],"')    //  ~ sanitize sexps
               .replace(/\]\[/g, '],[')    // /

    console.log('--', data)
    return JSON.parse(data) }


//// Function error ////////////////////////////////////////////////////////////
//
//   (Object:sexp) -> 
// 
// Throws a parsing error.
//
function error(sexp) {
    throw new Error( 'Error: couldn\'t parse the following shit: \n\n'
                   + JSON.stringify(sexp) )}


//// -Exports //////////////////////////////////////////////////////////////////
module.exports = { parse: parse 
                 , error: error }