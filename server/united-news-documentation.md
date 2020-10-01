# United News App server

United News is an application to aggregate new from several sources. this app has :

-   RESTful endpoint for asset's CRUD operation
-   JSON formatted response

&nbsp;

## RESTful endpoints

### POST user/login

> Login to Application

_Request Header_

```
{
    "Content-Type": "application/json"
}
```

_Request Body_

```
{
    "email": "<user email>",
    "password": "<user password>",
}
```

_Response (201 - Created)_

```
{
    "id": "<user id>",
    "email": "<user email>"
    "access_token": "<generated accesss token>"
}
```

_Response (401 - Unauthorized)_

```
{
    "message": "<Invalid email or password>"
}
```

_Response (404 - Not Found)_

```
{
    "message": "Data Not Found"
}
```

_Response (500 - Internal Server Error)_

```
{
    "message": "<error messages>"
}
```

---

### POST /googlesignin

> sign in to google Oauth

_Request Header_

```
not needed
```

_Request Body_

```
{
    "token_id": "<token id from google>"
}
```

_Response (200)_

```
{
    "id": "<user id>",
    "email": "<user email>"
    "access_token": "<generated accesss token>"
}
```

_Response (500 - Internal Server Error)_

```
{
    "message": "<error messages>"
}
```

---

### POST user/register

> Register a User

_Request Header_

```
{
    "Content-Type": "application/json"
}
```

_Request Body_

```
{
    "email": "<user email>",
    "password": "<user password>",
    "full_name": "<user full name>",
}
```

_Response (201 - Created)_

```
{
    "id": <given id by system>,
    "email": "<user email>",
    "full_name": "<user full name>",
}
```

_Response (400 - Bad Request)_

```
{
    "message": "<validation error message>"
}
```

_Response (500 - Internal Server Error)_

```
{
    "message": "<error messages>"
}
```

---

### PUT /user/edit

> Edit User data

_Request Header_

```
{
    "Content-Type": "application/json"
    "access_token": "<access token>"
}
```

_Request Body_

```
{
    "full_name": "<user full name>",
}
```

_Response (200)_

```
{
    "full_name": "<user full name>",
}
```

_Response (400 - Bad Request)_

```
{
    "message": "<validation error message>"
}
```

_Response (401 - Unauthorized)_

```
{
    "message": "You do not have access"
}
```

_Response (500 - Internal Server Error)_

```
{
    "message": "<error messages>"
}
```

---

### GET /news/headline

> Get News headline

_Request Header_

```
{
    "access_token": "<access token>"
}
```

_Request Body_

```
not needed
```

_Response (200)_

```
[
    {
        "title": "<news title>",
        "description": "<news description>",
        "publishedAt": "<news status>",
        "news_url": "<original news link>"
    },
    {
        "title": "<news title>",
        "description": "<news description>",
        "publishedAt": "<news status>",
        "news_url": "<original news link>"
    }
]
```

_Response (401 - Unauthorized)_

```
{
    "message": "You do not have access"
}
```

_Response (500 - Internal Server Error)_

```
{
    "message": "<error messages>"
}
```

### GET /news/search

> Search News

_Request Header_

```
{
    "Content-Type": "application/json",
    "access_token": "<access token>"
}
```

_Request Body_

```
{
    "query": "<user query>"
}
```

_Response (200)_

```
[
    {
        "title": "<news title>",
        "description": "<news description>",
        "publishedAt": "<news status>",
        "news_url": "<original news link>"
    },
    {
        "title": "<news title>",
        "description": "<news description>",
        "publishedAt": "<news status>",
        "news_url": "<original news link>"
    }
]
```

_Response (401 - Unauthorized)_

```
{
    "message": "You do not have access"
}
```

_Response (404 - Not Found)_

```
{
    "message": "Data Not Found"
}
```

_Response (500 - Internal Server Error)_

```
{
    "message": "<error messages>"
}
```

&nbsp;

### GET /user/collection

> Get all news saved by user

_Request Header_

```
{
    "access_token": "<access token>"
}
```

_Request Body_

```
not needed
```

_Response (200)_

```
[
    {
        "id": <news id>,
        "title": "<news title>",
        "description": "<news description>",
        "publishedAt": "<news status>",
        "news_url": "<original news link>",
        "UserId": "<creator user id>",
        "tag": "<news tag name>",
        "createdAt": "2020-03-20T07:15:12.149Z",
        "updatedAt": "2020-03-20T07:15:12.149Z",
    },
    {
        "id": <news id>,
        "title": "<news title>",
        "description": "<news description>",
        "publishedAt": "<news status>",
        "news_url": "<original news link>",
        "UserId": "<creator user id>",
        "tag": "<news tag name>",
        "createdAt": "2020-03-20T07:15:12.149Z",
        "updatedAt": "2020-03-20T07:15:12.149Z",
    }
]
```

_Response (401 - Unauthorized)_

```
{
    "message": "You do not have access"
}
```

_Response (500 - Internal Server Error)_

```
{
    "message": "<error messages>"
}
```

---

### GET /user/collection/:id

> Get news saved by user by id

_Request Header_

```
{
    "access_token": "<access token>"
}
```

_Request Body_

```
not needed
```

_Response (200)_

```

{
    "id": <news id>,
    "title": "<news title>",
    "description": "<news description>",
    "publishedAt": "<news status>",
    "news_url": "<original news link>",
    "UserId": "<creator user id>",
    "tag": "<news tag name>",
    "createdAt": "2020-03-20T07:15:12.149Z",
    "updatedAt": "2020-03-20T07:15:12.149Z",
}
```

_Response (401 - Unauthorized)_

```
{
    "message": "You do not have access"
}
```

_Response (404 - Not Found)_

```
{
    "message": "Data Not Found"
}
```

_Response (500 - Internal Server Error)_

```
{
    "message": "<error messages>"
}
```

---

### GET /user/collection/:tag

> Get news saved by user by id

_Request Header_

```
{
    "access_token": "<access token>"
}
```

_Request Body_

```
not needed
```

_Response (200)_

```

{
    "id": <news id>,
    "title": "<news title>",
    "description": "<news description>",
    "publishedAt": "<news status>",
    "news_url": "<original news link>",
    "UserId": "<creator user id>",
    "tag": "<news tag name>",
    "createdAt": "2020-03-20T07:15:12.149Z",
    "updatedAt": "2020-03-20T07:15:12.149Z",
}
```

_Response (401 - Unauthorized)_

```
{
    "message": "You do not have access"
}
```

_Response (404 - Not Found)_

```
{
    "message": "Data Not Found"
}
```

_Response (500 - Internal Server Error)_

```
{
    "message": "<error messages>"
}
```

---

### DELETE /user/collection/:id

> Delete news saved in collection

_Request Header_

```
{
    "access_token": "<access token>"
}
```

_Request Body_

```
not needed
```

_Response (200)_

```
{
    "message": "news success to delete"
}
```

_Response (401 - Unauthorized)_

```
{
    "message": "You do not have access"
}
```

_Response (404 - Not Found)_

```
{
    "message": "Data Not Found"
}
```

_Response (500 - Internal Server Error)_

```
{
    "message": "<error messages>"
}
```

---

### PATCH /user/collection/:id

> Change tag of the news

_Request Header_

```
{
    "Content-Type": "application/json",
    "access_token": "<access token>"
}
```

_Request Body_

```
{
    "tag": "<news tag>"
}
```

_Response (200)_

```
{
    "id": <news id>,
    "title": "<news title>",
    "description": "<news description>",
    "publishedAt": "<news status>",
    "news_url": "<original news link>",
    "UserId": "<creator user id>",
    "tag": "<news tag name>",
    "createdAt": "2020-03-20T07:15:12.149Z",
    "updatedAt": "2020-03-20T07:15:12.149Z",
}

```

_Response (400 - Bad Request)_

```
{
    "message": "<validation error message>"
}
```

_Response (401 - Unauthorized)_

```
{
    "message": "You do not have access"
}
```

_Response (404 - Not Found)_

```
{
    "message": "Data Not Found"
}
```

_Response (500 - Internal Server Error)_

```
{
    "message": "<error messages>"
}
```

---

### POST /user/collection/

> Change tag of the news

_Request Header_

```
{
    "Content-Type": "application/json",
    "access_token": "<access token>"
}
```

_Request Body_

```
{
    "title": "<news title>",
    "description": "<news description>",
    "publishedAt": "<news status>",
    "news_url": "<original news link>",
    "tag": "<news tag name>",
}
```

_Response (200)_

```
{
    "id": <news id>,
    "title": "<news title>",
    "description": "<news description>",
    "publishedAt": "<news status>",
    "news_url": "<original news link>",
    "UserId": "<creator user id>",
    "tag": "<news tag name>",
    "createdAt": "2020-03-20T07:15:12.149Z",
    "updatedAt": "2020-03-20T07:15:12.149Z",
}

```

_Response (400 - Bad Request)_

```
{
    "message": "<validation error message>"
}
```

_Response (401 - Unauthorized)_

```
{
    "message": "You do not have access"
}
```

_Response (500 - Internal Server Error)_

```
{
    "message": "<error messages>"
}
```

---
