const routes = [
    {
        method: 'GET',
        path: '/hello',
        handler: (req, h) => {
            return h.response({
                message: 'nice'
            }).code(201)
        }
    },
]

module.exports = routes