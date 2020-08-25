const music = require('../model/music')

const all = {
    path: '/api/music/all',
    method: 'get',
    func: (request, response) => {
        let ms = music.all()
        let r = JSON.stringify(ms)
        // console.log('music加载出来的数据')
        // console.log(r)
        response.send(r)
    }
}

const routes = [
    all,
]

module.exports.routes = routes
