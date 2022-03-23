const http = require('http')

/**
 * @param request: objek yang berisikan informasi terkait permintaan
 * @param response: objek yang digunakan untuk menanggapi permintaan
 */
const requestListener = (request, response) => {
    const method = request.method
    const url = request.url

    if (url === '/') {
        if (method === 'GET') {
            response.statusCode = 200
            response.setHeader('Content-Type', 'text/html')
            response.end('Ini adalah homepage')
        } else {
            response.end('Halaman tidak dapat diakses dengan <any> request')
        }
        return
    }

    if (url === '/about') {
        if (method === 'GET') {
            response.statusCode = 200
            response.setHeader('Content-Type', 'text/html')
            response.end('Ini adalah about page')
        } else if (method === 'POST') {
            let body = []

            request.on('data', chunk => {
                body.push(chunk)
            })

            request.on('end', () => {
                body = Buffer.concat(body).toString()
                const { name } = JSON.parse(body)
                response.end(`Hallo ${name}, welcome to about page`)
            })
        } else {
            response.end('Halaman tidak dapat diakses dengan <any> request')
        }
        return
    }

    response.end('Not found')
}

const server = http.createServer(requestListener)
server.listen(4000, () => {
    console.log("Running in port 4000");
})