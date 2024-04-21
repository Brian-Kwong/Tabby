document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("on").addEventListener("click", function() {
        changeOnOff("on");
    });

    document.getElementById("off").addEventListener("click", function() {
        changeOnOff("off");
    });
});

function changeOnOff(state) {
    if (state === 'on') {
        console.log("extension is on");
        // You can send a message to your background script here to indicate the extension is on.
        chrome.runtime.sendMessage({ action: "extensionStatus", status: "on" });
    } else {
        console.log("extension is off");
        // You can send a message to your background script here to indicate the extension is off.
        chrome.runtime.sendMessage({ action: "extensionStatus", status: "off" });
    }
}
