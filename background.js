// try {
//   chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
//     if (changeInfo.status === "complete") {
//       chrome.scripting.executeScript({
//         target: { tabId: tab.id },
//         files: ["content.js"],
//       });
//     }
//   });
// } catch (e) {
//   console.log(e);
// }

try {
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === "complete") {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["popup.js"],
      });
    }
  });
} catch (e) {
  console.log(e);
}

//stores the state of what the user wants (on or off)
// try {
// document.addEventListener("DOMContentLoaded", function() {
//     document.getElementById("on").addEventListener("click", function() {
//         changeOnOff("on");
//     });

//     document.getElementById("off").addEventListener("click", function() {
//         changeOnOff("off");
//     });
// });

// function changeOnOff(state) {
//     if (state === 'on') {
//         console.log("extension is on");
//     } else {
//         console.log("extension is off");
//     }
// }
// }catch(e) {
//   console.log("On/Off error", e);
// }