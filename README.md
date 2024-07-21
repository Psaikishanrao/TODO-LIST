```markdown
# Todo List Application

This is a Todo List application with authentication and task management features. The application includes user registration, login, and task management functionalities categorized into Personal, Work, Me-Time, and Household tasks.

## Getting Started

### Prerequisites

- Node.js (v14.x or later)
- npm (v6.x or later)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/Psaikishanrao/TODO-LIST.git
    cd TODO-LIST
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

### Running the Application

1. Start the server:

    ```bash
    npm run server
    ```

2. Open your browser and navigate to `http://localhost:5000`.

### API Documentation

The API documentation is available at `http://localhost:5000/api-docs`. It is generated using Swagger.

### File Structure

```
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

### API Endpoints

#### Authentication

- **POST** `/api/auth/register`
  - Description: Register a new user
  - Request Body:
    ```json
    {
      "username": "string",
      "password": "string"
    }
    ```
  - Responses:
    - `201`: Registration successful
    - `400`: Bad request

- **POST** `/api/auth/login`
  - Description: Login a user
  - Request Body:
    ```json
    {
      "username": "string",
      "password": "string"
    }
    ```
  - Responses:
    - `200`: Login successful
    - `401`: Invalid credentials

- **GET** `/api/auth/profile`
  - Description: Get user profile
  - Responses:
    - `200`: Success
    - `401`: Unauthorized

#### Todo Management

- **GET** `/api/todos`
  - Description: Get all todos
  - Responses:
    - `200`: Success

- **POST** `/api/todos`
  - Description: Create a new todo
  - Request Body:
    ```json
    {
      "title": "string",
      "description": "string",
      "category": "string"
    }
    ```
  - Responses:
    - `201`: Todo created
    - `400`: Bad request

- **PUT** `/api/todos/:id`
  - Description: Update a todo
  - Request Body:
    ```json
    {
      "title": "string",
      "description": "string",
      "category": "string"
    }
    ```
  - Responses:
    - `200`: Todo updated
    - `400`: Bad request
    - `404`: Todo not found

- **DELETE** `/api/todos/:id`
  - Description: Delete a todo
  - Responses:
    - `200`: Todo deleted
    - `404`: Todo not found

### License

This project is licensed under the MIT License. See the `LICENSE` file for details.
```
