target = null;

function initPanel() {
   $('#meme-input')
      .val('')
      .keyup(function(event) {
         if (event.which == 13) {
            console.log('meme pattern completed');
            $('#error').text('').hide();
            $('#meme').attr('src', 'loading.gif').show();
            
            chrome.runtime.sendMessage({event: 'memeRequest',
                                        target: target,
                                        memeRequest: $(this).val()}, function(response) {
              console.log(response);
            });
         }
      });
/*
   self.port.on('panelOpened', function(t) {
      target = t;
      $('#meme').attr('src', 'loading.gif').hide();
      $('#error').text('').hide();
      $('#meme-input').val('').focus();
   });

   self.port.on('memeGenerated', function(memeUrl) {
      $('#meme').attr('src', memeUrl).show();
   });

   self.port.on('badMemeRequest', function(helpText) {
      $('#meme').hide();
      $('#error')
         .html(helpText.replace(/\n/g, '<br/>'))
         .show();
   });

   self.port.on('memeGenerationFailed', function(error) {
      $('#meme').hide();
      $('#error')
         .html(error.replace(/\n/g, '<br/>'))
         .show();
   });
*/
}