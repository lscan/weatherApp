// todo:
// remove the old chart when you search for a new one

// chart stuff
var ctx;
var ctxData;
var ctxOptions;
require(['node_modules/chart.js/dist/Chart.js'], function() {
  ctx = document.getElementById("myChart");
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
        data: []
      }
    ]
  };
  ctxOptions = {
    showLines: true
  }
});

var currentLocationButton;
var response;
var weatherApp = {};

(function() {
  document.getElementById('city-click').addEventListener('click', function() {
    hideSections();
    document.getElementsByClassName('city-search')[0].style.display = "block";
  });
  document.getElementById('zip-click').addEventListener('click', function() {
    hideSections();
    document.getElementsByClassName('zip-search')[0].style.display = "block";
  });
  document.getElementById('location-click').addEventListener('click', function() {
    hideSections();
    document.getElementsByClassName('location-search')[0].style.display = "block";
  });
  function hideSections() {
    document.getElementsByClassName('city-search')[0].style.display = "none";
    document.getElementsByClassName('zip-search')[0].style.display = "none";
    document.getElementsByClassName('location-search')[0].style.display = "none";
  }
  weatherApp.baseUrl = "http://api.openweathermap.org/data/2.5/weather?";
  weatherApp.baseUrlForecast = "http://api.openweathermap.org/data/2.5/forecast?";
  weatherApp.apiKey = "apikey=33b2850b60fc24e3dd76cae396d00544";
  weatherApp.zip = "&zip=";
  weatherApp.city = "&q=";
  weatherApp.fiveDay = false;
  weatherApp.tempScale = "fahrenheit";
  var httpRequest;

  // for getting temp by zip code
  document.getElementById("zip-submit").onclick = function(e) {
    e.preventDefault();
    var thisZip = document.getElementById('zip-value').value;
    $.get(weatherApp.baseUrl + weatherApp.apiKey + "&zip=" + thisZip, function( data ) {
  		document.getElementById('zipOrCity').innerHTML = thisZip;
      getWeatherByTempScale(data);
      setTempScaleInDom();
    	document.getElementById('result').style.display = "block";
    	document.getElementById('zip-value').value = "";
		});
    if(weatherApp.fiveDay == true) {
      fiveDay("zip", null, thisZip, null, null);
    }
  }

  // for getting temp by city
  document.getElementById("city-submit").onclick = function(e) {
  	e.preventDefault();
    var thisCity = document.getElementById('city-value').value;
  	$.get(weatherApp.baseUrl + weatherApp.apiKey + "&q=" + thisCity, function( data ) {
  		document.getElementById('zipOrCity').innerHTML = thisCity;
      getWeatherByTempScale(data);
      setTempScaleInDom();
    	document.getElementById('result').style.display = "block";
    	document.getElementById('city-value').value = "";
		});
    // this removes a potential space in between the city and state, which won't work with the API call
    thisCity.replace(' ', '');
    if(weatherApp.fiveDay == true) {
      fiveDay("city", thisCity, null, null, null);
    }
  }

  // for getting temp by current lat/lon
  document.getElementById("location-submit").onclick = function(e) {
    e.preventDefault();
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        weatherApp.lat = position.coords.latitude;
        weatherApp.lon = position.coords.longitude;
        $.ajax({
          url: "http://api.openweathermap.org/data/2.5/weather?lat=" + weatherApp.lat.toFixed(2) + "&lon=" + weatherApp.lon.toFixed(2) + "&" + weatherApp.apiKey,
          method: 'GET',
          dataType: 'jsonp',
          success: function(response) {
            var data = response;
            document.getElementById('zipOrCity').innerHTML = "lat " + weatherApp.lat.toFixed(2) + ", lon " + weatherApp.lon.toFixed(2);
            getWeatherByTempScale(data);
            setTempScaleInDom();
            document.getElementById('result').style.display = "block";
            if(weatherApp.fiveDay == true) {
              fiveDay("currentLocation", null, null, weatherApp.lat, weatherApp.lon);
            }
          }
        });
      }, function(error){console.log(error)});
    } else {console.log('no navigator.geolocation');}
  }

  // conversion functions
  function convertKelvinToFahrenheit(kelvinTemp) {
    return Math.round((kelvinTemp*(9/5)-459.67)*10)/10;
  }
  function convertKelvinToCelsius(kelvinTemp) {
    return Math.round(kelvinTemp - 273.15);
  }

  // function to get temp by lat/lon
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

  // five day forecasts function
  // type is zip, city, or lat/lon
  function fiveDay(type, city, zip, lat, lon) {
    var endpoint = weatherApp.baseUrlForecast;
    if(type == "city") {
      endpoint = endpoint + "q=" + city + "&" + weatherApp.apiKey;
    } else if(type == "zip") {
      endpoint = endpoint + "zip=" + zip + "&" + weatherApp.apiKey;
    } else if(type == "currentLocation") {
      endpoint = endpoint + "lat=" + lat.toFixed(2) + "&lon=" + lon.toFixed(2) + "&" + weatherApp.apiKey;
    }
    $.ajax({
      url: endpoint,
      method: 'GET',
      dataType: 'jsonp',
      success: function(response) {
        console.log(response);
        for(var i=0; i<response.list.length; i++) {
          //grab data
          var fiveDayDatetime = response.list[i].dt_txt;
          var fiveDayTemp;
          
          if(weatherApp.tempScale == "fahrenheit") {
            fiveDayTemp = convertKelvinToFahrenheit(response.list[i].main.temp);
          } else if(weatherApp.tempScale == "celsius") {
            fiveDayTemp = convertKelvinToCelsius(response.list[i].main.temp);
          } else if(weatherApp.tempScale == "kelvin") {
            fiveDayTemp = response.list[i].main.temp;
          }

          // var fiveDayHumidity = response.list[i].main.humidity;
          // var fiveDayCloudiness = response.list[i].clouds.all;
          // var fiveDayWind = response.list[i].wind.speed;
          // var fiveDayWeatherDescription = response.list[i].weather[0].description;
          // var fiveDayWeatherMain = response.list[i].weather[0].main;

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
  // determine if button is checked or unchecked
  function fiveDayClick() {
    if(fiveDayButton.checked == true) {
      weatherApp.fiveDay = true;
    } else if(fiveDayButton.checked == false) {
      weatherApp.fiveDay = false;
    }
  }
  // set weatherApp.tempScale to fahrenheit, celsius, or kelvin
  function setTempScale() {
    if(document.getElementById('fahrenheit').checked == true) {
      weatherApp.tempScale = "fahrenheit";
    } else if(document.getElementById('celsius').checked == true) {
      weatherApp.tempScale = "celsius";
    } else if(document.getElementById('kelvin').checked == true) {
      weatherApp.tempScale = "kelvin";
    }
  }
  // create the wording on the page
  function setTempScaleInDom() {
    var tempScaleSpan = document.getElementById('temp-scale');
    if(weatherApp.tempScale == "fahrenheit") {
      tempScaleSpan.innerHTML = "Fahrenheit";
    } else if(weatherApp.tempScale == "celsius") {
      tempScaleSpan.innerHTML = "Celsius";
    } else if(weatherApp.tempScale == "kelvin") {
      tempScaleSpan.innerHTML = "Kelvin";
    }
  }
  // when actually getting the data from the API call, this determines what to convert the temp to
  function getWeatherByTempScale(data) {
    if(weatherApp.tempScale == "fahrenheit") {
      document.getElementById('temperature').innerHTML = convertKelvinToFahrenheit(data.main.temp);
    } else if(weatherApp.tempScale == "celsius") {
      document.getElementById('temperature').innerHTML = convertKelvinToCelsius(data.main.temp);
    } else if(weatherApp.tempScale == "kelvin") {
      document.getElementById('temperature').innerHTML = data.main.temp;
    }
  }

  // listener for the button that determines whether the 5-day forecast should be displayed
  var fiveDayButton = document.getElementById('cb4');
  fiveDayButton.addEventListener('click', fiveDayClick);
  // add the listeners to the radio buttons
  var tempScaleRadios = document.getElementsByName('r-group-1');
  for(var i=0; i<tempScaleRadios.length; i++) {
    tempScaleRadios[i].addEventListener('click', setTempScale);
  }
  // listener for the current location button
  currentLocationButton = document.getElementById('current');
  currentLocationButton.addEventListener('click', currentLocation);

})();