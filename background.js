chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'clean-link',
    title: "Ethan's AntiTrack: Clean tracking params",
    contexts: ['link']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'clean-link' && info.linkUrl) {
    let cleaned = info.linkUrl.split('?')[0];
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (orig, clean) => {
        const sel = document.querySelector(`a[href="${orig}"]`);
        if (sel) {
          sel.setAttribute('href', clean);
          alert(`Cleaned URL:\n${clean}`);
        }
      },
      args: [info.linkUrl, cleaned]
    });
  }
});
