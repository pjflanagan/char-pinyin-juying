
function loadCSV() {
    $.ajax({
        type: "GET",
        url: "data.txt",
        dataType: "text",
        success: function(data) {processData(data);}
     });
}

function focusInput() {
  
}

(function() {
  const displayCharacter = $('#display-characters');
})();

$(document).ready(function() {
});