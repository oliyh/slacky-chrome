memePattern = new RegExp('\/meme', 'i');
target = null;

function addToCarousel(memeUrl) {
   addSlide($('<li/>').append($('<img>', {src: memeUrl})));
}

function replaceFirstInCarousel(memeUrl) {
   replaceSlide(0, $('<li/>').append($('<img>', {src: memeUrl})));
}

function onMemeGenerated(response) {
  $('#memeHistory').show();
  $('#meme-url').val(response.memeUrl);
  replaceFirstInCarousel(response.memeUrl);
}

function onBadMemeRequest(response) {
  removeSlide(0);
  $('#error').html(response.helpText.replace(/\n/g, '<br/>'));
  $('#error-container').show();
}

function onMemeGenerationFailed(response) {
  removeSlide(0);
  $('#error').html(response.errorMsg.replace(/\n/g, '<br/>'));
  $('#error-container').show();
}

function initSlackyPanel() {
  initialiseVss();

   $('#meme-input')
      .val('')
      .keyup(function(event) {
         if (event.which == 13) {
            console.log('meme pattern completed');
            $('#error-container').hide();
            addToCarousel('loading.gif');
            $('#memeHistory').show();

            chrome.runtime.sendMessage({event: 'memeRequest',
                                        target: (target == null ? null : target),
                                        memeRequest: $(this).val()},
                                        function(response) {
                                                  switch(response.event) {
                                                    case 'memeGenerated':
                                                        onMemeGenerated(response);
                                                        break;

                                                    case 'badMemeRequest':
                                                        onBadMemeRequest(response);
                                                        break;

                                                    case 'memeGenerationFailed':
                                                        onMemeGenerationFailed(response);
                                                        break;
                                                  }
                                        });
         }
      });

  $('#copy-meme-url').click(function (e) {
    $(document).one('copy', function(event) {
      event.originalEvent.clipboardData.setData('text', $('#meme-url').val());
      event.preventDefault();
    });
    var success = document.execCommand('copy', false, null);
  });

  $('#copy-meme-data').click(function (e) {
    $(document).one('copy', function(event) {
      event.originalEvent.clipboardData.setData('text/html', '<img src="' + $('#meme-url').val() + '"/>');
      event.preventDefault();
    });
    var success = document.execCommand('copy', false, null);
    console.log(success ? 'image copied' : 'could not copy image');
  });

  $('#hide-error').click(function(e) {
    $('#error-container').hide();
  });
}

function initMemeHistory(memeHistory) {
  console.log('Populating history with ' + memeHistory + ' entries');
  $('#slides').empty();
  $('#indicator').empty();
  $(memeHistory).each(function (i, result) {
     addToCarousel(result.url);
  });
  if (memeHistory.length > 0) {
     $('#memeHistory').show();
  }
}

function populateMemeHistory() {
  chrome.runtime.sendMessage({event: 'populateMemeHistory'},
                             function(response) {
                                initMemeHistory(response.memeHistory);
                             });
}

function init() {
   console.log("Initialising Slacky panel");
   initSlackyPanel();
   populateMemeHistory();
}

jQuery(document).ready(init);
