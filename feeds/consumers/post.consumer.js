const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

const onHandlePostCreated = async (data) => {
    try {
        let post = {
            post_id : data.data[0].post_id,
            post_text: data.data[0].post_text,
            comment_count: 0
        }

        await database('feed_master').insert(post);
    } catch (error) {
        throw error
    }
};

const onHandlePostUpdated = async (data) => {
    return 'Not Implemented!';
};

const onHandlePostDeleted = async (data) => {
    return 'Not Implemented!';
};

module.exports = {
    onHandlePostCreated,
    onHandlePostUpdated,
    onHandlePostDeleted,
};
