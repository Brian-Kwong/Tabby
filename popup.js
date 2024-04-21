const onButton = document.getElementById("switch");
import { extractDomain, makeNewTabGroup } from "./background.js";

var state;
chrome.storage.local.get(["enabled"], (enabled) => {
  state = enabled["enabled"];
  onButton.checked = state;
});

onButton.addEventListener("change", function () {
  if (state === false) {
    state = true;
    let enabled = true;
    chrome.storage.local.set({ enabled: enabled }).then(() => {
      var myTabs = [];
      chrome.storage.local.get(["enabled"], (enabled) => {
        var enabled = enabled["enabled"];

        function filterGroups(listOfTitle) {
          var myGroups = [];
          while (listOfTitle.length > 0) {
            var group = [];
            var base = listOfTitle.pop();
            group.push(base);
            var base_url, given_url;
            for (var i = listOfTitle.length - 1; i >= 0; i--) {
              base_url = extractDomain(base["url"]);
              given_url = extractDomain(listOfTitle[i]["url"]);
              if (base_url === given_url) {
                group.push(listOfTitle[i]);
                listOfTitle.splice(i, 1);
              }
            }
            myGroups.push(group);
          }
          return myGroups;
        }

        if (enabled) {
          var tabs = chrome.tabs.query({}, (tabs) => {
            tabs.forEach((tab) => {
              myTabs.push(tab);
            });
            console.log(myTabs);
            var groupsTabs = filterGroups(myTabs.map((tab) => tab));
            groupsTabs.forEach((group) => {
              makeNewTabGroup(group);
            });
          });
        }
      });
    });
  } else {
    let enabled = false;
    state = false;
    chrome.storage.local.set({ enabled: enabled }).then(() => {
      chrome.tabGroups.query({}, (groups) => {
        if (groups.length === 0) return;
        groups.forEach((group) => {
          chrome.tabs.query({ groupId: group["id"] }, (tabs) => {
            chrome.tabs.ungroup(
              tabs.map((tab) => tab["id"]),
              () => {}
            );
          });
        });
      });
    });
  }
});
