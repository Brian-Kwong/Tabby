chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  chrome.storage.local.get(["enabled"], (value) => {
    let enabled = value["enabled"];
    var myTabs = [];
    function filterGroups(listOfTitle) {
      var myGroups = [];
      while (listOfTitle.length > 0) {
        var group = [];
        var base = listOfTitle.pop();
        group.push(base);
        for (var i = 0; i < listOfTitle.length; i++) {
          if (listOfTitle[i]["title"] === base["title"]) {
            group.push(listOfTitle[i]);
            listOfTitle.splice(i, 1);
          }
        }
        myGroups.push(group);
      }
      return myGroups;
    }

    /* Wait intil the page loads */
    if (enabled && changeInfo.status === "complete") {
      var tabs = chrome.tabs.query({}, (tabs) => {
        /* Add all the tabs to the array */
        tabs.forEach((tab) => {
          myTabs.push(tab);
        });
        /* Groups the tabs by title */
        var groupsTabs = filterGroups(myTabs.map((tab) => tab));
        /* Uses groups to make the tab groups */
        groupsTabs.forEach((group) => {
          chrome.tabs.group(
            {
              tabIds: group.map((tab) => tab.id),
            },
            (groupId) => {
              chrome.tabGroups.update(groupId, { title: group[0].title });
            }
          );
        });
      });
    } else {
      return null;
    }
  });
});
