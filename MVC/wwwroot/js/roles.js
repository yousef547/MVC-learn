
saveForm = function () {
    var isFormValid = $("#roleForm").valid();
    if (isFormValid) {
        showLoader();
        $("#roleForm").submit();
    }
}

savePermissions = function () {
    var isFormValid = $("#permissionsForm").valid();
    if (isFormValid) {
        showLoader();
        $("#permissionsForm").submit();
    }
}


//strart Roles
deleteConfirmationRoles = function () {
    $(".roles-confirm-delete").confirmation({
        rootSelector: '[data-toggle=confirmation]',
        popout: true,
        singleton: true,
        title: DELETE,
        btnOkLabel: YES,
        btnCancelLabel: NO,
        onConfirm: function () {
            switch ($(this).data('source')) {
                case "archiveRoles":
                    removeRoles($(this).data('itemid'));
                    break;
                case "unArchiveRoles":
                    unRemoveRoles($(this).data('itemid'));
                    break;
            }
        }
    })
}




getRoles = function () {
    showLoader();
    $.get(`/Roles/GetRoles`, function (data, status) {
        $("#getRoles").html(data);
        handleDataTable({
            selector: ".tables-roles",
            stateLoadCallback: stateLoadParams
        });
        deleteConfirmationRoles();
        hideLoader();
        showLoaderFromAjax()
    })
}

removeRoles = function (id) {
    showLoader();
    $.get(`/Roles/Archive/${id}`, function (data, status) {
        getRoles();
    })
}

unRemoveRoles = function (id) {
    showLoader();
    $.get(`/Roles/Unarchive/${id}`, function (data, status) {
        getRoles();
    })
}

//end Roles