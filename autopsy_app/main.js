const { app, BrowserWindow } = require('electron');

let points = {
    "killer": 0,
    "lover": 0,
    "humor": 0,
    "dispassionate": 0
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

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
    win.loadFile('index.html')

    // Open the DevTools.
    win.webContents.openDevTools()

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

function displayBody() {
    // display clickable items for head
    if(clicked) { // currently undefined
        displayMusings('head');
    }
    // display clickable items for torso
    if(clicked) { // currently undefined
        displayMusings('torso');
    }
    // display clickable items for arms
    if(clicked) { // currently undefined
        displayMusings('arms');
    }
    // display clickable items for legs
    if(clicked) { // currently undefined
        displayMusings('legs');
    }

}

function displayMusings(bodyPart) {
    musings = require('../lib/text.js').musings(points, bodyPart);
    musings.forEach(musing => {
        // display all musings in array as clickable options
        if (clicked) { // currently undefined
            displayYesNo(bodyPart, musing);
        }
    })
    console.log(musings);
}

function displayYesNo(bodyPart, musing) {
    // display musing and yes/no options

    if (yes) { // currently undefined
        displayArthurResponse(bodyPart, musing);
        increasePoints(bodyPart, musing);
    }
    else {
        displayMusings(bodyPart);
    }
}

function displayArthurResponse(bodyPart, musing) {
    let response = require('../lib/text.js').fetchAurthurResponse(bodyPart, musing);
    // display response
    // display button to continue
    if (clicked) { // curently undefined
        displayBody();
    }
}

function increasePoints(bodyPart, musing) {
    points = require('../lib/text.js').increasePoints(points, bodyPart, musing);
    console.log(points);
}