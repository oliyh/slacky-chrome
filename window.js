memePattern = new RegExp('\/meme$', 'i');

function attachDomEventListeners() {
   $('textarea, input').keyup(function(event) {
      var userText = $(event.target).val();
      var textJustTyped = userText.substring(0, doGetCaretPosition(event.target));
      if (memePattern.test(textJustTyped)) {
        console.log("Emitting memeDetected event");
         //self.port.emit('memeDetected', $(event.target).attr('id'));
      }
   });
}

function attachSlackyEventListeners() {
   //self.port.on('memeGenerated', function(target, memeUrl) {
   //   var target = $('#' + target);
   //   target.val(target.val().replace(memePattern, memeUrl));
   //});
}

function init() {
   console.log("Hello world, slacky is here!");
   attachDomEventListeners();
   attachSlackyEventListeners();
}

init();