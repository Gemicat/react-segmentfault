const express = require('express');
const superagent = require('superagent');
const cheerio = require('cheerio');

const app = express();

// 设置请求头
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
})

// 设置默认请求路径
app.get('/', function(req, res) {
    let url = 'https://segmentfault.com/questions?page=';
    let page = req.query.page;
    superagent.get(url + page)
        .end(function(err, sres) {
            let arrInfo = getList(sres.text);
            res.jsonp(arrInfo);
        });
});

// 获取分类
app.get('/tag', function(req, res) {
    let page = req.query.page;
    let tag = req.query.tag;
    let url = 'https://segmentfault.com/t/' + tag + '?type=newest&page=' + page;
    superagent.get(url)
        .end(function(err, sres) {
            let arrInfo = getList(sres.text);
            res.jsonp(arrInfo);
        })
})

// 获取问题详情
app.get('/question', function(req, res) {
    let id = req.query.id;
    let url = 'https://segmentfault.com/q/' + id;
    superagent.get(url)
        .end(function(err, sres) {
            let $ = cheerio.load(sres.text, {
                decodeEntities: false
            });
            $("img[data-src]").each(function() {
                let src = $(this).attr('data-src');
                $(this).attr('src', "https://segmentfault.com" + src);
            });

            let arr = {
                question: [],
                comment: []
            };
            arr.question = {
                title: $("#questionTitle").find('a').text(),
                question: $(".question").html(),
                count: $(".widget-question__item").find('.count').text(),
                authorTime: $(".question__author").text()
            }
            let commonts = $(".widget-answers__item");
            commonts.map(function(index, item) {
                let $ele = $(item);
                arr.comment.push({
                    answer: $ele.find('.answer ').html(),
                    count: $ele.find('.widget-vote .count ').text(),
                    avatar: $ele.find(".avatar-32").attr("src"),
                    name: $ele.find('.answer__info--author-name').text(),
                    rank: $ele.find(".answer__info--author-rank").text(),
                    time: $ele.find(".mb0 a").eq(0).text()
                });
            });
            res.jsonp(arr);
        })
})

// 格式化返回的json
function getList(data){
    let $ = cheerio.load(data);
    let arr = [];
    let list = $('.stream-list').find('section');
    list.map(function(index, item) {
        let $ele = $(item);
        let reg = /\d+/;
        let views = parseInt($ele.find('.views').text().trim());
        let answers = parseInt($ele.find('.answers').text().trim());
        let votes = parseInt($ele.find('.votes').text().trim());
        let author = $ele.find(".author a").eq(0).text();
        let title = $ele.find('.title a').text().trim();
        let titleSrc = $ele.find('.title a').attr("href").match(reg).toString();
        let collect = parseInt($ele.find('.pull-right').text().trim());
        let time = $ele.find(".author a").eq(1).text();

        arr.push({
            views: views,
            answers: answers,
            votes: votes,
            title: {
                content: title,
                titleSrc: titleSrc
            },
            collect: collect,
            author: author,
            time: time
        });
    });

    return arr;
}

// 开启服务
let server = app.listen(3000, function() {
    console.log(3000);
});