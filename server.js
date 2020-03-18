const express = require('express');
const app = express();
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const options = {
    target: 'https://fridgy-api.herokuapp.com/', // target host
    // pathRewrite: {
    //   '^/api/old-path': '/api/new-path', // rewrite path
    //   '^/api/remove/path': '/path' // remove base path
    // }
  };


app.use(express.static(__dirname + '/dist/oshop'));

app.use('/api', createProxyMiddleware(options));

//

app.get('/*', (req,res) => {
    res.sendFile(__dirname + '/dist/oshop/index.html');
});

app.listen(process.env.PORT || 8080);
