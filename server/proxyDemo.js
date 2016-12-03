/**
 * Created by Administrator on 2016/12/3.
 */

const http = require('http')
const express = require('express')
const httpProxy = require('http-proxy')

const proxy = httpProxy.createProxyServer({
  target: 'http://api.douban.com/',
  changeOrigin: true,
})
const app = express()

app.all('/v2/*', function (req, res) {
  proxy.web(req, res)
})

http.createServer(app).listen('1003', function () {
  console.log('启动服务器完成，访问试试：http://127.0.0.1:1003/v2/movie/top250')
})
