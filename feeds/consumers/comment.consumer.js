const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

const onHandleCommentCreated = async (data) => {
    try {
        console.log(data);
        let commentCount = await database('feed_master')
            .select('comment_count')
            .where({ post_id: parseInt(data.postId) });
        commentCount = parseInt(commentCount[0].comment_count)
        commentCount++;

        if (commentCount !== NaN && typeof commentCount === 'number') {
            await database('feed_master')
                .update({
                    comment_count: commentCount,
                })
                .where({ post_id: parseInt(data.postId) });
        }
    } catch (error) {
        throw error;
    }
};

const onHandleCommentUpdated = async (data) => {
    return 'Not Implemented!';
};

const onHandleCommentDeleted = async (data) => {
    return 'Not Implemented!';
};

module.exports = {
    onHandleCommentCreated,
    onHandleCommentUpdated,
    onHandleCommentDeleted,
};
