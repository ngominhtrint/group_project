var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.get('/scrape', function(req, res) {
	url = 'https://www.foody.vn/ho-chi-minh/yummyq-xien-nuong-nhat-ban-truong-dinh';
	request({
		headers: {'Connection': 'keep-alive', 'content-type': 'text/html'},
		url: url
	}, function(error, response, html){
		var data = [];
		if(!error) {
			var $ = cheerio.load(html);
			var name, price;
			$('div.content-item').filter(function(){
				var imageURL = $(this).find(".avatar").children('img').attr('src');
				var reviewPoint = $(this).find("items-content").find(".review-points").text();
				var name = $(this).find("items-content").find(".title.fd-text-ellip").text();
				var address = $(this).find("items-content").find(".desc.fd-text-ellip").text();

				console.log(imageURL);
				var place = {name: name, address: address, reviewPoint: reviewPoint, imageURL: imageURL};
				data.push(place);
			})
			fs.writeFile('output.json', JSON.stringify(data, null, 4), function(err){
				console.log('Finished');
			})
		} else {
			console.log(error);
			console.log(response);
			res.send(error);
		}
	});
});

app.listen(3000, function(){
	console.log('Server is running at 3000');
});

