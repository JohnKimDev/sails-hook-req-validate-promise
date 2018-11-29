/*
* helper - Function
* @description: Helper in validation types
*/

var V = require('validator');
var types = require('./validationTypes');

module.exports = function(value, validations, key){

  if(typeof validations === 'string') {
    return validationType(value, validations.replace(/ /g, '').toLowerCase(), key);
  } else if(_.isPlainObject(validations)) {
    return checkEnumValidation(value, validations, key);
  } else if(_.isArray(validations)){
    var error = [];
    _.each(validations, function(validation){
      if(_.isPlainObject(validation)) {
        return checkEnumDefaultValidation(value, validations, key);
      } else {
      var valid = validationType(value, validation.replace(/ /g,'').toLowerCase(), key);
      if(valid.error) error.push(valid.error); else value = valid.value;
      }
    });
    if(error.length) return {error: error.join(', ')};
    return {value: value};
  } else {
    return {error: 'Error checking validations, valid validations: String , enum object, or Array ' +
            ' valid formats example: \n' +
            ' req.validator(\'id\', {color: [\'hex\', \'uppercase\'], email: \'email\'})'};
  }
};

var checkEnumDefaultValidation = function(value, validation, key){
  if(_.isPlainObject(validation)) {
    var _key = _.keys(validation);
    if (_key.indexOf('default') >= 0 && value === null || value === undefined) {
      var defaultVal = validation['default'];
      return {value: defaultVal};
    } else if (_key.indexOf('enum') >= 0) {
      var enumVal = validation['enum'];
      if (_.isArray(enumVal) && enumVal.indexOf(value) !== -1) {
        return {value: value};
      }
      return {error: 'The value must be one of ' + JSON.stringify(validation)};
    } 
  }
  return {error: 'Error checking validations, valid validations: String , enum object, or Array ' +
    ' valid formats example: \n' +
    ' req.validator(\'id\', {color: [\'hex\', \'uppercase\'], email: \'email\'})'};
};

var validationType = function(value, validation, key){

  function runValidation(oValue, oValidation){
    if(oValidation === 'string'){
      if(typeof oValue === 'string'){
        return {value: oValue};
      }else{
        return {value: V.toString(oValue)};
      }
    } else if(oValidation === 'array') {
      return _.isArray(oValue) ? {value: oValue} : null;  
    } else if(oValidation === 'toBoolean') {
      if(oValue === '0') oValue = 0;
      return {value: V.toBoolean(oValue)};
    } else {
      var method = types[oValidation].method;
      if(V[method](oValue)){
        if(types[oValidation].sanitizer) oValue = types[oValidation].sanitizer(oValue);
        return {value: oValue};
      }else{
        return null;
      }
    }
  }

  var output;

  if (validation.indexOf('|')<0) {
    if(!types[validation]) return {error: validation + ' is not valid validation type.'};
    output = runValidation(value, validation);
    if (output === null || typeof output === 'undefined') {
      if(types[validation].type) validation = types[validation].type;
      output = {error: key + ': ' + value + ', should be ' + validation + ' type.', param: key};
    }
  } else {
    var validations = (validation.indexOf('||')>=0) ? validation.split('||') : validation.split('|');     // to suppor legacy || operation. In new version, OR = |
    var invalidTypes = [];
    var isValid = false;
    for (var v in validations) {
      var singleValidation = validations[v];
      if(!types[singleValidation]) {
        invalidTypes.push(singleValidation);
      }
      else {
        var data = runValidation(value, singleValidation);
        if (data) {
          output = data;
          isValid = true;
          break;
        }
      }
    }
    // cleanup
    if (!isValid) {
      var strErr = "";
      for (var d in validations) {
        if (invalidTypes.indexOf(validations[d]) < 0) {
          strErr += validations[d] + ", ";
        }
      }

      if (strErr.length > 0) {
        strErr = strErr.substr(0,strErr.length-2);
        strErr = key + ': ' + value + ' should be ' +
          strErr.replace(/,([^,]*)$/, ' or$1') + ' type.';
      }
      if (invalidTypes.length > 0) {
        if (strErr.length > 0 ) { strErr += " "; }
        strErr += invalidTypes.join(', ').replace(/,([^,]*)$/, ' and$1') +
                  (invalidTypes.length > 1 ? ' are':' is') + ' not valid validation type' +
                  (invalidTypes.length > 1 ? 's':'') + '.';
      }
      output = {error: strErr, param: key};
    }
  }
  return output;
};


