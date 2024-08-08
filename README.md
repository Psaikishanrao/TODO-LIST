
---

# Todo List Application

This is a comprehensive Todo List application that features user authentication, task management, and categorization into Personal, Work, Me-Time, and Household tasks. The application is built with Node.js and MongoDB, offering a complete CRUD interface with JWT authentication and detailed API documentation via Swagger.

## Features

- **CRUD Operations** with MongoDB
- **JWT Authentication** for secure user sessions
- **Swagger API Documentation** for easy API reference
- **Unit Testing** with Jest to ensure application robustness
- **Development Server** using Nodemon for automatic restarts

## Getting Started

### Prerequisites

- **Node.js** (v14.x or later)
- **npm** (v6.x or later)
- **MongoDB** (installed and running)

### Installation

1. **Clone the Repository**:

    ```bash
    git clone https://github.com/Psaikishanrao/TODO-LIST.git
    cd TODO-LIST
    ```

2. **Install Dependencies**:

    ```bash
    npm install
    ```

3. **Configuration**:

    Create a `.env` file in the root directory and add the following configuration:

    ```plaintext
    PORT=3000
    MONGODB_URI=mongodb://localhost:27017/your_database_name
    JWT_SECRET=your_secret_key
    ```

    Update the `swagger.js` file in the root folder with your API details if necessary.

### Running the Application

1. **Start MongoDB**:

    Ensure your MongoDB server is running. You can start it using:

    ```bash
    mongod
    ```

2. **Start the Development Server**:

    ```bash
    npm run dev
    ```

    This will start the server using Nodemon for automatic restarts during development.

3. **Access the Application**:

    Open your browser and navigate to `http://localhost:5000`.

### API Documentation

The API documentation, generated using Swagger, is available at `http://localhost:5000/api-docs`.

## File Structure

```plaintext
TODO-LIST/
│
├── routes/
│   ├── authRoutes.js
│   └── todoRoutes.js
│
├── public/
│   ├── styles.css
│   ├── script.js
│   ├── login.js
│   ├── index.html
│   └── dashboard.html
│
├── middleware/
│   └── db.js
├── models/
│   ├── User.js
│   └── Todo.js
├── controllers/
│   ├── todoController.js
│   └── authController.js
├── config/
│   └── authMiddleware.js
│
├── app.js
├── swagger.js
├── .gitignore
├── .env
├── package.json
└── README.md
```

## API Endpoints

### Authentication

- **POST** `/api/auth/register`
  - **Description**: Register a new user
  - **Request Body**:
    ```json
    {
      "username": "string",
      "password": "string"
    }
    ```
  - **Responses**:
    - `201`: Registration successful
    - `400`: Bad request

- **POST** `/api/auth/login`
  - **Description**: Login a user
  - **Request Body**:
    ```json
    {
      "username": "string",
      "password": "string"
    }
    ```
  - **Responses**:
    - `200`: Login successful
    - `401`: Invalid credentials

- **GET** `/api/auth/profile`
  - **Description**: Get user profile
  - **Responses**:
    - `200`: Success
    - `401`: Unauthorized

### Todo Management

- **GET** `/api/todos`
  - **Description**: Get all todos
  - **Responses**:
    - `200`: Success

- **POST** `/api/todos`
  - **Description**: Create a new todo
  - **Request Body**:
    ```json
    {
      "title": "string",
      "description": "string",
      "category": "string"
    }
    ```
  - **Responses**:
    - `201`: Todo created
    - `400`: Bad request

- **PUT** `/api/todos/:id`
  - **Description**: Update a todo
  - **Request Body**:
    ```json
    {
      "title": "string",
      "description": "string",
      "category": "string"
    }
    ```
  - **Responses**:
    - `200`: Todo updated
    - `400`: Bad request
    - `404`: Todo not found

- **DELETE** `/api/todos/:id`
  - **Description**: Delete a todo
  - **Responses**:
    - `200`: Todo deleted
    - `404`: Todo not found

## Running Tests

Unit tests are provided to ensure the stability and reliability of the application. You can run the tests using:

```bash
npm test
```

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

---
