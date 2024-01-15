
$(document).ready(function () {
    const apiKey = "71b4497f13724d83825077104f9bc741";

    $("#search-form").submit(function (event) {
        event.preventDefault();
        const cityName = $("#search-input").val();
        if (cityName !== "") {
            getWeatherData(cityName, apiKey);
            $("#search-input").val("");
        }
    });

    // Function to get weather data from OpenWeatherMap API
    function getWeatherData(cityName, apiKey) {
        const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;

        $.ajax({
            url: apiUrl,
            method: "GET",
            dataType: "json",
            success: function (data) {
                // Handle the data and update the HTML
                displayCurrentWeather(data);
                displayForecast(data);
                // Save the city to localStorage for search history
                saveToHistory(cityName);
            },
            error: function (error) {
                console.error("Error fetching weather data:", error);
                // Handle error (e.g., display an error message)
            }
        });
    }

    // Function to display current weather conditions
    function displayCurrentWeather(data) {
        const currentWeather = data.list[0];

        // Update HTML with current weather information
        $("#today").html(`
            <h2>${data.city.name}</h2>
            <p>Date: ${dayjs(currentWeather.dt_txt).format("YYYY-MM-DD HH:mm:ss")}</p>
            <p>Temperature: ${currentWeather.main.temp} °C</p>
            <p>Humidity: ${currentWeather.main.humidity}%</p>
            <p>Wind Speed: ${currentWeather.wind.speed} m/s</p>
        `);
    }

    // Function to display 5-day forecast
    function displayForecast(data) {
        const forecast = data.list.slice(1, 6);

        // Update HTML with forecast information
        $("#forecast").html("");
        forecast.forEach(day => {
            $("#forecast").append(`
                <div class="col-md-2">
                    <h4>${dayjs(day.dt_txt).format("YYYY-MM-DD")}</h4>
                    <p>Temperature: ${day.main.temp} °C</p>
                    <p>Humidity: ${day.main.humidity}%</p>
                </div>
            `);
        });
    }

    // Function to save city to search history in localStorage
    function saveToHistory(cityName) {
        let history = JSON.parse(localStorage.getItem("searchHistory")) || [];
        history.unshift(cityName);
        localStorage.setItem("searchHistory", JSON.stringify(history.slice(0, 5))); // Save only the last 5 searches
        updateSearchHistory();
    }

    // Function to update the search history in the UI
    function updateSearchHistory() {
        const history = JSON.parse(localStorage.getItem("searchHistory")) || [];
        $("#history").html("");
        history.forEach(city => {
            $("#history").append(`
                <a href="#" class="list-group-item list-group-item-action">${city}</a>
            `);
        });

        // Add click event listener to history items
        $(".list-group-item").click(function (event) {
            event.preventDefault();
            const cityName = $(this).text();
            getWeatherData(cityName, apiKey);
        });
    }

    // Initial update of search history when the page loads
    updateSearchHistory();
});
