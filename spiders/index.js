require('../config/mongoose')();
const spider = require("../utils/spider");
require("./vnexpress");
require("./dantri");

spider.on("drain", function () {
    // For example, release a connection to database.
    process.exit(0)
});
