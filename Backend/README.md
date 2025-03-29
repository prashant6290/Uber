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
