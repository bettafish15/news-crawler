module.exports = function () {
    switch (process.env.NODE_ENV) {
        case 'development':
            return {
                mongoose: {
                    uri: 'mongodb://127.0.0.1:27017',
                    options: {
                        dbName: 'news',
                        user: '',
                        pass: '',
                        useNewUrlParser: true,
                        useUnifiedTopology: true,
                        useFindAndModify: false,
                        useCreateIndex: true,
                        bufferMaxEntries: 0,
                        connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
                        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivit
                    }
                },
            };

        case 'production':
            return {

            };

        default:
            return {
                mongoose: {
                    uri: 'mongodb://127.0.0.1:27017',
                    options: {
                        dbName: 'news',
                        user: '',
                        pass: '',
                        useNewUrlParser: true,
                        useUnifiedTopology: true,
                        useFindAndModify: false,
                        useCreateIndex: true,
                        bufferMaxEntries: 0,
                        connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
                        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivit
                    }
                },
            };
    }

}