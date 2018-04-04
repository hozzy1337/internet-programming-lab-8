onmessage = function(event) {

    var primes = findPrimes(event.data.from, event.data.to);

    postMessage(primes);
};

function findPrimes(fromNumber, toNumber) {
    var measures;
    var measure;
    var list = [];
    for (var i=fromNumber; i<=toNumber; i++) {
        if (i>1) list.push(i);
    }

    var maxDiv = Math.round(Math.sqrt(toNumber));
    var primes = [];

    for (var i=0; i<list.length; i++) {
        //localStorage.setItem("iterator", i);
        performance.clearMarks();
        performance.mark("start");
        var failed = false;
        for (var j=2; j<=maxDiv; j++) {
            if ((list[i] != j) && (list[i] % j == 0)) {
                failed = true;
            } else if ((j==maxDiv) && (failed == false)) {
                primes.push(list[i]);
                //localStorage.setItem("mylist", list);
                performance.mark("end");
                performance.measure("time to find number" ,"start", "end");
                measures = performance.getEntriesByType("measure");
                measure = measures[0];
                primes.push("TIME:" + measure.duration);
                performance.clearMeasures();
            }
        }
    }
    return primes;
}

