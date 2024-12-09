#!/bin/bash

ENV_FILE="environments/production.env"

source $ENV_FILE

  ENV_PATH=$ENV_FILE npm run build

  echo "MySQL is up and running, running migrations..."
  ENV_PATH=$ENV_FILE npm run migration:run

  # Start the application in production mode
  echo "Migration  complete, starting the application..."
  ENV_PATH=$ENV_FILE npm run start:prod