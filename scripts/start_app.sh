#!/bin/bash
echo "Starting the Docker container..."

# Stop existing container if running
docker stop lowtech-gmbh-server || true
docker rm lowtech-gmbh-server || true

# Pull latest image
docker pull $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/lowtech-gmbh-server:$IMAGE_TAG

# Run container
docker run -d -p 8000:8000 --name lowtech-gmbh-server \
  -e NODE_ENV=production \
  -e DB_HOST=${DB_HOST} \
  -e DB_PORT=${DB_PORT} \
  -e DB_NAME=${DB_NAME} \
  -e DB_USER=${DB_USER} \
  -e DB_PASSWORD=${DB_PASSWORD} \
  -e JWT_SECRET=${JWT_SECRET} \
  -e AWS_REGION=${AWS_REGION} \
  -e AWS_S3_BUCKET_NAME=${AWS_S3_BUCKET_NAME} \
  -e AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID} \
  -e AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY} \
  -e STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY} \
  -e AWS_SES_FROM_EMAIL=${AWS_SES_FROM_EMAIL} \
  $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/lowtech-gmbh-server:$IMAGE_TAG

echo "✅ Server deployed successfully!"
