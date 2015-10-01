memePattern = new RegExp('\/meme', 'i');
target = null;

function showSlackyPopover(target) {
   this.target = target;

   $('#meme').attr('src', chrome.extension.getURL('loading.gif')).hide();
   $('#meme-input').val('');
   $('#error').text('').hide();
   $('#slacky-popover').show();
   $('#meme-input').focus();
}

function hideSlackyPopover() {
   $('#slacky-popover').hide();
   target.focus();
}

function attachDomEventListeners() {
   $('textarea, input').keyup(function(event) {
      var userText = $(event.target).val();
      var textJustTyped = userText.substring(0, doGetCaretPosition(event.target));
      if (memePattern.test(textJustTyped)) {

        showSlackyPopover($(event.target));

        console.log("Emitting memeDetected event");
        chrome.runtime.sendMessage({event: 'memeDetected',
                                    target: $(event.target).attr('id')});
      }
   });
}

function onMemeGenerated(response) {
   console.log('meme response recieved');
   $('#meme').attr('src', response.memeUrl).show();
   var target = $('#' + response.target);
   target.val(target.val().replace(memePattern, response.memeUrl));
}
   
function onBadMemeRequest(response) {
   $('#meme').hide();
   $('#error')
    .html(response.helpText.replace(/\n/g, '<br/>'))
    .show();
}

function onMemeGenerationFailed(response) {
   $('#meme').hide();
   $('#error')
    .html(response.errorMsg.replace(/\n/g, '<br/>'))
    .show();
}

function initSlackyPanel() {
   $('#meme-input')
      .val('')
      .keyup(function(event) {
         if (event.which == 13) {
            console.log('meme pattern completed');
            $('#error').text('').hide();
            $('#meme').attr('src', chrome.extension.getURL('loading.gif')).show();

            chrome.runtime.sendMessage({event: 'memeRequest',
                                        target: target.attr('id'),
                                        memeRequest: $(this).val()});
         } else if (event.which == 27) {
            console.log('user pressed esc');
            hideSlackyPopover();
         }
      });
}

function attachSlackyPanel() {
  chrome.runtime.sendMessage({event: 'requestPanelContent'},
                             function(response) {
                                var body = response.body;
                                $(document.body).append(body);
                                initSlackyPanel();
                             });
}

function registerMemeEventListeners() {
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        switch(request.event) {
          case 'memeGenerated':
              onMemeGenerated(request);
              break;
              
          case 'badMemeRequest':
              onBadMemeRequest(request);
              break;
              
          case 'memeGenerationFailed':
              onMemeGenerationFailed(request);
              break;

          default:
              console.log('Unknown event: ' + request + sender);
        }
    });
}

function init() {
   console.log("Hello world, slacky is here!");
   attachDomEventListeners();
   attachSlackyPanel();
   registerMemeEventListeners();
}

init();
