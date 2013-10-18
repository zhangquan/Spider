var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    // yay!

    console.log("open")
});


var PageSchema = mongoose.Schema({
    title: String,
    doc: String
})


var SiteSchema = mongoose.Schema({
    title: String,
    author: String,
    commonPage: String,
    pages: [PageSchema],
    date: { type: Date, default: Date.now }

})

var Site = mongoose.model('Site', SiteSchema);
var Page = mongoose.model('Page', PageSchema) ;

exports = {
    Site:Site,
    Page:Page
}


