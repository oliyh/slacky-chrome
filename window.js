memePattern = new RegExp('\/meme$', 'i');

function attachDomEventListeners() {
   $('textarea, input').keyup(function(event) {
      var userText = $(event.target).val();
      var textJustTyped = userText.substring(0, doGetCaretPosition(event.target));
      if (memePattern.test(textJustTyped)) {
        console.log("Emitting memeDetected event");
        chrome.runtime.sendMessage({target: $(event.target).attr('id')}, function(response) {
          var target = $('#' + response.target);
          target.val(target.val().replace(memePattern, response.memeUrl));
        });
      }
   });
}

function init() {
   console.log("Hello world, slacky is here!");
   attachDomEventListeners();
}

init();