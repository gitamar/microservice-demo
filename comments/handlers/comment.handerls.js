const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);
const { publishToQueue  } = require('../utils/rabbitMQ')

const getCommentByPost = async (req, res) => {
    try {
        let { postId } = req.params;
        console.log(`Getting all comments for post # ${postId}`);
        publishToQueue('tasks','Hellowwww')
        let data = await database
            .select()
            .from('comment_master')
            .where({ post_id: postId });

        if (data.length === 0) {
            return res.status(404).json({
                status: 404,
                message: 'Nobody got nothing to say !',
                data: null,
            });
        }

        return res.status(200).json({
            status: 200,
            message: 'comments list',
            data: data,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error',
            data: null,
        });
    }
};

const getCommentById = async (req, res) => {
    try {
        let { id } = req.params;
        console.log(`Get comment by # ${id} `);

        let data = await database
            .select()
            .from('comment_master')
            .where({ comment_id: id });

        if (data.length === 0) {
            return res.status(404).json({
                errorStack: null,
                status: 404,
                message: 'Invalid Comment Id',
            });
        }

        return res.status(200).json({
            status: 200,
            message: 'comment',
            data: data,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            errorStack: error,
            status: 500,
            message: 'Internal Server Error',
        });
    }
};

const createComment = async (req, res) => {
    try {
        let { comment } = req.body;
        let { postId } = req.params;
        console.log(`Createing new comment `, req.body);

        let data = await database('comment_master')
            .insert({ comment_text: comment, post_id: postId, comment_score: 0 })
            .returning('*')

            publishToQueue('create-comment',JSON.stringify({comment,postId}))

        return res.status(200).json({
            status: 200,
            message: 'Comment Created',
            data: data,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            errorStack: error,
            status: 500,
            message: 'Internal Server Error',
        });
    }
};


const editCommentById = async (req, res) => {
    try {
        let { comment } = req.body;
        let { id } = req.params;
        console.log(`Editing comment by # ${id} `, req.body);

        let data = await database('comment_master')
            .update({ comment_text: comment })
            .where({ comment_id: id });

        if (!data) {
            return res.status(404).json({
                errorStack: null,
                status: 404,
                message: 'Invalid Comment Id',
            });
        }

        return res.status(200).json({
            status: 200,
            message: 'Comment Edited',
            data: data,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            errorStack: error,
            status: 500,
            message: 'Internal Server Error',
        });
    }
};

const deleteCommentById = async (req, res) => {
    try {
        let { id } = req.params;
        console.log(`Deleting comment by # ${id} `);

        let data = await database('comment_master')
            .del()
            .where({ comment_id: id });

        if (!data) {
            return res.status(404).json({
                errorStack: null,
                status: 404,
                message: 'Invalid Comment Id',
            });
        }

        return res.status(200).json({
            status: 200,
            message: 'Comment Deleted',
            data: data,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            errorStack: error,
            status: 500,
            message: 'Internal Server Error',
        });
    }
};

module.exports = {
    getCommentByPost,
    createComment,
    getCommentById,
    editCommentById,
    deleteCommentById,
};