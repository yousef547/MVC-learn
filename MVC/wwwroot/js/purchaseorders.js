////const { get } = require("jquery");

calculateEndDate = function (startDateInput, delivery_Period, endDate) {
    let startDate = $(`#${startDateInput}`).val();
    let deliveryPeriod = $(`#${delivery_Period}`).val();

    showLoader();
    $.ajax({
        url: `/PurchasingOrders/CalculateEndDate?startDate=${startDate}&deliveryPeriod=${deliveryPeriod}`,
        success: function (data) {
            //$(`#${inputEndDate}`).val(data.endDate);
            $(`#${endDate}`).text(data.endDateStr);
        },
        complete: function () {
            hideLoader();
        }
    })
}

addSupplierPayment = function (add) {
    let PurchaseOrderId = $("#PurchaseOrderId").val();

    let model = {};
    model.SupplierPayment = [];
    $("#showSupplierPayment .box-content").each(function () {
        let PaymentSupplier = {};
        PaymentSupplier.SupplierPoId = $(this).find(".supplierName").val();
        PaymentSupplier.SupplierPONumber = $(this).find(".subblierNumber").val();
        PaymentSupplier.Amount = $(this).find(".supplierAmount").val();
        PaymentSupplier.PaymentTypeId = $(this).find(".supplierPayment").val();
        model.SupplierPayment.push(PaymentSupplier);
    });


    showLoader();
    $.ajax({
        url: `/PurchasingOrders/AddSupplierPayment/${PurchaseOrderId}?add=${add}`,
        method: "POST",
        data: model,
        success: function (data) {
            $("#showSupplierPayment").html(data);
            $('.supplierName').on('change', function () {
                var numberPo = $(this).attr("data-number");
                var amount = $(this).find(':selected').data('amount');
                $(`#${numberPo}`).val(amount);
            })
        },
        complete: function () {
            hideLoader();
        }
    })
}

deleteEmployee = function (index) {
    let model = {};
    model.SupplierPayment = [];
    let PurchaseOrderId = $("#PurchaseOrderId").val();

    $("#showSupplierPayment .box-content").each(function () {
        let PaymentSupplier = {};
        PaymentSupplier.SupplierPoId = $(this).find(".supplierName").val();
        PaymentSupplier.SupplierPONumber = $(this).find(".subblierNumber").val();
        PaymentSupplier.Amount = $(this).find(".supplierAmount").val();
        PaymentSupplier.PaymentTypeId = $(this).find(".supplierPayment").val();
        model.SupplierPayment.push(PaymentSupplier);
    });


    showLoader();
    $.ajax({
        url: `/PurchasingOrders/DeleteSupplierPayment/${PurchaseOrderId}?index=${index}`,
        method: "POST",
        data: model,
        success: function (data) {
            $("#showSupplierPayment").html(data);
            $('.supplierName').on('change', function () {
                var amount = $(this).attr("data-amount");
                $('.supplierName').on('change', function () {
                    var numberPo = $(this).attr("data-number");
                    var amount = $(this).find(':selected').data('amount');
                    $(`#${numberPo}`).val(amount);
                })
            })
        },
        complete: function () {
            hideLoader();
        }
    })
}

var foundId;
showModelFunded = function (id) {
    foundId = id;
    resetInput();
    $('#modalInfoNew').modal('show')
}
closeModel = function () {
    $('#modalInfoNew').modal('hide')
}
changeURLFunded = function (isFound) {
    var url = `/PurchasingOrders/Create/${foundId}?type=${isFound}`;
    $('#goToCreate').css({ 'pointer-events': 'All', 'opacity': '1' })
    $('#goToCreate').attr('href', url);
}

resetInput = function () {
    document.getElementById("funded").checked = false;
    document.getElementById("LightFunded").checked = false;
    document.getElementById("notfunded").checked = false;
    $('#goToCreate').attr('href', '')
    $('#goToCreate').css({ 'pointer-events': 'none', 'opacity': '50%' })
}

nextToSupplier = function () {
    $("#CustomerPo").removeClass('active show');
    $("#SupplierPo").addClass('active show');
    $("#CustomerPo-tab").removeClass('active')
    $("#SupplierPo-tab").addClass('active')

}

var supplierDone = [];
addSupplierPo = function (index) {
    let supplierId = $("#poSupplierId").val();
    let PurchaseOrderId = $("#PurchaseOrderId").val();
    if ($(".checkBoxOffer:checked").length > 0 && $(`#SupplierPONumber_${supplierId}`).val() != '' && $(`#SupplierPOVMsStartDate_${supplierId}`).val() != '') {
        let formData = new FormData($(`#SupplierPoForm_${supplierId}`)[0]);
        formData.append("PurchaseOrderId", PurchaseOrderId);

        for (var i = 0; i < $(`.checkBoxId_${index} .checkBoxOffer:checked`).length; i++) {
            formData.append("offerIds", $(`.checkBoxId_${index} .checkBoxOffer:checked`)[i].value);
        }
        showLoader();
        $.ajax({
            url: `/PurchasingOrders/AddSuplierPo`,
            data: formData,
            method: "POST",
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            success: function (result) {
                if (result) {
                    supplierDone.push(supplierId);
                    $(`#nextSupplier_${supplierId}`).addClass('d-none')
                    getDSupplierProducts(false)
                    addSupplierPayment(false);
                }
            },
            error: function () {
                toastr.error(ERROR_DB);
            },
            complete: function () {
                hideLoader();
            }
        })
    } else {
        toastr.error(ERROR_DB);
    }

}

getDSupplierProducts = function (work) {
    let supplierId = $("#poSupplierId").val();
    if ($("#availableSuppliers  li").last().hasClass("active")) {
        $("#nextSupplier").addClass("d-none cancel")
    } else {
        $("#nextSupplier").removeClass("d-none cancel")
    }
    if (!work) {
        if ($("#availableSuppliers li").last().hasClass("active")) {
            $("#availableSuppliers li").first().addClass("active");
            var afterDone = $("#availableSuppliers  li").first().attr('data-itemid');
            console.log(afterDone);
            $(`#supplierPo_${afterDone}`).addClass("showSupplier").removeClass("d-none")
            $(`#supplierPo_${afterDone}`).siblings().addClass('d-none').removeClass('showSupplier')
        } else {
            $("#availableSuppliers  li.active").addClass("done");
            $("#availableSuppliers  li.active").removeClass('active').next().addClass("active");
            $(`#poSupplierId_${supplierId}`).removeClass("showSupplier").addClass("d-none")
            supplierId = $("#availableSuppliers  li.active").attr('data-itemid');
            $("#poSupplierId").val(supplierId);
            $(`.showSupplier`).addClass('d-none').removeClass('showSupplier').next().addClass('showSupplier').removeClass('d-none');
        }

    } else {
        $(`#supplierPo_${supplierId}`).removeClass('d-none').siblings().addClass('d-none');
        $(`#supplierPo_${supplierId}`).first().addClass('showSupplier').siblings().removeClass('showSupplier');
    }




}

saveForm = function () {
    var customerPOForm = $("#CustomerPoForm")[0];
    var fundDetailsForm = $("#FundDetails")[0];
    let PurchaseOrderId = $("#PurchaseOrderId").val();

    var a = new FormData(); // using additional FormData object
    var data = new FormData(customerPOForm);
    var formValues = data.entries();
    while (!(ent = formValues.next()).done) {
        // Note the change here 
        a.append(`CustomerPO.${ent.value[0]}`, ent.value[1])
    }

    data = new FormData(fundDetailsForm);
    formValues = data.entries();
    while (!(ent = formValues.next()).done) {
        // Note the change here 
        a.append(`FundDetails.${ent.value[0]}`, ent.value[1])
    }

    for (var i = 0; i < $(".supplierAmount").length; i++) {
        a.append("detailsPayment[" + i + "].SupplierPoId", $(".supplierName")[i].value);
        a.append("detailsPayment[" + i + "].Amount", $(".supplierAmount")[i].value);
        a.append("detailsPayment[" + i + "].PaymentTypeId", $(".supplierPayment")[i].value);
    }


    var isValidFundDetails;
    var FundDetails = $("#createType").attr("data-type") === 'True';
    if (FundDetails) {
        isValidFundDetails = $("#FundDetails").valid();
    } else {
        isValidFundDetails = true;
    }

    if ($("#CustomerPoForm").valid() && isValidFundDetails) {
        showLoader();
        $.ajax({
            url: `/PurchasingOrders/Create`,
            data: a,
            method: "POST",
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            success: function (result) {
                if (result.success) {
                    window.location.href = `/PurchasingOrders/ProjectDetails/${PurchaseOrderId}`
                } else {
                    $("#CustomerPoForm").html(result);
                }

            },
            error: function () {
                toastr.error(ERROR_DB);
            },
            complete: function () {
            }
        })
    }

    // start fund details


}

submitCustomerPo = function () {
    var isForm2Valid = $("#FundDetails");
    let PurchaseOrderId = $("#PurchaseOrderId").val();

    let formData2 = new FormData(isForm2Valid[0]);
    for (var i = 0; i < $(".supplierAmount").length; i++) {
        formData2.append("detailsPayment[" + i + "].SupplierPoId", $(".supplierName")[i].value);
        formData2.append("detailsPayment[" + i + "].Amount", $(".supplierAmount")[i].value);
        formData2.append("detailsPayment[" + i + "].PaymentTypeId", $(".supplierPayment")[i].value);
    }
    if (isForm2Valid.valid()) {
        showLoader();
        $.ajax({
            url: `/PurchasingOrders/AddFundDetails`,
            data: formData2,
            method: "POST",
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            success: function (result) {
                $("#FundDetails").html(result);
                //window.location.href = `/PurchasingOrders/ProjectDetails/${PurchaseOrderId}`
            },
            error: function () {
                toastr.error(ERROR_DB);
            },
            complete: function () {
                hideLoader();
            }
        })
    }
}
//setCustomer
setValueCustomer = function () {
    $('.get-value').each(function (i, obj) {
        obj.value = $("#CustomerPONumber").val()
    });
    setValueSupplier()
}
setValueSupplier = function () {
    var supplierPo = [];
    $('.set-text').each(function (i, obj) {
        if (obj.value != '') {
            supplierPo.push(obj.value);
        }
    });
    $(`#SupplierPONumber`).val(`#${supplierPo.join(',#')}`)
}

$('.supplierName').on('change', function () {
    var numberPo = $(this).attr("data-number");
    var amount = $(this).find(':selected').data('amount');
    $(`#${numberPo}`).val(amount);
})

changeInterest = function () {
    var currency = $("#CurrencyId option:selected").data("symbol");
    var amount = $("#Amount").val();
    var fundPeriod = $("#FundPeriod").val();
    var bankInterest = $("#BankInterest").val();
    var valuesPercentage = (amount * bankInterest) / 100;
    var InterestMonth = fundPeriod * valuesPercentage;
    $("#symbol").text(currency);
    $("#totalInterest").text(InterestMonth.toFixed(2));
}

