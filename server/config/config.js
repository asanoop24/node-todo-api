var env = process.env.NODE_ENV || 'development';

if(env === 'development' || env === 'test'){
  var config = require('./config.json');
  var envConfig = config[env];

  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key]
  });
}

console.log('ENV: ', env);
console.log('MONGODB_URI: ', process.env.MONGODB_URI);
console.log('PORT: ', process.env.PORT);
