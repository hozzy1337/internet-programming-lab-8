navigator.geolocation.getCurrentPosition(
    function(position) {
        alert('Ваши координаты: ' +
            position.coords.latitude + ", " + position.coords.longitude);
    }
);

var notify = new Notification("premision");
notify.onerror = function(){
    console.log("permission state = default or denied");
};
Notification.requestPermission( newMessage );

function newMessage(permission) {
    if( permission != "granted" ) return false;
    var notify = new Notification("Thanks for letting notify you");
};

function getHiddenProp(){
    if ('hidden' in document) return 'hidden';
    return null;
}

function isHidden() {
    var prop = getHiddenProp();
    if (!prop) return false;

    return document[prop];
}

window.addEventListener("load", function notifyDemo() {
    var visProp = getHiddenProp();
    if (visProp) {
        var evtname = visProp.replace(/[H|h]idden/,'') + 'visibilitychange';
        document.addEventListener(evtname, visChange);
    }
    function visChange() {
        setTimeout(showNotification, 3000);
    }

    function showNotification() {
        if (isHidden()) {
            var mailNot = new Notification("Нотификация", {
                body : "Вы ушли со страницы!"
            });
        }
    }
});

var statusDisplay = document.getElementById("status");
var searchButton = document.getElementById("searchButton");
var primeContainer = document.getElementById("primeContainer");
primeContainer.innerHTML = '';

function doSearch() {
    var fromNumber = document.getElementById("from").value;
    var toNumber = document.getElementById("to").value;
    fromNumber = Number(fromNumber);
    toNumber = Number(toNumber);
    localStorage.setItem("to", toNumber);

    if(localStorage.getItem("iterator") != null) fromNumber = localStorage.getItem("iterator");
    if(localStorage.getItem("to") != null) toNumber = localStorage.getItem("to");
    if(localStorage.getItem("mylist") != null) primeContainer.innerHTML = localStorage.getItem("mylist").toString();

    searchButton.disabled = true;

    worker = new Worker("PrimeWorker.js");

    worker.onmessage = receivedWorkerMessage;
    worker.onerror = workerError;

    worker.postMessage(
        { from: fromNumber,
            to: toNumber
        }
    );

    statusDisplay.innerHTML = "Фоновый поток ищет простые числа (от "+
        fromNumber + " до " + toNumber + ") ...";
}

function workerError(error) {
    statusDisplay.innerHTML = error.message;
}
function cancelSearch() {
    worker.terminate();
    worker = null;
    statusDisplay.innerHTML = "Поток остановлен.";
    searchButton.disabled = false;
}


var worker = new Worker("PrimeWorker.js");

function receivedWorkerMessage(event) {
    var primes = event.data;
    localStorage.setItem("mylist", primes);

    var primeList = "";
    for (var i=0; i<primes.length; i++) {
        primeList += primes[i];
        if (i != primes.length-1) primeList += ", ";
    }

    primeContainer.innerHTML += primeList;

    if (primeList.length == 0) {
        statusDisplay.innerHTML = "Ошибка поиска.";
        searchButton.disabled = false;
        var mailNotification = new Notification("Нотификация", {
            body : "Ошибка поиска."
        });
    }
    else {
        statusDisplay.innerHTML = "Простые числа найдены!";
        searchButton.disabled = false;
        var mailNotification = new Notification("Нотификация", {
            body : "Простые числа найдены!"
        });
    }
}



