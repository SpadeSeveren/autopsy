let fs = require('fs');
const slash = process.platform === 'darwin' || process.platform === 'linux' ? '/' : '\\';
let { points, available } = require(`..${slash}data.json`);
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


function musingButtonCallback(bodyPart, musing) {

    var container = document.getElementsByClassName("musing_table")[0];
    container.parentNode.removeChild(container);
    
    var textElement = document.createElement("button");
    textElement.innerHTML = require(`..${slash}lib${slash}text.js`).fetchMusingText(this.bodyPart, this.innerHTML)[0];
    textElement.musing = this.innerHTML;
    textElement.count = 0;
    textElement.bodyPart = this.bodyPart;
    textElement.dialogueLength = require(`..${slash}lib${slash}text.js`).fetchMusingText(this.bodyPart, this.innerHTML).length;
    textElement.className = "dialogue_text";
    textElement.addEventListener("click", advanceDialogue);

    var newContainer = document.createElement("container");
    newContainer.className = "dialogue_container";

    var body = document.body;
    newContainer.appendChild(textElement);

    var element = document.getElementsByClassName("observationalText")[0];
    element.parentNode.removeChild(element);

    document.body.appendChild(newContainer);

}

function dialogueButtonCallback(bodyPart = currentBodyPart, musing = currentMusing) {

    var container = document.getElementsByClassName("dialogue_container")[0];
    if(container != null)
    {
        container.parentNode.removeChild(container);
    }

    console.log(bodyPart);
    console.log(musing);

    var textElement = document.createElement("button");
    let arthurResponse = require(`..${slash}lib${slash}text.js`).fetchArthurResponse(bodyPart, musing);
    textElement.innerHTML = arthurResponse[0];
    textElement.musing = musing;
    textElement.count = 0;
    textElement.bodyPart = bodyPart;
    textElement.dialogueLength = arthurResponse.length;
    textElement.className = "dialogue_text";
    textElement.addEventListener("click", advanceArthurDialogue);
    
    var newContainer = document.createElement("container");
    newContainer.className = "dialogue_container";

    var body = document.body;
    newContainer.appendChild(textElement);

    document.body.appendChild(newContainer);

}

function advanceDialogue() {
    if (this.count == this.dialogueLength - 1) {
        promptDialogue(this);
    }
    else {
        this.count++;
        this.innerHTML = require(`..${slash}lib${slash}text.js`).fetchMusingText(this.bodyPart, this.musing)[this.count];
    }
}

function advanceArthurDialogue() {
    if (this.count === this.dialogueLength - 1) {
        points = require(`..${slash}lib${slash}text.js`).increasePoints(points, this.bodyPart, this.musing);
        available[this.bodyPart] = false;
        this.innerHTML = "Return to the full-body examination";
        this.onclick = () => {
            loadMusings("body");
        };
    }
    else {
        this.count++;
        this.innerHTML = require(`..${slash}lib${slash}text.js`).fetchArthurResponse(this.bodyPart, this.musing)[this.count];
    }
}

function loadMusings(bodyPart) {
    fs.writeFileSync(`./data.json`, JSON.stringify({ points: points, available: available }), 'utf8');
    window.location.href = `./${bodyPart}.html`;
    console.log(points);
    console.log(end);
}

function promptDialogue(element) {

    element.parentNode.removeChild(element);

    var container = document.getElementsByClassName("dialogue_container")[0];
    var prompt = document.createElement("div");
    prompt.innerHTML = "Would you like to tell your thoughts to Arthur?";

    prompt.className = "prompt";

    container.appendChild(prompt);

    var table = document.createElement("table");
    table.className = "yes_no_table";
    var row = document.createElement("th");

    var yesButton = document.createElement("button");
    var noButton = document.createElement("button");

    yesButton.style = "width: 300px; height: 120px; border: 2px solid black;"
    noButton.style = "width: 300px; height: 120px; border: 2px solid black;"

    yesButton.innerHTML = "Yes";
    noButton.innerHTML = "No";
    noButton.onclick = () => {
        loadMusings(element.bodyPart);
    };

    yesButton.onclick = () => {
        var arthurFace = require(`..${slash}lib${slash}text.js`).fetchArthurMood(element.bodyPart, element.musing);
        document.getElementById("img").src = `./Images/arthur ${arthurFace}.jpg`;
        document.getElementsByClassName("container")[0].style = "width: 25%; height: 25%; transform: translate(150%, 0%);";
        dialogueButtonCallback(element.bodyPart, element.musing);
    };
    row.appendChild(yesButton);
    row.appendChild(noButton);
    table.appendChild(row);
    container.appendChild(table);
}

function createMusings(bodyPart) {
    var musingArray = require(`..${slash}lib${slash}text.js`).musings(points, bodyPart);
    var container = document.getElementsByClassName("container")[0];
    var table = document.createElement("table");
    table.id = "table";
    table.className = "musing_table";
    musingArray.forEach(musing => {
        var row = document.createElement("th")
        var musingText = document.createElement("button");
        musingText.innerHTML = musing;
        musingText.addEventListener("click", musingButtonCallback);
        musingText.className = "musing_button";
        musingText.bodyPart = bodyPart;
        row.appendChild(musingText);
        row.className = "musing_row";
        table.appendChild(row);
    })
    container.appendChild(table);
    var div = document.createElement("P");
    div.innerHTML =  require(`..${slash}lib${slash}text.js`).fetchDiscriptions(bodyPart);
    div.className = "observationalText";
    container.appendChild(div);
}

function createBodyButtons() {
    console.log(available);
    if (available.head) {
        var headButton = document.createElement("button");
        headButton.className = "headButton";
        headButton.onclick = () => {
            loadMusings("head");
        };
        var container = document.getElementsByClassName("container")[0];
        container.appendChild(headButton);
    }
    if (available.torso) {
        var torsoButton = document.createElement("button");
        torsoButton.className = "torsoButton";
        torsoButton.onclick = () => {
            loadMusings("torso");
        };
        var container = document.getElementsByClassName("container")[0];
        container.appendChild(torsoButton);
    }
    if (available.arms) {
        var armsButton = document.createElement("button");
        armsButton.className = "armsButton";
        armsButton.onclick = () => {
            loadMusings("arms");
        };
        var container = document.getElementsByClassName("container")[0];
        container.appendChild(armsButton);
    }
    if (available.legs) {
        var legsButton = document.createElement("button");
        legsButton.className = "legsButton";
        legsButton.onclick = () => {
            loadMusings("legs");
        };
        var container = document.getElementsByClassName("container")[0];
        container.appendChild(legsButton);
        console.log(legsButton);
    }
    if (available.clipboard) {
        var clipboardButton = document.createElement("button");
        clipboardButton.className = "clipboardButton";
        clipboardButton.onclick = () => {
            loadMusings("clipboard");
        };
        var container = document.getElementsByClassName("container")[0];
        container.appendChild(clipboardButton);
        console.log(clipboardButton);
    }
}

function checkEnd(){
    var end = require(`..${slash}lib${slash}text.js`).fetchEnding(points);
    
    console.log(points);
    console.log(end);
    if(end !== false){
        console.log("end achieved");

        if(end === "humor") {
            window.location.href = "./humorEnding.html";
        }
        if(end === "conspiracy") {
            window.location.href = "./conspiracyEnding.html";
        }
        if(end === "lover") {
            window.location.href = "./loverEnding.html";
        }
        if(end === "killer") {
            window.location.href = "./killerEnding.html";
        }
    }
}

function loadIntro() {
    window.location.href = `./introscreen.html`;
}

function loadBody() {
    window.location.href = `./body.html`;
}

function fetchEnding(ending) {
    var container = document.getElementsByClassName("container")[0];
    var endingText = document.createElement("button");
    endingText.textArray = require(`..${slash}lib${slash}text.js`).fetchEndingText(ending);
    endingText.maxCount = endingText.textArray.length;
    endingText.count = 0;
    endingText.ending = ending;
    endingText.innerText = endingText.textArray[0];
    endingText.className = "dialogue_button";
    endingText.addEventListener("click", increaseEnding);
    container.appendChild(endingText);
}

function increaseEnding() {
    if(this.count === this.maxCount - 1) {

    }
    else {
        this.count++;
        console.log(this.textArray);
        this.innerText = this.textArray[this.count];
    }
}