# sails-hook-req-validate

[![Build Status](https://travis-ci.org/JohnKimDev/sails-hook-req-validate.svg?branch=master)](https://travis-ci.org/JohnKimDev/sails-hook-req-validate) 

Sails hook for overwrite req.validate request.

```javascript
  npm install sails-hook-req-validate --save 
```

### req.validate();

> ##### Requirements:
Sails v1.0.0 and lodash enabled as global (by default it comes enabled). For v0.10.X see below.
This project is originally forked from sails-hook-validator with following modifications:

> * rather then creating a new validation function, it overwrites the existing `req.validate` function
> * changed the optional field marker `?` to be the surffix (ex: name?)
> * updated the filter names
> * changed the error respond from `res.error(400, data)` to `res.badRequest(data)`

---
### UPDATE
1.0.0 : Sails V1.0.0 support.


---
### UPDATE
0.2.0 : OR operation logic is added. 

```javascript
// 'numeric || string' or 'numeric|| string' are OK. Space will be ignored
var param = req.validate({'id' : 'numeric||string'});     
```

---

### [NEW] OR Operation
OR `||` operarion is a new addition to 0.2.x version. It can be applied to either *required* or *optional* parameter.
```javascript
var params = req.validate(
                {'id': 'string || numeric'},   // 'numeric || string' or 'numeric|| string' are OK. Space will be ignored
                {'usernameOrEmail': 'string || numeric || email'}
              );
// if the validation fails, "req.badRequest" will be called and returns 'false'.  
console.log(params);                // {id: '1234', usernameOrEmail: 'user001'} OR false
if (!params) { return; }
```

<br>

### Simple Single & Multple Parameter(s)
Validates `req.params` for expecting parameter keys and returns `req.badRequest` (400 status code) if any parameter key is missing.

```javascript
var params = req.validate('id');
// if the validation fails, "req.badRequest" will be called and returns 'false'.  
console.log(params);                // {id: '1234'} OR false
if (!params) { return; }
```
<br>

```javascript
var params = req.validate(['id', 'firstname', 'lastname']);  // lastname is an OPTIONAL field 
// if the validation fails, "req.badRequest" will be called and returns 'false'.
console.log(params);               // {id: '1234', firstname: "John", lastname: "Doe"} OR false
if (!params) { return; }
```

<br>

### Optional Parameter
Validates `req.params` for expecting parameter keys and returns `req.badRequest` (400 status code) if any parameter key is missing except optional parameters.

```javascript
var params = req.validate(['id', 'firstname', 'lastname?']);  // lastname is an OPTIONAL field 
// if the validation fails, "req.badRequest" will be called and returns 'false'.
console.log(params);               // {id: '1234', firstname: "John", lastname: "Doe"} OR false
if (!params) { return; }
```

NOTE: For an optional parameter, just add `?` at the end of the passing parameter key.

<br>

### Multple Parameters with TYPE filters
Validates `req.params` for expecting parameter keys and returns `req.badRequest` (400 status code) if any missing parameter key.

```javascript
var params = req.validate([
		{'id' : 'numeric'},
		{'firstname' : 'string'}, 
		{'lastname' : 'string'}
		]);   
// if the validation fails, "req.badRequest" will be called and returns 'false'.
console.log(params);               // {id: '1234', firstname: "John", lastname: "Doe"} OR false
if (!params) { return; }
```
See [Validation Filters](#validation_filters) for more information.

<br>

### Multple Parameters with TYPE filters & CONVERTION filters
Validates `req.params` for expecting parameter keys and returns `req.badRequest` (400 status code) if any missing parameter key.

```javascript
var params = req.validate([
		{'id' : 'numeric'},
		{'firstname' : ['string', 'toUppercase']}, 
		{'lastname' : ['string', 'toLowercase']}
		]);   
// if the validation fails, "req.badRequest" will be called and returns 'false'.
console.log(params);               // {id: '1234', firstname: "JOHN", lastname: "doe"} OR false
if (!params) { return; }
```
NOTE: All CONVERTION filters start with `to`, for example: toUppercase, toBoolean.

See [Validation Filters](#validation_filters) and [Conversion Filters](#conversion_filters) for more information.

<br>

### - Additional Example (Combining All Above Examples in One) 
Validates `req.params` for expecting parameter keys and returns `req.badRequest` (400 status code) if any missing parameter key.

```javascript
var params = req.validate([
		{'id' : 'numeric'},                             // (required) 'id' param as NUMERIC type
		'phone?',                                       // (optional) 'phone' as ANY type
		{'website?': 'url'},                              // (optional) 'website' as URL type
		{'firstname' : ['string', 'toUppercase']},      // (required) 'firstname' as STRING type and convert to UPPERCASE
		{'department' : ['string', 'lowercase']}        // (required) 'department' as STRING type and must be LOWERCASE input
		]);   
if (!params) { return; }
```
See [Validation Filters](#validation_filters) and [Conversion Filters](#conversion_filters) for more information.

<br>

### Disable Default Error Response  
When the validation fails, `res.badRequest` will not be sent instead 'false' will be returned.

```javascript
var params = req.validate(['id', 'firstname', 'lastname'], false);  

// when the validation fails, 'false' will be returned
if (!params) {
	return res.badRequest('Invalid Parameters');
} else {
	console.log(params);		// {id: '1234', firstname: "John", lastname: "Doe"}
}
```
NOTE: To disable the default error response, set `false` as the second passing variable.

<br>

### Custom Validation Callback 

```javascript
var params = req.validate(
		['id', 'firstname', 'lastname'],
		function(err, params) {
			if (err) {
				console.log(err);      // {message: 'some error message', invalid: ['id', 'firstname']} 
			} else {
				console.log(params);   // {id: '1234', firstname: "John", lastname: "doe"}
			}
		}
	);  
```
NOTE: To set a custom callback, set function callback as the second passing variable.

<br>

### <a name="validation_filters"></a>Validation Filters

```javascript  
  email
  url
  ip
  alpha
  numeric
  base64
  hex
  hexColor
  lowercase
  uppercase
  string
  boolean
  int
  float
  date
  json
  ascii
  mongoId
  alphanumeric
  creditCard
```

<br>

### <a name="conversion_filters"></a>Conversion Filters

```javascript  
  toLowercase
  toUppercase
  toEmail
  toBoolean
  toDate
```

<br>

#### Sails v0.10.x
To work with reg.validate() in v0.10 just clone this repo inside of api/hooks folder.
