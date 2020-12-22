module.exports = function () {
    var database = require("./databse");
    
    var config = Object.assign(database);
    return config;
}();