
saveForm = function () {
    var isFormValid = $("#userForm").valid();
    if (isFormValid) {
        showLoader();
        $("#userForm").submit();
    }
}

saveUserRoles = function () {
    $("#userRolesForm").submit();
}

saveUserDepartments = function () {
    var isFormValid = $("#userDepartmentsForm").valid();
    if (isFormValid) {
        showLoader();
        $("#userDepartmentsForm").submit();
    }
}




//strart Users
deleteConfirmationUsers = function () {
    $(".users-confirm-delete").confirmation({
        rootSelector: '[data-toggle=confirmation]',
        popout: true,
        singleton: true,
        title: DELETE,
        btnOkLabel: YES,
        btnCancelLabel: NO,
        onConfirm: function () {
            switch ($(this).data('source')) {
                case "archiveUsers":
                    removeUsers($(this).data('itemid'));
                    break;
                case "unArchiveUsers":
                    unRemoveUsers($(this).data('itemid'));
                    break;
            }
        }
    })
}




getUsers = function () {
    showLoader();
    $.get(`/Users/GetUsers`, function (data, status) {
        $("#getUsers").html(data);
        handleDataTable({
            selector: ".tables-user-home",
            stateLoadCallback: stateLoadParams
        });
        deleteConfirmationUsers();
        hideLoader();
        showLoaderFromAjax()
    })
}

removeUsers = function (id) {
    showLoader();
    $.get(`/Users/Archive/${id}`, function (data, status) {
        getUsers();
    })
}

unRemoveUsers = function (id) {
    showLoader();
    $.get(`/Users/Unarchive/${id}`, function (data, status) {
        getUsers();
    })
}

//end Users