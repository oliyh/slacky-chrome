memePattern = new RegExp('\/meme', 'i');
target = null;

function addToCarousel(memeUrl) {
   addSlide($('<li/>').append($('<img>', {src: memeUrl})));
}

function replaceFirstInCarousel(memeUrl) {
   replaceSlide(0, $('<li/>').append($('<img>', {src: memeUrl})));
}

function showSlackyPopover(target) {
  this.target = target;

  if ($('#slides li').length > 0) {
     $('#memeHistory').show();
  } else {
     $('#memeHistory').hide();
  }
  $('#error-container').hide();
  $('#meme-input').val('').focus();
  $('#slacky-popover').show();
}

function hideSlackyPopover() {
   $('#slacky-popover').hide();
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
  $('#memeHistory').show();
  $('#meme-url').val(response.memeUrl);
  replaceFirstInCarousel(response.memeUrl);
  if (target != null) {
    var target = $('#' + response.target);
    target.val(target.val().replace(memePattern, response.memeUrl));
  }
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

function onSlackyPanelInvoked(response) {
  if ($('#slacky-popover').is(":visible")) {
    hideSlackyPopover();
  } else {
    showSlackyPopover(null);
  }
}

function initSlackyPanel() {
  initialiseVss();
  
   $('#meme-input')
      .val('')
      .keyup(function(event) {
         if (event.which == 13) {
            console.log('meme pattern completed');
            $('#error-container').hide();
            addToCarousel(chrome.extension.getURL('loading.gif'));
            $('#memeHistory').show();

            chrome.runtime.sendMessage({event: 'memeRequest',
                                        target: (target == null ? null : target.attr('id')),
                                        memeRequest: $(this).val()});
         } else if (event.which == 27) {
            console.log('user pressed esc');
            hideSlackyPopover();
            target.focus();
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
  
  // hide slacky popover when click elsewhere
  $('html').click(function() {
    hideSlackyPopover();
  });
  
  // stop clicks inside slacky popover from hiding it
  $('#slacky-popover').click(function(e) {
    e.stopPropagation();
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

function attachSlackyPanel() {
  chrome.runtime.sendMessage({event: 'requestPanelContent'},
                             function(response) {
                                var body = response.body;
                                $(document.body).append(body);
                                initSlackyPanel();
                                initMemeHistory(response.memeHistory);
                                   showSlackyPopover(null);
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

          case 'slackyPanelInvoked':
            onSlackyPanelInvoked(request);
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
