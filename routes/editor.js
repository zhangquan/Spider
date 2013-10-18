var express = require('express')
    , fs = require('fs')
    , http = require('http')
    , express = express();


var settings = {
    port: 3000,
    paths: {
        static: __dirname + '/static',
        uploads: __dirname + '/uploads'
    }
};

