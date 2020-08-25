const fs = require('fs')

const musicFilePath = 'db/music.json'

const loadMusics = () => {
    let content = fs.readFileSync(musicFilePath, 'utf8')
    let ms = JSON.parse(content)
    return ms
}

const m = {
    data: loadMusics()
}

m.all = function() {
    let ms = this.data
    return ms
}

// 导出对象
module.exports = m
