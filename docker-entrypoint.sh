#!/bin/sh

# Default to "local" if ENV is not set
ENV=${ENV:-local}

if [ "$ENV" != "local" ]; then
  echo "Starting application in $ENV environment..."
  yarn run dev:${ENV} --host
else
  echo "Starting application in local environment..."
  yarn run dev --host
fi
