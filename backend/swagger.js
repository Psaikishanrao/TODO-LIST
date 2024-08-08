const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Todo List API',
      version: '1.0.0',
      description: `
        ## Todo List Application

        This is a Todo List application with authentication and task management features. The application includes user registration, login, and task management functionalities categorized into Personal, Work, Me-Time, and Household tasks.

        For more details on setting up and running the project locally, please refer to the [README.md](https://github.com/Psaikishanrao/TODO-LIST/blob/master/README.md).

        ### API Documentation
        The API documentation is available below.
      `,
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
