/**
 * TODO:
 * Buatlah program untuk membaca teks input.txt dan menuliskannya ulang pada berkas output.txt
 * menggunakan teknik readable stream dan writable stream.
 */
const fs = require('fs')
const path = require('path')

const readableStream = fs.createReadStream(path.resolve(__dirname, 'input.txt'), {
    highWaterMark: 15
})

const writeableStream = fs.createWriteStream(path.resolve(__dirname, 'output.txt'))

readableStream.on('readable', () => {
    try {
        writeableStream.write(`${readableStream.read()}\n`)
    } catch (err) {
        // console.log(err);
    }
})

readableStream.on('end', () => {
    writeableStream.end()
})

