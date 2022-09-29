const env = require('./env.json')

module.exports = {
  apps: [
    {
      name: 'Chorus',
      script: './app.js',
      watch: false,
      env,
      autorestart: true,
      // instances : 'max',
      // exec_mode : 'cluster'
    }
  ]
}
