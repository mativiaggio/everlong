$("#slug").on("input", function () {
  $(this).val(function (index, value) {
    return value.replace(/\s+/g, "-");
  });
});
