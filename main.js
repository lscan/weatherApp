/*

- Sign up for openweathermap.org and generate an API key.
- User either $.ajax or $.get to pull weather current data .
  for Washington DC (hint: http://api.openweathermap.org/data/2.5/weather?q=...).
- Print the temperature in console.
- Bonus 1: add a form prompting user for the city and state.
- Bonus 2: convert answer from kelvin to fahrenheit.

*/

// var responseData;
'use strict';
var response;
(function() {
  var weatherApp = {};
  weatherApp.baseUrl = "http://api.openweathermap.org/data/2.5/weather?";
  weatherApp.apiKey = "apikey=33b2850b60fc24e3dd76cae396d00544";
  weatherApp.zip = "&zip=";
  weatherApp.city = "&q=";
  var httpRequest;

  document.getElementById("zip-submit").onclick = function(e) {
    e.preventDefault();
    console.log('Making request by zip code.');
    var newZip = weatherApp.zip + document.getElementById('zip-value').value;
    $.get(weatherApp.baseUrl+weatherApp.apiKey+newZip, function( data ) {
  		document.getElementById('zipOrCity').innerHTML = document.getElementById('zip-value').value;
    	document.getElementById('temperature').innerHTML = convertKelvin(data.main.temp);
    	document.getElementById('result').style.display = "block";
    	response = data;
    	document.getElementById('zip-value').value = "";
		});
  }
  document.getElementById("city-submit").onclick = function(e) {
  	e.preventDefault();
  	console.log('Making request by city.');
  	var newCity = weatherApp.city + document.getElementById('city-value').value;
  	$.get(weatherApp.baseUrl+weatherApp.apiKey+newCity, function( data ) {
  		document.getElementById('zipOrCity').innerHTML = document.getElementById('city-value').value;
    	document.getElementById('temperature').innerHTML = convertKelvin(data.main.temp);
    	document.getElementById('result').style.display = "block";
    	response = data;
    	document.getElementById('city-value').value = "";
		});
  }
  function convertKelvin(kelvinTemp) {
  	return Math.round((kelvinTemp*(9/5)-459.67)*10)/10;
  }
})();