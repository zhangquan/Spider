/*
 * GET home page.
 */

var db = require("../db"),
    Site = db.Site,
    Page = db.Page;


exports.createSite = function (req, res) {
    var newSite = new db.Site();
    newSite.title = req.param("title")
    newSite.author = req.param("author");
    newSite.save(function () {
        res.send(JSON.stringify({ success: true }), { 'Content-type': 'application/json' }, 200);
    })
};

exports.removeSite = function (req, res) {
    var newSite = new db.Site();
    newSite.title = req.param("title")
    newSite.author = req.param("author");
    newSite.save(function () {
        res.send(JSON.stringify({ success: true }), { 'Content-type': 'application/json' }, 200);
    })
};

exports.createPage = function (req, res) {
    var siteid = req.param("siteid");
    var title = req.param("title");
    var doc = req.param("doc");

    var site = Site.findById(siteid);

    var newPage = new Page();
    newPage.title = title;
    newPage.doc = doc;
    site.pages.push(newPage);


    site.save(function () {
        res.send(JSON.stringify({ success: true }), { 'Content-type': 'application/json' }, 200);
    })
};

exports.updatePage = function (req, res) {
    var siteid = req.param("siteid");
    var pageid = req.param("pageid");
    var title = req.param("title");
    var doc = req.param("doc");

    var site = Site.findById(siteid);

    var page = site.pages.id(pageid);


    page.title = title;
    page.doc = doc;


    site.save(function () {
        res.send(JSON.stringify({ success: true }), { 'Content-type': 'application/json' }, 200);
    })
};


exports.removePage = function (req, res) {
    var id = req.param("id");
    var siteid = req.param("siteid");
    var pageid = req.param("pageid");


    var site = Site.findById(siteid);

    var page = site.pages.id(pageid);

    page.remove({ _id: id }, function (err) {
        res.send(JSON.stringify({ success: true }), { 'Content-type': 'application/json' }, 200);
    });


};





