# API Documentation

## POST /users/register

### Description
This endpoint registers a new user. It accepts user information including fullname, email, and password. The fullname should include both "firstname" and "lastname" properties.

### Request Body
- `fullname`: Object
  - `firstname`: string (min 3 characters)
  - `lastname`: string (min 3 characters)
- `email`: string (valid email format, min 5 characters)
- `password`: string (min 6 characters)

**Example:**
```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

### Success Response
- **Code:** 201 Created  
- **Content:**
```json
{
  "token": "JWT token string",
  "user": {
    "_id": "user_id",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    // ...other user properties...
  }
}
```

### Error Responses

- **Validation Error:**  
  - **Code:** 400 Bad Request  
  - **Content:** 
  ```json
  { "errors": [ { "msg": "Error message", "param": "field", "location": "body" } ] }
  ```
  
- **Missing Fields Error:**  
  - **Code:** 400 Bad Request  
  - **Content:**
  ```json
  { "message": "All fields are required" }
  ```

- **Server Error:**  
  - **Code:** 500 Internal Server Error  
  - **Content:**
  ```json
  { "message": "Error message" }
  ```

## POST /users/login

### Description
This endpoint authenticates an existing user. It accepts user credentials including email and password.

### Request Body
- `email`: string (valid email format, min 5 characters)
- `password`: string (min 6 characters)

**Example:**
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

### Success Response
- **Code:** 200 OK  
- **Content:**
```json
{
  "token": "JWT token string",
  "user": {
    "_id": "user_id",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
    // ...other user properties...
  }
}
```

### Error Responses

- **Validation Error:**  
  - **Code:** 400 Bad Request  
  - **Content:** 
  ```json
  { "errors": [ { "msg": "Error message", "param": "field", "location": "body" } ] }
  ```
  
- **Missing Fields Error:**  
  - **Code:** 400 Bad Request  
  - **Content:**
  ```json
  { "message": "All fields are required" }
  ```
  
- **Server Error:**  
  - **Code:** 500 Internal Server Error  
  - **Content:**
  ```json
  { "message": "Error message" }
  ```

## GET /users/profile

### Description
This endpoint retrieves the profile of the currently authenticated user. The request requires a valid token (set via a cookie or header).

### Request Headers
- Cookie: token=JWT token string  
  -- or --
- x-auth-token: JWT token string

### Success Response
- **Code:** 200 OK  
- **Content:**
```json
{
  "user": {
    "_id": "user_id",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
    // ...other user properties, excluding password...
  }
}
```

### Error Responses
- **Unauthorized:**  
  - **Code:** 401 Unauthorized  
  - **Content:**
  ```json
  { "message": "Unauthorized" }
  ```
- **User Not Found:**  
  - **Code:** 404 Not Found  
  - **Content:**
  ```json
  { "message": "User not found" }
  ```

## GET /users/logout

### Description
This endpoint logs out the authenticated user by clearing the token cookie and blacklisting the token.

### Request Headers
- Cookie: token=JWT token string  
  -- or --
- x-auth-token: JWT token string

### Success Response
- **Code:** 200 OK  
- **Content:**
```json
{ "message": "Logged out successfully" }
```

### Error Responses
- **Server Error:**  
  - **Code:** 500 Internal Server Error  
  - **Content:**
  ```json
  { "message": "Error message" }
  ```

## POST /captains/register

### Description
Registers a new captain. Accepts personal details and vehicle information.

### Request Body
```json
{
  "fullname": {
    "firstname": "Jane", // required, min 3 characters
    "lastname": "Doe"    // required
  },
  "email": "jane.doe@example.com", // must be a valid email
  "password": "securePass123",     // required, min 6 characters
  "vehicle": {
    "color": "Red",         // required, min 3 characters
    "plate": "XYZ1234",     // required, min 3 characters
    "capacity": 4,          // required, integer, minimum value 1
    "vehicleType": "car"    // required, allowed values: 'car', 'motorcycle', 'auto'
  }
}
```

### Success Response
```json
{
  "token": "JWT token string", // generated authentication token
  "captain": {
    "_id": "captain_id",
    "fullname": {
      "firstname": "Jane",
      "lastname": "Doe"
    },
    "email": "jane.doe@example.com",
    "vehicle": {
      "color": "Red",
      "plate": "XYZ1234",
      "capacity": 4,
      "vehicleType": "car"
    }
    // ...other captain details...
  }
}
```

### Error Responses
- **Validation Error (400):**
```json
{
  "errors": [ 
    { "msg": "Error message", "param": "field", "location": "body" } // details of the validation error
  ]
}
```
- **Missing Fields (400):**
```json
{ "message": "All fields are required" }
```
- **Server Error (500):**
```json
{ "message": "Error message" }
```

## POST /captains/login

### Description
Authenticates a captain using email and password.

### Request Body
```json
{
  "email": "jane.doe@example.com", // must be a valid email
  "password": "securePass123"        // required, min 6 characters
}
```

### Success Response
```json
{
  "token": "JWT token string", // generated authentication token
  "captain": {
    "_id": "captain_id",
    "fullname": {
      "firstname": "Jane",
      "lastname": "Doe"
    },
    "email": "jane.doe@example.com",
    // ...other captain details...
  }
}
```

### Error Responses
- **Validation Error (400):**
```json
{
  "errors": [ 
    { "msg": "Error message", "param": "field", "location": "body" }
  ]
}
```
- **Invalid Credentials (401):**
```json
{ "message": "Invalid email or password" }
```
- **Server Error (500):**
```json
{ "message": "Error message" }
```

## GET /captains/profile

### Description
Retrieves the profile of the authenticated captain. Token must be provided via cookie or header.

### Success Response
```json
{
  "captain": {
    "_id": "captain_id",
    "fullname": {
      "firstname": "Jane",
      "lastname": "Doe"
    },
    "email": "jane.doe@example.com",
    "vehicle": {
      "color": "Red",
      "plate": "XYZ1234",
      "capacity": 4,
      "vehicleType": "car"
    }
    // ...other captain fields, excluding sensitive data...
  }
}
```

### Error Response
- **Unauthorized (401):**
```json
{ "message": "Unauthorized" }
```

## GET /captains/logout

### Description
Logs out the captain by clearing the token cookie and blacklisting the token.

### Success Response
```json
{ "message": "Logged out successfully" }
```

### Error Response
- **Server Error (500):**
```json
{ "message": "Error message" }
```
