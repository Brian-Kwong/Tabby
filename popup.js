const onButton = document.getElementById("switch");

let state = false; // Initialize state variable

onButton.addEventListener("change", function() {
    state = !state; // Toggle the state when the button is changed
    if (state === true) {
          let enabled = true;
          chrome.storage.local.set({ enabled: enabled }).then(() => {
          console.log("Value is set");
    });
    } else {
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
    }
});
