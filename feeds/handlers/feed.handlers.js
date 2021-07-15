const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);
const { attachPaginate } = require('knex-paginate');
attachPaginate();
const { publishToQueue } = require('../utils/rabbitMQ');

const getFeed = async (req, res) => {
    try {
        let { page, limit } = req.query;
        console.log(`Get all feeds by page: ${page} and limit: ${limit}`);

        let data = await database('feed_master').paginate({
            perPage: limit,
            currentPage: page,
        });

        console.log(data);

        if (data.length === 0) {
            return res.status(404).json({
                errorStack: null,
                status: 404,
                message: 'Invalid Post Id',
            });
        }

        return res.status(200).json({
            status: 200,
            message: 'feed',
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
    getFeed,
};
