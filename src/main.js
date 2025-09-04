
let DICTIONARY;

function loadCSV() {
  $.ajax({
    type: "GET",
    url: "data/dictionary.txt",
    dataType: "text",
    success: function (data) {
      console.log(data);
      DICTIONARY = data;
    }
  });
}

function focusInput() {

}

function onChange() {
  console.log()
}

function onKeyDown() {

}

function getSelection() {
  var inputField = $('#myInput')[0]; // Get the DOM element from the jQuery object

  if (inputField) {
    var start = inputField.selectionStart;
    var end = inputField.selectionEnd;
    var selectedText = inputField.value.substring(start, end);

    console.log("Selected Text:", selectedText);
  }
}

(function () {
  loadCSV();
  const displayCharacter = $('#display-characters');
})();

