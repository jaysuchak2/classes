module.exports = function (mongoose) {
    var options = {
        collection: 'levels',
        timestamps: true
    };
    var levels = new mongoose.Schema({
        level: {
            type: String
        }
    }, options);
    return levels;
};