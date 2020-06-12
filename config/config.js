var env = process.env.NODE_ENV || 'development'; // precess.env.NODE_ENV is very imprtant 

if (env === 'development') {
    var config = require('./config.json');
    // console.log(config);
    var envConfig = config[env];

    Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key];
    });
    // console.log(envConfig);
}