memePattern = new RegExp('\/meme$', 'i');

function attachDomEventListeners() {
   $('textarea, input').keyup(function(event) {
      var userText = $(event.target).val();
      var textJustTyped = userText.substring(0, doGetCaretPosition(event.target));
      if (memePattern.test(textJustTyped)) {
        
        console.log("Emitting memeDetected event");
        chrome.runtime.sendMessage({type: 'memeDetected', 
                                    target: $(event.target).attr('id')}, 
                                    function(response) {
                                      var target = $('#' + response.target);
                                      target.val(target.val().replace(memePattern, response.memeUrl));
                                    });
      }
   });
}

function attachSlackyPanel() {
  chrome.runtime.sendMessage({type: 'requestPanelContent'}, 
                             function(response) {
                                var body = response.body;
                                $(document.body).append(body);
                             });
}

function init() {
   console.log("Hello world, slacky is here!");
   attachDomEventListeners();
   attachSlackyPanel();
}

init();