clientId = null;

function populateMemeHistory(request, sendResponse) {
  chrome.storage.sync.get('memeHistory', function(items) {
    var memeHistory = items.memeHistory;
    sendResponse({memeHistory: memeHistory || []});
  });
}

function storeMemeResult(result) {
  chrome.storage.sync.get('memeHistory', function(items) {
    var memeHistory = items.memeHistory;
    if (!memeHistory) {
        memeHistory = [];
    }
    memeHistory.push(result);
    if (memeHistory.length > 10) {
       memeHistory.shift();
    }
    chrome.storage.sync.set({memeHistory: memeHistory});
  });
}

function memeRequest(request, sendResponse) {
   console.log('posting to slacky');
   $.ajax(
      {type: "POST",
       url: 'https://slacky-server.herokuapp.com/api/browser-plugin/meme',
       data: {text: request.memeRequest,
              token: clientId},
       success: function(response) {
          console.log('meme returned!');
          storeMemeResult({url: response});
          sendResponse({event: 'memeGenerated',
                        target: request.target,
                        memeUrl: response});
       },
       error: function(xhr, status, errorMsg) {
         switch (xhr.status) {
           case 400:
            sendResponse({event: 'badMemeRequest',
                          helpText: xhr.responseText});
            break;
            
            default:
            sendResponse({event: 'memeGenerationFailed',
                          errorMsg: xhr.responseText});
            break;
         }
       }});
}

function init() {
  console.log("Initialising Slacky background process");
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        switch(request.event) {
          case 'populateMemeHistory':
              populateMemeHistory(request, sendResponse);
              break;

          case 'memeRequest':
              memeRequest(request, sendResponse);
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
  
  //chrome.browserAction.onClicked.addListener(function(tab) {
  //  chrome.tabs.sendMessage(tab.id, {event: 'slackyPanelInvoked'});
  //}); 
  console.log('background page loaded');
}

init();
