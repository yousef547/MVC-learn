
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

checkIsAgency = function () {
    var isSubCompany = $("#IsAgency").is(":checked");
    if (isSubCompany)
        $('.agency-select').removeClass('d-none');
    else
        $('.agency-select').addClass('d-none');
}

$('#IsAgency').click(function () {
    checkIsAgency();
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
            url: '/Suppliers/GetCities',
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
        contact.SupplierId = $(this).find(".contact-supplierid").val();

        contact.ContactVM = {};
        contact.ContactVM.Id = $(this).find(".contact-vm-id").val();
        contact.ContactVM.TypeId = $(this).find(".contact-type").val();
        contact.ContactVM.PhoneCodeId = $(this).find(".contact-phonecode").val();
        contact.ContactVM.Number = $(this).find(".contact-number").val();

        model.Contacts.push(contact);
    })

    showLoader();
    $.ajax({
        url: '/Suppliers/AddContact',
        method: 'POST',
        data: model,
        success: function (data) {
            $("#supplier-contacts").html(data);

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
        contact.SupplierId = $(this).find(".contact-supplierid").val();

        contact.ContactVM = {};
        contact.ContactVM.Id = $(this).find(".contact-vm-id").val();
        contact.ContactVM.TypeId = $(this).find(".contact-type").val();
        contact.ContactVM.PhoneCodeId = $(this).find(".contact-phonecode").val();
        contact.ContactVM.Number = $(this).find(".contact-number").val();

        model.Contacts.push(contact);
    })

    showLoader();
    $.ajax({
        url: "/Suppliers/DeleteContact?index=" + index,
        method: 'POST',
        data: model,
        success: function (data) {
            $("#supplier-contacts").html(data);

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
        url: "/Suppliers/DeleteDbContact/" + id,
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
        employee.SupplierId = $(this).find(".employee-supplierid").val();
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
        url: '/Suppliers/AddEmployee',
        method: 'POST',
        data: model,
        success: function (data) {
            $("#supplier-employees").html(data);

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
        employee.SupplierId = $(this).find(".employee-supplierid").val();
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
        url: "/Suppliers/DeleteEmployee?index=" + index,
        method: "POST",
        data: model,
        success: function (data) {
            $("#supplier-employees").html(data);

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
        url: "/Suppliers/DeleteDbEmployee/" + id,
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
        url: "/Suppliers/DeleteDbAttachment/" + id,
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

addCertificate = function () {
    var model = {};
    model.Certificates = [];
    $(".certificates-list").find(".certificate-item").each(function () {
        var certificate = {};
        certificate.Id = $(this).find(".certificate-id").val();
        certificate.SupplierId = $(this).find(".certificate-supplierid").val();
        certificate.CertificateId = $(this).find(".certificate-certificateid").val();
        certificate.CertificateVM = {};
        certificate.CertificateVM.Id = $(this).find(".certificate-vm-id").val();
        //certificate.CertificateVM.AttachmentId = $(this).find(".certificate-vm-attachmentid").val();
        certificate.CertificateVM.Name = $(this).find(".certificate-vm-name").val();

        var fileToUpload = $(this).find(".certificate-file")[0].files[0];
        if (fileToUpload != null) {
            let formData = new FormData();
            formData.append("file", fileToUpload);
            $.ajax({
                url: '/Suppliers/UploadFile',
                async: false,
                data: formData,
                method: "POST",
                enctype: 'multipart/form-data',
                processData: false,
                contentType: false,
                success: function (data) {
                    certificate.CertificateVM.AttachmentId = data.attachmentId;
                    certificate.CertificateVM.AttachmentPath = data.filePath;
                }
            })
        } else {
            certificate.CertificateVM.AttachmentId = $(this).find(".certificate-vm-attachmentid").val();
            certificate.CertificateVM.AttachmentPath = $(this).find(".certificate-vm-attachmentpath").val();
        }
        model.Certificates.push(certificate);
    })

    showLoader();
    $.ajax({
        url: '/Suppliers/AddCertificate',
        method: 'POST',
        data: model,
        success: function (data) {
            $("#supplier-certifications").html(data);
            $(".custom-file-input.certificate-file").on("change", function () {
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

deleteCertificate = function (index) {
    var model = {};
    model.Certificates = [];
    $(".certificates-list").find(".certificate-item").each(function () {
        var certificate = {};
        certificate.Id = $(this).find(".certificate-id").val();
        certificate.SupplierId = $(this).find(".certificate-supplierid").val();
        certificate.CertificateId = $(this).find(".certificate-certificateid").val();
        certificate.CertificateVM = {};
        certificate.CertificateVM.Id = $(this).find(".certificate-vm-id").val();
        certificate.CertificateVM.Name = $(this).find(".certificate-vm-name").val();

        var fileToUpload = $(this).find(".certificate-file")[0].files[0];
        if (fileToUpload != null) {
            let formData = new FormData();
            formData.append("file", fileToUpload);
            $.ajax({
                url: '/Suppliers/UploadFile',
                async: false,
                data: formData,
                method: "POST",
                enctype: 'multipart/form-data',
                processData: false,
                contentType: false,
                success: function (data) {
                    certificate.CertificateVM.AttachmentId = data.attachmentId;
                    certificate.CertificateVM.AttachmentPath = data.filePath;
                }
            })
        } else {
            certificate.CertificateVM.AttachmentId = $(this).find(".certificate-vm-attachmentid").val();
            certificate.CertificateVM.AttachmentPath = $(this).find(".certificate-vm-attachmentpath").val();
        }
        model.Certificates.push(certificate);
    })

    showLoader();
    $.ajax({
        url: '/Suppliers/DeleteCertificate?index=' + index,
        method: 'POST',
        data: model,
        success: function (data) {
            $("#supplier-certifications").html(data);
            $(".custom-file-input.certificate-file").on("change", function () {
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

deleteDbCertificate = function (id, index) {
    showLoader();
    $.ajax({
        url: "/Suppliers/DeleteDbCertificate/" + id,
        method: "POST",
        success: function (result) {
            if (result) {
                deleteCertificate(index);
            } else {
                alert("Failed to delete certificate");
            }
        },
        complete: function () {
            hideLoader();
        }
    })
}

saveForm = function (actionType) {
    var isFormValid = $("#supplierForm").valid();
    if (isFormValid) {
        showLoader();
        $("#actionType").val(actionType);
        $("#supplierForm").submit();
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
        product.SupplierId = $(this).find(".product-supplierid").val();
        model.Products.push(product);
    })

    showLoader();
    $.ajax({
        url: '/Suppliers/AddProduct',
        method: 'POST',
        data: model,
        success: function (data) {
            $("#supplier-products").html(data);
        },
        complete: function () {
            hideLoader();
        }
    })
}

deleteDbProduct = function (id, productId) {
    showLoader();
    $.ajax({
        url: '/Suppliers/DeleteDbProduct/' + id + '?productId=' + productId,
        method: 'POST',
        success: function (data) {
            $("#supplier-products").html(data);
        },
        complete: function () {
            hideLoader();
        }
    })
}

deleteDetailsDbAttachment = function (id, attachmentId) {
    showLoader();
    $.ajax({
        url: '/Suppliers/DeleteDetailsDbAttachment/' + id + '?attachmentId=' + attachmentId,
        method: 'POST',
        success: function (data) {
            $("#supplier-files").html(data);
        },
        complete: function () {
            hideLoader();
        }
    })
}

setupSelectProductBtn = function (btn, index) {
    //$("#btnSelectServices").attr("disabled", true);
    var supplierDepartmentIds = $("#DepartmentId").val();
    var selectedDepartments = $("#DepartmentId :selected");
    var selectedText = [];
    $(selectedDepartments).each(function () {
        selectedText.push($(this).text());
    });
    $("#departmentIds").val(supplierDepartmentIds);
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
    //let itemArr = items.split(',');
    debugger
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
            product.SupplierId = $(this).find(".product-supplierid").val();
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
        url: '/Suppliers/RefreshProducts',
        method: 'POST',
        data: model,
        success: function (data) {
            $("#supplier-products").html(data);
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
        url: '/Suppliers/RefreshProducts',
        method: 'POST',
        data: model,
        success: function (data) {
            $("#supplier-products").html(data);
        },
        complete: function () {
            hideLoader();
        }
    })
}

favourite = function (itemId) {
    showLoader();
    $.ajax({
        url: '/Suppliers/ToggleFavourite?itemId=' + itemId,
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
            url: "/Suppliers/UpdateBeneficiaryInfo",
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
        $("#bankBranches").load("/Suppliers/GetBankBranches?bankId=" + bankId, function () {
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
            url: "/Suppliers/GetBranchDetails?branchId=" + branchId,
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
        url: "/Suppliers/AddCurrency",
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
        url: "/Suppliers/DeleteCurrency?index=" + index,
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
    $("#bankcurrencies").load("/Suppliers/ClearCurrencies");
    $("#SupplierBankId").val("");
}

addSupplierBank = function () {
    let supplierId = $("#Id").val();
    let branchId = $("#BranchId").val();

    let isValid = true;
    if (branchId == "") {
        isValid = false;
    }

    let model = {};
    model.SupplierId = supplierId;
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
        url: "/Suppliers/AddBank",
        method: "POST",
        data: model,
        success: function (data) {
            $("#supplierBanks").html(data);
            clearBankForm();
            cancelAddBankForm();
        },
        complete: function () {
            hideLoader();
        }
    })
}

deleteSupplierBank = function (supplierBankId) {
    let supplierId = $("#Id").val();

    showLoader();
    $.ajax({
        url: "/Suppliers/DeleteBank/" + supplierId + "?bankId=" + supplierBankId,
        success: function (data) {
            $("#supplierBanks").html(data);
        },
        complete: function () {
            hideLoader();
        }
    })
}

supplierBankCurrencyChanged = function (supplierBankId) {
    let supplierBankCurrencyId = $("#currency_" + supplierBankId).val();

    if (supplierBankCurrencyId != "") {
        showLoader();
        $.ajax({
            url: "/Suppliers/GetBankCurrencyDetails?currencyId=" + supplierBankCurrencyId,
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

editSupplierBank = function (supplierBankId) {
    showLoader();
    $('.hidden-table-bank').fadeIn(1000);
    $("#btnAddBank").fadeOut(100);
    $("#btnAdd").addClass("d-none");
    $("#btnUpdate").removeClass("d-none");

    $.ajax({
        url: "/Suppliers/EditBank?bankId=" + supplierBankId,
        success: function (data) {
            $("#SupplierBankId").val(data.Id);
            $("#BankId").val(data.BankId);
            bankChanged(data.BranchId);
            $("#bankcurrencies").load("/Suppliers/GetBankCurrencies?bankId=" + supplierBankId);
        },
        complete: function () {
            hideLoader();
        }
    })

}

updateSupplierBank = function () {
    let supplierBankId = $("#SupplierBankId").val();
    let supplierId = $("#Id").val();
    let branchId = $("#BranchId").val();

    let isValid = true;
    if (branchId == "") {
        isValid = false;
    }

    let model = {};
    model.Id = supplierBankId;
    model.SupplierId = supplierId;
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
        url: "/Suppliers/UpdateBank",
        method: "POST",
        data: model,
        success: function (data) {
            $("#supplierBanks").html(data);
            clearBankForm();
            cancelAddBankForm();
        },
        complete: function () {
            hideLoader();
        }
    })
}




deleteConfirmationSuppliers = function () {
    $(".suppliers-confirm-delete").confirmation({
        rootSelector: '[data-toggle=confirmation]',
        popout: true,
        singleton: true,
        title: DELETE,
        btnOkLabel: YES,
        btnCancelLabel: NO,
        onConfirm: function () {
            switch ($(this).data('source')) {
                case "archiveSuppliers":
                    removeSuppliers($(this).data('itemid'));
                    break;
                case "unArchiveSuppliers":
                    unRemoveSuppliers($(this).data('itemid'));
                    break;
            }
        }
    })
}


//strart Suppliers
getSuppliers = function () {
    showLoader();
    $.get(`/Suppliers/GetSuppliers`, function (data, status) {
        $("#showSuppliers").html(data);
        handleDataTable({
            selector: ".table-suppliers",
            stateLoadCallback: stateLoadParams
        });
        deleteConfirmationSuppliers()
        hideLoader();
        showLoaderFromAjax();
    })
}

removeSuppliers = function (id) {
    showLoader();
    $.get(`/Suppliers/Archive/${id}`, function (data, status) {
        getSuppliers();
    })
}

unRemoveSuppliers = function (id) {
    showLoader();
    $.get(`/Suppliers/Unarchive/${id}`, function (data, status) {
        getSuppliers();
    })
}

//end Suppliers