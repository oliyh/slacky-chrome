chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");

            sendResponse({memeUrl: "http://static.fjcdn.com/pictures/It+s+an+old+meme+how+i+feel+when+i+see_e83de6_3481193.jpg",
                   target: request.target});
                   chrome.tabs.create({url: chrome.extension.getURL('slacky-panel.html')},
                   function(tab) {
            // After the tab has been created, open a window to inject the tab
            chrome.windows.create({
                tabId: tab.id,
                type: 'popup',
                focused: true
              // incognito, top, left, ...
            });
        });;
  });

  console.log('background page loaded');
