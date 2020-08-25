项目介绍：
•使用ECMAScript 在Node.js 环境下、爬取目标网页数据，并配合 ECharts 框架实现数据可视化
•针对不同目标网页，可实现普通爬虫、伪装登录爬虫，使用 cheerio 和syncrequest 模块爬取目标数据
•通过缓存机制提高爬虫效率
•数据分析后按指定格式保存，通过 fs 库将数据写入 JSON 文件
•在Node.js 环境下通过 Express 框架搭建后端，调用 ECharts 库，选择合适样式，配置图表对应参数并渲染页面

文件夹：
crawler:爬虫文件
visualization:可视化

crawler 用法:
cd crawler
nmp install
nmp run start
即可得到豆瓣250音乐数据

将该数据复制到visualization文件目录下（已复制）：
cd visualization
nmp intall
nmp run start
打开命令行所给链接，即可看到可视化图标
在命令行所给来链接后加/api/music/all，即可看到所有音乐数据


