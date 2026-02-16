module.exports = {
  apps: [
    {
      name: `rad-admin`,
      script: 'npx',
      interpreter: 'none',
      args: 'serve -s dist -l 3055',
    },
  ],
};
