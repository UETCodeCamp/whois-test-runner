module.exports = {
  apps : [{
    name: 'test-runner',
    script: 'server.js',
    instances: 1,
    autorestart: true,
    env: {
		NODE_ENV: 'production',
		PORT: 6969,
		SUBMIT_HOST: 'http://localhost:3222'
    }
  }],
};
