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
                        useCreateIndex: true
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
                        useCreateIndex: true
                    }
                },
            };
    }

}