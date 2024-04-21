chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  var myTabs = [];

  // const classifyNew = async (newTab) => {
  //   const url = "http://127.0.0.1:5000/?query=" + newTab;
  // };
  // classifyNew("test");

  function filterGroups(listOfTitle) {
    var myGroups = [];
    while (listOfTitle.length > 0) {
      var group = [];
      var base = listOfTitle.pop();
      group.push(base);
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
  function extractDomain(url) {
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
  }

  function extractTitle(url) {
    domain = extractDomain(url);
    var parts = domain.split(".");
    var title = parts[0]; // Get the first part before the first period

    // Capitalize the first letter of each word
    title = title.replace(/\b\w/g, function (char) {
      return char.toUpperCase();
    });

    return title;
  }

  if (changeInfo.status === "complete") {
    var tabs = chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        myTabs.push(tab);
      });
      console.log(myTabs);
      groupsTabs = filterGroups(myTabs.map((tab) => tab));
      groupsTabs.forEach((group) => {
        chrome.tabs.group(
          {
            tabIds: group.map((tab) => tab.id),
          },
          (groupId) => {
            chrome.tabGroups.update(groupId, {
              title: extractTitle(group[0]["url"]),
            });
          }
        );
      });
    });
  }
});
