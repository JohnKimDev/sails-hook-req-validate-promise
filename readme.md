# sails-hook-req-validate-promise

Sails hook for overwrite req.validate request with Promise.

Non-Promise version: https://www.npmjs.com/package/sails-hook-req-validate

```javascript
  npm install sails-hook-req-validate-promise --save 
```

### req.validate();

> ##### Requirements:
Sails v1.0.0 and lodash enabled as global (by default it comes enabled). 

---
### [NEW in 1.1.0] Enumeration check

```javascript
  req.validate('id', {enum: ['apple', 'organe', 'bannana']})
    .then(params => {  
      console.log(params);
    });
```

```javascript
  req.validate([
    {'id', {enum: ['apple', 'organe', 'bannana']}},
    {'username?', 'string' }
    ).then(params => {  
      console.log(params);
    });
```

```javascript
  req.validate([
    {'id', ['string', {enum: ['apple', 'organe', 'bannana']}]},
    {'username?', 'string' }
    ).then(params => {  
      console.log(params);
    });
```
---


### Simple Single & Multple Parameter(s)
Validates `req.params` for expecting parameter keys and returns `req.badRequest` (400 status code) if any parameter key is missing.


```javascript
  req.validate('id')
    .then(params => {  
      console.log(params);   // {id: '1234'} 
    });
    // if the validation fails, "req.badRequest" will be called and will NOT returns Promise.reject
```
<br>

Disable `req.badRequest` on error and enable `Promise.reject`
```javascript
  req.validate('id', false)  // <--- if you set the second value as FALSE, req.badRequest will NOT be call when error but it will return Promise.reject
    .then(params => {  
      console.log(params);   // {id: '1234'} 
    })
    .catch(err => {
      console.log(err);
    });
```
NOTE: To disable the default error response, set `false` as the second passing variable.

<br>

```javascript
  req.validate(['id', 'firstname', 'lastname'])
    .then(params => {  
      console.log(params);   // {id: '1234', firstname: "John", lastname: "Doe"}
    });
    // if the validation fails, "req.badRequest" will be called and will NOT returns Promise.reject
```

<br>

### Optional Parameter
Validates `req.params` for expecting parameter keys and returns `req.badRequest` (400 status code) if any parameter key is missing except optional parameters.

```javascript
  req.validate(['id', 'firstname', 'lastname?'])  // lastname is an OPTIONAL field 
    .then(params => {  
      console.log(params);   // {id: '1234', firstname: "John", lastname: "Doe"}
    });
    // if the validation fails, "req.badRequest" will be called and will NOT returns Promise.reject
```

NOTE: For an optional parameter, just add `?` at the end of the passing parameter key.

<br>

Disable `req.badRequest` on error and enable `Promise.reject`

```javascript
  req.validate(
    ['id', 'firstname', 'lastname?'],   // lastname is an OPTIONAL field 
    false  // <--- if you set the second value as FALSE, req.badRequest will NOT be call when error but it will return Promise.reject                             
    )  
    .then(params => {  
      console.log(params);   // {id: '1234', firstname: "John", lastname: "Doe"}
    })
    .catch(err => {
      console.log(err);
    });

```
NOTE: To disable the default error response, set `false` as the second passing variable.

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
    });
    // if the validation fails, "req.badRequest" will be called and will NOT returns Promise.reject
```
See [Validation Filters](#validation_filters) for more information.

<br>

### OR Operation
OR `||` operarion is a new addition to 0.2.x version. It can be applied to either *required* or *optional* parameter.
```javascript
  req.validate(
      {'id': 'string || numeric'},   // 'numeric || string' or 'numeric|| string' are OK. Space will be ignored
      {'usernameOrEmail': 'string || numeric || email'}
    ).then(params => {  
      console.log(params);   // {id: '1234', usernameOrEmail: 'user001'} 
    });
    // if the validation fails, "req.badRequest" will be called and will NOT returns Promise.reject
```
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
    });
    // if the validation fails, "req.badRequest" will be called and will NOT returns Promise.reject// if the validation fails, "req.badRequest" will NOT returns Promise.reject
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
    });
    // if the validation fails, "req.badRequest" will be called and will NOT returns Promise.reject
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
    console.log(err);
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
