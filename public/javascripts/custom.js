
$(document).ready(function (e) {

  addEventListenerToSelectGuests();

  //Party date default value is today
  $("#start-date").val(new Date().toDateInputValue());
  $("#end-date").val(new Date().toDateInputValue());
  $("#start-time").val("00:00");

  //Party cannot be created before today
  $("#start-date").attr("min", new Date().toDateInputValue());
  setEndDateDefault();

  //Show actual date on user dashboard
  $("#actual-date").html(new Date().toDateInputValue());

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


// $("form").submit(function (e) {
//   e.preventDefault();

//   $.ajax({
//     method: "post",
//     url: "/login",
//     data: { username: $(this).find("input").value() }
//   }).done(function (successResult) {
//     console.log(successResult);
//     // window.location.href = "/profile"
//   }).fail(function (err) {
//     console.log(err);
//     $(".error").html(err.responseText).show()
//   })

// })

$("#sign-in-form").submit((e) => {


  e.preventDefault();
  var formData = {
    username: $("input[name='username']").val(),
    password: $("input[name='password']").val()
  }
  $.ajax({
    type: "POST",
    url: "/user/sign-in",
    data: formData,
  })
    .done((succes) => {
      window.location = "/user/dashboard"
    }).fail((err) => {
      $("#error-message").show().delay(3000).fadeOut();
    })
})