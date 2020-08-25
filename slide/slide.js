// 轮播图
// 模拟网站的轮播图组件
/*
已完成功能：
 1. 点击下一页可以切换到下一张图片
 2. 点击上一页可以切换到上一张图片
 3. 点击按钮时, 切换小圆点
 4. 移动到小圆点, 可以切换到相应图片
 5. 自动播放图片
*/

var log = console.log.bind(console)

var e = function(selector) {
    var element = document.querySelector(selector)
    if (element === null) {
        var s = `元素没找到，选择器 ${selector} 没有找到或者 js 没有放在 body 里`
        alert(s)
        return element
    } else {
        return element
    }
}

var es = function(selector) {
    var elements = document.querySelectorAll(selector)
    if(elements.length === 0){
        var s = `元素没找到，选择器 ${selector} 没有找到或者 js 没有放在 body 里`
        alert(s)
        return []
    } else {
        return elements
    }
}

var bindAll = function(selector, move, callback) {
    for (let i = 0; i < selector.length; i++) {
        selector[i].addEventListener(move, callback)
    }
}

//获取下一个要显示的图片的index
/*
@slide 当前图片元素
@offset 下一张图片相对于当前图片的偏移量
*/
var nextIndex = function(slide, offset) {
    var numberOfActive = Number(slide.dataset.active)
    var numberOfImgs = Number(slide.dataset.imgs)
    var nextIndex = (numberOfActive + offset + numberOfImgs) % numberOfImgs
    return nextIndex
}

//更改图片显示，更改小圆点显示
var showImageAtIndex = function(slide, index) {
    //设置父节点的data-active
    slide.dataset.active = String(index)
    //更改显示图片
    var className = 'gua-active'
    var activeImag = e('.gua-active')
    activeImag.classList.remove(className)

    var showImagId = '#id-guaimage-' + String(index)
    var showImage = e(showImagId)
    showImage.classList.add(className)

    //更改显示的小圆点
    var classindi = 'gua-white'
    var activeIndi = e('.gua-white')
    activeIndi.classList.remove(classindi)

    var showIndiId = '#id-indicator-' + String(index)
    var showIndi = e(showIndiId)
    showIndi.classList.add(classindi)
}

//给小圆点绑定mouseover事件
var bindEventIndicator = function() {
    var slide = e('.gua-slide')
    var indicators = es('.gua-slide-indi')
    bindAll(indicators, 'mouseover', function(event) {
        var target = event.target
        var index = Number(target.dataset.index)
        showImageAtIndex(slide, index)
    })
}

//给上下按钮绑定click事件
var bindEventButton = function() {
    var slide = e('.gua-slide')
    var buttons = es('.gua-slide-button')
    bindAll(buttons, 'click', function(event) {
        var target = event.target
        var offset = Number(target.dataset.offset)
        var index = nextIndex(slide, offset)
        showImageAtIndex(slide, index)
    })
}

//正序切换到下一张
var playNextImage = function() {
    var slide  = e('.gua-slide')
    var offset = 1
    var index = nextIndex(slide, offset)
    showImageAtIndex(slide, index)
}

//使用setInterval实现自动播放，2秒切换下一张
var autoPlay = function () {
    var interval = 2000
    setInterval(function() {
        playNextImage()
    }, interval)
}


var __main = function() {
    bindEventButton()
    bindEventIndicator()
    autoPlay()
}

__main()
