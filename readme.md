# sails-hook-req-validate-promise

Sails hook for overwrite req.validate request with Promise.

Non-Promise version: https://www.npmjs.com/package/sails-hook-req-validate

```javascript
  npm install sails-hook-req-validate-promise --save 
```

### req.validate();

> ##### Requirements:
Sails v1.x.x and lodash enabled as global (lodash is enabled by default). 

---

### Default Value (when a parameter is not set)

```javascript
  const params = await req.validate('fruit', {default: 'apple'}); // if 'fruit' doesn't exists, it will be set as 'apple'
  console.log(params);
```

```javascript
  const params = await req.validate([
    {'fruit', {enum: ['apple', 'organe', 'bannana'], default: 'apple'}},   // also can be used with enum
    {'username?', 'string' }
  ]);
  console.log(params);
```

---

### Enumeration check

```javascript
  const params = await req.validate('fruit', {enum: ['apple', 'organe', 'bannana']});
  console.log(params);
```

```javascript
  const params = await req.validate([
    {'fruit', {enum: ['apple', 'organe', 'bannana']}},
    {'username?', 'string' },
    {'nickname?', 'any' }   // any type
  ]);
  console.log(params);
```

```javascript
  const params = await req.validate([
    {'fruit', ['string', {enum: ['apple', 'organe', 'bannana']}]},
    {'username?', 'string' }
  ]);
  console.log(params);
```

---

### Simple Single & Multple Parameter(s)
Validates `req.params` for expecting parameter keys and returns `req.badRequest` (400 status code) if any parameter key is missing.


```javascript
  try {
    const params = await req.validate('id');
    console.log(params);   // {id: '1234'} 
    // if the validation fails, "req.badRequest" will be called and returns Promise.reject
  } catch (err) {
    // wil catch Promise.reject here.
  }
```

If you prefer non async-await promise method

```javascript
  req.validate('id');
    .then(params => {  
      console.log(params);   // {id: '1234'} 
    })
    .catch(err => {
      console.error(err);
    });
```

<br>

Disable `req.badRequest` on error and enable `Promise.reject`
```javascript
  const params = await req.validate('id', false);  // <--- if you set the second value as FALSE, req.badRequest will NOT be call when error but it will just return Promise.reject
```
NOTE: To disable the default error response, set `false` as the second passing variable.

<br>

```javascript
  const params = await req.validate(['id', 'firstname', 'lastname']);
  console.log(params);   // {id: '1234', firstname: "John", lastname: "Doe"}
  // if the validation fails, "req.badRequest" will be called and returns Promise.reject
```

<br>

### Optional Parameter
Validates `req.params` for expecting parameter keys and returns `req.badRequest` (400 status code) if any parameter key is missing except optional parameters.

```javascript
  const params = await req.validate(['id', 'firstname', 'lastname?']);  // lastname is an OPTIONAL field 
  console.log(params);   // {id: '1234', firstname: "John", lastname: "Doe"}
  // if the validation fails, "req.badRequest" will be called and returns Promise.reject
```

NOTE: For an optional parameter, just add `?` at the end of the passing parameter key.

<br>

### Multple Parameters with TYPE filters
Validates `req.params` for expecting parameter keys and returns `req.badRequest` (400 status code) if any missing parameter key.

```javascript
  const params = await req.validate([
    {'id' : 'numeric'},
    {'firstname' : 'string'}, 
    {'lastname' : 'string'}
		]);
  console.log(params);   // {id: '1234', firstname: "John", lastname: "Doe"}
```
See [Validation Filters](#validation_filters) for more information.

<br>

### OR Operation
OR `|` operarion is a new addition to 0.2.x version. It can be applied to either *required* or *optional* parameter.
```javascript
  const params = await rreq.validate(
      {'id': 'string | numeric'},   // 'numeric | string', 'numeric|string' or 'numeric| string' are OK. Space will be ignored
      {'usernameOrEmail': 'string | numeric | email'}
    );```
<br>


### Multple Parameters with TYPE filters & CONVERTION filters
Validates `req.params` for expecting parameter keys and returns `req.badRequest` (400 status code) if any missing parameter key.

```javascript
  const params = await rreq.validate([
		{'id' : 'numeric'},
		{'firstname' : ['string', 'toUppercase']}, 
		{'lastname' : ['string', 'toLowercase']}
		]);
  console.log(params);   // {id: '1234', firstname: "John", lastname: "Doe"}
```
NOTE: All CONVERTION filters start with `to`, for example: toUppercase, toBoolean.

See [Validation Filters](#validation_filters) and [Conversion Filters](#conversion_filters) for more information.

<br>

### - Additional Example (Combining All Above Examples in One) 
Validates `req.params` for expecting parameter keys and returns `req.badRequest` (400 status code) if any missing parameter key.

```javascript
  const params = await req.validate([
		{'id' : 'numeric'},                             // (required) 'id' param as NUMERIC type
		'phone?',                                       // (optional) 'phone' as ANY type
		{'website?': 'url'},                            // (optional) 'website' as URL type
		{'firstname' : ['string', 'toUppercase']},      // (required) 'firstname' as STRING type and convert to UPPERCASE
		{'department' : ['string', 'lowercase']}        // (required) 'department' as STRING type and must be LOWERCASE input
		]);
  console.log(params);   // {id: '1234', firstname: "John", lastname: "Doe"}
  // if the validation fails, "req.badRequest" will be called and will NOT returns Promise.reject
```
See [Validation Filters](#validation_filters) and [Conversion Filters](#conversion_filters) for more information.

<br>

### Disable Default Error Response  
When the validation fails, `res.badRequest` will not be sent instead 'false' will be returned.

```javascript
  try {
    const params = await req.validate(
      ['id', 'firstname', 'lastname?'],   // lastname is an OPTIONAL field 
      false  // <--- if you set the second value as FALSE, req.badRequest will NOT be call "res.badRequest" response when error but it will return Promise.reject                         
    );
    console.log(params);   // {id: '1234', firstname: "John", lastname: "Doe"}
    // ..process
  } catch (err) {
    console.error(err);
    return res.badRequest();    // Make sure to handle badRequest response
  }
```

NOTE: To disable the default error response, set `false` as the second passing variable.

<br>

### <a name="validation_filters"></a>Validation Filters

```javascript  
  any
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
  array
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
