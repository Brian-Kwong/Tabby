export const extractDomain = function extractDomain(url) {
  // Remove protocol
  var domain = url.replace(/(^\w+:|^)\/\//, "");

  // Remove path and query parameters
  domain = domain.split("/")[0];

  // Remove port number if present
  domain = domain.split(":")[0];

  // Extract only the domain name
  var matches = domain.match(/^www\.(.+\.\w{2,3})(?:\/.*)?$/);
  if (matches) {
    domain = matches[1];
  }

  // Extract second-level domain
  var parts = domain.split(".");
  if (parts.length > 2) {
    domain = parts.slice(1).join(".");
  }

  return domain;
};

export const extractTitle = function extractTitle(url) {
  var domain = extractDomain(url);
  var parts = domain.split(".");
  var title = parts[0]; // Get the first part before the first period

  // Capitalize the first letter of each word
  title = title.replace(/\b\w/g, function (char) {
    return char.toUpperCase();
  });

  return title;
};

export const makeNewTabGroup = function (tabList) {
  chrome.tabs.group(
    {
      tabIds: tabList.map((tab) => tab.id),
    },
    (groupId) => {
      chrome.tabGroups.update(groupId, {
        title: extractTitle(tabList[0]["url"]),
      });
    }
  );
};

export const findCorrectTab = function findCorrectTabGroup(tab) {
  let title = extractTitle(tab["url"]);
  var foundHome = false;
  chrome.tabGroups.get(tab["groupId"], (group) => {
    if (group["title"] === title) {
      return;
    }
    chrome.tabGroups.query({}, (groups) => {
      groups.forEach((group) => {
        if (group["title"] === title) {
          chrome.tab.group({ groupId: group["id"], tabIds: tab["id"] });
          foundHome = true;
        }
      });
      if (!foundHome) {
        makeNewTabGroup([tab]);
      }
    });
  });
};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  chrome.storage.local.get(["enabled"], (enabled) => {
    if (enabled["enabled"] && changeInfo.status === "complete") {
      var currTab = tab;
      if (currTab["groupId"] === -1) {
        makeNewTabGroup([currTab]);
      } else {
        findCorrectTab(currTab);
      }
    }
  });
});
