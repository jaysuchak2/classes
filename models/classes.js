module.exports = function (mongoose) {
    var options = {
        collection: 'classes',
        timestamps: true
    };
    var classes = new mongoose.Schema({
        college: {
            type: mongoose.Schema.Types.ObjectId
        },
        title: {
            type: String
        },
        contactNumber: {
            type: Number
        },
        email: {
            type: String
        },
        price: {
            type: Number
        },
        levels: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "levels"
        }],
        description: {
            type: String
        },
        syllabus: {
            type: String
        }
    }, options);
    return classes;
};