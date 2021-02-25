const mongoose = require('mongoose');
const config = require('./config')();

module.exports =function(){

    mongoose.connect(config.mongoose.uri, config.mongoose.options);

    mongoose.connection.on('connected', function(){
        console.log("Mongoose default connection is open to ", config.mongoose.uri);
    });

    mongoose.connection.on('error', function(err){
        console.error("Mongoose default connection has occured "+err+" error");
    });

    mongoose.connection.on('disconnected', function(){
        console.log("Mongoose default connection is disconnected");
    });

    process.on('SIGINT', function(){
        mongoose.connection.close(function(){
            console.log("Mongoose default connection is disconnected due to application termination");
            process.exit(0)
        });
    });
}