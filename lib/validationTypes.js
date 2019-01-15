/* All the validation types and the method name to validate */

var V = require('validator');

/* Add in Validator object the isString method */
V.isString = function(value){
  return _.isString(value)
};
/* Add in Validator object the isBoolean method */
V.isBoolean = function(value){
  return _.isBoolean(value);
};

V.isArray = function(value) {
  return _.isArray(value);
}

V.isObject = function(value) {
  return _.isPlainObject(value);
}

V.isAny = function(value) {
  return true;
}

module.exports = {

  'alpha': {
    method: 'isAlpha'
  },
  'alphanumeric': {
    method: 'isAlphanumeric'
  },
  'ascii': {
    method: 'isAscii'
  },
  'array': {
    method: 'isArray'
  },
  'any': {
    method: 'isAny'
  },
  'base64': {
    method: 'isBase64'
  },
  'boolean': {
    method: 'isBoolean',
    sanitizer: V.toBoolean
  },
  'creditcard': {
    method: 'isCreditCard'
  },
  'date': {
    method: 'isDate',
    sanitizer: V.toDate
  },
  'email': {
    method: 'isEmail'
  },
  'float': {
    method: 'isFloat',
    sanitizer: V.toFloat
  },
  'hex': {
    method: 'isHexadecimal'
  },
  'hexcolor': {
    method: 'isHexColor'
  },
  'int': {
    method: 'isInt',
    sanitizer: V.toInt
  },
  'ip': {
    method: 'isIP'
  },
  'json': {
    method: 'isJSON',
    sanitizer: JSON.parse
  },
  'lowercase': {
    method: 'isLowercase'
  },
  'mongoid' : {
    method: 'isMongoId'
  },
  'numeric': {
    method: 'isNumeric',
    sanitizer: V.toFloat
  },
  'object': {
    method: 'isObject'
  },
  'string': {
    sanitizer: 'toString'
  },
  'url': {
    method: 'isURL'
  },
  'uppercase': {
    method: 'isUppercase'
  },

  // ---- Conversion filters ----

  'toboolean': {
    method: 'isBoolean',
    sanitizer: V.toBoolean,
    type: 'boolean'
  },
  'todate': {
    method: 'isDate',
    sanitizer: V.toDate,
    type: 'date'
  },
  'toemail': {
    method: 'isEmail',
    sanitizer: V.normalizeEmail,
    type: 'email'
  },
  'tolowercase': {
    method: 'isString',
    sanitizer: toLowerCase,
    type: 'string'
  },
  'touppercase': {
    method: 'isString',
    sanitizer: toUpperCase,
    type: 'string'
  },
  'toint': {
    method: 'isInt',
    sanitizer: V.toInt,
    type: 'int'
  },
  'tofloat': {
    method: 'isFloat',
    sanitizer: V.toFloat,
    type: 'float'
  }

};

/*
* toLowerCase - Function
* @params - value {String}
* Check if is posible to set the string .toLowerCase and if it is lowerCase
*/
function toLowerCase(value){
  return value.toLowerCase();
}

/*
* toLowerCase - Function
* @params - value {String}
* Check if is posible to set the string .toLowerCase and if it is lowerCase
*/
function toUpperCase(value){
  return value.toUpperCase();
}
