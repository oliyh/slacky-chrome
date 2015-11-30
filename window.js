memePattern = new RegExp('\/meme', 'i');

function attachDomEventListeners() {
   $('textarea, input').keyup(function(event) {
      var userText = $(event.target).val();
      var textJustTyped = userText.substring(0, doGetCaretPosition(event.target));
      if (memePattern.test(textJustTyped)) {

        console.log("Emitting memeDetected event");
        chrome.runtime.sendMessage({event: 'memeDetected',
                                    target: $(event.target).attr('id')});
      }
   });

   $('div[contenteditable]').keyup(function(event) {
      console.log('key pressed');
      var userText = event.target.textContent;
      if (memePattern.test(userText)) {
        console.log("Emitting memeDetected event for" + $(event.target).attr('id'));
        chrome.runtime.sendMessage({event: 'memeDetected',
                                    target: $(event.target).attr('id')});
      }
   });
}

function onMemeGenerated(response) {
  if (response.target != null) {
    var target = $('#' + response.target);
    if (target.attr('contenteditable')) {
         console.log('inserting image');
         target.append($('<img/>', {src: response.memeUrl}));
    } else {
       target.val(target.val().replace(memePattern, response.memeUrl));
    }
  }
}

function registerExtensionEventListeners() {
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        switch(request.event) {
          case 'memeGenerated':
              onMemeGenerated(request);
              break;

          default:
              console.log('Unknown event: ' + request + sender);
        }
    });
}

function init() {
   console.log("Initialising Slacky window listeners");
   attachDomEventListeners();
   registerExtensionEventListeners();
}

init();