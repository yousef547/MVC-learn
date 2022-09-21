
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
            url: '/Customers/GetCities',
            data: {
                countryId: countryId,
                cityId: cityId
            },
            success: function (data) {
                $("#addressCities").html(data);
                $("#AddressVM_CityId")
                    .selectpicker();
            },
            complete: function () {
                hideLoader();
            }
        })
    }
}

var uploadFileEditCustomer = document.querySelector('#upload-file-edit-customer')
if (uploadFileEditCustomer != null) {
    uploadFileEditCustomer.addEventListener("change", function () {
        document.querySelector("#show-name-upload-customer-file").innerHTML = `
                <p>File Name : ${this.files[0].name}</p>
                <span>${this.files.length} File(s) Selected</span>`;
    });
}
var uploadImgLogoEditCustomer = document.querySelector("#upload-img-logo-edit-customer")
if (uploadImgLogoEditCustomer != null) {
    uploadImgLogoEditCustomer.addEventListener('change', function (e) {
        const [file] = uploadImgLogoEditCustomer.files
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
        contact.CustomerId = $(this).find(".contact-customerid").val();

        contact.ContactVM = {};
        contact.ContactVM.Id = $(this).find(".contact-vm-id").val();
        contact.ContactVM.TypeId = $(this).find(".contact-type").val();
        contact.ContactVM.PhoneCodeId = $(this).find(".contact-phonecode").val();
        contact.ContactVM.Number = $(this).find(".contact-number").val();

        model.Contacts.push(contact);
    })

    showLoader();
    $.ajax({
        url: '/Customers/AddContact',
        method: 'POST',
        data: model,
        success: function (data) {
            $("#customer-contacts").html(data);

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
        contact.CustomerId = $(this).find(".contact-customerid").val();

        contact.ContactVM = {};
        contact.ContactVM.Id = $(this).find(".contact-vm-id").val();
        contact.ContactVM.TypeId = $(this).find(".contact-type").val();
        contact.ContactVM.PhoneCodeId = $(this).find(".contact-phonecode").val();
        contact.ContactVM.Number = $(this).find(".contact-number").val();

        model.Contacts.push(contact);
    })

    showLoader();
    $.ajax({
        url: "/Customers/DeleteContact?index=" + index,
        method: 'POST',
        data: model,
        success: function (data) {
            $("#customer-contacts").html(data);

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
        url: "/Customers/DeleteDbContact/" + id,
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

addVendor = function () {
    var model = {};
    model.Vendors = [];

    $("#customer-vendor-list").find(".item").each(function () {
        var vendor = {};
        vendor.Id = $(this).find(".vendor-id").val();
        vendor.CustomerId = $(this).find(".vendor-customerid").val();
        vendor.BookRegistrationNumber = $(this).find(".vendor-brn").val();
        vendor.Value = $(this).find(".vendor-value").val();
        vendor.RegistrationDate = $(this).find(".vendor-date").val();
        vendor.VAT = $(this).find(".vendor-vat").val();

        var fileToUpload = $(this).find(".vendor-attachment")[0].files[0];
        if (fileToUpload != null) {
            let formData = new FormData();
            formData.append("file", fileToUpload);
            $.ajax({
                url: '/Customers/UploadFile',
                async: false,
                data: formData,
                method: "POST",
                enctype: 'multipart/form-data',
                processData: false,
                contentType: false,
                success: function (data) {
                    vendor.AttachmentId = data.attachmentId;
                    vendor.AttachmentPath = data.filePath;
                }
            })
        } else {
            vendor.AttachmentId = $(this).find(".vendor-attachmentid").val();
            vendor.AttachmentPath = $(this).find(".vendor-attachmentpath").val();
        }
        model.Vendors.push(vendor);
    })

    showLoader();
    $.ajax({
        url: '/Customers/AddVendorRegistration',
        method: 'POST',
        data: model,
        success: function (data) {
            $("#customer-vendor-list").html(data);
            $(".custom-file-input.vendor-attachment").on("change", function () {
                var fileName = $(this).val().split("\\").pop();
                $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
                $(this).siblings(".file-upload-label").find(".span-upload").addClass("selected").html(fileName);
            });
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
        employee.CustomerId = $(this).find(".employee-customerid").val();
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
        url: '/Customers/AddEmployee',
        method: 'POST',
        data: model,
        success: function (data) {
            $("#customer-employees").html(data);

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
        employee.CustomerId = $(this).find(".employee-customerid").val();
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
        url: "/Customers/DeleteEmployee?index=" + index,
        method: "POST",
        data: model,
        success: function (data) {
            $("#customer-employees").html(data);

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
        url: "/Customers/DeleteDbEmployee/" + id,
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
        url: "/Customers/DeleteDbAttachment/" + id,
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
        url: '/Customers/ToggleFavourite?itemId=' + itemId,
        method: "POST",
        success: function (result) {
            changeFavouriteIcon(result, itemId);
            refreshFavouriteComponent(false);
        },
        complete: function () {
            hideLoader();
        }
    })
}

saveForm = function (actionType) {
    var isFormValid = $("#customerForm").valid();
    if (isFormValid) {
        showLoader();
        $("#actionType").val(actionType);
        $("#customerForm").submit();
    }
}

//initializeIndex = function () {
//    var stateLoadParams = function (settings, data) {
//        var searchData = data.search.search;
//        $("#searchbox").val(searchData);
//    }

//    $(document).ready(function () {
//        getCustomers();
       
//    });
//}

showAddBankform = function () {
    $('.hidden-table-bank').fadeIn(1000);
    $("#btnAddBank").fadeOut(100);
    $("#btnAdd").removeClass("d-none");
    $("#btnUpdate").addClass("d-none");
    clearCustomerBankForm();
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
            url: "/Customers/UpdateBeneficiaryInfo",
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
        $("#bankBranches").load("/Customers/GetBankBranches?bankId=" + bankId, function () {
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
            url: "/Customers/GetBranchDetails?branchId=" + branchId,
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
        url: "/Customers/AddCurrency",
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
        url: "/Customers/DeleteCurrency?index=" + index,
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

addCustomerBank = function () {
    let customerId = $("#Id").val();
    let branchId = $("#BranchId").val();

    let isValid = true;
    if (branchId == "") {
        isValid = false;
    }

    let model = {};
    model.CustomerId = customerId;
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
        url: "/Customers/AddBank",
        method: "POST",
        data: model,
        success: function (data) {
            $("#customerBanks").html(data);
            clearCustomerBankForm();
            cancelAddBankForm();
        },
        complete: function () {
            hideLoader();
        }
    })
}

deleteCustomerBank = function (customerBankId) {
    let customerId = $("#Id").val();

    showLoader();
    $.ajax({
        url: "/Customers/DeleteBank/" + customerId + "?bankId=" + customerBankId,
        success: function (data) {
            $("#customerBanks").html(data);
        },
        complete: function () {
            hideLoader();
        }
    })
}

customerBankCurrencyChanged = function (customerBankId) {
    let customerBankCurrencyId = $("#currency_" + customerBankId).val();

    if (customerBankCurrencyId != "") {
        showLoader();
        $.ajax({
            url: "/Customers/GetBankCurrencyDetails?currencyId=" + customerBankCurrencyId,
            success: function (data) {
                $("#accountno_" + customerBankId).text(data.AccountNo);
                $("#iban_" + customerBankId).text(data.IBAN);
            },
            complete: function () {
                hideLoader();
            }
        })
    }
}

clearCustomerBankForm = function () {
    $("#BranchId").val("").trigger("change");
    $("#BankId").val("").trigger("change");
    $("#bankcurrencies").load("/Customers/ClearCurrencies");
    $("#CustomerBankId").val("");
}

editCustomerBank = function (customerBankId) {
    showLoader();
    $('.hidden-table-bank').fadeIn(1000);
    $("#btnAddBank").fadeOut(100);
    $("#btnAdd").addClass("d-none");
    $("#btnUpdate").removeClass("d-none");

    $.ajax({
        url: "/Customers/EditBank?bankId=" + customerBankId,
        success: function (data) {
            $("#CustomerBankId").val(data.Id);
            $("#BankId").val(data.BankId);
            bankChanged(data.BranchId);
            $("#bankcurrencies").load("/Customers/GetBankCurrencies?bankId=" + customerBankId);
        },
        complete: function () {
            hideLoader();
        }
    })

}

updateCustomerBank = function () {
    let customerBankId = $("#CustomerBankId").val();
    let customerId = $("#Id").val();
    let branchId = $("#BranchId").val();

    let isValid = true;
    if (branchId == "") {
        isValid = false;
    }

    let model = {};
    model.Id = customerBankId;
    model.CustomerId = customerId;
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
        url: "/Customers/UpdateBank",
        method: "POST",
        data: model,
        success: function (data) {
            $("#customerBanks").html(data);
            clearCustomerBankForm();
            cancelAddBankForm();
        },
        complete: function () {
            hideLoader();
        }
    })
}

deleteConfirmationCustome = function () {
    $(".custome-confirm-delete").confirmation({
        rootSelector: '[data-toggle=confirmation]',
        popout: true,
        singleton: true,
        title: DELETE,
        btnOkLabel: YES,
        btnCancelLabel: NO,
        onConfirm: function () {
            switch ($(this).data('source')) {
                case "archiveCustome":
                    removeCustomers($(this).data('itemid'));
                    break;
                case "unArchiveCustome":
                    unRemoveCustomers($(this).data('itemid'));
                    break;
            }
        }
    })
}

//start Customers
getCustomers = function () {
    showLoader();
    $.get(`/Customers/GetCustomers`, function (data, status) {
        $("#getCustomers").html(data);
         handleDataTable({
            selector: ".table-customers",
            stateLoadCallback: stateLoadParams
        });
        deleteConfirmationCustome()
        hideLoader();
        showLoaderFromAjax();
    })
}

removeCustomers = function (id) {
    showLoader();
    $.get(`/Customers/Archive/${id}`, function (data, status) {
        getCustomers();
    })
}

unRemoveCustomers = function (id) {
    showLoader();
    $.get(`/Customers/Unarchive/${id}`, function (data, status) {
        getCustomers();
    })
}
//end Customers

showVisitDetails = function (visitId) {
    showLoader();
    $.get(`/Visits/Details/${visitId}`, function (data, status) {
        $("#visitDetails").html(data);
        $("#detailsVisit").modal("show");
        hideLoader();
    })
}

getOpportunities = function () {
    var customerId = $("#Customer_Id").val();
    showLoader();
    $.get(`/Customers/GetOpportunities/${customerId}`, function (data) {
        $("#historyOpportunities").html(data);
        hideLoader();
    })
}

GetQuotations = function () {
    var customerId = $("#Customer_Id").val();
    showLoader();
    $.get(`/Customers/GetQuotations/${customerId}`, function (data) {
        $('#historyQuotations').html(data)
        hideLoader();
    })
}