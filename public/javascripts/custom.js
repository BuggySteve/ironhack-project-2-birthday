
$(document).ready(function (e) {

  addEventListenerToSelectGuests();

})

function addEventListenerToSelectGuests() {
  //Move elements within guest-select on "edit party" page
  $(".invited-option").click(function (e) {
    let $this = $(this);
    $this.attr("class", "uninvited-option")
    $("#uninvited-selector").append($this);
    addEventListenerToSelectGuests();
  });

  $(".uninvited-option").click(function (e) {
    let $this = $(this);
    $this.attr("class", "invited-option")
    $("#invited-selector").append($this);
    addEventListenerToSelectGuests();
  });
};