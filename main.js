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
var ctx;
var ctxData;
var ctxOptions;
require(['node_modules/core-js/client/core.js'], function () {
    // not totally sure how this works. do we need something here?
    // this clears up the console errors
});
require(['node_modules/chart.js/dist/Chart.js'], function(){
  ctx = document.getElementById("myChart");

  // begin sample data
  // var myChart = new Chart(ctx, {
  //   type: 'bar',
  //   data: {
  //     labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
  //     datasets: [{
  //       label: '# of Votes',
  //       data: [12, 19, 3, 5, 2, 3],
  //       backgroundColor: [
  //         'rgba(255, 99, 132, 0.2)',
  //         'rgba(54, 162, 235, 0.2)',
  //         'rgba(255, 206, 86, 0.2)',
  //         'rgba(75, 192, 192, 0.2)',
  //         'rgba(153, 102, 255, 0.2)',
  //         'rgba(255, 159, 64, 0.2)'
  //       ],
  //       borderColor: [
  //         'rgba(255,99,132,1)',
  //         'rgba(54, 162, 235, 1)',
  //         'rgba(255, 206, 86, 1)',
  //         'rgba(75, 192, 192, 1)',
  //         'rgba(153, 102, 255, 1)',
  //         'rgba(255, 159, 64, 1)'
  //       ],
  //       borderWidth: 1
  //     }]
  //   },
  //   options: {
  //     scales: {
  //       yAxes: [{
  //         ticks: {
  //           beginAtZero:true
  //         }
  //       }]
  //     }
  //   }
  // });
  // end sample data

  //trying line chart

  ctxData = {
    labels: [],
    datasets: [
      {
        label: "5 day forecast",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "#FE5F55",
        borderColor: "#FE5F55",
        borderCapStyle: 'butt',
        // borderDash: [],
        // borderDashOffset: 0,
        // borderJoinStyle: 'miter',
        // pointBorderColor: "grey",
        // pointBackgroundColor: "#fff",
        // pointBorderWidth: 1,
        // pointHoverRadius: 1,
        // pointHoverBackgroundColor: "grey",
        // pointHoverBorderColor: "red",
        // pointHoverBorderWidth: 1,
        // pointRadius: 1,
        // pointHitRadius: 5,
        data: []
      }
    ]
  };
  ctxOptions = {
    showLines: true
    // scales: {
    //   yAxes: [{
    //     ticks: {
    //       beginAtZero:true
    //     }
    //   }]
    // }
  }


});




var currentLocationButton
var response;
var weatherApp = {};
(function() {
  document.getElementById('city-click').addEventListener('click', function() {
    document.getElementsByClassName('city-search')[0].style.display = "none";
    document.getElementsByClassName('location-search')[0].style.display = "none";
    document.getElementsByClassName('zip-search')[0].style.display = "block";
  });
  document.getElementById('zip-click').addEventListener('click', function() {
    document.getElementsByClassName('zip-search')[0].style.display = "none";
    document.getElementsByClassName('location-search')[0].style.display = "none";
    document.getElementsByClassName('city-search')[0].style.display = "block";
  });
  document.getElementById('location-click').addEventListener('click', function() {
    document.getElementsByClassName('city-search')[0].style.display = "none";
    document.getElementsByClassName('zip-search')[0].style.display = "none";
    document.getElementsByClassName('location-search')[0].style.display = "block";
  });
  weatherApp.baseUrl = "http://api.openweathermap.org/data/2.5/weather?";
  weatherApp.baseUrlForecast = "http://api.openweathermap.org/data/2.5/forecast?";
  weatherApp.apiKey = "apikey=33b2850b60fc24e3dd76cae396d00544";
  weatherApp.zip = "&zip=";
  weatherApp.city = "&q=";
  weatherApp.fiveDay = false;
  var httpRequest;
  if(navigator.geolocation) {
    console.log('navigator.geolocation')
    //if it is use the getCurrentPosition method to retrieve the Window's location
    navigator.geolocation.getCurrentPosition(function(position) {
      weatherApp.lat = position.coords.latitude;
      weatherApp.lon = position.coords.longitude;
      console.log('finished getting current location');
      //you could make this button unclickable until current location data is available
      //you could also mess with local storage to speed things up
    }, function(error){console.log(error)});
  } else {console.log('nah');}

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
    if(weatherApp.fiveDay == true) {
      fiveDayCity();
    }
  }
  function convertKelvin(kelvinTemp) {
  	return Math.round((kelvinTemp*(9/5)-459.67)*10)/10;
  }
  function currentLocation() {
    var currentLocationEndpoint = weatherApp.baseUrl + "lat=" + weatherApp.lat + "&lon=" + weatherApp.lon + "&" + weatherApp.apiKey;
    $.ajax({
      url: currentLocationEndpoint,
      method: 'GET',
      dataType: 'jsonp',
      success: function(response) {
        console.log(response);
      }
    });
  }

  // five day forecasts
  function fiveDayCity() {
    var newCity = weatherApp.city + document.getElementById('city-value').value;
    var endpoint = weatherApp.baseUrlForecast + newCity + "&" + weatherApp.apiKey;
    $.ajax({
      url: endpoint,
      method: 'GET',
      dataType: 'jsonp',
      success: function(response) {
        console.log(response);
        for(var i=0; i<response.list.length; i++) {
          //grab data
          var fiveDayDatetime = response.list[i].dt_txt;
          var fiveDayTemp = convertKelvin(response.list[i].main.temp);
          var fiveDayHumidity = response.list[i].main.humidity;
          var fiveDayCloudiness = response.list[i].clouds.all;
          var fiveDayWind = response.list[i].wind.speed;
          var fiveDayWeatherDescription = response.list[i].weather[0].description;
          var fiveDayWeatherMain = response.list[i].weather[0].main;

          // for chart
          ctxData.labels.push(fiveDayDatetime);
          ctxData.datasets[0].data.push(fiveDayTemp);

        }
        var myLineChart = new Chart(ctx, {
            type: 'line',
            data: ctxData,
            options: ctxOptions
          });
      }
    });
  }
  //function for determining if button is checked or unchecked
  function fiveDayClick() {
    if(fiveDayButton.checked == true) {
      console.log('set weatherApp.fiveDay to true');
      weatherApp.fiveDay = true;
    } else if(fiveDayButton.checked == false) {
      console.log('set weatherApp.fiveDay to false');
      weatherApp.fiveDay = false;
    }
  }
  var fiveDayButton = document.getElementById('cb4');
  fiveDayButton.addEventListener('click', fiveDayClick)
  currentLocationButton = document.getElementById('current');
  currentLocationButton.addEventListener('click', currentLocation);
})();