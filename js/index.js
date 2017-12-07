/*      model       */
let model = {
    //flag to lock cards
    blockField: false,
    selectedQueue: [],
    statusRightPears:0,
    unAttempts:0, //unsuccessful attempts to choose
    gameStart: false,
    getArrayImages: function (l) {
        let files = ["chamomile.jpg", "dandelion.JPG", "eiffel_tower.jpg", "hare.jpg", "horse.jpg", "house.jpg",
            "lavra.jpg", "motorcycle.jpg", "ocean.jpg", "rottweiler.jpg", "sunset.jpg", "tesla.jpg"];
        let result = shuffle(files);
        //separate the desired number of pictures
        result = result.slice(0, l / 2);
        //create pairs
        result = result.concat(result);
        //shuffle again
        result = shuffle(result);
        return result;

        function shuffle(a) {
            for (let i = a.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [a[i], a[j]] = [a[j], a[i]];
            }
            return a;
        }
    },
    //verification of inverted cards
    checkingForMatches: function (id) {
        this.selectedQueue.push(id);
        if (this.selectedQueue.length === 2) {
            //At the same time, only two pictures can be turned upside down, we turn on the lock
            this.blockField = true;
            if(document.getElementById(this.selectedQueue[0]).firstElementChild.lastElementChild.lastElementChild.src ===
                document.getElementById(this.selectedQueue[1]).firstElementChild.lastElementChild.lastElementChild.src){
                //hidden use element
                setTimeout(function () {
                    view.hiddenCard(document.getElementById(model.selectedQueue[0]));
                    view.hiddenCard(document.getElementById(model.selectedQueue[1]));
                    model.selectedQueue = [];
                    //the animation is over, the cards are removed, we remove the lock.
                    model.blockField = false;
                    model.openRightPears();//add one right result
                },1000);
                //remove listener
                document.getElementById(this.selectedQueue[0]).removeEventListener('click', controller.rotateItem, false);
                document.getElementById(this.selectedQueue[1]).removeEventListener('click', controller.rotateItem, false);
            }
            //wrong pair
            else {
                this.unAttempts ++;
                setTimeout(function () {
                    while (model.selectedQueue.length) {
                        document.getElementById(model.selectedQueue.shift()).firstElementChild.className = "block";
                    }
                    model.blockField = false;//remove the lock
                }, 1500);
            }
        }
    },

    openRightPears: function () {
        this.statusRightPears++;
        //have all pears game over
        if (this.statusRightPears === parseInt(document.getElementById('select_field').value[0])) {
            this.stopTimer();
            this.gameStart = false;
            let resultPoints = this.calculationPoints();
            alert("you win, you have " + resultPoints + " pints");
            let name = prompt("enter your name", "");
            //save results
            if (name !== "") {
                let arrUsers = JSON.parse(localStorage.getItem(document.getElementById('select_field').value));//deserialize it
                if (arrUsers === null) {
                    arrUsers = [];
                    arrUsers = changeArray(arrUsers, name, resultPoints);
                    let serialObj = JSON.stringify(arrUsers); //serialize it
                    localStorage.setItem(document.getElementById('select_field').value, serialObj);
                } else {
                    arrUsers = changeArray(arrUsers, name, resultPoints);
                    let serialObj = JSON.stringify(arrUsers); //serialize it
                    localStorage.setItem(document.getElementById('select_field').value, serialObj);
                }
            }
            view.showStatistics();
        }
        function changeArray(arr, name, points) {
            let date = new Date();
            for (let i in arr) {
                if (arr[i].name === name) {
                    if (arr[i].points < points) {
                        arr[i].points = points;
                        arr[i].date = date.getDate()+"."+(date.getMonth()+1)+"."+date.getFullYear();
                        return arr;
                    }
                    else {
                        return arr;
                    }
                }
            }
            arr.push({name: name, points: points, date: date.getDate()+"."+(date.getMonth()+1)+"."+date.getFullYear()});
            return arr;
        }
    },
    startTimer: function () {
        startTimer();
    },
    stopTimer: function () {
        stopTimer();
    },
    pauseTimer: function () {
        if (model.gameStart) {
            onOfPauseTimer();
        }
    },
    calculationPoints: function () {
        let points = 20;
        let min = parseInt(getMinute());
        //consider points in the game, from the time and wrong attempts
        switch (document.getElementById('select_field').value) {
            case "6 Pairs":
                points -= min;
                points -= this.unAttempts;
                break;
            case "8 Pairs":
                points -= (min / 2);
                points -= (this.unAttempts / 2);
                break;
            case "10 Pairs":
                points -= (min / 3);
                points -= (this.unAttempts / 3);
                break;
            case "12 Pairs":
                points -= (min / 4);
                points -= (this.unAttempts / 4);
                break;
            default:
        }
        if (points > 0) {
            return points;
        } else {
            return 1;
        }
    }
};

/*      view        */
let view = {
    //fill the field with cards
    createCards: function (pear, size, color) {
        let puzzle = document.getElementById('puzzle');
        puzzle.innerHTML = "";
        for (let i = 0; i < pear; i++) {
            let contentCard = document.createElement("div");
            contentCard.className = "content_card";
            contentCard.style.width = size + "px";
            contentCard.style.height = size + "px";
            contentCard.id = "puzzle-" + (i + 1);
            contentCard.innerHTML += "<div class='block'>" +
                "<div class='front side' style='background-color:" + color + "'></div>" +
                "<div class='back side'></div>" +
                "</div>";
            puzzle.appendChild(contentCard);
        }
        model.stopTimer();
        model.gameStart = false;
    },
    startGame: function () {
        view.showStatistics();
        model.gameStart = true;
        model.unAttempts = 0;
        let puzzle = document.getElementById('puzzle');
        controller.setColor();
        model.statusRightPears = 0;
        model.blockField = false;
        //show all the pictures and then hide
        openAllCards();
        setTimeout(closeAllCards, 1500);
        controller.setListener();
        model.startTimer();

        function openAllCards() {
            let imgArray = model.getArrayImages(puzzle.childNodes.length+1);
            for (let i = 0; i < puzzle.childNodes.length; i++) {
                //add picture
                puzzle.childNodes[i].firstElementChild.lastElementChild.innerHTML ="<img class='back_img' alt="+imgArray[i]+" src="+"img\\"+imgArray[i]+" />";
                puzzle.childNodes[i].firstElementChild.className += " rotated";
            }
        }
        function closeAllCards() {
            for (let i = 0; i < puzzle.childNodes.length; i++) {
                puzzle.childNodes[i].firstElementChild.className = "block";
            }
        }
    },
    //hide the card from the screen
    hiddenCard: function (elem) {
        elem.innerHTML = "<div class='block'>" +
            "<div class='front side' style='background-color:white'></div>" +
            "<div class='back side'></div>" +
            "</div>";
    },
    showStatistics: function () {
        let tableRef = document.getElementById("user_points").getElementsByTagName("tbody")[0];
        //clear table
        while (tableRef.rows[1]) {
            tableRef.deleteRow(1)
        }
        let arrUsers = JSON.parse(localStorage.getItem(document.getElementById('select_field').value));//deserialize it
        if (arrUsers !== null) {
            arrUsers.sort(function (a, b) {
                return parseFloat(b.points) - parseFloat(a.points);
            });
            for (let i in arrUsers) {
                let newRow = tableRef.insertRow(tableRef.rows.length);
                let cell1 = newRow.insertCell(0);
                let cell2 = newRow.insertCell(1);
                let cell3 = newRow.insertCell(2);
                cell1.appendChild(document.createTextNode(arrUsers[i].name));
                cell2.appendChild(document.createTextNode(arrUsers[i].points));
                cell3.appendChild(document.createTextNode(arrUsers[i].date));
            }
        }
    }
};

/*      controller      */
let controller = {

    createField: function (color) {
        view.showStatistics();
        switch (document.getElementById('select_field').value) {
            case "6 Pairs":
                view.createCards(12, "160", color);
                break;
            case "8 Pairs":
                view.createCards(16, "160", color);
                break;
            case "10 Pairs":
                view.createCards(20, "128", color);
                break;
            case "12 Pairs":
                view.createCards(24, "106", color);
                break;
            default:
        }
    },

    //set listener for all cards
    setListener: function () {
        let className = document.getElementsByClassName('content_card');
        for (let i = 0; i < className.length; i++) {
            className[i].addEventListener('click', controller.rotateItem, false);
        }
    },
    //invert the hidden element
    rotateItem: function () {
        let attribute = this.getAttribute("id");
        if (document.getElementById(attribute).firstElementChild.className === "block" && document.getElementById(attribute).firstElementChild.className!=='' && !model.blockField) {
            document.getElementById(attribute).firstElementChild.className += " rotated";
            model.checkingForMatches(attribute);
        }
    },

    setColor: function () {
        let arr = document.getElementsByClassName("front");
        let color = document.getElementById("color").value;
        for (let i = 0; i < arr.length; i++) {
            arr[i].style.backgroundColor = color;
        }
    }
};

(function () {
    let app = {
        init: function () {
            this.event();
        },

        main: function () {
            //here we write what is not included in the mv
        },

        event: function () {
            controller.createField(document.getElementById("color").value);
            //set new color
            document.getElementById("submitColor").addEventListener("click", controller.setColor, false);
            //create a new size field
            let selectField = document.getElementById('select_field');
            selectField.onchange = function () {
                controller.createField(document.getElementById("color").value);
            };
            // button startTimer game
            document.getElementById("startBtn").addEventListener("click",view.startGame,false);
            document.getElementById("pauseBtn").addEventListener("click",model.pauseTimer,false);

        }

    };

    app.init();
}());