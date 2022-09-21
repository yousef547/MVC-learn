
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
//$("#AddressVM_CityId,#addressCountry,#OrganizationTypeId,#DepartmentId,#ActivityTypeId")
//    .selectpicker();
getCities = function (cityId) {
    var countryId = $("#addressCountry").val();

    clearCities();
    if (countryId != "") {
        showLoader();
        $.ajax({
            url: '/Competitors/GetCities',
            data: {
                countryId: countryId,
                cityId: cityId
            },
            success: function (data) {
                $("#addressCities").html(data);
                $("#AddressVM_CityId").selectpicker();
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
        contact.CompetitorId = $(this).find(".contact-competitorid").val();

        contact.ContactVM = {};
        contact.ContactVM.Id = $(this).find(".contact-vm-id").val();
        contact.ContactVM.TypeId = $(this).find(".contact-type").val();
        contact.ContactVM.PhoneCodeId = $(this).find(".contact-phonecode").val();
        contact.ContactVM.Number = $(this).find(".contact-number").val();

        model.Contacts.push(contact);
    })

    showLoader();
    $.ajax({
        url: '/Competitors/AddContact',
        method: 'POST',
        data: model,
        success: function (data) {
            $("#competitor-contacts").html(data);

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
        contact.CompetitorId = $(this).find(".contact-competitorid").val();

        contact.ContactVM = {};
        contact.ContactVM.Id = $(this).find(".contact-vm-id").val();
        contact.ContactVM.TypeId = $(this).find(".contact-type").val();
        contact.ContactVM.PhoneCodeId = $(this).find(".contact-phonecode").val();
        contact.ContactVM.Number = $(this).find(".contact-number").val();

        model.Contacts.push(contact);
    })

    showLoader();
    $.ajax({
        url: "/Competitors/DeleteContact?index=" + index,
        method: 'POST',
        data: model,
        success: function (data) {
            $("#competitor-contacts").html(data);

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
        url: "/Competitors/DeleteDbContact/" + id,
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
        employee.CompetitorId = $(this).find(".employee-competitorid").val();
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
        url: '/Competitors/AddEmployee',
        method: 'POST',
        data: model,
        success: function (data) {
            $("#competitor-employees").html(data);

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
        employee.CompetitorId = $(this).find(".employee-competitorid").val();
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
        url: "/Competitors/DeleteEmployee?index=" + index,
        method: "POST",
        data: model,
        success: function (data) {
            $("#competitor-employees").html(data);

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
        url: "/Competitors/DeleteDbEmployee/" + id,
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
        url: "/Competitors/DeleteDbAttachment/" + id,
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

saveForm = function (actionType) {
    var isFormValid = $("#competitorForm").valid();
    if (isFormValid) {
        showLoader();
        $("#actionType").val(actionType);
        $("#competitorForm").submit();
    }
}

addProduct = function () {
    var model = {};
    model.Products = [];
    $(".products-list").find(".product-item").each(function () {
        var product = {};
        product.Id = $(this).find(".product-id").val();
        product.ProductId = $(this).find(".product-productid").val();
        product.ProductName = $(this).find(".product-productname").val();
        product.ProductNameAr = $(this).find(".product-productnamear").val();
        product.CompetitorId = $(this).find(".product-competitorid").val();
        model.Products.push(product);
    })

    showLoader();
    $.ajax({
        url: '/Competitors/AddProduct',
        method: 'POST',
        data: model,
        success: function (data) {
            $("#competitor-products").html(data);
        },
        complete: function () {
            hideLoader();
        }
    })
}

deleteDbProduct = function (id, productId) {
    showLoader();
    $.ajax({
        url: '/Competitors/DeleteDbProduct/' + id + '?productId=' + productId,
        method: 'POST',
        success: function (data) {
            $("#competitor-products").html(data);
        },
        complete: function () {
            hideLoader();
        }
    })
}

deleteDetailsDbAttachment = function (id, attachmentId) {
    showLoader();
    $.ajax({
        url: '/Competitors/DeleteDetailsDbAttachment/' + id + '?attachmentId=' + attachmentId,
        method: 'POST',
        success: function (data) {
            $("#competitor-files").html(data);
        },
        complete: function () {
            hideLoader();
        }
    })
}

setupSelectProductBtn = function (btn, index) {
    var competitorDepartmentIds = $("#DepartmentId").val();
    var selectedDepartments = $("#DepartmentId :selected");
    var selectedText = [];
    $(selectedDepartments).each(function () {
        selectedText.push($(this).text());
    });
    $("#departmentIds").val(competitorDepartmentIds);
    if (selectedDepartments.length > 0) {
        $("#departmentNames").text(selectedText.join(' - '));
    } else {
        $("#departmentNames").text(ERROR_NO_DEPARTMENTS_SELECTED);
    }

    var productIds = [];
    $(".products-list").find(".product-item").each(function () {
        var id = $(this).find(".product-productid").val();
        if (id != 0)
            productIds.push(id);
    })
    $("#selected-product-ids").val(productIds);

    $("#saveSelectedItem").on('click', function () {
        var selectedItems = $("#category-item-value").val();
        let itemArr = selectedItems.split(',');
        refreshProducts(itemArr);
        $("#saveSelectedItem").unbind('click');
        $("#selectProductsModal").modal('hide');
    })
}

refreshProducts = function (items) {
    var model = {};
    model.Products = [];

    $(".products-list").find(".product-item").each(function () {
        let productId = $(this).find(".product-productid").val();
        if (productId) {
            var product = {};
            product.Id = $(this).find(".product-id").val();
            product.ProductId = productId;
            product.ProductName = $(this).find(".product-productname").val();
            product.ProductNameAr = $(this).find(".product-productnamear").val();
            product.CompetitorId = $(this).find(".product-competitorid").val();
            model.Products.push(product);
        }
    })

    for (let i = 0; i < items.length; i++) {
        var product = {};
        product.ProductId = items[i];
        model.Products.push(product);
    }

    showLoader();
    $.ajax({
        url: '/Competitors/RefreshProducts',
        method: 'POST',
        data: model,
        success: function (data) {
            $("#competitor-products").html(data);
        },
        complete: function () {
            hideLoader();
        }
    })
}

clearProducts = function () {
    var model = {};
    model.Products = [];

    showLoader();
    $.ajax({
        url: '/Competitors/RefreshProducts',
        method: 'POST',
        data: model,
        success: function (data) {
            $("#competitor-products").html(data);
        },
        complete: function () {
            hideLoader();
        }
    })
}

favourite = function (itemId) {
    showLoader();
    $.ajax({
        url: '/Competitors/ToggleFavourite?itemId=' + itemId,
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

showAddBankform = function () {
    $('.hidden-table-bank').fadeIn(1000);
    $("#btnAddBank").fadeOut(100);
    $("#btnAdd").removeClass("d-none");
    $("#btnUpdate").addClass("d-none");
    clearBankForm();
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
            url: "/Competitors/UpdateBeneficiaryInfo",
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
        $("#bankBranches").load("/Competitors/GetBankBranches?bankId=" + bankId, function () {
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
            url: "/Competitors/GetBranchDetails?branchId=" + branchId,
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
        url: "/Competitors/AddCurrency",
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
        url: "/Competitors/DeleteCurrency?index=" + index,
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

clearBankForm = function () {
    $("#BranchId").val("").trigger("change");
    $("#BankId").val("").trigger("change");
    $("#bankcurrencies").load("/Competitors/ClearCurrencies");
    $("#CompetitorBankId").val("");
}

addCompetitorBank = function () {
    let competitorId = $("#Id").val();
    let branchId = $("#BranchId").val();

    let isValid = true;
    if (branchId == "") {
        isValid = false;
    }

    let model = {};
    model.CompetitorId = competitorId;
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
        url: "/Competitors/AddBank",
        method: "POST",
        data: model,
        success: function (data) {
            $("#competitorBanks").html(data);
            clearBankForm();
            cancelAddBankForm();
        },
        complete: function () {
            hideLoader();
        }
    })
}

deleteCompetitorBank = function (competitorBankId) {
    let competitorId = $("#Id").val();

    showLoader();
    $.ajax({
        url: "/Competitors/DeleteBank/" + competitorId + "?bankId=" + competitorBankId,
        success: function (data) {
            $("#competitorBanks").html(data);
        },
        complete: function () {
            hideLoader();
        }
    })
}

competitorBankCurrencyChanged = function (competitorBankId) {
    let competitorBankCurrencyId = $("#currency_" + competitorBankId).val();

    if (competitorBankCurrencyId != "") {
        showLoader();
        $.ajax({
            url: "/Competitors/GetBankCurrencyDetails?currencyId=" + competitorBankCurrencyId,
            success: function (data) {
                $("#accountno_" + competitorBankId).text(data.AccountNo);
                $("#iban_" + competitorBankId).text(data.IBAN);
            },
            complete: function () {
                hideLoader();
            }
        })
    }
}

editCompetitorBank = function (competitorBankId) {
    showLoader();
    $('.hidden-table-bank').fadeIn(1000);
    $("#btnAddBank").fadeOut(100);
    $("#btnAdd").addClass("d-none");
    $("#btnUpdate").removeClass("d-none");

    $.ajax({
        url: "/Competitors/EditBank?bankId=" + competitorBankId,
        success: function (data) {
            $("#CompetitorBankId").val(data.Id);
            $("#BankId").val(data.BankId);
            bankChanged(data.BranchId);
            $("#bankcurrencies").load("/Competitors/GetBankCurrencies?bankId=" + competitorBankId);
        },
        complete: function () {
            hideLoader();
        }
    })

}

updateCompetitorBank = function () {
    let competitorBankId = $("#CompetitorBankId").val();
    let competitorId = $("#Id").val();
    let branchId = $("#BranchId").val();

    let isValid = true;
    if (branchId == "") {
        isValid = false;
    }

    let model = {};
    model.Id = competitorBankId;
    model.CompetitorId = competitorId;
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
        url: "/Competitors/UpdateBank",
        method: "POST",
        data: model,
        success: function (data) {
            $("#competitorBanks").html(data);
            clearBankForm();
            cancelAddBankForm();
        },
        complete: function () {
            hideLoader();
        }
    })
}




deleteConfirmationCompetitors = function () {
    $(".competitors-confirm-delete").confirmation({
        rootSelector: '[data-toggle=confirmation]',
        popout: true,
        singleton: true,
        title: DELETE,
        btnOkLabel: YES,
        btnCancelLabel: NO,
        onConfirm: function () {
            switch ($(this).data('source')) {
                case "archiveCompetitors":
                    removeCompetitors($(this).data('itemid'));
                    break;
                case "unArchiveCompetitors":
                    unRemoveCompetitors($(this).data('itemid'));
                    break;
            }
        }
    })
}


//strart Competitors
getCompetitors = function () {
    showLoader();
    $.get(`/Competitors/GetCompetitors`, function (data, status) {
        $("#getCompetitors").html(data);
        handleDataTable({
            selector: ".table-Competitors-all",
            stateLoadCallback: stateLoadParams
        });
        deleteConfirmationCompetitors()
        hideLoader();
        showLoaderFromAjax();
    })
}

removeCompetitors = function (id) {
    showLoader();
    $.get(`/Competitors/Archive/${id}`, function (data, status) {
        getCompetitors();
    })
}

unRemoveCompetitors = function (id) {
    showLoader();
    $.get(`/Competitors/Unarchive/${id}`, function (data, status) {
        getCompetitors();
    })
}

//end Competitors