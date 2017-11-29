/*      model       */
let model = {
    //flag to lock cards
    blockField: false,
    selectedQueue: [],
    statusGame:0,
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
                    model.openPears();//add one right result
                },1000);
                //remove listener
                document.getElementById(this.selectedQueue[0]).removeEventListener('click', controller.rotateItem, false);
                document.getElementById(this.selectedQueue[1]).removeEventListener('click', controller.rotateItem, false);
            }
            else {
                setTimeout(function () {
                    while (model.selectedQueue.length) {
                        document.getElementById(model.selectedQueue.shift()).firstElementChild.className = "block";
                    }
                    model.blockField = false;//remove the lock
                }, 1500);
            }


        }
    },

    openPears: function () {
        this.statusGame++;
        //have all pears game over
        if (this.statusGame == document.getElementById('select_field').value[0]){
            alert("you win");
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
    },
    startGame: function () {
        let puzzle = document.getElementById('puzzle');
        controller.setColor();
        model.statusGame = 0;
        //show all the pictures and then hide
        openAllCards();
        setTimeout(closeAllCards, 1500);
        controller.setListener();

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
    }
};

/*      controller      */
let controller = {

    createField: function (color) {
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
            // button start game
            document.getElementById("start").addEventListener("click",view.startGame,false);

        }

    };

    app.init();
}());