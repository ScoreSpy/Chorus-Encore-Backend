const config = require('./src/configs/json/overides.json')
if (config.devMode === true) { throw new Error('DevMode enabled!') }
