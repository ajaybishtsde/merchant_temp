const env = process.env.NODE_ENV || 'local';

const masterConfig = {
  local: {
    server_url: 'http://localhost:3000/api',
    BASE_URL: 'http://localhost:3000',
  },
  staging: {
    server_url: 'https://api.4rl.app/api',
    BASE_URL: 'https://api.4rl.app/api',
  },
  pre_prod: {
    server_url: 'https://api-prod.4rlapp.com/api',
    BASE_URL: 'https://api-prod.4rlapp.com/api',
  },
  prod: {
    server_url: 'https://api.4rlapp.com/api',
    BASE_URL: 'https://api.4rlapp.com/api',
  },
};

export const { server_url, BASE_URL } =
  masterConfig[env as keyof typeof masterConfig];
export const SERVER_ENV = env;
