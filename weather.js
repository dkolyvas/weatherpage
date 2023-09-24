$(document).ready(function(){
 $("#get-button" ).on('click', function(){
    fetchFromServer()
})
$('#city-sel').on('change', function(){
    console.log(this.value)
    selectedCity = this.value
    fetchFromServer()
})

$('#frequency-sel').on('change', function(){
    selectedFrequency = this.value
    fetchFromServer()
})
selectedCity=0
selectedFrequency='daily'
loadCitySelector()
fetchFromServer()
})

let selectedCity
let selectedFrequency;



const cities = [{name:'Αθήνα', lat: 37.99, lon: 23.74},
{name: 'Θεσσαλονίκη', lat: 40.62, lon: 22.96},
  {name:'Πάτρα', lat: 38.25, lon:21.73},
{name: 'Ηράκλειο', lat:35.34, lon:25.13}]

function loadCitySelector(){
    let htmCode
    for(var i = 0; i < cities.length; i++){
        htmCode +=`<option value= ${i}>${cities[i].name}</option>`
    }
    $('#city-sel').html(htmCode)
}

function fetchFromServer(){
    let req = new XMLHttpRequest()
    let lon = cities[selectedCity].lon
    let lat = cities[selectedCity].lat
    req.open("GET",`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&lang=el&appid=9e2e5c756787174680e1052f41192d62`,true )
    req.timeout = 5000;
    req.ontimeout = (e) =>showApiError();
    req.onreadystatechange = function(){
        if(req.readyState === 4){
            if(req.status === 200){
                let result = JSON.parse(req.responseText)
              // $(".results").html(`['dt'])}2 ${result.lat} ${result.current.weather.description} <br>`)
            if(selectedFrequency==="daily"){
                processDailyData(result)
            } else{
                processHourlyData(result)
            }
            showCity()   
            }
            else{
                showApiError();
            }
        }
    }
    req.send()
}

function processDailyData(rawData){
   console.log(rawData.daily)
   let results = []
    for(let dailyForecast of rawData.daily){
        console.log(dailyForecast)
        let fDay = findDay(dailyForecast.dt)
        let fmax = Math.round(dailyForecast.temp.max);
         let fmin =Math.round( dailyForecast.temp.min)
        let fweather = dailyForecast.weather[0].description
        let ficon = dailyForecast.weather[0].icon
        
        results.push({day: fDay, max: fmax, min: fmin, weather:fweather, icon: ficon})
    }
    
    
    
    showResults(results, true)
}

function processHourlyData(rawData){
    let results = []
    console.log(rawData.hourly)
    for(let hourlyForecast of rawData.hourly){
        console.log(hourlyForecast)
        let fDay = findHour(hourlyForecast.dt)
        let fmin = Math.round(hourlyForecast.temp)
        let fweather = hourlyForecast.weather[0].description
        let ficon = hourlyForecast.weather[0].icon
        
        results.push({day: fDay, min: fmin,  weather:fweather, icon: ficon})
    }

    showResults(results, false)

}

function findDay(timeInMs){
    console.log(timeInMs)
    let dateR = new Date(timeInMs * 1000)
    console.log(dateR.toDateString())
    let days = ['Κυριακή','Δευτέρα','Τρίτη','Τετάρτη','Πέμπτη','Παρασκευή','Σάββατο']
    let dateInText = days[dateR.getDay()] + ", " + dateR.getDate() +"/" + dateR.getMonth() + "/" + dateR.getFullYear()
    return dateInText

}

function findHour(timeInMs){
    let hourR = new Date(timeInMs * 1000)
    let approximeteHour = (hourR.getMinutes() <30)? hourR.getHours(): hourR.getHours() + 1
    let days = ['Κυριακή','Δευτέρα','Τρίτη','Τετάρτη','Πέμπτη','Παρασκευή','Σάββατο']
    let hourInText = days[hourR.getDay()] + ", "  + approximeteHour + ":00"
    return hourInText

}

function showResults(weather, daily){
    console.log(weather)
    let toWrite = ` <tr>
                        <th> Ημέρα/Ώρα
                        <th> Θερμοκρασία
                        <th> Καιρός
                    </tr>`
    
    

    


    for(var forecast of weather){
        var imgSrc = ' https://openweathermap.org/img/wn/'+ forecast.icon+ '@2x.png'
        var temperature
        if(daily){
            temperature = forecast.min + "min/" + forecast.max+ "max"
        } else{
            temperature = forecast.min
        }
        toWrite += `<tr>
                        <td> ${forecast.day}</td>
                        <td> ${temperature}</td>
                        <td> ${forecast.weather} <img src = ${imgSrc} class="weather-icon">
                    </tr>`
        

    }
    $("#forecast-table").html(toWrite)
   
}

function showApiError(){
    $(".results").html("Παρουσιάστηκε πρόβλημα στη φόρτωση του περιεχομένου")
}

function showCity(){
    let cityName = cities[selectedCity].name
    $('#city-field').html(cityName)
}

