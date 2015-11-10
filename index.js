clientId = null;

function requestPanelContent(request, sendResponse) {
  sendResponse({body: document.getElementById('slacky-panel').innerHTML,
                memeHistory: [{url: 'http://i.memecaptain.com/gend_images/Dhdr_w.jpg'}, {url: 'http://i.memecaptain.com/gend_images/6Ao8JA.jpg'}]});
}

function memeRequest(request, tabId) {
   console.log('posting to slacky');
   $.ajax(
      {type: "POST",
       url: 'https://slacky-server.herokuapp.com/api/browser-plugin/meme',
       data: {text: request.memeRequest,
              token: clientId},
       success: function(response) {
          console.log('meme returned!');
          chrome.tabs.sendMessage(tabId, {event: 'memeGenerated',
                                          target: request.target,
                                          memeUrl: response});
       },
       error: function(xhr, status, errorMsg) {
         switch (xhr.status) {
           case 400:
            chrome.tabs.sendMessage(tabId, {event: 'badMemeRequest',
                                            helpText: xhr.responseText});
            break;
            
            default:
            chrome.tabs.sendMessage(tabId, {event: 'memeGenerationFailed',
                                            errorMsg: xhr.responseText});
            break;
         }
       }});
}

function init() {
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        switch(request.event) {
          case 'requestPanelContent':
              requestPanelContent(request, sendResponse);
              break;

          case 'memeRequest':
              memeRequest(request, sender.tab.id);
              break;

          default:
              console.log('Unknown event: ' + request.event);
        }
        
        return true;
    });
    
  chrome.storage.sync.get('clientId', function(items) {
    var cid = items.clientId;
    if (cid) {
        clientId = cid;
    } else {
        cid = getRandomToken();
        chrome.storage.sync.set({clientId: cid}, function() {
            clientId = cid;
        });
    }
    console.log('clientId ' + clientId);
  });
  
  chrome.browserAction.setPopup({popup: document.getElementById('slacky-panel').innerHTML});
  console.log('background page loaded');
}

init();
