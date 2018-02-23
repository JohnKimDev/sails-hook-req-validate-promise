# sails-hook-req-validate-promise

Sails hook for overwrite req.validate request with Promise.

Non-Promise version: https://www.npmjs.com/package/sails-hook-req-validate

```javascript
  npm install sails-hook-req-validate-promise --save 
```

### req.validate();

> ##### Requirements:
Sails v1.0.0 and lodash enabled as global (by default it comes enabled). For v0.10.X see below.
This project is originally forked from sails-hook-validator with following modifications:

> * rather then creating a new validation function, it overwrites the existing `req.validate` function
> * changed the optional field marker `?` to be the surffix (ex: name?)
> * updated the filter names
> * changed the error respond from `res.error(400, data)` to `res.badRequest(data)`

```javascript
// 'numeric || string' or 'numeric|| string' are OK. Space will be ignored
req.validate({'id' : 'numeric||string'});     
```

---

### [NEW] OR Operation
OR `||` operarion is a new addition to 0.2.x version. It can be applied to either *required* or *optional* parameter.
```javascript
  req.validate(
      {'id': 'string || numeric'},   // 'numeric || string' or 'numeric|| string' are OK. Space will be ignored
      {'usernameOrEmail': 'string || numeric || email'}
    ).then(params => {  
      console.log(params);   // {id: '1234', usernameOrEmail: 'user001'} 
    }).catch(err => {
      // if the validation fails, "req.badRequest" will be called and returns Promise.reject
      console.log(err);
    });
```

<br>

### Simple Single & Multple Parameter(s)
Validates `req.params` for expecting parameter keys and returns `req.badRequest` (400 status code) if any parameter key is missing.

```javascript
  req.validate('id')
    .then(params => {  
      console.log(params);   // {id: '1234'} 
    })
    .catch(err => {
      // if the validation fails, "req.badRequest" will be called and returns Promise.reject
      console.log(err);
    });
```
<br>

```javascript
  req.validate(['id', 'firstname', 'lastname']);
    .then(params => {  
      console.log(params);   // {id: '1234', firstname: "John", lastname: "Doe"}
    })
    .catch(err => {
      // if the validation fails, "req.badRequest" will be called and returns Promise.reject
      console.log(err);
    });
```

<br>

### Optional Parameter
Validates `req.params` for expecting parameter keys and returns `req.badRequest` (400 status code) if any parameter key is missing except optional parameters.

```javascript
  req.validate(['id', 'firstname', 'lastname?']);  // lastname is an OPTIONAL field 
    .then(params => {  
      console.log(params);   // {id: '1234', firstname: "John", lastname: "Doe"}
    })
    .catch(err => {
      // if the validation fails, "req.badRequest" will be called and returns Promise.reject
      console.log(err);
    });
```

NOTE: For an optional parameter, just add `?` at the end of the passing parameter key.

<br>

### Multple Parameters with TYPE filters
Validates `req.params` for expecting parameter keys and returns `req.badRequest` (400 status code) if any missing parameter key.

```javascript
  req.validate([
    {'id' : 'numeric'},
    {'firstname' : 'string'}, 
    {'lastname' : 'string'}
		]) 
    .then(params => {  
      console.log(params);   // {id: '1234', firstname: "John", lastname: "Doe"}
    }) 
    .catch(err => {
      // if the validation fails, "req.badRequest" will be called and returns Promise.reject
      console.log(err);
    }); 
```
See [Validation Filters](#validation_filters) for more information.

<br>

### Multple Parameters with TYPE filters & CONVERTION filters
Validates `req.params` for expecting parameter keys and returns `req.badRequest` (400 status code) if any missing parameter key.

```javascript
  req.validate([
		{'id' : 'numeric'},
		{'firstname' : ['string', 'toUppercase']}, 
		{'lastname' : ['string', 'toLowercase']}
		])
		.then(params => {  
      console.log(params);   // {id: '1234', firstname: "John", lastname: "Doe"}
    })
    .catch(err => {
      // if the validation fails, "req.badRequest" will be called and returns Promise.reject
      console.log(err);
    }); 
```
NOTE: All CONVERTION filters start with `to`, for example: toUppercase, toBoolean.

See [Validation Filters](#validation_filters) and [Conversion Filters](#conversion_filters) for more information.

<br>

### - Additional Example (Combining All Above Examples in One) 
Validates `req.params` for expecting parameter keys and returns `req.badRequest` (400 status code) if any missing parameter key.

```javascript
  req.validate([
		{'id' : 'numeric'},                             // (required) 'id' param as NUMERIC type
		'phone?',                                       // (optional) 'phone' as ANY type
		{'website?': 'url'},                              // (optional) 'website' as URL type
		{'firstname' : ['string', 'toUppercase']},      // (required) 'firstname' as STRING type and convert to UPPERCASE
		{'department' : ['string', 'lowercase']}        // (required) 'department' as STRING type and must be LOWERCASE input
		])
		.then(params => {  
      console.log(params);   // {id: '1234', firstname: "John", lastname: "Doe"}
    })
    .catch(err => {
      // if the validation fails, "req.badRequest" will be called and returns Promise.reject
      console.log(err);
    }); 
```
See [Validation Filters](#validation_filters) and [Conversion Filters](#conversion_filters) for more information.

<br>

### Disable Default Error Response  
When the validation fails, `res.badRequest` will not be sent instead 'false' will be returned.

```javascript
  req.validate(['id', 'firstname', 'lastname'], false)
  .then(params => {  
    console.log(params);   // {id: '1234', firstname: "John", lastname: "Doe"}
  })
  .catch(err => {
    // if the validation fails, "req.badRequest" will be called and returns Promise.reject
    console.log(err);
    return res.badRequest(err);
  }); 

```
NOTE: To disable the default error response, set `false` as the second passing variable.

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
