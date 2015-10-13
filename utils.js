/*
** Returns the caret (cursor) position of the specified text field.
** Return value range is 0-oField.value.length.
** Taken from http://stackoverflow.com/questions/2897155/get-cursor-position-in-characters-within-a-text-input-field
*/
function doGetCaretPosition (oField) {
   var iCaretPos = 0;

   if (oField.selectionStart || oField.selectionStart == '0') {
      iCaretPos = oField.selectionStart;
   }
   return (iCaretPos);
}

function getRandomToken() {
    // E.g. 8 * 32 = 256 bits token
    var randomPool = new Uint8Array(32);
    crypto.getRandomValues(randomPool);
    var hex = '';
    for (var i = 0; i < randomPool.length; ++i) {
        hex += randomPool[i].toString(16);
    }
    // E.g. db18458e2782b2b77e36769c569e263a53885a9944dd0a861e5064eac16f1a
    return hex;
}