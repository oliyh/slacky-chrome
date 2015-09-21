function requestPanelContent(request, sendResponse) {
  sendResponse({body: document.getElementById('slacky-panel').innerHTML});
}

function memeDetected(request, sendResponse) {
  sendResponse({memeUrl: "http://static.fjcdn.com/pictures/It+s+an+old+meme+how+i+feel+when+i+see_e83de6_3481193.jpg",
                target: request.target});
}

function init() {
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        switch(request.event) {          
          case 'requestPanelContent':
              requestPanelContent(request, sendResponse);
              break;
              
          case 'memeDetected':
              memeDetected(request, sendResponse);
              break;
              
          default:
              console.log('Unknown event: ' + request + sender);
        }
    });
  console.log('background page loaded');
}

init();
  
