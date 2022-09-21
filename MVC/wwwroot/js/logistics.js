
checkIsSubCompany = function () {
    var isSubCompany = $("#IsSubCompany").is(":checked");
    if (isSubCompany)
        $('.company-select').removeClass('d-none');
    else
        $('.company-select').addClass('d-none');
}

$('#IsSubCompany').click(function () {
    checkIsSubCompany();
})

clearCities = function () {
    $("#AddressVM_CityId option").not(":first").remove();
}

getCities = function (cityId) {
    var countryId = $("#addressCountry").val();

    clearCities();
    if (countryId != "") {
        showLoader();
        $.ajax({
            url: '/Logistics/GetCities',
            data: {
                countryId: countryId,
                cityId: cityId
            },
            success: function (data) {
                $("#addressCities").html(data);
                $('#AddressVM_CityId').selectpicker();

            },
            complete: function () {
                hideLoader();
            }
        })
    }
}

var uploadFileEditLogistic = document.querySelector('#upload-file-edit-customer')
if (uploadFileEditLogistic != null) {
    uploadFileEditLogistic.addEventListener("change", function () {
        document.querySelector("#show-name-upload-customer-file").innerHTML = `
                <p>File Name : ${this.files[0].name}</p>
                <span>${this.files.length} File(s) Selected</span>`;
    });
}
var uploadImgLogoEditLogistic = document.querySelector("#upload-img-logo-edit-customer")
if (uploadImgLogoEditLogistic != null) {
    uploadImgLogoEditLogistic.addEventListener('change', function (e) {
        const [file] = uploadImgLogoEditLogistic.files
        if (file) {
            var blah = document.querySelector('#img-src-upload');
            blah.src = URL.createObjectURL(file)
            blah.classList.add('uploaded-cust')
        }
    })
}

initView = function () {
    var lat = $("#AddressVM_Latitude").val();
    var lng = $("#AddressVM_Longitude").val();
    if (lat != "" && lng != "") {
        getAddress(lat, lng, "#locationText");
    }
    var returnObj = initMap("map");
    initBtn("#AddressVM_Latitude", "#AddressVM_Longitude", "#locationText", "#selectLocationModal");

    $('#selectLocationModal').on('shown.bs.modal', function () {
        returnObj.map.invalidateSize();

        lat = $("#AddressVM_Latitude").val();
        lng = $("#AddressVM_Longitude").val();
        if (lat != "" && lng != "") {
            goToLocation(lat, lng, returnObj.markers);
            returnObj.map.setView([lat, lng], 15);
        } else {
            returnObj.locate.start();
        }
    })

    $("#addressCountry").on('change', function () {
        var cityId = $("#AddressVM_CityId").val();
        getCities(cityId);
    })
}

addContact = function () {
    var model = {};
    model.Contacts = [];
    $(".contacts-list").find(".item").each(function () {
        var contact = {};
        contact.Id = $(this).find(".contact-id").val();
        contact.ContactId = $(this).find(".contact-contactid").val();
        contact.LogisticId = $(this).find(".contact-logisticid").val();

        contact.ContactVM = {};
        contact.ContactVM.Id = $(this).find(".contact-vm-id").val();
        contact.ContactVM.TypeId = $(this).find(".contact-type").val();
        contact.ContactVM.PhoneCodeId = $(this).find(".contact-phonecode").val();
        contact.ContactVM.Number = $(this).find(".contact-number").val();

        model.Contacts.push(contact);
    })

    showLoader();
    $.ajax({
        url: '/Logistics/AddContact',
        method: 'POST',
        data: model,
        success: function (data) {
            $("#logistic-contacts").html(data);

            initDropDownCountry(".contact-country.parent-list-country");
        },
        complete: function () {
            hideLoader();
        }
    })
}

deleteContact = function (index) {
    var model = {};
    model.Contacts = [];
    $(".contacts-list").find(".item").each(function () {
        var contact = {};
        contact.Id = $(this).find(".contact-id").val();
        contact.ContactId = $(this).find(".contact-contactid").val();
        contact.LogisticId = $(this).find(".contact-logisticid").val();

        contact.ContactVM = {};
        contact.ContactVM.Id = $(this).find(".contact-vm-id").val();
        contact.ContactVM.TypeId = $(this).find(".contact-type").val();
        contact.ContactVM.PhoneCodeId = $(this).find(".contact-phonecode").val();
        contact.ContactVM.Number = $(this).find(".contact-number").val();

        model.Contacts.push(contact);
    })

    showLoader();
    $.ajax({
        url: "/Logistics/DeleteContact?index=" + index,
        method: 'POST',
        data: model,
        success: function (data) {
            $("#logistic-contacts").html(data);

            initDropDownCountry(".contact-country.parent-list-country");
        },
        complete: function () {
            hideLoader();
        }
    })
}

deleteDbContact = function (id, index) {
    showLoader();
    $.ajax({
        url: "/Logistics/DeleteDbContact/" + id,
        method: "POST",
        success: function (result) {
            if (result) {
                deleteContact(index);
            } else {
                alert("Failed to delete contact");
            }
        },
        complete: function () {
            hideLoader();
        }
    })
}

addEmployee = function () {
    var model = {};
    model.Employees = [];
    $(".employees-list").find(".box-content").each(function () {
        //var isvalid = $(this).find(".employee-email").valid();
        var employee = {};
        employee.Id = $(this).find(".employee-id").val();
        employee.LogisticId = $(this).find(".employee-logisticid").val();
        employee.EmployeeId = $(this).find(".employee-employeeid").val();

        employee.EmployeeVM = {};
        employee.EmployeeVM.Id = $(this).find(".employee-vm-id").val();
        employee.EmployeeVM.Name = $(this).find(".employee-name").val();
        employee.EmployeeVM.Department = $(this).find(".employee-department").val();
        employee.EmployeeVM.Position = $(this).find(".employee-position").val();
        employee.EmployeeVM.Email = $(this).find(".employee-email").val();
        employee.EmployeeVM.PhoneCodeId = $(this).find(".employee-phonecode").val();
        employee.EmployeeVM.Phone = $(this).find(".employee-phone").val();

        model.Employees.push(employee);
    })

    showLoader();
    $.ajax({
        url: '/Logistics/AddEmployee',
        method: 'POST',
        data: model,
        success: function (data) {
            $("#logistic-employees").html(data);

            initDropDownCountry(".employee-country.parent-list-country");
        },
        complete: function () {
            hideLoader();
        }
    })
}

deleteEmployee = function (index) {
    var model = {};
    model.Employees = [];
    $(".employees-list").find(".box-content").each(function () {
        //var isvalid = $(this).find(".employee-email").valid();
        var employee = {};
        employee.Id = $(this).find(".employee-id").val();
        employee.LogisticId = $(this).find(".employee-logisticid").val();
        employee.EmployeeId = $(this).find(".employee-employeeid").val();

        employee.EmployeeVM = {};
        employee.EmployeeVM.Id = $(this).find(".employee-vm-id").val();
        employee.EmployeeVM.Name = $(this).find(".employee-name").val();
        employee.EmployeeVM.Department = $(this).find(".employee-department").val();
        employee.EmployeeVM.Position = $(this).find(".employee-position").val();
        employee.EmployeeVM.Email = $(this).find(".employee-email").val();
        employee.EmployeeVM.PhoneCodeId = $(this).find(".employee-phonecode").val();
        employee.EmployeeVM.Phone = $(this).find(".employee-phone").val();

        model.Employees.push(employee);
    })

    showLoader();
    $.ajax({
        url: "/Logistics/DeleteEmployee?index=" + index,
        method: "POST",
        data: model,
        success: function (data) {
            $("#logistic-employees").html(data);

            initDropDownCountry(".employee-country.parent-list-country");
        },
        complete: function () {
            hideLoader();
        }
    })
}

deleteDbEmployee = function (id, index) {
    showLoader();
    $.ajax({
        url: "/Logistics/DeleteDbEmployee/" + id,
        method: "POST",
        success: function (result) {
            if (result) {
                deleteEmployee(index);
            } else {
                alert("Failed to delete employee");
            }
        },
        complete: function () {
            hideLoader();
        }
    })
}

deleteDbAttachment = function (id) {
    showLoader();
    $.ajax({
        url: "/Logistics/DeleteDbAttachment/" + id,
        method: "POST",
        success: function (result) {
            if (result) {
                $("#attachment_" + id).remove();
            } else {
                alert("Failed to delete attachment");
            }
        },
        complete: function () {
            hideLoader();
        }
    })
}

favourite = function (itemId) {
    showLoader();
    $.ajax({
        url: '/Logistics/ToggleFavourite?itemId=' + itemId,
        method: "POST",
        success: function (result) {
            changeFavouriteIcon(result, itemId);
            refreshFavouriteComponent();
        },
        complete: function () {
            hideLoader();
        }
    })
}

saveForm = function (actionType) {
    var isFormValid = $("#logisticForm").valid();
    if (isFormValid) {
        showLoader();
        $("#actionType").val(actionType);
        $("#logisticForm").submit();
    }
}

initializeIndex = function () {
    var stateLoadParams = function (settings, data) {
        var searchData = data.search.search;
        $("#searchbox").val(searchData);
    }

    $(document).ready(function () {
        handleDataTable({
            selector: ".table-logistics",
            stateLoadCallback: stateLoadParams
        });
    });
}

showAddBankform = function () {
    $('.hidden-table-bank').fadeIn(1000);
    $("#btnAddBank").fadeOut(100);
    $("#btnAdd").removeClass("d-none");
    $("#btnUpdate").addClass("d-none");
    clearLogisticBankForm();
}

cancelAddBankForm = function () {
    $('.hidden-table-bank').fadeOut(100);
    $("#btnAddBank").fadeIn(1000);
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
            url: "/Logistics/UpdateBeneficiaryInfo",
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

bankChanged = function (branchId) {
    let bankId = $("#BankId").val();
    if (bankId) {
        showLoader();
        $("#bankBranches").load("/Logistics/GetBankBranches?bankId=" + bankId, function () {
            if (branchId) {
                $("#BranchId").val(branchId).trigger("change");
            }
            hideLoader();
        });
    } else {
        $("#BranchId option").slice(1).remove();
    }
}

branchChanged = function () {
    let branchId = $("#BranchId").val();
    if (branchId) {
        showLoader();
        $.ajax({
            url: "/Logistics/GetBranchDetails?branchId=" + branchId,
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
        url: "/Logistics/AddCurrency",
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
        url: "/Logistics/DeleteCurrency?index=" + index,
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

addLogisticBank = function () {
    let logisticId = $("#Id").val();
    let branchId = $("#BranchId").val();

    let isValid = true;
    if (branchId == "") {
        isValid = false;
    }

    let model = {};
    model.LogisticId = logisticId;
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
        url: "/Logistics/AddBank",
        method: "POST",
        data: model,
        success: function (data) {
            $("#logisticBanks").html(data);
            clearLogisticBankForm();
            cancelAddBankForm();
        },
        complete: function () {
            hideLoader();
        }
    })
}

deleteLogisticBank = function (logisticBankId) {
    let logisticId = $("#Id").val();

    showLoader();
    $.ajax({
        url: "/Logistics/DeleteBank/" + logisticId + "?bankId=" + logisticBankId,
        success: function (data) {
            $("#logisticBanks").html(data);
        },
        complete: function () {
            hideLoader();
        }
    })
}

logisticBankCurrencyChanged = function (logisticBankId) {
    let logisticBankCurrencyId = $("#currency_" + logisticBankId).val();

    if (logisticBankCurrencyId != "") {
        showLoader();
        $.ajax({
            url: "/Logistics/GetBankCurrencyDetails?currencyId=" + logisticBankCurrencyId,
            success: function (data) {
                $("#accountno_" + logisticBankId).text(data.AccountNo);
                $("#iban_" + logisticBankId).text(data.IBAN);
            },
            complete: function () {
                hideLoader();
            }
        })
    }
}

clearLogisticBankForm = function () {
    $("#BranchId").val("").trigger("change");
    $("#BankId").val("").trigger("change");
    $("#bankcurrencies").load("/Logistics/ClearCurrencies");
    $("#LogisticBankId").val("");
}

editLogisticBank = function (logisticBankId) {
    showLoader();
    $('.hidden-table-bank').fadeIn(1000);
    $("#btnAddBank").fadeOut(100);
    $("#btnAdd").addClass("d-none");
    $("#btnUpdate").removeClass("d-none");

    $.ajax({
        url: "/Logistics/EditBank?bankId=" + logisticBankId,
        success: function (data) {
            $("#LogisticBankId").val(data.Id);
            $("#BankId").val(data.BankId);
            bankChanged(data.BranchId);
            $("#bankcurrencies").load("/Logistics/GetBankCurrencies?bankId=" + logisticBankId);
        },
        complete: function () {
            hideLoader();
        }
    })

}

updateLogisticBank = function () {
    let logisticBankId = $("#LogisticBankId").val();
    let logisticId = $("#Id").val();
    let branchId = $("#BranchId").val();

    let isValid = true;
    if (branchId == "") {
        isValid = false;
    }

    let model = {};
    model.Id = logisticBankId;
    model.LogisticId = logisticId;
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
        url: "/Logistics/UpdateBank",
        method: "POST",
        data: model,
        success: function (data) {
            $("#logisticBanks").html(data);
            clearLogisticBankForm();
            cancelAddBankForm();
        },
        complete: function () {
            hideLoader();
        }
    })
}





deleteConfirmationLogistics = function () {
    $(".logistics-confirm-delete").confirmation({
        rootSelector: '[data-toggle=confirmation]',
        popout: true,
        singleton: true,
        title: DELETE,
        btnOkLabel: YES,
        btnCancelLabel: NO,
        onConfirm: function () {
            switch ($(this).data('source')) {
                case "archiveLogistics":
                    removeLogistics($(this).data('itemid'));
                    break;
                case "unArchiveLogistics":
                    unRemoveLogistics($(this).data('itemid'));
                    break;
            }
        }
    })
}


//strart Logistics
getLogistics = function () {
    showLoader();
    $.get(`/Logistics/GetLogistics`, function (data, status) {
        $("#getLogistics").html(data);
        handleDataTable({
            selector: ".table-Logistics",
            stateLoadCallback: stateLoadParams
        });
        deleteConfirmationLogistics();
        hideLoader();
        showLoaderFromAjax();
    })
}

removeLogistics = function (id) {
    showLoader();
    $.get(`/Logistics/Archive/${id}`, function (data, status) {
        getLogistics();
    })
}

unRemoveLogistics = function (id) {
    showLoader();
    $.get(`/Logistics/Unarchive/${id}`, function (data, status) {
        getLogistics();
    })
}

//end Logistics