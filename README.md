# React Vite Project

This is a simple project setup using React with Vite. Vite provides a fast build process and development server for modern web projects.

## Requirements

- [Node.js](https://nodejs.org/en/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

## Getting Started

### 1. Clone the repository

```bash
git clone https://gitlab.com/AkibDeraiya123/4rl-admin.git
cd 4rl-admin
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Running the project

#### Development

To start the development server, use the following commands based on your environment:

- **Local Environment:**

  ```bash
  npm run dev
  ```

- **Staging Environment:**

  ```bash
  npm run dev:stag
  ```

- **Production Environment:**

  ```bash
  npm run dev:prod
  ```

This will start the Vite development server for the specified environment.

### 4. Building the project

To build the project for different environments, use the following commands:

- **Local Environment:**

  ```bash
  npm run build
  ```

- **Staging Environment:**

  ```bash
  npm run build:stag
  ```

- **Production Environment:**

  ```bash
  npm run build:prod
  ```

This will create a production-ready build of your project inside the `dist/` folder.

### 5. Previewing the production build

To preview the production build using Vite's preview server:

```bash
npm run preview
```

## Scripts Overview

- **dev**: Starts the development server for the local environment.
- **dev:stag**: Starts the development server for the staging environment.
- **dev:prod**: Starts the development server for the production environment.
- **build**: Builds the project for the local environment.
- **build:stag**: Builds the project for the staging environment.
- **build:prod**: Builds the project for the production environment.
- **preview**: Previews the production build using Vite's preview server.

## License

This project is licensed under the MIT License.
