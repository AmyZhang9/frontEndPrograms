const request = require('syncrequest')
const cheerio = require("cheerio")
var fs = require('fs')

var ofile = fs.openSync('music.json', 'w');
//当需要进行登录爬虫的时候，需要获取cookie和userAgent
const { cookie, userAgent } = require('./config');
const { count } = require('console');

const index = () => {
    var musics = []
    for (var j = 0; j < 10; j++) {
        //爬取文件url
        let url = 'https://music.douban.com/top250?start='
        //豆瓣250系列的需要爬虫的网页有25张，url区别是start = 25n (n=0-9)
        let time = j * 25
        url = url + time
        let options = {}
        // options 参数可以模拟登录, 爬虫豆瓣不需要进行登录
        //模拟登录的话
        // let options = {
        //     'header': {
        //         'cookie': cookie,
        //         'userAgent' : userAgent
        //     },
        // }

        let resultHtml = request.get.sync(url, options).body.toString()
        var $ = cheerio.load(resultHtml)
        //可以创建一个和jQuery选择器用法差不多的选择器 $.

        var tables = $(".indent table")
        // console.log(tables)
        //观察豆瓣音乐的html源码可知，其中的歌曲名，专辑名存储在.p12 > a 标签中
        //歌手，年份，类型等信息存储在.p12 .p1 中，注意，有的p1只有一个，有的有多个，需要指明取第一个
        for (var i = 0; i < tables.length; i++) {
            var music = {}
            var table = tables.eq(i)
            //获取歌曲名
            var ta = table.find('.pl2').find('a')
            var tname = ta.text().trim()
            var index = tname.indexOf('\n')
            if (index !== -1) {
                tname = tname.slice(0, index)
            }
            music.name = tname
            //获取专辑名，专辑名有则加入，没有则不加入
            talbum = ta.find('span').text().trim()
            if (talbum !== '') {
                music.album = talbum
            }
            //年份
            var tinfor = table.find('.pl2').find('.pl').eq(0).text().trim()
            //歌手
            var tsinger = tinfor.slice(0, tinfor.indexOf('/')).trim()
            music.singer = tsinger
            tinfor = tinfor.slice(tinfor.indexOf('/') + 1)
            //年份
            tyear = tinfor.slice(0, tinfor.indexOf('/')).trim()
            music.year = tyear
            //种类
            tstyle = tinfor.slice(tinfor.lastIndexOf('/') + 1).trim()
            let sign = false
            //豆瓣音乐的总类通常是/的最后的一组词，当时可能会没有类型，因此此处需要做一个防错处理
            if (tstyle === '原声' || tstyle === 'CD') {
                sign = true
            }
            if (tstyle === '数字(Digital)' || tstyle === 'CD DVD') {
                sign = true
            }
            if (sign) {
                tstyle = '未注明'
            }
            
            music.style = tstyle
            //保存到music中
            musics.push(music)
        }
    }
    console.log(musics)
    //先使用JSON序列化，以utf-8模式存储
    fs.writeSync(ofile, JSON.stringify(musics), null, 'utf-8');
}

const __main = () => {
    index()
}

__main()
