function requestPanelContent(request, sendResponse) {
  sendResponse({body: document.getElementById('slacky-panel').innerHTML});
}

function memeRequest(request, sendResponse) {
   $.post(
      {url: 'https://slacky-server.herokuapp.com/api/meme',
       body: {text: request.memeRequest},
       success: function(response) { // this should be on complete and then i dispatch on response code
          sendResponse({memeUrl: response.text,
                        target: request.target});
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
              memeRequest(request, sendResponse);
              break;

          default:
              console.log('Unknown event: ' + request + sender);
        }
    });
  console.log('background page loaded');
}

init();
