# URL Shortener API

A URL Shortener API built with Node.js, Express, and MongoDB, allowing users to create, manage, and track shortened URLs.

![URL-Shortner-Backend](https://socialify.git.ci/Anubhav-Ghosh1/URL-Shortner-Backend/image?forks=1&issues=1&language=1&name=1&owner=1&pulls=1&stargazers=1&theme=Dark)

## Features

-   **Create Shortened URLs**: Users can shorten URLs with an optional custom alias.
-   **Redirect Shortened URLs**: Redirects to the original URL using the shortened URL.
-   **Track Visits**: Logs visitor details (IP, user-agent) and increments visit count.
-   **Manage URLs**: Toggle active status, update, and delete URLs.
-   **User-Specific URL Management**: Each user can access and manage only their URLs.

## Tech Stack

-   **Backend**: Node.js, Express.js
-   **Database**: MongoDB
-   **UUID**: For unique URL identifiers
-   **Middleware**: Authentication middleware (assumes JWT auth for protecting routes)

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/Anubhav-Ghosh1/url-shortener-backend.git
    cd url-shortener-api
    ```
1. Install dependencies
    ```
    npm install
3. Run
    ```
    npm run dev
    ```
## API Routes

### User Routes

- **Create User**
  - **Endpoint:** `POST /api/users`
  - **Description:** Register a new user.
  - **Request Body:**
    ```json
    {
      "username": "string",
      "password": "string"
    }
    ```

- **Get User URLs**
  - **Endpoint:** `GET /api/users/urls`
  - **Description:** Retrieve all URLs created by the authenticated user.
  - **Authorization:** Bearer token required.

### URL Routes

- **Create URL**
  - **Endpoint:** `POST /api/urls`
  - **Description:** Create a new shortened URL.
  - **Request Body:**
    ```json
    {
      "originalURL": "string",
      "isActive": "boolean",
      "customAlias": "string (optional)"
    }
    ```
  - **Authorization:** Bearer token required.

- **Redirect to Original URL**
  - **Endpoint:** `GET /api/urls/:shortnedURL`
  - **Description:** Redirect to the original URL using the shortened URL.
  - **Path Parameter:**
    - `shortnedURL`: The shortened URL identifier.

- **Get URL Details**
  - **Endpoint:** `GET /api/urls/details`
  - **Description:** Fetch details for a specific URL.
  - **Request Body:**
    ```json
    {
      "urlId": "string"
    }
    ```
  - **Authorization:** Bearer token required.

- **Update URL**
  - **Endpoint:** `PUT /api/urls`
  - **Description:** Update an existing URL.
  - **Request Body:**
    ```json
    {
      "urlId": "string",
      "originalURL": "string (optional)",
      "isActive": "boolean (optional)",
      "customAlias": "string (optional)"
    }
    ```
  - **Authorization:** Bearer token required.

- **Delete URL**
  - **Endpoint:** `DELETE /api/urls`
  - **Description:** Delete a shortened URL.
  - **Request Body:**
    ```json
    {
      "urlId": "string"
    }
    ```
  - **Authorization:** Bearer token required.

- **Toggle URL Status**
  - **Endpoint:** `PATCH /api/urls/status`
  - **Description:** Toggle the active status of a URL.
  - **Request Body:**
    ```json
    {
      "urlId": "string"
    }
    ```
  - **Authorization:** Bearer token required.