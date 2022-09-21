deleteConfirmationTreasuries = function () {
    $(".treasuries-confirm-delete").confirmation({
        rootSelector: '[data-toggle=confirmation]',
        popout: true,
        singleton: true,
        title: DELETE,
        btnOkLabel: YES,
        btnCancelLabel: NO,
        onConfirm: function () {
            switch ($(this).data('source')) {
                case "archiveTreasuries":
                    deleteTreasury($(this).data('itemid'));
                    break;
            
            }
        }
    })
}
typeChanged = function () {
    let typeValue = $("input[name='Type']:checked").val()

    if (typeValue == '0') {
        $(".type-bank").removeClass("d-none");
        $(".type-cash").addClass("d-none");
    } else {
        $(".type-bank").addClass("d-none");
        $(".type-cash").removeClass("d-none");
    }
}

getTreasuries = function () {
    let departmentId = $("#incomeDepartmentId").val();

    showLoader()
    $.get(`/Treasuries/GetTreasuries/?departmentId=${departmentId}`, function (data) {
        $(`#trasuries`).html(data);
        deleteConfirmationTreasuries();
        hideLoader()
    })
}


deleteTreasury = function (id) {
    showLoader()
    $.get(`/Treasuries/Archive/${id}`, function (data) {
        if (data) {
            getTreasuries();
        }
    })
}

departmentChanged = function (bankId = null) {
    let departmentId = $("#DepartmentId").val();

    if (departmentId) {
        showLoader();
        $.ajax({
            url: `/Treasuries/GetBanksByDepartmentId?departmentId=${departmentId}`,
            success: function (data) {
                $("#banksPartial").html(data);
                if (bankId) {
                    $("#DepartmentBankId").val(bankId);
                }
                bankChanged();
            },
            complete: function () {
                hideLoader();
            }
        })
    } else {
        $("#DepartmentBankId option:not(:first)").remove();
        bankChanged();
    }
}

bankChanged = function () {
    let bankId = $("#DepartmentBankId").val();

    if (bankId) {
        showLoader();
        $.ajax({
            url: `/Treasuries/GetCurrenciesByDepartmentBankId?departmentBankId=${bankId}`,
            success: function (data) {
                $("#currenciesPartial").html(data);
            },
            complete: function () {
                hideLoader();
            }
        })
    } else {
        $("#DepartmentBankCurrencyId option:not(:first)").remove();
    }
}

saveForm = function () {
    let isValid = $("#treasuryForm").valid();

    if (isValid) {
        $("#treasuryForm").submit();
    }
}

editForm = function () {
        let isValid = $("#treasuryFormEdit").valid();
        if (isValid) {
            $("#treasuryFormEdit").submit();
        }
}