const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);
const { publishToQueue } = require('../utils/rabbitMQ');

const getPostById = async (req, res) => {
    try {
        let { id } = req.params;
        console.log(`Get post by # ${id} `);

        let data = await database
            .select()
            .from('post_master')
            .where({ post_id: id });

        if (data.length === 0) {
            return res.status(404).json({
                errorStack: null,
                status: 404,
                message: 'Invalid Post Id',
            });
        }

        return res.status(200).json({
            status: 200,
            message: 'post',
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

const createPost = async (req, res) => {
    try {
        let { post } = req.body;
        console.log(`Createing new post `, req.body);

        let data = await database('post_master').insert({ post_text: post }).returning('*');

        if (data) {
            publishToQueue('create-post', JSON.stringify({ data }));
        }

        return res.status(200).json({
            status: 200,
            message: 'Post Created',
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

const editPostById = async (req, res) => {
    try {
        let { post } = req.body;
        let { id } = req.params;
        console.log(`Editing post by # ${id} `, req.body);

        let data = await database('post_master')
            .update({ post_text: post })
            .where({ post_id: id });

        if (data) {
            publishToQueue('edit-post', { post_id: id, post_text: post });
        }

        if (!data) {
            return res.status(404).json({
                errorStack: null,
                status: 404,
                message: 'Invalid Post Id',
            });
        }

        return res.status(200).json({
            status: 200,
            message: 'Post Edited',
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

const deletePostById = async (req, res) => {
    try {
        let { id } = req.params;
        console.log(`Deleting post by # ${id} `);

        let data = await database('post_master').del().where({ post_id: id });

        if (data) {
            publishToQueue('delete-post', { post_id: id });
        }

        if (!data) {
            return res.status(404).json({
                errorStack: null,
                status: 404,
                message: 'Invalid Post Id',
            });
        }

        return res.status(200).json({
            status: 200,
            message: 'Post Deleted',
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
    createPost,
    getPostById,
    editPostById,
    deletePostById,
};
