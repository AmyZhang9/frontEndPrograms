var log = console.log.bind(console)
var ensure = function (condition, information) {
    if (condition === false) {
        alert(information)
    }
}

var e = function (selector) {
    var element = document.querySelector(selector)
    if (element === null) {
        var s = `元素没有找到, 选择器 ${selector} 不对或者 js 没有放在 body 里面`
        alert(s)
    } else {
        return element
    }
}

//游戏等级相关信息
var obj = {
    //初级
    'first': {
        boxNum: 100,
        row: 10,
        col: 10,
        boomNum: 10,
    },
    //中级
    'second': {
        boxNum: 144,
        row: 12,
        col: 12,
        boomNum: 15,
    },
    //高级
    'third': {
        boxNum: 225,
        row: 15,
        col: 15,
        boomNum: 25,
    },
}

// allTime游戏进行的事件，intervalIndex设置的定时器的序号，start是否开始标志
var allTime = 0
var intervalIndex = 0
var start = false

//boxNum该游戏等级的格子总数，row行，col列，boomNum炸弹数，该四个参数初始化为初级游戏的相关参数
var boxNum = obj['first'].boxNum
var row = obj['first'].row
var col = obj['first'].col
var boomNum = obj['first'].boomNum

//返回小格子的语句块
var getBoxInfor = function (value) {
    var r = `<div class='little' id='id-index-${value}' data-number=0></div>`
    return r
}

//生成格子
var produceInsideBox = function (bigBox) {
    for (var i = 0; i < row; i++) {
        for (var j = 0; j < col; j++) {
            var index = i * col + j
            var box = getBoxInfor(index + 1)
            bigBox.insertAdjacentHTML('beforeend', box)
        }
    }
}

//生成随机数
var random = function (range) {
    var result = Math.floor(Math.random() * range) + 1
    // log(result)
    return result
}

//生成雷 获得boomNum个雷，不包含index,是的点击的第一个格子不是雷
var produceBoom = function (index) {
    var boomArr = []
    while (boomArr.length < boomNum) {
        var r = random(row * col)
        if (r === index || boomArr.includes(r)) {
            continue
        } else {
            boomArr.push(r)
        }
    }
    //log(boomArr)
    return boomArr
}

//获取index周围的一圈的格子数组
var getAround = function (index) {
    var arr = []
    var isNotTop = (index > col)        //非最上
    var isNotLeft = (index % col !== 1)  //非最左
    var isNotRight = (index % col !== 0)  //非最右
    var isNotBottom = (index < ((row - 1) * col + 1))       //非最下

    //非最上则需要将上面一排加入数组
    if (isNotTop) {
        isNotLeft && arr.push(index - (col + 1))
        arr.push(index - col)
        isNotRight && arr.push(index - (col - 1))
    }
    isNotLeft && arr.push(index - 1)
    isNotRight && arr.push(index + 1)

    //非最下则需要将下面一排加入数组
    if (isNotBottom) {
        isNotLeft && arr.push(index + (col - 1))
        arr.push(index + col)
        isNotRight && arr.push(index + (col + 1))
    }
    return arr
}

//获取与index直接相连的格子数组
var getConnect = function (index) {
    var arr = []
    var isNotTop = (index > col)        //非最上
    var isNotLeft = (index % col !== 1)  //非最左
    var isNotRight = (index % col !== 0)  //非最右
    var isNotBottom = (index < ((row - 1) * col + 1))      //非最下

    isNotTop && arr.push(index - col)
    isNotLeft && arr.push(index - 1)
    isNotRight && arr.push(index + 1)
    isNotBottom && arr.push(index + col)
    return arr

}

//boomInitial是获取炸弹数组（其中不包含index),并将炸弹和周围有炸弹的格子data-number指定相应的值
var boomInitial = function (index) {
    log("boomInitial")
    //获取地雷的数组
    var boomArr = produceBoom(index)
    for (var i = 0; i < boomArr.length; i++) {
        var boomIndex = boomArr[i]
        // var boomIndex = boomArr[0]
        var idname = '#id-index-' + String(boomIndex)
        var box = e(idname)
        box.dataset.number = '*'
        var aroundArr = getAround(boomIndex)
        for (var j = 0; j < aroundArr.length; j++) {
            idname = '#id-index-' + String(aroundArr[j])
            box = e(idname)
            if (box.dataset.number != '*') {
                box.dataset.number = String(Number(box.dataset.number) + 1)
            }
        }
    }
    return boomArr
}

//清除该格子上的所有图标（小红旗，问号）
function clearFlag(self) {
    if (self.classList.contains('iconfont')) {
        self.classList.remove('iconfont')
        if (self.classList.contains('icon-xiaohongqi')) {
            self.classList.remove('icon-xiaohongqi')
            var residue = e('#id-span-residue')
            var number = Number(residue.innerText) + 1
            residue.innerText = String(number)
        } else {
            self.classList.remove('icon-wenhao')
        }

    }
}

//对于周围没有炸弹的格子，递归翻开周围
var recuresive = function (arr) {
    for (var i = 0; i < arr.length; i++) {
        var index = arr[i]
        var idname = '#id-index-' + String(index)
        var box = e(idname)
        if (box.classList.contains('clicked')) {
            continue
        } else if (box.dataset.number !== '0') {
            clearFlag(box)
            boxNum -= 1
            box.classList.add('clicked')
            box.innerText = box.dataset.number

        } else {
            clearFlag(box)
            boxNum -= 1
            box.classList.add('clicked')
            var id = box.id
            var index = Number(id.slice(id.lastIndexOf('-') + 1))
            //log(index)
            var arrNext = getConnect(index)
            recuresive(arrNext)
        }
    }
}

//事件委托，把click绑定在big上
var bindEventDelegate = function (all) {
    var boomArr = []
    all.onmousedown = function (event) {
        var self = event.target
        //log(self)
        //确定被点击的是小格子
        if (self.classList.contains('little')) {
            if (start === false) {
                log('游戏开始！')
                start = true
                //开启定时器计时
                intervalIndex = setInterval(() => {
                    var time = e('#id-span-resttime')
                    allTime = allTime + 1
                    time.innerText = String(allTime) + ' s'
                }, 1000);
                //初始化炸弹，让炸弹不会第一个点击的位置
                var id = self.id
                var index = Number(id.slice(id.lastIndexOf('-') + 1))
                boomArr = boomInitial(index)
                // showBoom()
            }
            //获取点击的键标号
            var mouseBtnNo = event.button;
            if (mouseBtnNo === 0) {
                log('点击了左键')
                reactionForMouseLeft(self, boomArr, all)

            } else if (mouseBtnNo === 2) {
                log('点击了右键')
                reactionForMouseRight(self)
            }
        }
    }
}

//点击左键的需要的操作
function reactionForMouseLeft(self, boomArr, all) {
    //如果该单元被标记，则无法点击右键无效
    if (self.classList.contains('iconfont')) {
        return
    }
    if (self.classList.contains('clicked')) {
        //log('点击过了')
    } else {
        if (self.dataset.number === '*') {
            all.classList.add('finished')
            var len = boomArr.length
            log('长度', len)
            log('boomArr', boomArr)
            for (var i = 0; i < len; i++) {
                var idname = '#id-index-' + String(boomArr[i])
                var box = e(idname)
                box.classList.add('clicked')
                box.innerText = box.dataset.number
                clearFlag(box)
            }
            clearInterval(intervalIndex)
            document.body.insertAdjacentHTML('beforeend', '<h1 class=\'red\'>游戏结束，你输了</h1>')
            log('游戏结束，你输了')
            all.onmousedown = null
        } else if (self.dataset.number !== '0') {
            boxNum -= 1
            self.classList.add('clicked')
            self.innerText = self.dataset.number
        } else {
            self.classList.add('clicked')
            boxNum -= 1
            var id = self.id
            var index = Number(id.slice(id.lastIndexOf('-') + 1))
            var arr = getConnect(index)
            recuresive(arr)
        }
        if (boxNum === boomNum) {
            all.classList.add('finished')
            clearInterval(intervalIndex)
            document.body.insertAdjacentHTML('beforeend', '<h1 class=\'red\'>游戏结束，你赢了</h1>')
            log('游戏结束，你赢了')
            all.onmousedown = null
        }
    }
}

//点击右键需要的操作
function reactionForMouseRight(self) {
    var residue = e('#id-span-residue')
    var num = Number(residue.innerText)
    if (!self.classList.contains('iconfont')) {
        self.classList.add('iconfont')
        self.classList.add('icon-xiaohongqi')
        if (num > 0) {
            num = num - 1
        }
        residue.innerText = String(num)
    } else {
        if (self.classList.contains('icon-xiaohongqi')) {
            self.classList.remove('icon-xiaohongqi')
            self.classList.add('icon-wenhao')
            num = num + 1
            residue.innerText = String(num)
        } else {
            self.classList.remove('icon-wenhao')
            self.classList.remove('iconfont')
        }
    }
}

//重新开始的具体操作
function restartProcess(lever, all) {
    var index = lever.selectedIndex
    //得到游戏等级
    var module = lever.options[index].value
    boxNum = obj[module].boxNum
    row = obj[module].row
    col = obj[module].col
    boomNum = obj[module].boomNum

    //数据初始化
    allTime = 0
    start = false
    var time = e('#id-span-resttime')
    time.innerText = '0s'
    var residue = e('#id-span-residue')
    residue.innerText = String(boomNum)
    //格子初始化
    all.innerHTML = ''
    produceInsideBox(all)
    bindEventDelegate(all)
}


//给重新开始按钮绑定click函数
var restartclicked = function (all) {
    var restart = e('#id-button-restart')
    restart.addEventListener('click', function (event) {
        if (all.classList.contains('finished')) {
            //删除结果标签
            var result = document.getElementsByTagName('h1')[0];
            document.body.removeChild(result)
            //清除结果中的finished的标志
            all.classList.remove('finished')
        } else {
            var change = confirm('游戏正在进行中，是否重新开启新游戏')
            if (change === false) {
                return
            }
        }
        var lever = e('#id-select-level')
        restartProcess(lever, all)
    })
}

//给等级按钮绑定事件
var bindlevelEvent = function (all) {
    var lever = e('#id-select-level')
    lever.onchange = function () {
        var index = lever.selectedIndex
        //得到游戏等级
        var module = lever.options[index].value
        //修改边框的大小
        var keys = Object.keys(obj)
        for (k in keys) {
            all.classList.remove(keys[k])
        }
        all.classList.add(module)


        if (all.classList.contains('finished')) {
            //删除结果标签
            var result = document.getElementsByTagName('h1')[0];
            document.body.removeChild(result)
            //清除结果中的finished的标志
            all.classList.remove('finished')
        }
        restartProcess(lever, all)

    }
}

//测试函数，用于显示所有的格子的data-num,仅用作测试
function showBoom() {
    for (var i = 1; i <= boxNum; i++) {
        var idname = '#id-index-' + String(i)
        var box = e(idname)
        box.innerText = box.dataset.number
        // log(box)
    }
}

//总步骤
var _main = function () {
    var bigBox = e('.all')

    //清除浏览器默认的左右键菜单
    bigBox.onselectstart = function () {
        return false;
    }
    bigBox.oncontextmenu = function (e) {
        return false;
    }

    bindlevelEvent(bigBox)
    produceInsideBox(bigBox)
    bindEventDelegate(bigBox)
    restartclicked(bigBox)

}

_main()