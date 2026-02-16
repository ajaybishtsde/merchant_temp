#!/bin/bash
set -euo pipefail

# Load .env file if it exists
if [ -f .env ]; then
    set -a
    source .env
    set +a
fi

# Prepare build arguments from .env file
build_args=$(grep -v '^#' .env | xargs -I{} echo --build-arg {})

# Validate the environment
if [[ ! "$ENV" =~ ^(stag|pre_prod|prod|local)$ ]]; then
  echo "Invalid environment specified. Use 'stag', 'pre_prod', 'prod', or 'local'."
  exit 1
fi

# Login to Amazon ECR if the environment is not 'local'
if [[ "$ENV" != "local" ]]; then
  echo "Logging into Amazon ECR..."
  aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 730335179836.dkr.ecr.us-east-1.amazonaws.com
fi

# Build Docker Image with the specified environment
echo "Building Docker image with environment: $ENV..."
docker build --platform linux/amd64 $build_args -t 730335179836.dkr.ecr.us-east-1.amazonaws.com/admin_ecr:latest .

# Push Image to ECR if the environment is not 'local'
if [[ "$ENV" != "local" ]]; then
  echo "Pushing Docker image to ECR..."
  docker push 730335179836.dkr.ecr.us-east-1.amazonaws.com/admin_ecr:latest
  echo "Build and push completed for environment: $ENV"
else
  echo "Local environment selected. Skipping ECR push."
fi