
saveForm = function () {
    var isFormValid = $("#productForm").valid();
    if (isFormValid) {
        showLoader();
        $("#productForm").submit();
    }
}

departmentChanged = function (categoryId) {
    var departmentId = $("#DepartmentId").val();
    var isService = $("#IsService").is(":checked");
    if (departmentId) {
        showLoader();
        $.ajax({
            url: "/Products/GetCategoriesByDepartmentId/" + departmentId + "?isService=" + isService,
            success: function (data) {
                $("#departmentCategories").html(data);
                $("#CategoryId").val(categoryId);
            },
            complete: function () {
                hideLoader();
            }
        })
    }
}