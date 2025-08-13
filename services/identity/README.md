# User Service API Documentation

## Overview

This documentation outlines the RESTful API endpoints provided by the User Service. The API supports basic user management functionality including registration, authentication, retrieval, updating, and deletion of users.

All endpoints are prefixed with `/api/v1`.

---

## Response Structure

All API responses adhere to a standard structure:

```json
{
  "message": "Descriptive status message",
  "data": null | object | array
}
````

---

## Endpoints

### 1. User Registration

* **Endpoint:** `POST /signup`
* **Description:** Registers a new user in the system.

**Request Body:**

```json
{
  "firstName": "John",     // optional
  "lastName": "Doe",       // optional
  "email": "john@example.com",   // required
  "password": "password123" ,     // required
  "role": "user | admin"
}
```

**Success Response (200 OK):**

```json
{
  "message": "User created successfully",
  "data": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "admin | user"
  }
}
```

**Error Responses:**

* `400 Bad Request`: Missing required fields or email already registered.
* `500 Internal Server Error`: Unexpected error during registration.

---

### 2. User Authentication

* **Endpoint:** `POST /signin`
* **Description:** Authenticates a user with email and password.

**Request Body:**

```json
{
  "email": "john@example.com",     // required
  "password": "password123"        // required
}
```

**Success Response (200 OK):**

```json
{
  "message": "Sign-in successful",
  "data": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "admin | user"
  }
}
```

**Error Responses:**

* `400 Bad Request`: Missing email or password.
* `401 Unauthorized`: Incorrect email or password.
* `500 Internal Server Error`: Error during authentication process.

---

### 3. Retrieve All Users

* **Endpoint:** `GET /users`
* **Description:** Returns a list of all registered users.

**Success Response (200 OK):**

```json
{
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "admin | user"
    }
    // Additional users...
  ]
}
```

**Other Responses:**

* `200 OK`: An empty list if no users are found.
* `500 Internal Server Error`: Failure retrieving users.

---

### 4. Retrieve User by ID

* **Endpoint:** `GET /get`
* **Description:** Retrieves a single user by their unique identifier.

**Query Parameters:**

* `userId` (required): The unique ID of the user to retrieve.

**Success Response (200 OK):**

```json
{
  "message": "User retrieved successfully",
  "data": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "admin | user"
  }
}
```

**Error Responses:**

* `400 Bad Request`: Missing userId parameter.
* `500 Internal Server Error`: User not found or retrieval failure.

---

### 5. Update User

* **Endpoint:** `PUT /update`
* **Description:** Updates user information.

**Request Body:**

```json
{
  "userId": 1,                     // required
  "firstName": "John",            // optional
  "lastName": "Doe",              // optional
  "email": "john@example.com",    // optional
  "password": "newpassword" ,      // optional
  "role": "admin | user"
}
```

**Success Response (200 OK):**

```json
{
  "message": "User updated successfully",
  "data": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "admin | user"
  }
}
```

**Error Responses:**

* `400 Bad Request`: Missing userId or invalid fields.
* `500 Internal Server Error`: Update operation failed or user not found.

---

### 6. Delete User

* **Endpoint:** `DELETE /delete`
* **Description:** Deletes a user from the system.

**Request Body:**

```json
{
  "userId": 1   // required
}
```

**Success Response (200 OK):**

```json
{
  "message": "User deleted successfully",
  "data": null
}
```

**Error Responses:**

* `400 Bad Request`: Missing userId.
* `500 Internal Server Error`: Deletion failed or user not found.

---

## Error Handling

All errors follow a consistent response structure:

```json
{
  "message": "Error description",
  "data": null
}
```

**Common Status Codes:**

* `200 OK`: Successful operation
* `400 Bad Request`: Missing or invalid parameters
* `401 Unauthorized`: Invalid credentials
* `500 Internal Server Error`: Application-side error

---

## Technical Notes

* All requests and responses use `application/json` as the content type.
* Passwords are never returned in any response.
* All string inputs are trimmed and validated.
* Email comparisons are case-insensitive.
* Internal exceptions are logged but not exposed to clients for security.

