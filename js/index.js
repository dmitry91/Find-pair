/*      model       */
let model = {};

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
            contentCard.innerHTML += "<div id='block' class='block'>" +
                "<div class='front side' style='background-color:" + color + "'></div>" +
                "<div class='back side'></div>" +
                "</div>";
            puzzle.appendChild(contentCard);
        }
    },
    //hide the card from the screen
    hiddenCard: function () {

    }
};

/*      controller      */
let controller = {

    createField: function (v) {
        switch (document.getElementById('select_field').value) {
            case "6 Pairs":
                view.createCards(12, "160", v);
                break;
            case "8 Pairs":
                view.createCards(16, "160", v);
                break;
            case "10 Pairs":
                view.createCards(20, "128", v);
                break;
            case "12 Pairs":
                view.createCards(24, "106", v);
                break;
            default:
        }
        controller.setListener();
    },

    //set listener for all cards
    setListener: function () {
        let myFunction = function () {
            let attribute = this.getAttribute("id");
            if (document.getElementById(attribute).firstElementChild.className === "block") {
                document.getElementById(attribute).firstElementChild.className += " rotated";
            }
            else {
                document.getElementById(attribute).firstElementChild.className = "block";
            }
        };
        let className = document.getElementsByClassName('content_card');
        for (let i = 0; i < className.length; i++) {
            className[i].addEventListener('click', myFunction, false);
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
            document.getElementById("submitColor").addEventListener("click", controller.setColor, false);
            controller.createField(document.getElementById("color").value);

            let selectField = document.getElementById('select_field');
            selectField.onchange = function () {
                controller.createField(document.getElementById("color").value);
            };
        }

    };

    app.init();
}());