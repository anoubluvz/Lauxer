const launchButton = document.querySelector(".launch-button");
const launchInfo = document.querySelector(".launch-info");
const getAppdataPath = require("appdata-path");
const ws = require("windows-shortcuts");
const fs = require("fs");
const remote = require("electron").remote;
const shell = require("electron").shell;

let versionsPath;
let robloxPlayerPath;
let playerFound = false;

window.addEventListener("load", () => {
    let appdataPath = getAppdataPath();
    let pathParts = appdataPath.split("\\");
    appdataPath = "";
    for(let i = 0; i < pathParts.length; i++)
    {
        const currentPart = pathParts[i];
        if(currentPart != "Roaming")
            appdataPath += currentPart + "\\";
    }
    appdataPath = appdataPath + "\\Local\\Roblox\\Versions";
    versionsPath = appdataPath;

    fs.readdir(versionsPath, (err, docs) => {
        docs.forEach(doc => {
            const docPath = `${versionsPath}\\${doc}`;
            const isDir = fs.lstatSync(docPath).isDirectory();
            if(isDir)
            {
                fs.readdir(docPath, (err, versionDocs) => {
                    versionDocs.forEach(versionDoc => {
                        const versionDocPath = `${docPath}\\${versionDoc}`
                        const isFile = fs.lstatSync(versionDocPath).isFile();
                        if(isFile)
                        {
                            if(versionDoc.toString() == "RobloxPlayerBeta.exe")
                            {
                                robloxPlayerPath = versionDocPath;
                                playerFound = true;
                            }
                        }
                    });
                    if(playerFound)
                        launchInfo.textContent = `Roblox player is found on disk, Click launch to launch the beta program!`;
                    else
                        launchInfo.textContent = "Could not find the roblox player on disk! Make sure you got roblox installed.";
                });
            }
        });
    });
});

launchButton.addEventListener("click", () => {
    const lauxerLauncherPath = `${__dirname}\\LauxerPlayer.lnk`;

    if(fs.existsSync(lauxerLauncherPath)    )
        fs.unlinkSync(lauxerLauncherPath);

    const loadingScreen = document.querySelector(".loading-screen");
    document.querySelector(".container").classList.add("hidden");
    loadingScreen.classList.remove("hidden");
    ws.create(lauxerLauncherPath, {
        target: robloxPlayerPath,
        args: "--app"
    }, (err) => {
        if(err)
        {
            console.error(err);
            return;
        }
        shell.openExternal(lauxerLauncherPath).then(() => {
            let w = remote.getCurrentWindow();
            w.close();
        })
    });
});