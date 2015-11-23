
var currentWeather;
var forecastWeeather;
function clock(){

    var date = new Date();
    var currentMinutes = date.getMinutes();
    var currentHours = date.getHours();
    var currentSeconds = date.getSeconds();
    currentMinutes = (currentMinutes < 10 ? "0" : "") + currentMinutes;
    currentSeconds = (currentSeconds < 10 ? "0" : "") + currentSeconds;
    var amPm = (currentHours < 12)? "AM" : "PM";
    currentHours = (currentHours > 12)? currentHours-12 : currentHours;
    currentHours = (currentHours == 0)? 12 : currentHours;

    var fullTime = currentHours + "<span class='dots'>:</span>" + currentMinutes + "<span class='dots'>:</span>" + currentSeconds + " " + "<span class='amPm'>"+amPm+"</span>";

    $("#clock").html(fullTime);
}
$(document).ready(function(){
	


    $(".view").hide();

   
    setInterval('clock()', 1000);
    $("#mini-calendar").html(dashboardSimpleCalendar());
    if(localStorage.currentWeatherInStorage==null){
        $(".mini-weather").html('Loading...');
        $.simpleWeather({
            location: 'Pakistan, Islamabad',
            woeid: '',
            unit: 'c',
            success: function(weather) {
                html = '<p>'+weather.temp+'&deg;'+weather.units.temp+'</p>';
                currentWeather = html;
                localStorage.currentWeatherInStorage = currentWeather;
                $("#mini-weather").html(html);
            },
            error: function(error) {
                console.log(error);
            }
        });
    }
    else{
        $("#mini-weather").html(localStorage.currentWeatherInStorage);
    }

    $("#mini-calendar").click(function(e){
		window.open("calendar.html", "_self");
        $(this).siblings().toggle();
        $(this).toggle();
        $("#calendar").toggleClass("flip");
    });


    $("[class^=mini]").click(function(){
        $("#calendar").toggle();
        $(this).toggleClass("flip vcenter-small");
        $(this).siblings().toggle();
        $(this).toggleClass('bb');
        $(".mini-weather").html('Loading...');


        
        if(localStorage.detailedWeather == null){
            
            $.simpleWeather({
                woeid: '',
                location: 'Islamabad, Pakistan',
                unit: 'c',
                success: function(weather) {
                    html = '<h2>'+weather.temp+'&deg;'+weather.units.temp+", "+weather.currently+ ", "+weather.city+'</h2>';

                    for(var i=0;i<weather.forecast.length;i++) {
                        html += '<p class="forecast">'+weather.forecast[i].day+': '+weather.forecast[i].high+'&deg;'+weather.units.temp+'</p>';
                    }

                    forecastWeather = html;
                    localStorage.detailedWeather = forecastWeather;
                    if($(".mini-weather").hasClass("flip")){
                        $(".mini-weather").html(forecastWeather).slideDown('slow');
                    }
                    if($(".mini-weather").css("display")=="block" && !$(".mini-weather").hasClass("flip")){
                        $(".mini-weather").html(currentWeather).slideDown('slow');
                    }
                },
                error: function(error) {
                    console.log(error);
                }
            });
        }
        else{
            if($(".mini-weather").hasClass("flip")){
                $(".mini-weather").html(localStorage.detailedWeather).slideDown('slow');
            }
            if($(".mini-weather").css("display")=="block" && !$(".mini-weather").hasClass("flip")){
                $(".mini-weather").html(localStorage.currentWeatherInStorage).slideDown('slow');
            }
        }

    });
});



var app = angular.module("myApp", []);
var monthNames = ["Jan", "Feb", "March", "April", "May", "June",
    "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];


app.controller("myAppController",function($scope) {

    $scope.days = ["Mon","Tue","Wed","Thur","Fri","Sat","Sun"];

    $scope.getCalendar=function($scope,date){
        console.log(date.getMonth());
        var year = date.getFullYear();
        var month = date.getMonth();
        var dateNow = (new Date());
        var monthName = monthNames[month];
        var day = date.getDate();
        var dayInMon = (new Date(year, month + 1, 0)).getDate();
        var minusDate = 0;
        var weekIndex = 0;
        var monthStartDay = new Date(year,month, 1).getDay();
        $scope.currMonth = monthName + ", " + year.toString();
        $scope.dateNow = dateNow;
        $scope.weeks = new Array([],[],[],[],[],[],[]);
        monthStartDay= ( monthStartDay === 0 ) ?  7 : monthStartDay ;
        for(var i=monthStartDay - 1;i>0;i--){
            var preMonDate = new Date(year, month, minusDate--);
            var day = {};
            day.number = preMonDate.getDate();
            day.class = "disabled";
            day.data = day.number + "  ";
            $scope.weeks[weekIndex].push(day);
        }
        $scope.weeks[weekIndex].reverse();
        var weekRemaining = 7-$scope.weeks[0].length;
        if(weekRemaining<1){
            weekIndex++;
            weekRemaining = 7;
        }
        var count = monthStartDay;
        for (var dateIte = 1; dateIte < dayInMon + 1;  dateIte++) {
            var date = new Date(year, month, dateIte);
            var day = {};
            day.number = date.getDate();
            day.weather = ' ';
            day.data = day.number + " " + day.weather;
            if(dateNow.getDate() === date.getDate()){
                day.class = "today";
            }
            var weekRemaining = 7-$scope.weeks[weekIndex].length;
            if(weekRemaining<1){
                weekIndex++; weekRemaining = 7;
            }
            $scope.weeks[weekIndex].push(day);
            count++;
        }
        var count = count;
        var plusDate = 1;
        while (count < 43) {
            var nextMonDate = new Date(year, month + 1, plusDate++);
            var day = {};
            day.number = nextMonDate.getDate();
            day.class = "disabled";
            day.data = day.number + "";
            var weekRemaining = 7-$scope.weeks[weekIndex].length;
            if(weekRemaining<1){
                weekIndex++; weekRemaining = 7;
            }
            $scope.weeks[weekIndex].push(day);
            count++;
        }

    }
    var currentDate = new Date();
    var calendarDate = new Date(currentDate);
    $scope.getCalendar($scope,calendarDate);

    $scope.next=function(){
        calendarDate.setMonth(calendarDate.getMonth()+1);
        $scope.getCalendar($scope,calendarDate);
    }
    $scope.previous=function(){
        calendarDate.setMonth(calendarDate.getMonth()-1);
        $scope.getCalendar($scope,calendarDate);

    }

});

function dashboardSimpleCalendar(){
    var date = new Date();
    var currentYear = date.getFullYear();
    var currentDate = date.getDate();
    var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    var currentDay = days[date.getDay()];

    return currentDay + "/" + currentDate + "/" + currentYear;
}