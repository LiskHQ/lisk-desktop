// istanbul ignore file

/**
 * Set the selection on an input
 * @param {Node} input - Ref
 * @param {Int} start - Starting index
 * @param {Int} end - Ending index
 */
export function setInputSelection(input, start, end) {
  if ('selectionStart' in input && 'selectionEnd' in input) {
    input.selectionStart = start;
    input.selectionEnd = end;
  } else {
    const range = input.createTextRange();
    range.collapse(true);
    range.moveStart('character', start);
    range.moveEnd('character', end - start);
    range.select();
  }
}

/**
 * Returns the selection range of an input
 * @param {Node} input - Ref
 */
export function getInputSelection(input) {
  let start = 0;
  let end = 0;

  if ('selectionStart' in input && 'selectionEnd' in input) {
    start = input.selectionStart;
    end = input.selectionEnd;
  } else {
    const range = document.selection.createRange();
    if (range.parentElement() === input) {
      start = -range.moveStart('character', -input.value.length);
      end = -range.moveEnd('character', -input.value.length);
    }
  }

  return {
    start,
    end,
    length: end - start,
  };
}
