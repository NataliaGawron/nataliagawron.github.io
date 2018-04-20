function careAboutFormat(number){
    var answer;
    if(number > -1 && number < 10){
        answer = '0' + number;
        return answer;
    }
    else
    {
        return number;
    }
}

function getDate(){
var daysOfWeek = ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'];

var date = new Date();

var dataFormat = daysOfWeek[date.getDay()] + ", " + careAboutFormat(date.getHours()) + ':' + 
                    careAboutFormat(date.getMinutes()) + ':' + careAboutFormat(date.getSeconds());

document.getElementById("date").innerHTML = dataFormat;
}

function setDate(){
    getDate();
    setInterval(getDate,1000);
}

//call whole clock thing
window.addEventListener('load', setDate, false);