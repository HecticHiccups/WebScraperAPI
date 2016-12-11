//NodeJS WebScraper API Barnes & Nobles
//Created by: Jesus Arteaga, Jonathon Portorreal
//Date Created: 12/10/2016, Time:12-5pm 
//


//Required Modules
const request = require('request');
const cheerio = require('cheerio');
const express = require('express');
const fs = require('fs'); 

const mongojs = require('mongojs'); 

//MLab Mongodb connection, user:jesus pass:jesus123, passed in classics array, parses data.
const db = mongojs("mongodb://jesus:jesus123@ds127948.mlab.com:27948/barnesapi", ["classics"]);

// intiaize express into a variable to utilize express methods.
let  app = express();

// ES6 Styling{ const, let, arrow functions ...etc... } Creating immutable url. 
const url =  "http://www.barnesandnoble.com/b/barnes-noble-classics/books/_/N-rqvZ8q8?Ns=P_Sales_Rank";
// auto format: gg=G 

//Utilizing request module passing url, passing arrow functions(anon) for callback.
request(url, (error, response, body) => {
  if (!error && response.statusCode == 200) {

    //--------------------------//
    let  $ = cheerio.load(body); //Using cheerio to parse the body as Jquery, and manipulate elements 
    //-------------------------//
    //

    
    let  classic_books = $("li.clearer > ul > li"); // Using jquery to determines which elements to target
    //inspect > copy > css selectors > run on console via jquery *DOM Traversing*


    classic_books.each((i, cat) => {  //created an each iteration that goes through each category
      //Using this to specify which class to retrieve information from and the type of infrormations e.g {src, text ..etc...}
      let  productImage =  $(this).find(".product-image img").attr("src"); 
      let  classicTitle =  $(this).find(".product-info-title a").text();
      let  classicAuthor = $(this).find(".contributors a").text();
	//Created a JSON object that passed in each retrieved infromation and then inserted the information in my Classics Database.
      let myJson = {
	product_image: productImage,
	classic_title: classicTitle,
	classic_author: classicAuthor,
      }
      //		console.log(myJson);
      //
      //inserting retrieved infromation into classics database, as JSON.
      db.classics.insert(myJson);

    });

    //   console.log(books) // Show the HTML for the Google homepage.
  }
})

/// API ENDPOINTS ///
//
//Using Express GET method. //For the main page created a req and response
app.get('/', (req, res) => {
  //respond to request with an image of desired product.
  res.json(db.classics.findOne({"product_image":"//prodimage.images-bn.com/pimages/9781593080259_p0_v4_s118x184.jpg"}));
});

app.listen(3000); // Application is running on localhost port 3000 
console.log("running on port 3000..."); //Executed when port is actually running can use error checking to denote if port is actually runing properly.
