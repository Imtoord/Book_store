# Book_store_api

Your project is a RESTful API built with Node.js, Express.js, and MongoDB. The API provides endpoints for user authentication, book management, review management, and more.

**API Endpoints**

### Authentication Endpoints

- `/api/v1/auth/register`: Creates a new user account
- `/api/v1/auth/login`: Authenticates a user and returns a JWT token
- `/api/v1/auth/logout`: Logs out a user
- `/api/v1/auth/changePassword`: Changes a user's password

### Book Management Endpoints

- `/api/v1/books`: Retrieves a list of all books
- `/api/v1/books/:id`: Retrieves a specific book by ID
- `/api/v1/books/search`: Searches for books by title, author, or genre
- `/api/v1/books`: Uploads a book cover image
- `/api/v1/books/:id`: Retrieves reviews for a specific book

### Review Management Endpoints

- `/api/v1/reviews`: Retrieves a list of all reviews
- `/api/v1/reviews/:id`: Retrieves a specific review by ID
- `/api/v1/reviews/:id`: Updates a review
- `/api/v1/reviews/:id`: Deletes a review

### User Management Endpoints

- `/api/v1/users`: Retrieves a list of all users
- `/api/v1/users/:id`: Retrieves a specific user by ID
- `/api/v1/users`: Updates a user's information
- `/api/v1/users`: Deletes a user

### Wish List Endpoints

- `/api/v1/wishlists`: Retrieves a list of all wish lists
- `/api/v1/wishlists/:id`: Adds or Removes a book to a wish list

### Cart Endpoints

- `/api/v1/carts`: Retrieves a list of all carts
- `/api/v1/carts/:id`: Retrieves a specific cart by ID
- `/api/v1/carts/:id`: Adds a book to a cart
- `/api/v1/carts/:id`: Removes a book from a cart
- `/api/v1/carts/:id`: Clears all items from a cart

### Error Handling

The API uses middleware to handle errors. If an error occurs, it will be returned as a JSON response with an HTTP status code. The API also uses error handling middleware to catch and handle errors.

**Middleware**

The API uses several middleware functions to handle authentication, authorization, and error handling. These include:

- `verifyToken`: Verifies the JWT token sent in the `Authorization` header.
- `verifyTokenAndAdmin`: Verifies the JWT token and checks if the user is an administrator.

**Middleware Functions**

The API uses several middleware functions to handle specific tasks. These include:

- `uploadSingleImage`: Handles single image uploads.
- `resizeImage`: Resizes images uploaded to the server.
- `uploadBook`: Handles multiple image uploads for book covers.

This is a Node.js module that exports several functions related to image and file uploads, resizing, and storage. Here's a breakdown of the code:

multerOptions

This function returns a multer object configured with memory storage and a custom file filter.
The file filter allows only image files (PNG, JPG, JPEG) to be uploaded.
If an invalid file type is detected, it returns an error.
uploadSingleImage

This function takes a file name as an argument and returns a multer object configured with the multerOptions function.
It allows only a single image file to be uploaded.
resizeImage

This function takes an array of arguments as input and returns an asynchronous handler function.
The function checks if a file is present in the request and resizes it if necessary.
It uses the sharp library to resize the image and saves it to the uploads directory.
It sets the resized image URL in the request body.
storagex

This is a custom disk storage strategy for multer.
It generates a unique filename for each uploaded file by concatenating a timestamp with a random number.
fileFilterx

This is a custom file filter function for multer.
It allows only image files (PNG, JPG, JPEG) and PDF files to be uploaded.
upload

This function exports a multer object configured with the storagex storage strategy and the fileFilterx filter function.
It allows uploading two files: "cover" (image) and "pdf" (PDF).
cloudinary

This function requires the cloudinary library and configures it with environment variables.
It exports the cloudinary object.
In summary, this module provides functions for:

Configuring image upload options
Uploading single images
Resizing images
Storing images on disk
Uploading multiple files (image and PDF)
Using cloudinary for cloud-based image storage
