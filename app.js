var express = require('express');
var pg = require('pg');
var app = express();
var connection = {
    client: 'pg',
    connection: {
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: '55555',
        database: 'my_db'
    }
};
var port = 3000;
var knex = require('knex')(connection);
var bookShelf = require('bookshelf')(knex);

var Book = bookShelf.Model.extend({
    tableName: 'books',
    pages: function() {
        return this.hasMany(Page);
    }
});

var Page = bookShelf.Model.extend({
    tableName: 'pages',
    book: function() {
        return this.belongsTo(Book);
    }
});


bookShelf.knex.schema.hasTable('books').then(function(exists) {
    if (!exists) {
        bookShelf.knex.schema.createTable('books', function(table) {
            table.increments('id').primary();
            table.string('name');
        }).then(function(table) {
            console.log('created table :', 'books');
        })
    }
});


bookShelf.knex.schema.hasTable('pages').then(function(exists) {
    if (!exists) {
        bookShelf.knex.schema.createTable('pages', function(table) {
            table.increments('id').primary();
            table.string('content');
            table.integer('book_id').references('books.id');
        }).then(function(table) {
            console.log('created table :', 'pages');
        });
    }
});


new Book({ name: 'New Article' }).save().then(function(model) {
    console.log("book inserted");
});


new Page({ content: 'some content', book_id: 1 }).save().then(function(model) {
    console.log("page inserted");
});


Book.where('id', 1).fetch({ withRelated: ['pages'] }).then(function(user) {
    console.log(user.toJSON());
}).catch(function(err) {
    console.error(err);
});
app.listen(port);
console.log("server is running....");
