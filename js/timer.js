/**
 *timer for counting time in the game
 */
let base = 60;
let clocktimer, dateObj, dh, dm, ds, ms, pauseTime;
let readout = '';
let h = 1, m = 1, tm = 1, s = 0, ts = 0;
ms = 0;
pauseTime = 0;
let initPause = 0;
//function for field cleaning
function clearСlock() {
    clearTimeout(clocktimer);
    h = 1;
    m = 1;
    tm = 1;
    s = 0;
    ts = 0;
    ms = 0;
    readout = '00:00:00';
    document.getElementById("formTimer").stopwatch.value = readout;
}
//function for stopwatch startTimer
function startTIME() {
    let cdateObj = new Date();
    let t = (cdateObj.getTime() - dateObj.getTime()) - (s * 1000);
    if (t > 999) {
        s++;
    }
    if (s >= (m * base)) {
        ts = 0;
        m++;
    } else {
        ts = parseInt((ms / 100) + s);
        if (ts >= base) {
            ts = ts - ((m - 1) * base);
        }
    }
    if (m > (h * base)) {
        tm = 1;
        h++;
    } else {
        tm = parseInt((ms / 100) + m);
        if (tm >= base) {
            tm = tm - ((h - 1) * base);
        }
    }
    ms = Math.round(t / 10);
    if (ms > 99) {
        ms = 0;
    }
    if (ms == 0) {
        ms = '00';
    }
    if (ms > 0 && ms <= 9) {
        ms = '0' + ms;
    }
    if (ts > 0) {
        ds = ts;
        if (ts < 10) {
            ds = '0' + ts;
        }
    } else {
        ds = '00';
    }
    dm = tm - 1;
    if (dm > 0) {
        if (dm < 10) {
            dm = '0' + dm;
        }
    } else {
        dm = '00';
    }
    dh = h - 1;
    if (dh > 0) {
        if (dh < 10) {
            dh = '0' + dh;
        }
    } else {
        dh = '00';
    }
    readout = dh + ':' + dm + ':' + ds;
    document.getElementById("formTimer").stopwatch.value = readout;
    clocktimer = setTimeout("startTIME()", 1);
}
function startTimer() {
    clearСlock();
    dateObj = new Date();
    pauseTime = new Date();
    startTIME();
    initPause = 0;
}
function stopTimer() {
    clearTimeout(clocktimer);
}
//onOfPauseTimer and startTimer function
function onOfPauseTimer() {
    if (initPause === 0) {
        clearTimeout(clocktimer);
        pauseTime = new Date() - pauseTime;
        initPause = 1;
        //When in the pause game we block actions over the field
        model.blockField = true;
    } else {
        pauseTime = new Date() - pauseTime;
        dateObj = new Date(pauseTime);
        startTIME();
        initPause = 0;
        model.blockField = false;
    }
}
function getMinute() {
    return dm;
}