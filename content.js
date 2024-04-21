var windows = chrome.tabs.query({
  active: true,
  lastFocusedWindow: true,
});
windows.then((tabs) => {
  console.log(tabs);
});
