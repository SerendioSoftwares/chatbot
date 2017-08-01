var _ = require('lodash');
var Promise = require('bluebird');

var allCategories = [
{name:'Slippers',  imageUrl: 'https://placeholdit.imgix.net/~text?txtsize=48&txt=Flower%20' + (1) + '&w=640&h=330'},
{name:'Sandals',  imageUrl: 'https://placeholdit.imgix.net/~text?txtsize=48&txt=Flower%20' + (1) + '&w=640&h=330'},
{name:'Running Shoes',  imageUrl: 'https://placeholdit.imgix.net/~text?txtsize=48&txt=Flower%20' + (1) + '&w=640&h=330'},
{name:'Basketball Shoes',  imageUrl: 'https://placeholdit.imgix.net/~text?txtsize=48&txt=Flower%20' + (1) + '&w=640&h=330'},
{name:'Canvas Shoes',  imageUrl: 'https://placeholdit.imgix.net/~text?txtsize=48&txt=Flower%20' + (1) + '&w=640&h=330'}
];

var slippers =[
{name:'Clpp li Mens Slip On Slippers ',  imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/712qGtSTJOL._UY575_.jpg', price: Math.floor(Math.random() * 100) + 10 + .99},
{name:'Tamarac by Slippers International 7161 Men\'s Camper Moccasin ',  imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/81WLVA2jY6L._UX575_.jpg', price: Math.floor(Math.random() * 100) + 10 + .99},
{name:'Alpine Swiss Yukon Mens Suede Shearling Slip On Moccasin Slippers',  imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/71FJXRX4f6L._UY575_.jpg', price: Math.floor(Math.random() * 100) + 10 + .99},
{name:'Men\'s Comfort Knitted Cotton Slippers',  imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/71kx0LuLAFL._UX575_.jpg', price: Math.floor(Math.random() * 100) + 10 + .99},
{name:'RockDove Two-Tone Memory Foam House Slippers for Men',  imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/91utouX0uGL._UX575_.jpg', price: Math.floor(Math.random() * 100) + 10 + .99},
{name:'Vonmay Men\'s Wool Plush Fleece Lined Slip On',  imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/61LnJR3I1vL._UX575_.jpg', price: Math.floor(Math.random() * 100) + 10 + .99},
{name:'Deer Stags Men\'s Nordic Clog Slipper ',  imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/718pNMqvHUL._UX575_.jpg', price: Math.floor(Math.random() * 100) + 10 + .99},
{name:'HomeTop Men\'s Comfort Breathable Moisture-wicking Spring Summer Slip On',  imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/91SXjgmR13L._UX575_.jpg', price: Math.floor(Math.random() * 100) + 10 + .99},
{name:'adidas Men\'s Adissage SC Slide Sandal ',  imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/81wf4jsm5SL._UX575_.jpg', price: Math.floor(Math.random() * 100) + 10 + .99},
{name:'Isotoner Men’s Microterry Slip On Slippers ',  imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/91e-Sf-DYYL._UX575_.jpg', price: Math.floor(Math.random() * 100) + 10 + .99}
];

var sandals=[
{name:'Dream Pairs 160912-M New Men\'s Adventurous Light-Weight',  imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/619CbpZGhbL._UX575_.jpg', price: Math.floor(Math.random() * 100) + 10 + .99},
{name:'Dockers Men\'s Newpage Gladiator Sandal ',  imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/81Nu0kfwPQL._UX575_.jpg', price: Math.floor(Math.random() * 100) + 10 + .99},
{name:'KEEN Men\'s Newport H2 Sandal ',  imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/81hAe1hUmTL._UX575_.jpg', price: Math.floor(Math.random() * 100) + 10 + .99},
{name:'Northside Men\'s Riverside II Open-Toe Sandal ',  imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/81RfTvaL2OL._UX575_.jpg', price: Math.floor(Math.random() * 100) + 10 + .99},
{name:'Northside Men\'s Burke II Sandal ',  imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/810ms8la8bL._UX575_.jpg', price: Math.floor(Math.random() * 100) + 10 + .99},
{name:'Columbia Men\'s Techsun Vent Sandal ',  imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/81NVEVs5EvL._UX575_.jpg', price: Math.floor(Math.random() * 100) + 10 + .99},
{name:'Fila Men\'s Transition Athletic Sandal ',  imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/71hKKpZJvuL._UX575_.jpg', price: Math.floor(Math.random() * 100) + 10 + .99},
{name:'Dockers Men\'s Searose Fisherman Sandal ',  imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/81vjF6j3AAL._UX575_.jpg', price: Math.floor(Math.random() * 100) + 10 + .99},
{name:'Rockport Men\'s Rocklake Athletic Sandal ',  imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/81h2UluvG1L._UY695_.jpg', price: Math.floor(Math.random() * 100) + 10 + .99},
{name:'Teva Men\'s Katavi Outdoor Sandal, Walnut',  imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/81RL0stHVVL._UX575_.jpg', price: Math.floor(Math.random() * 100) + 10 + .99},
];

var shoes=[
{name:'Dream Pairs 160912-M New Men\'s Adventurous Light-Weight',  imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/619CbpZGhbL._UX575_.jpg', price: Math.floor(Math.random() * 100) + 10 + .99},
{name:'Dockers Men\'s Newpage Gladiator Sandal ',  imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/81Nu0kfwPQL._UX575_.jpg', price: Math.floor(Math.random() * 100) + 10 + .99},
{name:'KEEN Men\'s Newport H2 Sandal ',  imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/81hAe1hUmTL._UX575_.jpg', price: Math.floor(Math.random() * 100) + 10 + .99},
{name:'Northside Men\'s Riverside II Open-Toe Sandal ',  imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/81RfTvaL2OL._UX575_.jpg', price: Math.floor(Math.random() * 100) + 10 + .99},
{name:'Northside Men\'s Burke II Sandal ',  imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/810ms8la8bL._UX575_.jpg', price: Math.floor(Math.random() * 100) + 10 + .99},
{name:'Columbia Men\'s Techsun Vent Sandal ',  imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/81NVEVs5EvL._UX575_.jpg', price: Math.floor(Math.random() * 100) + 10 + .99},
{name:'Fila Men\'s Transition Athletic Sandal ',  imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/71hKKpZJvuL._UX575_.jpg', price: Math.floor(Math.random() * 100) + 10 + .99},
{name:'Dockers Men\'s Searose Fisherman Sandal ',  imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/81vjF6j3AAL._UX575_.jpg', price: Math.floor(Math.random() * 100) + 10 + .99},
{name:'Rockport Men\'s Rocklake Athletic Sandal ',  imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/81h2UluvG1L._UY695_.jpg', price: Math.floor(Math.random() * 100) + 10 + .99},
{name:'Teva Men\'s Katavi Outdoor Sandal, Walnut',  imageUrl: 'https://images-na.ssl-images-amazon.com/images/I/81RL0stHVVL._UX575_.jpg', price: Math.floor(Math.random() * 100) + 10 + .99},
];

// var allCategories = _.times(5)
//     .map(function (i) {
//         return {
//             name: 'Flower ' + (i + 1),
//             imageUrl: 'https://placeholdit.imgix.net/~text?txtsize=48&txt=Flower%20' + (i + 1) + '&w=640&h=330'
//         };
//     });

// var allProducts = _.times(17)
//     .map(function (i) {
//         return {
//             name: 'Bouquet ' + (i + 1) + '\u2122',
//             imageUrl: 'https://placeholdit.imgix.net/~text?txtsize=48&txt=Bouquet%20' + (i + 1) + '&w=640&h=330',
//             price: Math.floor(Math.random() * 100) + 10 + .99
//         };
//     });

var productsService = {
    // Categories
    getCategories: function (pageNumber, pageSize) {
        return pageItems(pageNumber, pageSize, allCategories);
    },

    // Get Single Category
    getCategory: function (categoryName) {
        var category = _.find(allCategories, ['name', categoryName]);
        return Promise.resolve(category);
    },

    // Products
    getProducts: function (categoryName, pageNumber, pageSize) {
        console.log(categoryName)
        if (categoryName==='slippers')
        {
            return pageItems(pageNumber, pageSize, slippers);
        }
        else if (categoryName==='sandals')
        {
            return pageItems(pageNumber, pageSize, sandals);
        }
        else 
        {
            return pageItems(pageNumber, pageSize, shoes)
        }
    },

    // Get Single Product
    getProduct: function (productName) {
        var product = _.find(slippers.concat(sandals), ['name', productName]);

        return Promise.resolve(product);
    }
};

// helpers
function pageItems(pageNumber, pageSize, items) {
    var pageItems = _.take(_.drop(items, pageSize * (pageNumber - 1)), pageSize);
    var totalCount = items.length;
    return Promise.resolve({
        items: pageItems,
        totalCount: totalCount
    });
}

// export
module.exports = productsService;