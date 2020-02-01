const { app, BrowserWindow } = require('electron')

let points = {
    "killer": 0,
    "lover": 0,
    "humor": 0,
    "dispassionate": 0
}

let data =
    {
        "head": {
            "observational_text": "lorem ipsum",
            "musings": {
                "filler musing": {
                    "requires": {
                        "killer": 0,
                        "lover": 0,
                        "humor": 0,
                        "dispassionate": 0
                    },
                    "increase_points": {
                        "killer": 0,
                        "lover": 0,
                        "humor": 0,
                        "dispassionate": 0
                    },
                    "arthur_response": "lorem ipsum"
                }
            }
        },
        "torso": {
            "observational_text": "lorem ipsum",
            "musings": {
                "filler musing": {
                    "requires": {
                        "killer": 0,
                        "lover": 0,
                        "humor": 0,
                        "dispassionate": 0
                    },
                    "increase_points": {
                        "killer": 0,
                        "lover": 0,
                        "humor": 0,
                        "dispassionate": 0
                    },
                    "arthur_response": "lorem ipsum"
                }
            }
        },
        "arms": {
            "observational_text": "lorem ipsum",
            "musings": {
                "filler musing": {
                    "requires": {
                        "killer": 0,
                        "lover": 0,
                        "humor": 0,
                        "dispassionate": 0
                    },
                    "increase_points": {
                        "killer": 0,
                        "lover": 0,
                        "humor": 0,
                        "dispassionate": 0
                    }
                },
                "arthur_response": "lorem ipsum"
            }
        },
        "legs": {
            "observational_text": "lorem ipsum",
            "musings": {
                "filler musing": {
                    "requires": {
                        "killer": 0,
                        "lover": 0,
                        "humor": 0,
                        "dispassionate": 0
                    },
                    "increase_points": {
                        "killer": 0,
                        "lover": 0,
                        "humor": 0,
                        "dispassionate": 0
                    }
                },
                "arthur_response": "lorem ipsum"
            }
        }
    }

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function musings (points, bodyPart) {
    let res = [];
    Object.keys(data[bodyPart]).forEach(musingText => {
        let flag = true;
        Object.keys(points).forEach(type => {
            if (data[bodyPart].musings[musingText].requires[type] > points[type])
                flag = false;
        });
        if (flag)
            res.push(musingText);
    });
    return res;
}

function increasePoints (points, bodyPart, musing) {
    let incP = data[bodyPart].musings[musing].increase_points;
    Object.keys(incP).forEach(point => {
        points[point] += incP[point];
    });
    return points;
}

function createWindow () {
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

function click_callback(id)
{
    var output = increasePoints(points, 'head', 'filler musing');

    console.log(output);
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.