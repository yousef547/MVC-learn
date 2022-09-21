
saveForm = function () {
    var isFormValid = $("#categoriesForm").valid();
    if (isFormValid) {
        showLoader();
        $("#categoriesForm").submit();
    }
}

departmentChanged = function (parentId) {
    var departmentId = $("#DepartmentId").val();
    var isService = $("#IsService").is(":checked");
    if (departmentId) {
        showLoader();
        $.ajax({
            url: "/ProductCategories/GetParentsByDepartmentId/" + departmentId + "?isService=" + isService,
            success: function (data) {
                $("#departmentCategories").html(data);
                $("#ParentId").val(parentId);
            },
            complete: function () {
                hideLoader();
            }
        })
    }
}