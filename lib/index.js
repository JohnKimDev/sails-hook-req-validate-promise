/*
 * Validator - Function
 * @description: Service for check params that arrives in the request
 * If params aren't valid we send a 400 BadRequest else we return a parsed Object
 */

var errorsParser = require('./errorsParser');
var helper = require('./helper');

module.exports = function Validate(rules, sendResponse){
  var req = this.req;
  var res = this.res;
  var params = req.allParams();
  var parsedParams = {};

  return new Promise(function(resolve, reject) {

      if (sendResponse === undefined || sendResponse !== false) {
        sendResponse = true;
      }

      /*
       * Check if the rules are a simple single param and if the param exist
       */
      if (typeof rules === 'string') {
          var key = rules;
          if (key.slice(-1) === '?' && params[key.substr(0, key.length - 1)] === undefined) {
            return resolve(null);
          } else if (key.slice(-1) === '?') {
              key = key.substr(0, key.length - 1);
          } else if (params[key] === undefined) {
            var error = new Error(key + ' is required.');
              if (sendResponse) {
                res.badRequest(error);
              }
              return reject(error);
          }
          parsedParams[key] = params[key];
      }

      var errors = [];

      /*
       * Check if the rules are an Object and in that case check the type of them
       */
      if (_.isPlainObject(rules)) {
          _.each(rules, function (value, key) {
              if (key.slice(-1) === '?' && params[key.substr(0, key.length - 1)] === undefined) return null;
              else if (key.slice(-1) === '?') key = key.substr(0, key.length - 1);
              var param = params[key];
              if (param === undefined) return errors.push(key);
              var validation = helper(param, value, key);
              if (validation.error) return errors.push(validation);
              parsedParams[key] = validation.value;
          });
      }

      /*
       * Check if the rules are an Array of elements
       * If the value is a String, check if it exists in the params
       * If the value is an Object, check by key/value if the type is valid
       * In the a diferent case, return a not valid type error
       */
      if (_.isArray(rules)) {
          _.each(rules, function (rule) {
              if (typeof rule === 'string') {
                  var key = rule;
                  if (key.slice(-1) === '?' && params[key.substr(0, key.length - 1)] === undefined) return null;
                  else if (key.slice(-1) === '?') key = key.substr(0, key.length - 1);
                  if (params[key] === undefined) return errors.push(key);
                  parsedParams[key] = params[key];
              } else if (_.isPlainObject(rule)) {
                  _.each(rule, function (value, key) {
                      if (key.slice(-1) === '?' && params[key.substr(0, key.length - 1)] === undefined) return null;
                      else if (key.slice(-1) === '?') key = key.substr(0, key.length - 1);
                      var param = params[key];
                      if (param === undefined) return errors.push(key);
                      var validation = helper(param, value, key);
                      if (validation.error) return errors.push(validation);
                      parsedParams[key] = validation.value;
                  });
              } else {
                  errors.push(rule + ' isn\'t a valid type, valid types: String - Object');
              }
          });
      }

      /* In case of errors return a badRequest with the errors parsed */
      if (errors.length) {
          var error = new Error(errorsParser(errors));
          if (sendResponse) {
              return res.badRequest(error);
          }
          return reject(error);
      }

      return resolve(_.isEmpty(parsedParams)?{}:parsedParams);
  });
};
