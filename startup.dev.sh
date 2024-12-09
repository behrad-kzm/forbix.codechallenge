#!/bin/bash

if [ "$1" = "--test-only" ]; then
  ENV_FILE="test.env"
else
  ENV_FILE=".env"
fi

source $ENV_FILE

/opt/wait-for-it.sh $DATABASE_HOST_MASTER:3306 --timeout=30
# Once MySQL is available, run migrations
if [ $? -eq 0 ]; then
  # Determine the command to run based on the argument
  if [ "$1" = "--test-only" ]; then
    
    echo "MySQL is up and running, running migrations..."
    ENV_PATH=$ENV_FILE npm run schema:drop
    ENV_PATH=$ENV_FILE npm run migration:run
    
    echo "Migrations complete, running tests..."
    ENV_PATH=$ENV_FILE npm run test:unit
    ENV_PATH=$ENV_FILE npm run test:e2e
    ENV_PATH=$ENV_FILE npm run schema:drop
  else
    echo "MySQL is up and running, running migrations..."
    ENV_PATH=$ENV_FILE npm run migration:run

    echo "Migrations complete, starting the application..."
    ENV_PATH=$ENV_FILE npm run start:dev
  fi
else
  echo "Error: MySQL is not available"
fi
