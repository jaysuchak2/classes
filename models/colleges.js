module.exports = function (mongoose) {
    var options = {
        collection: 'colleges',
        timestamps: true
    };
    var college = new mongoose.Schema({
        name: {
            type: String
        }
    }, options);
    return college;
};