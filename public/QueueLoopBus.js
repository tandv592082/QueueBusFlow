const LOCATIONS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "K"];
const LENGTH = LOCATIONS.length;
const CIRCLE_RADIUS = 97;
const BUS_STOP_TIMEOUT = 3; // 3s


let i = 0;

let msg,
    startBtn,
    stopBtn,
    skipBtn,
    gohomeBtn,
    circleBus,
    bus,
    locationX,
    busQueue,
    next,
    loopText,
    skipText,
    stopText,
    turnHomeText,
    tick;

const busRunNextLocation = (isSkip, timeout) =>
    new Promise((resolve) => {
        if (isSkip) {
            resolve(true);
        }

        setTimeout(() => {
            console.log("Bus running...");
            resolve(true);
        }, timeout);
    });

const autoResolve = () =>
    new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, 5000);
    });

const TestBus = async () => {
    while (i < LENGTH) {
        if (i === LENGTH - 1) {
            showNextPosition(LOCATIONS[0]);
        } else {
            showNextPosition(LOCATIONS[i + 1]);
        }
        const res = await busRunNextLocation(false, 100);
        if (res) {
            i++;
            i = i % LENGTH;
        }
    }
};

// TestBus();
interval = null;
intervalShow = null;
isLoop = true;
isSkip = false;
isStop = false;
globalTL = [];
nextIndex = 1;
avgDeg = 360 / 360;
isInit = false;
indexOflocation = null;
deg = 0;
deg2 = 0;
counter = 0,
roundOneDone = false;

document.addEventListener("DOMContentLoaded", () => {
    msg = document.querySelector(".message");
    startBtn = document.getElementById("start");
    stopBtn = document.getElementById("stop");
    skipBtn = document.getElementById("skip");
    gohomeBtn = document.getElementById("gohome");
    circleBus = document.querySelector(".circle-bus");
    bus = document.querySelector(".bus");
    locationX = document.querySelector(".location");
    busQueue = document.querySelector(".bus-queue");
    tick = document.querySelector(".timmer");
    queueSVG = document.querySelector(".queueSVG");
    next = document.querySelector('.next');
    loopText = document.getElementById('loop-bus')
    skipText = document.querySelector('.skip-bus')
    stopText = document.querySelector('.stop-bus')



    const setPosition = (el, arrMtMl) => {
        el.style.display = 'block'
        el.style.marginTop = `${arrMtMl[0]}px`;
        el.style.marginLeft = `${arrMtMl[1]}px`;
    };

    const showNextPosition = (l) => {
        locationX.innerText = l;
    };

    showNextPosition(LOCATIONS[0]);

    const locationDeg = 360 / LENGTH;


    //append location to DOM
    for (let i = 0; i < LENGTH; i++) {
        busLocation = document.createElement("span");
        busLocation.textContent = LOCATIONS[i];
        
        circleBus.appendChild(busLocation);
        arrMtMl = getMtAndMl(CIRCLE_RADIUS, deg);
        globalTL.push(arrMtMl);
        setPosition(busLocation, arrMtMl);
        deg += locationDeg;
    }


    //show bus queue
    showBusQueue = () =>
        new Promise((resolve) => {
            clearInterval(interval);
            busQueue.style.display = "inline-block";
            queueSVG.style.display = "inline-block";
            skipBtn.disabled = true;
            stopBtn.disabled = true;

            const done = () => {
                clearInterval(interval);
                busQueue.style.display = "none";
                queueSVG.style.display = "none";
                startBtn.disabled = false;
                stopBtn.disabled = false;
                startBtn.click();
                skipText.textContent = 'False';
                skipText.style.backgroundColor = 'red';
                skipBtn.disabled = false;
                clearInterval(intervalShow);
                resolve(true);
            }

            if (isSkip) {
                done();
                isSkip = false;
            } else {
                t = BUS_STOP_TIMEOUT;
                tick.textContent = t;
                intervalShow = setInterval(() => {
                    t--;
                    tick.textContent = t;

                    if (t === 0) {
                        done();
                    }
                }, 1000);

            }
        });


    const renderBusLocation = async (timeout) => {
        const doTimeOut = timeout / 360;
        startBtn.onclick = () => {
            showNextPosition(LOCATIONS[nextIndex]);
            skipBtn.textContent = `Bỏ bến ${LOCATIONS[nextIndex]}`;
            stopBtn.disabled = false;
            skip.disabled = false;
            setPosition(next, globalTL[nextIndex]);
            arrMtMl = getMtAndMl(CIRCLE_RADIUS, deg2);
            setPosition(bus, arrMtMl);
            isStop = false;
            setStop();
            startBtn.disabled = true;
            interval = setInterval(async () => {
                arrMtMl = getMtAndMl(CIRCLE_RADIUS, deg2);
                indexOflocation = isInClude(globalTL, formatMargin(arrMtMl));

                if (indexOflocation && isInit) {
                    nextIndex++;
                    if (nextIndex === LENGTH) {
                        nextIndex = 0;
                        roundOneDone = true;
                    }

                    if(nextIndex === LENGTH - 1 && roundOneDone) {
                        nextIndex = 0;
                        roundOneDone = false;
                    }

                    showNextPosition(LOCATIONS[nextIndex]);
                    skipBtn.textContent = `Bỏ bến ${LOCATIONS[nextIndex]}`
                    setPosition(next, globalTL[nextIndex]);
                    await showBusQueue();
                }

                setPosition(bus, arrMtMl);
                counter++;
                deg2 += avgDeg;
                deg2 = deg2 % 360;

                if (!isLoop) {
                    if (counter === 360) {
                        clearInterval(interval);
                        startBtn.disabled = false;
                    }
                }

                counter = counter % 360;

                if (!isInit) {
                    isInit = true;
                }
            }, doTimeOut);
        };

    };

    renderBusLocation(30000);

    //handle gohome btn click
    gohomeBtn.onclick = () => {
        isLoop = !isLoop;
        loopText.textContent = isLoop;
    };

    gohomeBtn.addEventListener('change', e => {
        isLoop = e.target.checked
        loopText.textContent = isLoop;

        if(isLoop) {
            loopText.style.backgroundColor = 'green'
        }else {
            loopText.style.backgroundColor = 'red';
        }
    });

    //handle skip btn click
    skipBtn.onclick = () => {
        console.log("skip");
        skipText.textContent = 'True';
        skipText.style.backgroundColor = 'green';
        skipBtn.disabled = true;
        isSkip = true;
    };

    const setStop = () => {
        if(isStop) {
            stopText.textContent = 'True';
            stopText.style.backgroundColor = 'green'
            stopBtn.disabled = true;
        } else {
            stopText.textContent = 'False';
            stopText.style.backgroundColor = 'red'
            stopBtn.disabled = false;

        }
    }

    //handle stop btn click
    stopBtn.onclick = () => {
        console.log("stop");
        isStop = true;
        startBtn.disabled = false;
        setStop();
        clearInterval(interval);
    };

    //clear interval before page reload;
    window.onbeforeunload = function (event) {
        clearInterval(interval);
        clearInterval(intervalShow);
    };


    unskip = () => {
        isSkip = false;
    }
});

const checkQuadrant = (deg) => {
    if (deg === 0) deg = 360;
    const miniDeg = deg % 90;
    if (deg >= 360) return [1, miniDeg]; // 1 vai truong hop goc lon hon 360 Ex: 360.0000001
    if (deg > 0 && deg < 90) return [1, miniDeg];
    if (deg >= 90 && deg < 180) return [2, miniDeg];
    if (deg >= 180 && deg < 270) return [3, miniDeg];
    if (deg >= 270 && deg < 360) return [4, miniDeg];
};

const convertDegToRadian = (deg) => {
    return (deg * Math.PI) / 180;
};

const getMtAndMl = (radius, deg) => {
    const check = checkQuadrant(deg);
    let marginTop = 0;
    let marginLeft = 0;
    if (check[0] === 1) {
        marginTop = -radius * Math.cos(convertDegToRadian(check[1]));
        marginLeft = radius * Math.sin(convertDegToRadian(check[1]));
    }
    if (check[0] === 2) {
        marginTop = radius * Math.sin(convertDegToRadian(check[1]));
        marginLeft = radius * Math.cos(convertDegToRadian(check[1]));
    }
    if (check[0] === 3) {
        marginTop = radius * Math.cos(convertDegToRadian(check[1]));
        marginLeft = -radius * Math.sin(convertDegToRadian(check[1]));
    }
    if (check[0] === 4) {
        marginTop = -radius * Math.sin(convertDegToRadian(check[1]));
        marginLeft = -radius * Math.cos(convertDegToRadian(check[1]));
    }
    return [marginTop, marginLeft];
};

const formatMargin = (arr) => arr.map((el) => +el.toFixed(3));

const isInClude = (arr, val) => {
    let k;
    for (let i = 0; i < arr.length; i++) {
        k = formatMargin(arr[i]);
        if (k[0] == val[0] && k[1] == val[1]) return true;
    }
    return false;
};
