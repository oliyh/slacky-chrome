function requestPanelContent(request, sendResponse) {
  sendResponse({body: document.getElementById('slacky-panel').innerHTML});
}

function memeRequest(request, sendResponse) {
   console.log('posting to slacky');
   /*
   sendResponse({event: 'memeGenerated',
                               target: request.target,
                               memeUrl: 'cats.jpg'});
                               
   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, {event: 'memeGenerated',
                               target: request.target,
                               memeUrl: 'cats.jpg'});
});
*/
   
   $.ajax(
      {type: "POST",
       url: 'https://slacky-server.herokuapp.com/api/meme',
       data: {text: request.memeRequest},
       success: function(response) {
          console.log('meme returned!');
          sendResponse({event: 'memeGenerated',
                               target: request.target,
                               memeUrl: response});
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
              console.log('Unknown event: ' + request.event);
        }
        
        return true;
    });
  console.log('background page loaded');
}

init();
