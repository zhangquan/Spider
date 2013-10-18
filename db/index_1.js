var Db = require('tingodb')().Db,
    assert = require('assert');

var db = new Db('data', {});
// Fetch a collection to insert document into
var collection = db.collection("docs");
// Insert a single document


var findAll = function (callback) {
    db.find({}, function (err, docs) {

        callback && callback(docs)

    });

}
var removeAll = function (callback) {
    db.remove({type: "page"}, function (err, docs) {

        console.log("remove")

        callback && callback(docs)

    });

}
var find = function (callback) {
    collection.findOne({type: "page"}, function (err, item) {
        callback && callback(item)
    })

}
var insert = function (newdoc) {

    find(function (item) {
        if (item) {
            console.log("udpate", item._id)
            collection.update({_id: item._id}, {$set: {doc: newdoc.doc}});
        }
        else {
            collection.insert([newdoc], {w: 1}, function (err, result) {
                console.log("insert", result._id)

                // Fetch the document

            });
        }


    })


}



var insertSection =  function(newSection){

    collection.insert([newdoc], {w: 1}, function (err, result) {
        console.log("insert section", result._id)

        // Fetch the document

    });


}

var newSite = function(){

}

exports.insert = insert;

exports.find = find;

