# Stage 1: Build
FROM node:22-alpine AS builder

# Define environment variables
ARG ENV=stag
ENV ENV=${ENV}

# Set the working directory inside the container
WORKDIR /app

# Copy only necessary files for dependency installation
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the application based on the environment
RUN if [ "$ENV" != "local" ]; then yarn build:${ENV}; else yarn build; fi

# ------------------------------------
# Stage 2: Production – serve the build
FROM nginx:stable-alpine AS production

# Copy the build output from the previous stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 for HTTP traffic
EXPOSE 80

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
