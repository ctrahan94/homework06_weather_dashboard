var searches = [];
$("#search-button").on("click", function (event) {
  event.preventDefault();
  var searchCity = $("#search").val();
  $("#search").val("");
  searchWeather(searchCity);
});

function createBtn(searchCity) {
  var button = $("<button>").text(searchCity);
  var liEl = $("<li>").html(button);
  $("#history").prepend(liEl);
}

$("#history").on("click", "li", function (event) {
  event.preventDefault();
  searchWeather($(this).text());
});

function searchWeather(city) {
  $.ajax({
    type: "GET",
    url: `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=d9995652090810a377b77a746d600a6e&units=imperial`,
    dataType: "json",
  }).then(function (response) {
    var weatherIcon = response.weather[0].icon;
    console.log(response);
    searches.push(city);
    createBtn(city);
    $("#todays-icon").attr(
      "src",
      `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`
    );
    forecast(city);
    uvSearch(response.coord.lat, response.coord.lat);
    $("#city").text(
      response.name + " " + moment().format("dddd, MMMM Do YYYY")
    );
    $("#today-temp").append("Temperature: " + response.main.temp + "°F");
    $("#today-humidity").append("Humidity: " + response.main.humidity + "%");
    $("#today-wind").append("Wind: " + response.wind.speed + "mph");
  });
}

function uvSearch(lat, lon) {
  $.ajax({
    type: "GET",
    url: `https://api.openweathermap.org/data/2.5/uvi?appid=d9995652090810a377b77a746d600a6e&lat=${lat}&lon=${lon}`,
    dataType: "json",
  }).then(function (response) {
    console.log(response);
    var btn = $("<span>").addClass("btn btn-sm").text(response.value);
    $("#uv-index").append(response.value);
    if (response.value > 7.99) {
      btn.addClass("btn-danger");
    } else if (response.value < 7.98 && response.value > 6) {
      btn.addClass("btn-warning");
    } else {
      btn.addClass("btn-success");
    }
    $("#uv-index").html(btn);
  });
}

function forecast(city) {
  $.ajax({
    type: "GET",
    url: `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=d9995652090810a377b77a746d600a6e`,
    dataType: "json",
  }).then(function (data) {
    for (i = 0; i < 6; i++) {
      $("#fiveDayForecast").text("5 Day Forecast");
      var forecastTemp = data.list[i].main.temp;
      var forecastHumidity = data.list[i].main.humidity;
      var weatherIcon = data.list[i].weather[0].icon;
      var oneDayForward = new moment().add(1, "day");
      var twoDayForward = new moment().add(2, "day");
      var threeDayForward = new moment().add(3, "day");
      var fourDayForward = new moment().add(4, "day");
      var fiveDayForward = new moment().add(5, "day");
      $("#day1-date").text(oneDayForward.format("dddd MMMM DD"));
      $("#day2-date").text(twoDayForward.format("dddd MMMM DD"));
      $("#day3-date").text(threeDayForward.format("dddd MMMM DD"));
      $("#day4-date").text(fourDayForward.format("dddd MMMM DD"));
      $("#day5-date").text(fiveDayForward.format("dddd MMMM DD"));
      $(`#day${[i]}-temp`).text(`Temp: ${forecastTemp}°F`);
      $(`#day${[i]}-humidity`).text(`Humidity: ${forecastHumidity}%`);
      $(`#day${[i]}-icon`).attr(
        "src",
        `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`
      );
    }
  });
}
