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