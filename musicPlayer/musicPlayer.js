/*
    已完成功能：
        1. 播放，暂停
        2. 上一曲，下一曲
        3. 随机播放 （最后一排按钮第二个）
        4. 循环播放（最后一排按钮第三个，通常来说随机播放和循环播放在同一个按钮设置，此处不合理:需要修改）
           通过洗牌算法实现伪随机，参考实际音乐播放器来进行
        5. 随着音乐不同切换图片，音乐信息
        6. 音乐总时长，已播放时长
        7. 进度条：随音乐变换，两种改变播放进度的方法（1，点击进度条，2.拖动进度条上的dot)
        8. 解决了刷新页面时候会canplay事件由于之前已经执行过，歌曲已经加载上，所以不会重新加载，导致显示的总时间的问题加入gurantee函数）
    未完成功能：
        1.所有音乐列表：第一排第一个按钮

        Failed to load resource: the server responded with a status of 404 (Not Found)
        GET http://127.0.0.1:5500/favicon.ico 404 (Not Found)    每次点击按钮的时候都会出现类型的错误提示
        favicon.ico是地址栏图标
        
*/

var log = console.log.bind(console)

var e = function (selector) {
    var element = document.querySelector(selector)
    if (element === null) {
        var s = `元素没找到，选择器 ${selector} 没有找到或者 js 没有放在 body 里`
        alert(s)
        return element
    } else {
        return element
    }
}

//songs对象代替后台数据
var songs = {
    0: {
        'src': "musicInfor/Final Masquerade_Linkin Park_128K.mp3",
        'name': "Final Masquerade",
        'album': "The Hunting Party",
        'artist': "Linkin Park",
        'cover': 'musicInfor/linken.jpg',
    },
    1: {
        'src': "musicInfor/There For You_Martin Garrix,Troye Sivan_128K.mp3",
        'name': "There for You",
        'album': "Sunday Morning Songs Vol.4",
        'artist': "Troye Sivan / Martin Garrix",
        'cover': 'musicInfor/thereforyou.jpg'
    },
    2: {
        'src': "musicInfor/Whirlpool_In Between_128K.mp3",
        'name': "Whirlpool",
        'album': "Sunrise",
        'artist': "In Between",
        'cover': 'musicInfor/overture.jpg'
    },

}

var index = 0
//对象存储音乐信息模拟后台数据
var oriOrderArr = Object.keys(songs)
var orderArr = JSON.parse(JSON.stringify(oriOrderArr))   //强拷贝


//secondToTimeForm函数将传入的string类型的时间（以秒为单位）转换成“分：秒”的string形式
var secondToTimeForm = function (stime) {
    //在这里需要使用parseInt的原因在于后面的求余数，所以最好使用整数单位，有小数的话会导致出错
    var stime = parseInt(stime)
    var hour = ''
    var minute = ''
    var second = ''
    if (stime >= 3600) {
        h = parseInt(stime / 3600)
        hour = String(h) + ':'
        stime = stime - h * 3600
    }
    minute = ('0' + String(parseInt(stime / 60))).slice(-2) + ':'
    second = ('0' + String(stime % 60)).slice(-2)
    return hour + minute + second
}

//显示歌曲的当前已播放时间
var showCurrentTime = function (audio) {
    var s = e("#id-span-currentime")
    var time = audio.currentTime
    s.innerHTML = secondToTimeForm(time)
}

//显示歌曲的总时间
var showDuration = function (audio) {
    var s = e("#id-span-duration")
    var time = audio.duration
    s.innerHTML = secondToTimeForm(time)
}

//当歌曲播放时，需要定时的调节歌曲的当前已播放时间，进度条的已播放部分，点的位置
//范围interval 
var timeIntervalChangeModule = function (audio) {
    var interval = 500
    var number = setInterval(function () {
        //显示当前已经播放的时间
        showCurrentTime(audio)
        //调整进度条的位置
        let length = getProgress(audio)
        changeProgressBar(length)
    }, interval)
    return number
}


//获取进度条已完成部分的长度
var getProgress = function (audio) {
    var cTime = audio.currentTime
    var allTime = audio.duration
    var length = cTime / allTime * 14 + 'rem'
    return length
}

//根据获取到的进度条的长度修改已完成部分，原点的位置
//@length：string形的长度，单位可以任意
/*getProgress和changeProgressBar分开写的原因在于changeProgressBar这一部分还需要
  用在后面通过进度条改变歌曲进度中
*/
var changeProgressBar = function (length) {
    var dot = e('.bar_dot')
    dot.style.left = length
    var innerBar = e('.inner')
    innerBar.style.width = length
}


//绑定audio标签的canplay属性，触发时机为初次加载音乐时，调节进度条后
var bindEventCanplay = function (audio) {
    var b = e('.fa-play')
    // 给出 audio 的时长 duration。
    //parseInt可以将string。float形等等转化为整型
    audio.addEventListener('canplay', function (event) {
        log('canplay')
        showDuration(audio)
        if (b.classList.contains('fa-pause')) {
            audio.play()
        }
    })
}

//当页面刷新的时候，不会重新加载音乐，因此可能导致歌曲总时间栏目有问题，此处加一个保险函数
var guaranteeAllTime = function (audio) {
    log('guarantee alltime')
    var s = e("#id-span-duration")
    if (s.innerText === '00:00') {
        var time = audio.duration
        s.innerHTML = secondToTimeForm(time)
    }
}


//获取下一首歌的index
var orderChangeSong = function (offset) {
    keys = Object.keys(songs)
    index = (index + offset + keys.length) % keys.length
}

//改变歌曲信息显示，改变audio的src
var showNextSong = function (audio, song) {
    audio.src = song['src']         //改变歌曲
    var img = e('#id-img-albumCover')
    img.src = song['cover']
    var album = e(".info__album")   //专辑名
    album.innerText = song['album']
    var name = e(".info__song")     //歌名
    name.innerText = song['name']
    var artist = e(".info__artist")  //歌手名
    artist.innerText = song['artist']
    // audio.play()        //播放
}

//正常结束歌曲后，根据具体的播放模式调用ChangeSong获取下一首歌曲的index，
var bindEventEnded = function (audio) {
    audio.addEventListener('ended', function () {
        var song
        if (audio.classList.contains('undo')) {
            log('undo')
        } else if (audio.classList.contains('random')) {
            log('random')
            orderChangeSong(1)

        } else {
            log('order')
            orderChangeSong(1)
        }
        song = songs[orderArr[index]]
        showNextSong(audio, song)
        changeProgressBar(0)
    })
}

//intervalNum用于标记定时器的标志，
/*
    开启定时器的时间：1. 音乐播放器处于播放状态时
                     2. 点击了上一曲，下一曲的时候同时此前的播放器状态处于暂停
*/
var intervalNum = 0

//绑定播放/暂停按钮，切换播放暂停状态
var bindEventPlay = function (audio) {
    var b = e('.fa-play')
    var bParent = b.parentNode
    bParent.addEventListener('click', function (event) {
        if (b.classList.contains('fa-play')) {
            log('play')
            audio.play()
            b.classList.remove('fa-play')
            b.classList.add('fa-pause')
            intervalNum = timeIntervalChangeModule(audio)
        } else if (b.classList.contains('fa-pause')) {
            log('pause')
            audio.pause()
            b.classList.remove('fa-pause')
            b.classList.add('fa-play')
            clearInterval(intervalNum)
        }
    })
}

//绑定上一曲按钮
var bindEventStepBackward = function (audio) {
    var stepBackward = e('.fa-step-backward').parentNode
    stepBackward.addEventListener('click', function (event) {
        log('last')
        orderChangeSong(-1)
        var song = songs[orderArr[index]]
        showNextSong(audio, song)
        var play = e('#id-i-play')
        if (play.classList.contains('fa-play')) {
            // audio.play()
            play.classList.remove('fa-play')
            play.classList.add('fa-pause')
            intervalNum = timeIntervalChangeModule(audio)
        }
    })
}

//下一曲按钮
var bindEventStepForward = function (audio) {
    var stepBackward = e('.fa-step-forward').parentNode
    stepBackward.addEventListener('click', function (event) {
        log('next')
        orderChangeSong(1)
        var song = songs[orderArr[index]]
        showNextSong(audio, song)
        var play = e('#id-i-play')
        if (play.classList.contains('fa-play')) {
            // audio.play()
            play.classList.remove('fa-play')
            play.classList.add('fa-pause')
            intervalNum = timeIntervalChangeModule(audio)
        }
    })
}

//洗牌算法 ES6结构
function shuffle(arr) {
    // log('shuffle begin', arr)
    let n = arr.length, random;
    while (0 != n) {
        random = (Math.random() * n--) >>> 0; // 无符号右移位运算符向下取整
        [arr[n], arr[random]] = [arr[random], arr[n]] // ES6的结构赋值实现变量互换
    }
    // log('shuffle end', arr)
    return arr;
}


//随机播放按钮
var bindEventRandom = function (audio) {
    var random = e('.fa-random')
    var farandom = random.parentNode
    farandom.addEventListener('click', function (event) {
        log('click random button')
        if (random.classList.contains('random')) {
            log('order begin')
            //将index返回为原来的songs的key
            index = orderArr[index]
            //orderArr 变为原来的顺序
            orderArr = JSON.parse(JSON.stringify(oriOrderArr))
            audio.classList.remove('random')
            random.classList.remove('random')
            random.classList.remove('highlight')
        } else {
            log('random begin')
            audio.classList.add('random')
            random.classList.add('random')
            random.classList.add('highlight')
            //首先把当前的歌曲作为第一首，然后将后面的歌曲进行洗牌排序，连接在后面
            orderArr = shuffle(orderArr)
            log('随机播放洗牌后的播放顺序', orderArr)
            //将当前歌曲作为第一首歌，因此现在的index为0
            index = orderArr.indexOf(index)
        }
        log(random.classList)
    })
}

//undo按钮的功能被我设置为单曲循环按钮
var bindEventUndo = function (audio) {
    var undo = e('.fa-undo')
    var faundo = undo.parentNode
    faundo.addEventListener('click', function (event) {
        log('click undo button')
        if (undo.classList.contains('undo')) {
            audio.classList.remove('undo')
            undo.classList.remove('undo')
            undo.classList.remove('highlight')
        } else {
            audio.classList.add('undo')
            undo.classList.add('undo')
            undo.classList.add('highlight')

        }
        // log(undo.classList)
    })
}

//给进度条绑定点击事件
var bindEventBar = function (audio) {
    var outer = e('.outer')
    outer.addEventListener('click', function (event) {
        var inner = e('.inner')

    })
}

//获取元素距离浏览器边界长度
var getOffsetLeft = function (obj) {
    var tmp = obj.offsetLeft;
    var val = obj.offsetParent;
    while (val != null) {
        tmp += val.offsetLeft;
        val = val.offsetParent;
    }
    return tmp;
}

var bindEventClickBar = function (audio) {
    var outer = e('.outer')
    var max = 14 * 16
    outer.addEventListener('click', function (event) {
        var offset = getOffsetLeft(outer)
        var len = event.clientX - offset
        length = len + 'px'
        changeProgressBar(length)
        audio.currentTime = parseInt(len / max * audio.duration)
        showCurrentTime(audio)
    })
}


//给进度条的dot绑定事件
var bindEventBar = function (audio) {
    var dot = e('.bar_dot')
    var inner = e('.inner')
    var outer = e('.outer')
    //获取outer的边长，转换为px
    var max = 14 * 16
    //offset为outer边到浏览器边界的距离
    var offset = 0
    var moving = false
    dot.addEventListener('mousedown', function (event) {
        //获取outer与浏览器边的距离
        offset = event.clientX - dot.offsetLeft
        moving = true
    })

    document.addEventListener('mouseup', function (event) {
        moving = false
    })
    //dot随鼠标移动的响应函数
    document.addEventListener('mousemove', function (event) {
        if (moving) {
            var len = event.clientX - offset
            if (len < 0) {
                len = 0
            }
            if (len > max) {
                len = max
            }
            length = len + 'px'
            dot.style.left = length
            inner.style.width = length
            audio.currentTime = parseInt(len / max * audio.duration)
            showCurrentTime(audio)
        }
    })
}


var __main = function () {
    var audio = e('#id-audio-player')
    guaranteeAllTime(audio)
    bindEventPlay(audio)
    bindEventCanplay(audio)
    bindEventEnded(audio)
    bindEventStepBackward(audio)
    bindEventStepForward(audio)
    bindEventRandom(audio)
    bindEventUndo(audio)
    bindEventBar(audio)
    bindEventClickBar(audio)

}

__main()
