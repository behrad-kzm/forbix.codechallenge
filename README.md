
# Forbix Code Challenge

## Description

 This is a backend application built with NestJS for managing users and companies. It uses MySQL as the database and provides various services for handling users, companies, and their interactions.

## Prerequisites

Before getting started, make sure you have the following tools installed:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [NestJS CLI](https://docs.nestjs.com/)

## Environment Variables

This project uses a `.env` file to manage configuration. Create a `.env` file at the root of the project with the following content:

```env
DATABASE_TYPE=mysql
DATABASE_HOST_MASTER=mysql
DATABASE_PORT=3306
DATABASE_USERNAME=root
DATABASE_PASSWORD=123456
DATABASE_NAME=exam
```

This file should contain the necessary environment variables for connecting to the MySQL database and other configurations used by the application.

## Setup

### 1. Install dependencies

Run the following command to install the required Node.js packages:

```bash
npm install
```

### 2. Setup Docker (optional)

To run the project with Docker and MySQL, you can use the `docker-compose.yml` configuration. This will set up the MySQL database and API application in containers.

- **Build and start the containers**:

```bash
docker-compose up -d
```

This will run the application and MySQL container in the same network, with environment variables injected from the `.env` file.

### 3. Build the project

Build the NestJS project with:

```bash
nest build
```

### 4. Running the application

To start the application, run:

```bash
ENV_PATH=.env npm run start
```

This will start the application in development mode, using the environment variables defined in the `.env` file.

### 5. Running Unit Tests

To run the unit tests, use the following command:

```bash
nest build && ENV_PATH=.env npm run test:unit
```

## Project Structure

- `src/`: Contains all the application logic, including modules, controllers, services, and entities.
- `src/company/`: Contains company-related logic (services, controllers, etc.).
- `src/user/`: Contains user-related logic.
- `src/database/`: Contains the database configuration and migrations.
- `src/utils/`: Contains utility functions, decorators, and interceptors.
- `src/config/`: Configuration files for the app (e.g., database, app, and auth configurations).

## Docker Configuration

The project includes Docker files for development and production environments:

- **Dockerfile.dev**: The Dockerfile used to build the development environment for the application.
- **Dockerfile.prod**: The Dockerfile used to build the production environment.
- **docker-compose.yml**: Configuration for setting up the application and MySQL container in a Docker network.

## Troubleshooting

- **"Environment variable not found"**: Ensure that the `.env` file exists in the root directory and has the correct environment variables configured.
- **MySQL connection issues**: Verify that the MySQL container is running and accessible. Check the logs using `docker-compose logs mysql`.
- **Build issues**: If you encounter issues with the build, try deleting the `node_modules` directory and re-running `npm install`.

## License

Include your license information here, if applicable.
