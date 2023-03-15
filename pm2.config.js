const env = require('./env.json')

module.exports = {
  apps: [
    {
      name: 'ChorusEncore Backend',
      script: './app.js',
      watch: false,
      env,
      autorestart: true
    }
  ]
}
