const onButton = document.getElementById("on");
const offButton = document.getElementById("off");

onButton.onclick = function () {
  let enabled = true;
  chrome.storage.local.set({ enabled: enabled }).then(() => {
    console.log("Value is set");
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
