
$(document).ready(function (e) {

  addEventListenerToSelectGuests();

  //Party date default value is today
  $('#start-date').val(new Date().toDateInputValue());
  $('#end-date').val(new Date().toDateInputValue());
  $('#start-time').val("00:00");

  //Party cannot be created before today
  $('#start-date').attr("min", new Date().toDateInputValue());

  setEndDateDefault();
  setEndTimeDefault();

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

Date.prototype.toDateInputValue = (function () {
  var local = new Date(this);
  local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
  return local.toJSON().slice(0, 10);
});

//End date default val is set after start date input
function setEndDateDefault() {
  $("#start-date").on("input", () => {
    let startDateVal = $("#start-date").val();
    $("#end-date").val(startDateVal);
    $('#end-date').attr("min", startDateVal);
  });
};
