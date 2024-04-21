const onButton = document.getElementById("on");
const offButton = document.getElementById("off");

import { extractDomain, makeNewTabGroup } from "./background.js";

onButton.onclick = function () {
  let enabled = true;
  chrome.storage.local.set({ enabled: enabled }).then(() => {
    var myTabs = [];

    // const classifyNew = async (newTab) => {
    //   const url = "http://127.0.0.1:5000/?query=" + newTab;
    // };
    // classifyNew("test");
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
};

offButton.onclick = function () {
  let enabled = false;
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
};
