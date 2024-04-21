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
          chrome.tab.group({
            groupId: group["id"],
            tabIds: tab["id"],
          });
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
    if (enabled["enabled"] && changeInfo.status == "complete") {
      chrome.storage.local.get(["ai_mode"], (ai) => {
        if (!ai["ai_mode"]) {
          var currTab = tab;
          if (currTab["groupId"] === -1) {
            makeNewTabGroup([currTab]);
          } else {
            findCorrectTab(currTab);
          }
        } else {
          // if the previous tabs have already computed vectors
          const classifyNew = async (tabs, callback) => {
            const url = "http://127.0.0.1:5000/";
            fetch(url, {
              method: "POST",
              mode: "cors",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(tabs),
            })
              .then((response) => response.json())
              .then((json) => {
                callback(json);
                return 0;
              });
            return 1;
          };
          chrome.tabs.query({}, async (allTabs) => {
            const rawTabs = allTabs;

            let tabs = [];
            for (let i = 0; i < allTabs.length; ++i) {
              console.log(allTabs[i].title);
              if (allTabs[i].title != "New Tab") {
                tabs.push(allTabs[i]);
              }
            }
            if (tabs.length < 1) {
              return 0;
            }

            tabs = tabs.map(
              (tab) =>
                extractTitle(tab.url) +
                " " +
                extractTitle(tab.url) +
                " " +
                tab.title
            ); // ?
            tabs = tabs.map((tab) => tab.replaceAll(" ", "_"));
            classifyNew(tabs, (payload) => {
              // TODO: have clusters be calculated in here
              const groupings = payload.groupings;
              let groupAmount = 0;
              console.log(groupings);
              for (let i = 0; i < groupings.length; ++i) {
                if (groupings[i] > groupAmount) {
                  groupAmount = groupings[i];
                }
              }
              ++groupAmount;
              let allTabGroups = [];
              for (let i = 0; i < groupAmount; ++i) {
                allTabGroups.push([]);
              }
              console.log(allTabGroups);
              for (let i = 0; i < tabs.length; ++i) {
                console.log(groupings[i]);
                allTabGroups[groupings[i]].push(rawTabs[i]);
              }
              for (let i = 0; i < groupAmount; ++i) {
                makeNewTabGroup(allTabGroups[i]);
              }
            });
          });
        }
      });
    }
  });
});
