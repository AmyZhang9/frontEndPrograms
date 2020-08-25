// echarts
const chartStore = {
    pie: null,
}

const optionForPie = (data) => {
    let option = {
        title: {
            text: '豆瓣音乐top250音乐类型占比',
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [
            {
                name: '类型占比',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: data,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    }

    return option
}

const optionForArea = (area) => {
    let data = _.map(area, (v, k) => {
        let o = {
            name: k,
            value: v.length,
        }
        return o
    })
    let option = optionForPie(data)
    return option
}


const renderChart = (d) => {
    let data = d

    let area = _.groupBy(data, 'style')
    let areaOption = optionForArea(area)
    let pie = chartStore.pie
    pie.setOption(areaOption)

}

const fetchMusics = () => {
    let protocol = location.protocol
    console.log('protocol=', protocol)
    // 如果是通过 node 运行的, prototol 是 http
    // 则调用 api 来获取电影数据
    // 否则直接调用 musicJSON 函数获取电影数据
    if (protocol === 'http:') {
        // 使用 ajax 动态获取数据
        api.fetchMusics((d) => {
            d = JSON.parse(d)
            renderChart(d)
        })
    } else {
        // 直接使用 JSON 数据 不从后台获取
        let d = musicJSON()
        renderChart(d)
    }
}

const initedChart = () => {
    _.each(chartStore, (v, k) => {
        let selector = '#' + k
        log(selector)
        let element = document.querySelector(selector)
        let chart = echarts.init(element)
        chartStore[k] = chart
    })
}

const __main = () => {
    initedChart()
    fetchMusics()
}

// $(document).ready()  jQuery 的回调函数
// 是页面内容(只包括元素, 不包括元素引用的图片)载入完毕之后的回调事件
$(document).ready(() => {
    __main()
})
