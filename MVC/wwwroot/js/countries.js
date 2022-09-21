
saveForm = function () {
    var isFormValid = $("#countriesForm").valid();
    if (isFormValid) {
        showLoader();
        $("#countriesForm").submit();
    }
}