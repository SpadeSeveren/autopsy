const { app, BrowserWindow } = require('electron');
const slash = process.platform === 'darwin' || process.platform === 'linux' ? '/' : '\\';

let points = {
    "killer": 0,
    "lover": 0,
    "humor": 0,
    "conspiracy": 0
};

let available = {
    "head": true,
    "torso": true,
    "arms": true,
    "legs": true,
    "clipboard": true
};

let aurthurMood = 'normal';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })

    // and load the index.html of the app.
    win.loadFile('scenes\\body.html')

    win.maximize();

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})


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

    document.body.appendChild(newContainer);
    
}

function dialogueButtonCallback(bodyPart, musing) {

    var container = document.getElementsByClassName("dialogue_container")[0];
    container.parentNode.removeChild(container);

    console.log(bodyPart);
    console.log(musing);
    var textElement = document.createElement("button");
    textElement.innerHTML = require(`..${slash}lib${slash}text.js`).fetchArthurResponse(bodyPart, musing)[0];
    textElement.musing = musing;
    textElement.count = 0;
    textElement.bodyPart = bodyPart;
    textElement.dialogueLength = require(`..${slash}lib${slash}text.js`).fetchArthurResponse(bodyPart, musing).length;
    textElement.className = "dialogue_text";
    textElement.addEventListener("click", advanceArthurDialogue);

    var newContainer = document.createElement("container");
    newContainer.className = "dialogue_container";

    var body = document.body;
    newContainer.appendChild(textElement);

    document.body.appendChild(newContainer);
    
}

function advanceDialogue() {
    if(this.count == this.dialogueLength - 1) {
        promptDialogue(this);
    }
    else {
        this.count++;
        this.innerHTML = require(`..${slash}lib${slash}text.js`).fetchMusingText(this.bodyPart, this.musing)[this.count];
    }
}

function advanceArthurDialogue() {
    if(this.count == this.dialogueLength - 1) {
        points = require(`..${slash}lib${slash}text.js`).increasePoints(points, this.bodyPart, this.musing);
        this.innerHTML = "Return to the full-body examination";

    }
    else {
        this.count++;
        this.innerHTML = require(`..${slash}lib${slash}text.js`).fetchArthurResponse(this.bodyPart, this.musing)[this.count];
    }
}

function loadMusings(bodyPart){
    window.location.href=`./${bodyPart}.html`;
}

function promptDialogue(element){

    element.parentNode.removeChild(element);

    var container = document.getElementsByClassName("dialogue_container")[0];
    var prompt = document.createElement("div");
    prompt.innerHTML = "Would you like to tell your thoughts to Arthur?";
    container.appendChild(prompt);

    var table = document.createElement("table");
    table.className = "yes_no_table";
    var row = document.createElement("th");
    
    var yesButton = document.createElement("button");
    var noButton = document.createElement("button");
    yesButton.innerHTML = "Yes";
    noButton.innerHTML = "No";
    noButton.onclick = () => {
        loadMusings(element.bodyPart);
    };

    yesButton.onclick = () => {
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
        table.appendChild(row);
    })
    table.style = "width: 50%";
    container.appendChild(table);
}

// function getMood() {
//     return aurthurMood;
// }

function increasePoints(bodyPart, musing) {
    points = require('./lib/text.js').increasePoints(points, bodyPart, musing);
    console.log(points);
}


