function requestPanelContent(request, sendResponse) {
  sendResponse({body: document.getElementById('slacky-panel').innerHTML});
}

function memeRequest(request, sendResponse) {
   console.log('posting to slacky');
   $.ajax(
      {type: "POST",
       url: 'https://slacky-server.herokuapp.com/api/meme',
       data: {text: request.memeRequest},
       success: function(response) {
          console.log('meme returned!');
          sendResponse({memeUrl: response,
                        target: request.target});
       },
       error: function(xhr, status, errorMsg) {
          console.log('something went wrong');
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
