chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
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
            chrome.tabGroups.update(groupId, { title: group[0].title });
          }
        );
      });
    });
  }
});
