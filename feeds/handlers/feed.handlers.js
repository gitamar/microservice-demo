const environment = process.env.NODE_ENV || 'development';
const { Feed  } = require('../models/feed.model')
const { publishToQueue } = require('../utils/rabbitMQ');

const getFeed = async (req, res) => {
    try {
        let { page, limit  } = req.qurey
        console.log(`Get post by # ${id} `);

        const options = {
            page,
            limit,
            collation: {
              locale: 'en',
            },
          };

        let data = await Feed.paginate({},options)

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
