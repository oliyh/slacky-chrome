function currentIndex() {
   return $('#slides li.active').index() || 0;
}

function toggleControls() {
   if (currentIndex() < 1) {
      $('a.control_prev').hide();
   } else {
      $('a.control_prev').show();
   }

   if (currentIndex() == (slideCount() - 1)) {
      $('a.control_next').hide();
   } else {
      $('a.control_next').show();
   }
}

function slideCount() {
   return $('#slides li').length;
}

function resizeToFit() {
   var slideWidth = $('#slider').width();
   var slideHeight = $('#slides li').height();
   var sliderUlWidth = slideCount() * slideWidth;

   $('#slider').css({width: slideWidth, height: slideHeight});
   $('#slides').css({width: sliderUlWidth, height: slideHeight});
   $('#slides li').css({width: slideWidth});
}

function initialiseVss() {
  for (i = 0; i < slideCount(); i++) {
    $('#indicator').append($('<li/>'));
  }

  function moveLeft() {
    slideTo(currentIndex() - 1);
  }

  function moveRight() {
    slideTo(currentIndex() + 1);
  };

  $('#indicator li:first-child').addClass('active');
  $('#slides li:first-child').addClass('active');
  $('a.control_prev').click(moveLeft);
  $('a.control_next').click(moveRight);
  resizeToFit();
  toggleControls();
}

jQuery(document).ready(initialiseVss);

function slideTo(index) {
   var slideWidth = $('#slides li').width();
   $('#slides').animate({
      left: (-1 * slideWidth * index)
   }, 200, function() {
      $('#slides li.active, #indicator li.active').removeClass('active');
      $($('#slides li')[index]).addClass('active');
      $($('#indicator li')[index]).addClass('active');
      $('#meme-url').val($('#slides li.active img').attr('src'));
      toggleControls();
   });
}

function addSlide(slide) {
   $(slide).prependTo('#slides');
   $('#indicator').prepend($('<li/>'));

   if (slideCount() > 10) {
      $($('#slides li')[10]).remove();
      $($('#indicator li')[10]).remove();
   }

   resizeToFit();
   slideTo(0);
}

function replaceSlide(index, slide) {
   $($('#slides li')[index]).replaceWith($(slide));
   slideTo(index);
}

function removeSlide(index) {
   $($('#slides li')[index]).remove();
   $($('#indicator li')[index]).remove();
   slideTo(0);
}
