#   
Watch Store Backend

Welcome to the documentation for the Watch Store Backend! This backend is built from the ground up using  **Express.js**  and is designed to provide a robust, secure, and scalable solution for managing a watch store. Below is an overview of the features, architecture, and implementation details, including the SQL code to generate the required database tables.

----------

## **Tech Stack**

-   **Framework**: Express.js
    
-   **Database**: MySQL (with connection pooling and a singleton instance)
    
-   **Authentication**: JWT (JSON Web Tokens) with HTTP-only cookies
    
-   **Rate Limiting**: Implemented to prevent abuse
    
-   **Payment Gateway**: Stripe integration
    
-   **Static File Serving**: For serving images to the client
    
-   **Middleware**: Custom authentication middleware for route protection
    

----------

## **Key Features**

### 1.  **Secure Authentication**

-   **JWT (JSON Web Tokens)**: Used for secure user authentication.
    
-   **HTTP-Only Cookies**: JWTs are stored in HTTP-only cookies for enhanced security, preventing client-side JavaScript from accessing the token.
    
-   **Password Hashing**: User passwords are hashed using bcrypt before being stored in the database.
    

### 2.  **API Routes**

-   RESTful API routes are implemented for:
    
    -   User authentication (login, register, logout)
                
    -   Cart management (add, remove, update items)
                
    -   Payment processing (via Stripe)
        

### 3.  **Rate Limiting**

-   Rate limiting is implemented to prevent abuse of the API endpoints.
    
-   Limits are applied to sensitive routes like login and registration to protect against brute-force attacks.
    

### 4.  **Authentication Middleware**

-   Custom middleware is used to verify JWT tokens and protect routes.
    
-   Ensures that only authenticated users can access certain endpoints (e.g., placing orders, viewing order history).
    

### 5.  **MySQL Database with Connection Pooling and Singleton Instance**

-   **MySQL**: Used as the primary database for storing user data, product information, cart items, and orders.
    
-   **Connection Pooling**: Optimizes database performance by reusing connections, reducing the overhead of creating new connections for each query.
    
-   **Singleton Instance**: A single database instance is maintained throughout the application lifecycle to ensure efficient resource utilization and consistency.
    

### 6.  **Static Image Serving**

-   The backend serves static images (e.g., product images) to the client.
    
-   Images are stored in a designated directory and served via Express.js static middleware.
    

### 7.  **Stripe Payment Gateway Integration**

-   Stripe is integrated for secure payment processing.
        

### 8.  **Other Features**

-   **Error Handling**: Centralized error handling middleware for consistent error responses.
    
-   **Logging**: Request logging for debugging and monitoring.
    
-   **Environment Variables**: Configuration is managed using environment variables for security and flexibility.
    

----------

## **Database Design**

The MySQL database is designed with the following tables:

### SQL Code to Generate Tables

```sql

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE refresh_tokens (
  refresh_token_id INT AUTO_INCREMENT PRIMARY KEY,
  refresh_token VARCHAR(255) NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## **API Endpoints**

### **Authentication**

-   `POST /api/auth/signup`  - Register a new user.
    
-   `POST /api/auth/signin`  - Log in and receive a JWT.
    
-   `POST /api/logout`  - Log out and clear the JWT cookie.
    

### **Products**

-   `GET /api/products`  - Fetch all products.
                    

### **Cart**

-   `POST /api/cart`  - Add a product to the cart.
    
-   `GET /api/cart`  - Fetch the user's cart.
    
-   `POST /api/cart/increment`  - Increment the quantity of a product in a user's cart.
-   `POST /api/cart/decrement`  - Decrement the quantity of a product in a user's cart.
    
-   `DELETE /api/cart/:id`  - Remove a product from the cart.
    

### **Orders**

-   `POST /api/orders`  - Create a new order.
    
-   `GET /api/orders`  - Fetch all orders for the authenticated user.
    
-   `GET /api/orders/:id`  - Fetch a single order by ID.
    

### **Payments**

-   `POST /api/checkout`  - Create a Stripe payment intent.
  

----------

## **Setup and Installation**

1.  **Clone the Repository**:
    
    ```bash
    git clone https://github.com/amr-khaled27/watch-store-ecommerce-backend.git
    cd watch-store-backend
    ```
2.  **Install Dependencies**:

    ```bash    
    npm install
    ```
    
4.  **Set Up Environment Variables**:  
    Create a  `.env`  file in the root directory and add the following variables:
    
    ```env    
    PORT=8000
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=yourpassword
    DB_NAME=watch_store
    ACCESS_TOKEN_SECRET=your_access_secret
    REFRESH_TOKEN_SECRET=your_refresh_secret
    STRIPE_SECRET_KEY=your_stripe_secret_key
    ```
5.  **Run the Application**:
    
    ```bash    
    npm start
    ```
    

----------

## **Future Enhancements**

-   Add support for user roles (admin, customer).
    
-   Implement product search and filtering.
    
-   Add email notifications for order confirmations.
    
-   Integrate a caching layer (e.g., Redis) for improved performance.
    

----------

## **Conclusion**

This backend provides a secure, scalable, and efficient solution for managing a watch store. With features like JWT authentication, Stripe integration, and a well-optimized MySQL database, it is ready to power your e-commerce platform. The provided SQL code ensures the database is set up correctly to support all required functionality.
