const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const commentSchema = new mongoose.Schema({
    comment_id: Number,
    comments_text: String,
    comment_by: String,
    comment_mod_score: Number,
});

const feedSchema = new mongoose.Schema({
    post_text: String,
    post_mod_score: Number,
    post_by: String,
    comment_count: Number,
    comments: [commentSchema],
});

feedSchema.plugin(mongoosePaginate)

const Feed = mongoose.model('Feed', feedSchema);

module.exports = { Feed };
