memePattern = new RegExp('\/meme$', 'i');
target = null;

function showSlackyPopover(target) {
   this.target = target;

   $('#meme').attr('src', 'loading.gif').hide();
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
                                    target: $(event.target).attr('id')},
                                    function(response) {
                                      var target = $('#' + response.target);
                                      target.val(target.val().replace(memePattern, response.memeUrl));
                                    });
      }
   });
}

function initSlackyPanel() {
   $('#meme-input')
      .val('')
      .keyup(function(event) {
         if (event.which == 13) {
            console.log('meme pattern completed');
            $('#error').text('').hide();
            $('#meme').attr('src', 'loading.gif').show();

            chrome.runtime.sendMessage({event: 'memeRequest',
                                        target: target,
                                        memeRequest: $(this).val()},
                                        function(response) {
                                          console.log(response);
                                        });
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

function init() {
   console.log("Hello world, slacky is here!");
   attachDomEventListeners();
   attachSlackyPanel();
}

init();
