
$(document).ready(function () {
    getDepartments();

})

getDepartments = function () {
    showLoader();
    $.ajax({
        url: "/CompanyProfile/ShowDepartments",
        success: function (data) {
            $("#getAllDepartment").html(data);
            deleteConfirmationDepartment();
        },
        complete: function () {
            hideLoader();
        }
    })
}

editDepartment = function (id) {
    showLoader();
    $.get(`/CompanyProfile/EditDepartment/${id}`, function (data, status) {
        $("#displyEditDepartment").html(data);

        changeImgSrc('#editDepartmentImage', '#editDepartmentImage-img-src');

        $('#color-picker-edit').spectrum({
            type: "component",
            togglePaletteOnly: true,
            showInput: true,
            showInitial: true,
            allowEmpty: false
        });

        $("#editManagingDirectorId").selectpicker();
        $("#editSalesDirectorId").selectpicker();

        $(`#EditDepartment`).modal('show');

        hideLoader();
    })
}


favourite = function (itemId) {
    showLoader();
    $.ajax({
        url: '/CompanyProfile/ToggleFavourite?itemId=' + itemId,
        method: "POST",
        success: function (result) {
            changeFavouriteIcon(result, itemId);
            refreshFavouriteComponent(false);
            getDepartments()
        },
        complete: function () {
            hideLoader();
        }
    })
}

function createDepartment() {
    let form = $("#createDepartmentForm");
    let formData = new FormData(form[0]);
    if ($("input[name='ImageFile']").val() == "") {
        toastr.error(RequiredImage)
        return;
    }
    if (form.valid()) {
        showLoader();
        $.ajax({
            url: "/CompanyProfile/CreateDepartment",
            data: formData,
            method: "POST",
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            success: function (data) {
                clearData("#createDepartmentForm");
                getDepartments();
                $(`#CreateDepartment`).modal('hide');
            },
            complete: function () {
            }
        })
    }

}

clearBankForm = function () {
    $("#BranchId").val("").trigger("change");
    $("#BankId").val("").trigger("change");
    $("#bankcurrencies").load("/Suppliers/ClearCurrencies");
    $("#SupplierBankId").val("");
}

editBeneficiaryDetails = function () {
    $("#BeneficiaryName").val($("#BeneficiaryNameView").text().trim());
    $("#BeneficiaryAddress").val($("#BeneficiaryAddressView").text().trim());

    $("#bankviewmode").addClass("d-none");
    $("#bankeditmode").removeClass("d-none");
}

cancelBeneficiaryDetails = function () {
    $("#bankviewmode").removeClass("d-none");
    $("#bankeditmode").addClass("d-none");

    $("#BeneficiaryName").val("");
    $("#BeneficiaryAddress").val("");
}

showAddBankform = function () {
    $('.hidden-table-bank').fadeIn(1000);
    $("#btnAddBank").fadeOut(100);
    $("#btnAdd").removeClass("d-none");
    $("#btnUpdate").addClass("d-none");
    clearBankForm();
}

branchChanged = function () {
    let branchId = $("#BranchId").val();
    if (branchId) {
        showLoader();
        $.ajax({
            url: "/CompanyProfile/GetBranchDetails?branchId=" + branchId,
            success: function (data) {
                $("#BranchAddress").val(data.Address);
                $("#SwiftCode").val(data.SwiftCode);
            },
            complete: function () {
                hideLoader();
            }
        })
    } else {
        $("#BranchAddress").val("");
        $("#SwiftCode").val("");
    }
}

bankChanged = function (branchId) {
    let bankId = $("#BankId").val();
    if (bankId) {
        showLoader();
        $("#bankBranches").load("/CompanyProfile/GetBankBranches?bankId=" + bankId, function () {
            if (branchId) {
                $("#BranchId").val(branchId).trigger("change");
            }
            hideLoader();
        });
    } else {
        $("#BranchId option").slice(1).remove();
    }
}

cancelAddBankForm = function () {
    $('.hidden-table-bank').fadeOut(100);
    $("#btnAddBank").fadeIn(1000);
}

addCurrency = function () {
    let model = {};
    model.Currencies = [];

    $("#bankcurrencies .rowcurrency").each(function () {
        let currency = {};
        currency.CurrencyId = $(this).find(".currencyid").val();
        currency.AccountNo = $(this).find(".accountno").val();
        currency.IBAN = $(this).find(".iban").val();
        model.Currencies.push(currency);
    })

    showLoader();
    $.ajax({
        url: "/CompanyProfile/AddCurrency",
        method: "POST",
        data: model,
        success: function (data) {
            $("#bankcurrencies").html(data);
        },
        complete: function () {
            hideLoader();
        }
    })
}

saveBeneficiaryDetails = function () {
    let name = $("#BeneficiaryName").val();
    let address = $("#BeneficiaryAddress").val();
    if (name != "" && address != "") {
        let model = {};
        model.Id = $("#Id").val();
        model.BeneficiaryName = name;
        model.BeneficiaryAddress = address;

        showLoader();
        $.ajax({
            url: "/CompanyProfile/UpdateBeneficiaryInfo",
            method: "POST",
            data: model,
            success: function (result) {
                $("#BeneficiaryNameView").text(name);
                $("#BeneficiaryAddressView").text(address);

                cancelBeneficiaryDetails();
            },
            complete: function () {
                hideLoader();
            }
        })
    } else {
        toastr.error(ERROR_INVALID_DATA);
    }
}

departmentBankCurrencyChanged = function (supplierBankId) {
    let departmentBankCurrencyId = $("#currency_" + supplierBankId).val();

    if (departmentBankCurrencyId != "") {
        showLoader();
        $.ajax({
            url: "/CompanyProfile/GetBankCurrencyDetails?currencyId=" + departmentBankCurrencyId,
            success: function (data) {
                $("#accountno_" + supplierBankId).text(data.AccountNo);
                $("#iban_" + supplierBankId).text(data.IBAN);
            },
            complete: function () {
                hideLoader();
            }
        })
    }
}

addDepartmentBank = function () {
    let departmentId = $("#Id").val();
    let branchId = $("#BranchId").val();

    let isValid = true;
    if (branchId == "") {
        isValid = false;
    }

    let model = {};
    model.DepartmentId = departmentId;
    model.BranchId = branchId;

    model.CurrencyVMs = [];
    $("#bankcurrencies .rowcurrency").each(function () {
        let currency = {};
        let currencyId = $(this).find(".currencyid").val();
        let accountNo = $(this).find(".accountno").val();
        let IBAN = $(this).find(".iban").val();

        if (currencyId == "" || accountNo == "" || IBAN == "") {
            isValid = false;
        }

        currency.CurrencyId = currencyId;
        currency.AccountNo = accountNo;
        currency.IBAN = IBAN;
        model.CurrencyVMs.push(currency);
    })

    if (!isValid) {
        toastr.error(ERROR_INVALID_DATA);
        return;
    }

    showLoader();
    $.ajax({
        url: "/CompanyProfile/AddBank",
        method: "POST",
        data: model,
        success: function (data) {
            $("#DepartmentBanks").html(data);
            clearBankForm();
            cancelAddBankForm();
        },
        complete: function () {
            hideLoader();
        }
    })
}

updateDepartmentBank = function () {
    let departmentId = $("#Id").val();
    let branchId = $("#BranchId").val();
    let departmentBankId = $("#departmentBankId").val();

    let isValid = true;
    if (branchId == "") {
        isValid = false;
    }

    let model = {};
    model.DepartmentId = departmentId;
    model.BranchId = branchId;
    model.Id = departmentBankId;

    model.CurrencyVMs = [];
    $("#bankcurrencies .rowcurrency").each(function () {
        let currency = {};
        let currencyId = $(this).find(".currencyid").val();
        let accountNo = $(this).find(".accountno").val();
        let IBAN = $(this).find(".iban").val();

        if (currencyId == "" || accountNo == "" || IBAN == "") {
            isValid = false;
        }

        currency.CurrencyId = currencyId;
        currency.AccountNo = accountNo;
        currency.IBAN = IBAN;
        model.CurrencyVMs.push(currency);
    })

    if (!isValid) {
        toastr.error(ERROR_INVALID_DATA);
        return;
    }

    showLoader();
    $.ajax({
        url: "/CompanyProfile/UpdateBank",
        method: "POST",
        data: model,
        success: function (data) {
            $("#DepartmentBanks").html(data);
            clearBankForm();
            cancelAddBankForm();
        },
        complete: function () {
            hideLoader();
        }
    })
}

editDepartmentBank = function (departmentBankId) {
    showLoader();
    $('.hidden-table-bank').fadeIn(1000);
    $("#btnAddBank").fadeOut(100);
    $("#btnAdd").addClass("d-none");
    $("#btnUpdate").removeClass("d-none");

    $.ajax({
        url: "/CompanyProfile/EditBank?bankId=" + departmentBankId,
        success: function (data) {
            $("#departmentBankId").val(data.Id);
            $("#BankId").val(data.BankId);
            bankChanged(data.BranchId);
            $("#bankcurrencies").load("/CompanyProfile/GetBankCurrencies?bankId=" + departmentBankId);
        },
        complete: function () {
            hideLoader();
        }
    })

}

deleteDepartmentBank = function (departmentBankId) {
    let departmentId = $("#Id").val();

    showLoader();
    $.ajax({
        url: "/CompanyProfile/DeleteBank/" + departmentId + "?bankId=" + departmentBankId,
        success: function (data) {
            $("#DepartmentBanks").html(data);
        },
        complete: function () {
            hideLoader();
        }
    })
}

changeImgSrc('#createDepartmentImage', '#createDepartmentImage-img-src');

$(".depart-box").css("color", $(".depart-box").attr("backGround"));

deleteConfirmationDepartment = function () {
    $(".btn-confirm-delete_department").confirmation({
        rootSelector: '[data-toggle=confirmation]',
        // other options
        popout: true,
        singleton: true,
        title: DELETE,
        btnOkLabel: YES,
        btnCancelLabel: NO,
        onConfirm: function () {
            switch ($(this).data('source')) {
                case "archiveDepartment":
                    deleteDepartment($(this).data('itemid'))
                    break;
                case "unarchiveDepartment":
                    returnDepartment($(this).data('itemid'))
                    break;
                case "archiveDocument":
                    ArchiveDocument($(this).data('itemid'))
                    break;
                default:
                    break;
            }

        }
    })
}

deleteDepartment = function (Id) {
    showLoader();
    $.get(`/CompanyProfile/Archive/${Id}`, function (data, status) {
        getDepartments()
    })
}

returnDepartment = function (Id) {
    showLoader();
    $.get(`/CompanyProfile/Unarchive/${Id}`, function (data, status) {
        getDepartments()
    })
}

changeImgSrc('#ImageFile', '#img-src-upload');

$(".depart-box").css("color", $(".depart-box").attr("backGround"));


getAllDepartmentDocument = function (departmentId) {
    showLoader();
    $.get(`/CompanyProfile/GetDepartmentDocuments?departmentId=${departmentId}`, function (data) {
        $('#departmentDocuments').html(data);
        deleteConfirmationDepartment();
        hideLoader();
    })
}

showSectionEdit = function () {
    $("#table-document").addClass("d-none").siblings().removeClass("d-none");
}
hideSectionEdit = function () {
    $("#table-document-inputs").addClass("d-none").siblings().removeClass("d-none");
}

deleteCurrency = function (index) {
    let model = {};
    model.Currencies = [];

    $("#bankcurrencies .rowcurrency").each(function () {
        let currency = {};
        currency.CurrencyId = $(this).find(".currencyid").val();
        currency.AccountNo = $(this).find(".accountno").val();
        currency.IBAN = $(this).find(".iban").val();
        model.Currencies.push(currency);
    })

    showLoader();
    $.ajax({
        url: "/CompanyProfile/DeleteCurrency?index=" + index,
        method: "POST",
        data: model,
        success: function (data) {
            $("#bankcurrencies").html(data);
        },
        complete: function () {
            hideLoader();
        }
    })
}



//showDocumentInputs = function () {
//    $.get('/CompanyProfile/GetDepartmentDocumentsInputs', function (data) {
//        $("#addNewDocument").html(data);
//    });
//   }


addDocument = function () {
    let model = {};
    model.Documents = [];

    let form = $("#documentValue");
    let formData = new FormData(form[0]);


    showLoader();
    $.ajax({
        url: "/CompanyProfile/AddDocument",
        method: "POST",
        data: formData,
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        success: function (data) {
            $("#addNewDocument").html(data);
        },
        complete: function () {
            hideLoader();
        }
    })
}



deleteDocument = function (index) {
    let form = $("#documentValue");
    let formData = new FormData(form[0]);

    showLoader();
    $.ajax({
        url: `/CompanyProfile/DeleteDocument?index=${index}`,
        method: "POST",
        data: formData,
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        success: function (data) {
            $("#addNewDocument").html(data);
        },
        complete: function () {
            hideLoader();
        }
    })
}

saveDocuments = function () {
    var idDepartment = $("#departmentId").val();
    let form = $("#documentValue");
    let formData = new FormData(form[0]);
    if (form.valid()) {
        showLoader();
        $.ajax({
            url: `/CompanyProfile/SaveDocuments?departmentId=${idDepartment}`,
            data: formData,
            method: "POST",
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            success: function (data) {
                if (!data) {
                    toastr.error(RequiredImage)
                    return;
                } else {
                    getAllDepartmentDocument(idDepartment);
                    hideSectionEdit();
                }
            },
            complete: function () {
                hideLoader();

            }
        })
    }
}

ArchiveDocument = function (id) {
    var idDepartment = $("#departmentId").val();
    showLoader();
    $.get(`/CompanyProfile/ArchiveDocument/${id}`, function () {
        getAllDepartmentDocument(idDepartment);
    })
}
