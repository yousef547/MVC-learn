
showHideSections = function () {
    calculateHoldAmount();
    var isChecked = $("#BidBondVM_CashType").is(":checked");
    if (isChecked) {
        $(".bidbondon").show();
        $(".bidbondff").hide();
    } else {
        $(".bidbondff").show();
        $(".bidbondon").hide();
    }
}

getBankDetails = function () {
    var bankId = $("#BidBondVM_BidBondOn_BankId").val();
    if (bankId) {
        showLoader();
        $.ajax({
            url: '/Opportunities/GetBankDetails?bankId=' + bankId,
            success: function (data) {
                $("#BidBondVM_BidBondOn_Percentage").val(data.BidBondPercentage);
                $("#lbl_BidBondOn_Percentage").text(data.BidBondPercentage + "%");

                $("#BidBondVM_BidBondOn_Fees").val(data.BidBondMinFees);
                $("#lblBidBondOn_Fees").text(data.BidBondMinFees);
                calculateHoldAmount();
            },
            complete: function () {
                hideLoader();
            }
        })
    } else {
        $("#BidBondVM_BidBondOn_Percentage").val(0);
        $("#lbl_BidBondOn_Percentage").text("0%");

        $("#BidBondVM_BidBondOn_Fees").val(0);
        $("#lblBidBondOn_Fees").text("0");
        calculateHoldAmount();
    }
}

calculateHoldAmount = function () {
    var amount = $("#BidBondVM_Amount").val();
    var percentage = $("#BidBondVM_BidBondOn_Percentage").val();
    var isCredit = $("#BidBondVM_BidBondOn_IsCredit").is(":checked");
    if (!isCredit) {
        percentage = 100;
        $("#BidBondVM_BidBondOn_Percentage").val(100);
        $("#lbl_BidBondOn_Percentage").text('100%');
    }

    var holdAmount = amount * (percentage / 100);
    $("#BidBondVM_BidBondOn_HoldAmount").val(holdAmount);
    $("#lblBidBondOn_HoldAmount").text(holdAmount);
}

checkType = function () {
    showLoader();
    var typeId = $("#TypeId").val();
    $.ajax({
        url: '/Opportunities/CheckOpportunityType?typeId=' + typeId,
        success: function (data) {
            if (data) {
                $(".typeDependant").show();
            } else {
                $(".typeDependant").hide();
            }
        },
        complete: function () {
            hideLoader();
        }
    })
}

checkBidBond = function () {
    var isBidBond = $("#IsBidBond").is(":checked");
    if (isBidBond) {
        $("#bidBondBlock").fadeIn(500);
    } else {
        $("#bidBondBlock").fadeOut(500);
    }
}

checkBookTender = function () {
    var isBookTender = $("#IsBookTender").is(":checked");
    if (isBookTender) {
        $("#bookTenderBlock").fadeIn(500);
    } else {
        $("#bookTenderBlock").fadeOut(500);
    }
}

calculateExpiryDate = function () {
    showLoader();
    var issueDate = $("#BidBondVM_BidBondOn_IssueDate").val();
    var periodNo = $("#BidBondVM_BidBondOn_NoOfPeriods").val();

    $.ajax({
        url: '/Opportunities/CalculateExpiryDate?issueDate=' + issueDate + '&periodNo=' + periodNo,
        success: function (data) {
            $("#BidBondVM_IssueDate").val(data.issueDate);
            $("#BidBondVM_BidBondOn_ExpiryDate").val(data.expiryDate);
        },
        complete: function () {
            hideLoader();
        }
    })
}

deleteTechAttachment = function (technicalSpecsId, attachmentId) {
    showLoader();
    $.ajax({
        url: '/Opportunities/DeleteTechnicalSpecsAttachment?attachmentId=' + attachmentId,
        method: 'POST',
        success: function (data) {
            $("#techSpecsAttachments").load('/Opportunities/GetTechnicalSpecsAttachments/' + technicalSpecsId);
        },
        complete: function () {
            hideLoader();
        }
    });
}

addProduct = function () {
    showLoader();
    var addProductVM = {};
    addProductVM.productVMs = [];
    var rows = $("#productsTable>tbody>tr").each(function () {
        var row = $(this);
        var productVM = {};
        productVM.Id = row.find("td").eq(0).find("input").eq(0).val();
        productVM.TechnicalSpecificationId = row.find("td").eq(0).find("input").eq(1).val();
        productVM.ProductName = row.find("td").eq(0).find("input").eq(2).val();
        productVM.ProductNameAr = row.find("td").eq(0).find("input").eq(3).val();
        productVM.ProductId = row.find("td").eq(1).find("input").val();
        productVM.Quantity = row.find("td").eq(2).find("input").val();
        productVM.Description = row.find("td").eq(3).find("input").val();
        /*productVM.Origin = row.find("td").eq(4).find("input").val();*/
        productVM.ProductOriginId = row.find("td").eq(4).find("select").val();
        addProductVM.productVMs.push(productVM);
    });

    $.ajax({
        url: '/Opportunities/AddTechnicalSpecsProduct',
        data: addProductVM,
        method: 'POST',
        success: function (data) {
            $("#techSpecsProducts").html(data);
        },
        complete: function () {
            hideLoader();
        }
    })
}

deleteTechDbProduct = function (technicalSpecsProductId, btnDelete) {
    showLoader();
    $.ajax({
        url: '/Opportunities/DeleteTechnicalSpecsProduct?technicalSpecsProductId=' + technicalSpecsProductId,
        method: 'POST',
        success: function (data) {
            $(btnDelete).parent('td').parent('tr').remove();
        },
        complete: function () {
            hideLoader();
        }
    });
}

deleteProduct = function (btnDelete) {
    $(btnDelete).parent('td').parent('tr').remove();
}

getSupplierDetails = function () {
    showLoader();
    var supplierId = $("#roSupplierId").val();
    $("#roSupplierDetails").load('/Opportunities/GetSupplierDetails?supplierId=' + supplierId, function () {
        hideLoader();
    });
}

getProductDetails = function (index) {
    showLoader();
    var productId = $("#roProductId_" + index).val();
    $("#roProductDetails_" + index).load('/Opportunities/GetProductDetails?productId=' + productId + '&index=' + index, function () {
        hideLoader();
    });
}

deleteDbRequestOffer = function (offerId, btnDelete) {
    showLoader();
    $.ajax({
        url: '/Opportunities/DeleteRequestOffer?offerId=' + offerId,
        method: 'POST',
        success: function (data) {
            $(btnDelete).parent('td').parent('tr').remove();
            refreshAvailableSuppliers();
            updateRequestOffersNo(-1);
        },
        complete: function () {
            hideLoader();
        }
    });
}

refreshAvailableSuppliers = function () {
    var opportunityId = $("#Id").val();
    $("#soAvailableSuppliers").load("/Opportunities/RefreshRequestOfferAvailableSuppliers/" + opportunityId, function () {
        initCustomList('#availableSuppliers');
        $("#soEditAvailableSuppliers").load("/Opportunities/RefreshEditRequestOfferAvailableSuppliers/" + opportunityId, function () {
            initCustomList('#editAvailableSuppliers');
        });
    });
}

deleteRequestOffer = function (btnDelete) {
    $(btnDelete).parent('td').parent('tr').remove();
}

getSupplierOfferSupplierDetails = function () {
    showLoader();
    var supplierId = $("#soSupplierId").val();
    $("#soSupplierDetails").load('/Opportunities/GetSupplierDetails?supplierId=' + supplierId, function () {
        hideLoader();
    });
}

getCurrencyDetails = function () {
    showLoader();
    var currencyId = $("#soCurrencyId").val();
    var price = $("#soPrice").val();
    var rate = $("#soExchangeRate").val();
    $("#soCurrencyDetails").load('/Opportunities/GetCurrencyDetails?currencyId=' + currencyId + '&price=' + price + '&rate=' + rate, function () {
        hideLoader();
    });
}

requestOffersClicked = function () {
    $("#btnAddSuppliers").removeClass("d-none");
    $("#addOfferBlock").addClass("d-none");
}

supplierOffersClicked = function () {
    $("#addOfferBlock").removeClass("d-none");
    $("#btnAddSuppliers").addClass("d-none");
}

addSupplierOfferClicked = function () {
    $("#addOfferForm").removeClass("d-none");
    $("#btnAddOffer").addClass("d-none");
    $("#editOfferForm").addClass("d-none");
    currencyChanged();
    soDeliveryTypeChanged();
}

editSupplierOffer = function (offerId) {
    $("#addOfferForm").addClass("d-none");
    $("#btnAddOffer").removeClass("d-none");
    $("#editOfferForm").removeClass("d-none");

    showLoader();
    $("#editOfferForm").load("/Opportunities/EditSupplierOffer?supplierOfferId=" + offerId, function () {
        //dCurrencyChanged();
        calculateDetailsSupplierOfferTotal();
        soDDeliveryTypeChanged();
        initCustomList('#editAvailableSuppliers');
        hideLoader();
    });
}

cancelSupplierOfferClicked = function () {
    $("#addOfferForm").addClass("d-none");
    $("#btnAddOffer").removeClass("d-none");
}

cancelDSupplierOfferClicked = function () {
    $("#editOfferForm").addClass("d-none");
}

currencyChanged = function () {
    let currencyId = $("#soCurrencyId").val();
    if (currencyId) {
        showLoader();
        $.ajax({
            url: "/Opportunities/GetCurrencyData?currencyId=" + currencyId,
            success: function (data) {
                $("#soExchangeRate").val(data.ExchangeRate).trigger("change");
                $("#soCurrencySymbol").val(data.Symbol);
                $(".currencySymbol").text(data.Symbol);
            },
            complete: function () {
                hideLoader();
            }
        })
    } else {
        $("#soExchangeRate").val(0).trigger("change");
    }
}

dCurrencyChanged = function () {
    let currencyId = $("#soDCurrencyId").val();
    if (currencyId) {
        showLoader();
        $.ajax({
            url: "/Opportunities/GetCurrencyData?currencyId=" + currencyId,
            success: function (data) {
                $("#soDExchangeRate").val(data.ExchangeRate).trigger("change");
                $("#soDCurrencySymbol").val(data.Symbol);
                $(".currencySymbol").text(data.Symbol);
            },
            complete: function () {
                hideLoader();
            }
        })
    } else {
        $("#soDExchangeRate").val(0).trigger("change");
    }
}

getSupplierProducts = function () {
    let opportunityId = $("#Id").val();
    let supplierId = $("#soSupplierId").val();
    let symbol = $("#soCurrencySymbol").val();
    if (opportunityId && supplierId) {
        showLoader();
        $.ajax({
            url: "/Opportunities/GetSupplierProducts/" + opportunityId + "?supplierId=" + supplierId + "&currencySymbol=" + symbol,
            success: function (data) {
                $("#soSupplierProducts").html(data);
                calculateSupplierOfferTotal();

                $(".attachmentProdList").on("change", function () {
                    var fileName = $(this).val().split("\\").pop();
                    $(this).siblings('.file-upload-label').find(".span-upload").addClass("one-line").html(fileName);
                });
            },
            complete: function () {
                hideLoader();
            }
        })
    } else {
        $("#soSupplierProducts tr").remove();
    }
}

getDSupplierProducts = function () {
    let opportunityId = $("#Id").val();
    let supplierId = $("#soDSupplierId").val();
    let symbol = $("#soDCurrencySymbol").val();
    if (opportunityId && supplierId) {
        showLoader();
        $.ajax({
            url: "/Opportunities/GetSupplierProducts/" + opportunityId + "?supplierId=" + supplierId + "&currencySymbol=" + symbol,
            success: function (data) {
                $("#soDSupplierProducts").html(data);
                calculateDetailsSupplierOfferTotal();

                $(".attachmentProdList").on("change", function () {
                    var fileName = $(this).val().split("\\").pop();
                    $(this).siblings('.file-upload-label').find(".span-upload").addClass("one-line").html(fileName);
                });
            },
            complete: function () {
                hideLoader();
            }
        })
    } else {
        $("#soDSupplierProducts tr").remove();
    }
}

calculateSupplierOfferTotal = function () {
    let rate = parseFloat($("#soExchangeRate").val());
    let additionalCost = parseFloat($("#soAdditionalCost").val());
    let totalPrice = 0;
    $("#soSupplierProducts tr").each(function () {
        let productPrice = parseFloat($(this).find(".input-price input").val());
        let productQTY = parseInt($(this).closest("tr").find(".soproductqty").text());
        let productTotal = productPrice * productQTY;
        $(this).closest("tr").find(".soproducttotal").text(productTotal);
        totalPrice += productTotal;
    })

    totalPrice += additionalCost;
    $("#soTotalPrice").text(totalPrice.toFixed(2));
    $("#soTotalPriceLocal").text((totalPrice * rate).toFixed(2));
}

calculateDetailsSupplierOfferTotal = function () {
    let rate = parseFloat($("#soDExchangeRate").val());
    let additionalCost = parseFloat($("#soDAdditionalCost").val());
    let totalPrice = 0;
    $("#soDSupplierProducts tr").each(function () {
        let productPrice = parseFloat($(this).find(".input-price input").val());
        let productQTY = parseInt($(this).closest('tr').find(".soproductqty").text());
        let productTotal = productPrice * productQTY;
        $(this).closest('tr').find(".soproducttotal").text(productTotal);
        totalPrice += productTotal;
    })

    totalPrice += additionalCost;
    $("#soDTotalPrice").text(totalPrice.toFixed(2));
    $("#soDTotalPriceLocal").text((totalPrice * rate).toFixed(2));
}

soDeliveryTypeChanged = function () {
    var isFirstOptionSelected = $("#soDeliveryTypeId option:first").is(":selected");
    var isLastOptionSelected = $("#soDeliveryTypeId option:last").is(":selected");
    if (isFirstOptionSelected || isLastOptionSelected) {
        $("#soCIFCost").val(0);
        $("#soCIFCost").attr("readonly", true);
    } else {
        $("#soCIFCost").removeAttr("readonly");
    }
}

soDDeliveryTypeChanged = function () {
    var isFirstOptionSelected = $("#soDDeliveryTypeId option:first").is(":selected");
    var isLastOptionSelected = $("#soDDeliveryTypeId option:last").is(":selected");
    if (isFirstOptionSelected || isLastOptionSelected) {
        $("#soDCIFCost").val(0);
        $("#soDCIFCost").attr("readonly", true);
    } else {
        $("#soDCIFCost").removeAttr("readonly");
    }
}

addSupplierOffer = function () {
    var opportunityId = $("#soOpportunityId").val();
    var supplierId = $("#soSupplierId").val();
    var currencyId = $("#soCurrencyId").val();
    var exchangeRate = $("#soExchangeRate").val();
    var paymentTypeId = $("#soPaymentTypeId").val();
    var deliveryTypeId = $("#soDeliveryTypeId").val();
    var CIFCost = $("#soCIFCost").val();
    var deliveryRangeFrom = $("#soDeliveryRangeFrom").val();
    var deliveryRangeTo = $("#soDeliveryRangeTo").val();
    var attachmentValue = $("#soAttachments").val();
    var additionalCost = $("#soAdditionalCost").val();
    var filesToUpload = $("#soAttachments")[0].files;

    let msgArr = [];
    if (supplierId == "") {
        msgArr.push(INVALID_SUPPLIER_ID);
    }
    if (currencyId == "") {
        msgArr.push(INVALID_CURRENCY_ID);
    }
    if (exchangeRate == 0) {
        msgArr.push(INVALID_EXCHANGE_RATE);
    }
    if (paymentTypeId == "") {
        msgArr.push(INVALID_PAYMENT_TYPE_ID);
    }
    if (deliveryTypeId == "") {
        msgArr.push(INVALID_DELIVERY_TYPE_ID);
    }
    if (deliveryRangeFrom == "" || deliveryRangeTo == "") {
        msgArr.push(INVALID_DELIVERY_RANGE);
    }
    if (attachmentValue == "") {
        msgArr.push(INVALID_ATTACHMENT);
    }

    var isFirstOptionSelected = $("#soDeliveryTypeId option:first").is(":selected");
    var isLastOptionSelected = $("#soDeliveryTypeId option:last").is(":selected");
    if (!(isFirstOptionSelected || isLastOptionSelected) && CIFCost == 0) {
        msgArr.push(INVALID_CIF_COST);
    }

    var isProductsError = false;
    $("#soSupplierProducts tr").each(function () {
        let productPrice = $(this).find(".input-price input").val();
        if (productPrice == "") {
            isProductsError = true;
        }
    })
    if (isProductsError) {
        msgArr.push(INVALID_PRODUCTS);
    }

    if (msgArr.length) {
        toastr.error(msgArr.join('</br>'));
        return;
    }

    showLoader();
    let formData = new FormData();
    for (let i = 0; i < filesToUpload.length; i++) {
        formData.append("Files", filesToUpload[i]);
    }

    formData.append("OpportunityId", opportunityId);
    formData.append("SupplierId", supplierId);
    formData.append("CurrencyId", currencyId);
    formData.append("ExchangeRate", exchangeRate);
    formData.append("PaymentTypeId", paymentTypeId);
    formData.append("DeliveryTypeId", deliveryTypeId);
    formData.append("CIFCost", CIFCost);
    formData.append("DeliveryRangeFrom", deliveryRangeFrom);
    formData.append("DeliveryRangeTo", deliveryRangeTo);
    formData.append("AdditionalCost", additionalCost);

    //let productVMs = [];
    let j = 0;
    $("#soSupplierProducts tr").each(function () {
        let productVM = {};
        formData.append("ProductVMs[" + j + "].TechnicalSpecificationProductId", $(this).find(".sotsproductid").val());
        formData.append("ProductVMs[" + j + "].Price", $(this).find(".input-price input").val());
        formData.append("ProductVMs[" + j + "].File", $(this).find(".soproductattachment")[0].files[0]);
        j++;
    })

    $.ajax({
        url: "/Opportunities/AddSupplierOffer",
        data: formData,
        method: "POST",
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        success: function (data) {
            $("#supplierOffers").html(data);
            clearSupplierOfferForm();
            cancelSupplierOfferClicked();
        },
        complete: function () {
            hideLoader();
        }
    })
}

updateSupplierOffer = function () {
    var opportunityId = $("#soOpportunityId").val();
    var offerId = $("#soDOfferId").val();
    var supplierId = $("#soDSupplierId").val();
    var currencyId = $("#soDCurrencyId").val();
    var exchangeRate = $("#soDExchangeRate").val();
    var paymentTypeId = $("#soDPaymentTypeId").val();
    var deliveryTypeId = $("#soDDeliveryTypeId").val();
    var CIFCost = $("#soDCIFCost").val();
    var deliveryRangeFrom = $("#soDDeliveryRangeFrom").val();
    var deliveryRangeTo = $("#soDDeliveryRangeTo").val();
    var additionalCost = $("#soDAdditionalCost").val();
    var filesToUpload = $("#soDAttachments")[0].files;

    let msgArr = [];
    if (supplierId == "") {
        msgArr.push(INVALID_SUPPLIER_ID);
    }
    if (currencyId == "") {
        msgArr.push(INVALID_CURRENCY_ID);
    }
    if (exchangeRate == 0) {
        msgArr.push(INVALID_EXCHANGE_RATE);
    }
    if (paymentTypeId == "") {
        msgArr.push(INVALID_PAYMENT_TYPE_ID);
    }
    if (deliveryTypeId == "") {
        msgArr.push(INVALID_DELIVERY_TYPE_ID);
    }
    if (deliveryRangeFrom == "" || deliveryRangeTo == "") {
        msgArr.push(INVALID_DELIVERY_RANGE);
    }

    var isFirstOptionSelected = $("#soDDeliveryTypeId option:first").is(":selected");
    var isLastOptionSelected = $("#soDDeliveryTypeId option:last").is(":selected");
    if (!(isFirstOptionSelected || isLastOptionSelected) && CIFCost == 0) {
        msgArr.push(INVALID_CIF_COST);
    }

    var isProductsError = false;
    $("#soSupplierProducts tr").each(function () {
        let productPrice = $(this).find(".input-price input").val();
        if (productPrice == "") {
            isProductsError = true;
        }
    })
    if (isProductsError) {
        msgArr.push(INVALID_PRODUCTS);
    }

    if (msgArr.length) {
        toastr.error(msgArr.join('</br>'));
        return;
    }

    showLoader();
    let formData = new FormData();
    for (let i = 0; i < filesToUpload.length; i++) {
        formData.append("Files", filesToUpload[i]);
    }

    formData.append("Id", offerId);
    formData.append("OpportunityId", opportunityId);
    formData.append("SupplierId", supplierId);
    formData.append("CurrencyId", currencyId);
    formData.append("ExchangeRate", exchangeRate);
    formData.append("PaymentTypeId", paymentTypeId);
    formData.append("DeliveryTypeId", deliveryTypeId);
    formData.append("CIFCost", CIFCost);
    formData.append("DeliveryRangeFrom", deliveryRangeFrom);
    formData.append("DeliveryRangeTo", deliveryRangeTo);
    formData.append("AdditionalCost", additionalCost);

    //let productVMs = [];
    let j = 0;
    $("#soDSupplierProducts tr").each(function () {
        let productVM = {};
        formData.append("ProductVMs[" + j + "].Id", $(this).find(".soproductid").val());
        formData.append("ProductVMs[" + j + "].OfferId", $(this).find(".soproductofferid").val());
        formData.append("ProductVMs[" + j + "].TechnicalSpecificationProductId", $(this).find(".sotsproductid").val());
        formData.append("ProductVMs[" + j + "].Price", $(this).find(".input-price input").val());
        formData.append("ProductVMs[" + j + "].File", $(this).find(".soproductattachment")[0].files[0]);
        formData.append("ProductVMs[" + j + "].AttachmentId", $(this).find(".soproductattachmentid").val());
        j++;
    })

    $.ajax({
        url: "/Opportunities/UpdateSupplierOffer",
        data: formData,
        method: "POST",
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        success: function (data) {
            $("#supplierOffers").html(data);

            $("#editOfferForm").addClass("d-none");
        },
        complete: function () {
            hideLoader();
        }
    })
}

clearSupplierOfferForm = function () {
    let opportunityId = $("#soOpportunityId").val();

    $("#addOfferForm").load("/Opportunities/ClearSupplierOfferForm/" + opportunityId, function () {
        $(".sup-offer-attachment-input").on("change", function () {
            var fileName = $(this).val().split("\\").pop();
            $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
            $(this).siblings(".file-upload-label").find(".span-upload").addClass("selected").html(fileName);
        });
        initCustomList('#availableSuppliers');
    });
}

showHideCIF = function () {
    let isAllCIF = $("#isAllCIF").is(":checked");
    if (isAllCIF) {
        $(".wocif").addClass("d-none");
        $(".wcif").removeClass("d-none");
    } else {
        $(".wocif").removeClass("d-none");
        $(".wcif").addClass("d-none");
    }
}

deleteSupplierOffer = function (supplierOfferId) {
    showLoader();
    var opportunityId = $("#soOpportunityId").val();
    $.ajax({
        url: '/Opportunities/DeleteSupplierOffer/' + opportunityId + '?supplierOfferId=' + supplierOfferId,
        method: 'POST',
        success: function (data) {
            $("#supplierOffers").html(data);
            hideLoader();
        }
    });
}

deleteDbSupplierOffer = function (supplierOfferId, btnDelete) {
    showLoader();
    var opportunityId = $("#soOpportunityId").val();
    $.ajax({
        url: '/Opportunities/DeleteSupplierOffer?supplierOfferId=' + supplierOfferId,
        method: 'POST',
        success: function (data) {
            $(btnDelete).parent('td').parent('tr').remove();
            $("#changeableActions").load('/Opportunities/RefreshChangeableActions/' + opportunityId, function () {
                hideLoader();
            });
            updateSupplierOffersNo(-1);
        }
    });
}

deleteOfferAttachment = function (offerAttachmentId) {
    showLoader();
    $.ajax({
        url: "/Opportunities/DeleteOfferAttachment?offerAttachmentId=" + offerAttachmentId,
        success: function (result) {
            if (result) {
                $("#offerAttachment_" + offerAttachmentId).remove();
            } else {
                toastr.error(ERROR_DB);
            }
        },
        complete: function () {
            hideLoader();
        }
    })
}

updateRequestOffersNo = function (newNumber) {
    var oldNumber = parseInt($("#requestOffersNo").text());
    var number = oldNumber + newNumber;
    $("#requestOffersNo").text(number);
    updateTotalOffersNo(newNumber);
}

updateSupplierOffersNo = function (newNumber) {
    var oldNumber = parseInt($("#supplierOffersNo").text());
    var number = oldNumber + newNumber;
    $("#supplierOffersNo").text(number);
    updateTotalOffersNo(newNumber);
}

updateTotalOffersNo = function (newNumber) {
    var oldNumber = parseInt($("#totalOffersNo").text());
    var number = oldNumber + newNumber;
    $("#totalOffersNo").text(number);
}

deleteAttachment = function (attachmentId) {
    showLoader();
    var opportunityId = $("#ofilesOpportunityId").val();
    $.ajax({
        url: '/Opportunities/DeleteAttachment?attachmentId=' + attachmentId,
        method: 'POST',
        success: function (data) {
            $("#opportunityFiles").load("/Opportunities/GetOpportunityFiles/" + opportunityId, function () {
                $("#techSpecsAttachments").load("/Opportunities/GetTechSpecsAttachments/" + opportunityId, function () {
                    $("#oBidBond").load("/Opportunities/GetBidBondDetails/" + opportunityId, function () {
                        $("#oBookTender").load("/Opportunities/GetBookTenderDetails/" + opportunityId, function () {
                            hideLoader();
                        });
                    });
                });
            });
        }
    });
}

saveForm = function (actionType) {
    var isFormValid = $("#opportunityForm").valid();
    if (isFormValid) {
        showLoader();
        $("#actionType").val(actionType);
        $("#opportunityForm").submit();
    }
}

calculateBookTenderTotal = function () {
    if ($("#bookTenderFees").val() == "") {
        $("#bookTenderFees").val(0)
    }
    var fees = parseFloat($("#bookTenderFees").val());
    var VAT = parseFloat($("#VAT").val());
    var total = parseFloat(fees * (VAT / 100) + fees);
    $("#bookTenderTotalFees").val(total.toFixed(2));
}

favourite = function (itemId) {
    showLoader();
    $.ajax({
        url: '/Opportunities/ToggleFavourite?itemId=' + itemId,
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

initializeIndex = function (dataTableSelector) {
    deleteConfirmationOpportunity();

    var orderOptions = [];
    var dateOrder = [10, 'asc'];
    orderOptions.push(dateOrder);

    var colDefsOptions = [];
    var budgetOptions = {};
    budgetOptions.render = $.fn.dataTable.render.number(',', '.', 2);
    budgetOptions.targets = 8;
    colDefsOptions.push(budgetOptions);

    var buttonOptions = [
        {
            extend: 'excel',
            exportOptions: {
                columns: [0, 2, 3, 4, 5, 6, 8, 10]
            }
        },
        {
            extend: 'print',
            orientation: 'landscape',
            exportOptions: {
                columns: [0, 2, 3, 4, 5, 6, 8, 10]
            },
        }
    ];

    var stateLoadParams = function (settings, data) {
        try {
            var typesFilter = data.columns[4].search.search;
            var statusesFilter = data.columns[12].search.search;
            var optionFilter = data.columns[3].search.search;
            var dueDateFrom = data.dueDateFrom;
            var dueDateTo = data.dueDateTo;
            var searchInp = data.search.search;

            $('#opportunityTypesFilter').val(typesFilter);
            $('#opportunityStatusesFilter').val(statusesFilter);
            $('#dueDateFrom').val(dueDateFrom);
            $('#dueDateTo').val(dueDateTo);
            $("#searchbox").val(searchInp);
            deptFilter = optionFilter.split('|');
            $('#departmentFilter').val(deptFilter);
        } catch { }
    }

    var stateSaveParams = function (settings, data) {
        data.dueDateFrom = $("#dueDateFrom").val();
        data.dueDateTo = $("#dueDateTo").val();
    }

    var footerCallbackFn = function (row, data, start, end, display) {
        var numFormat = $.fn.dataTable.render.number(',', '.', 2).display;

        var api = this.api(), data;

        // Remove the formatting to get integer data for summation
        var intVal = function (i) {
            return typeof i === 'string' ?
                i.replace(/[\$,]/g, '') * 1 :
                typeof i === 'number' ?
                    i : 0;
        };

        // Total over all pages
        total = api
            .column(8)
            .data()
            .reduce(function (a, b) {
                return intVal(a) + intVal(b);
            }, 0);

        // Total over this page
        pageTotal = api
            .column(8, { page: 'current' })
            .data()
            .reduce(function (a, b) {
                return intVal(a) + intVal(b);
            }, 0);

        // Update footer
        $(api.column(6).footer()).html(
            numFormat(pageTotal)
        );
    }

    var dataTable = handleDataTable({
        selector: dataTableSelector,
        order: orderOptions,
        columnDefs: colDefsOptions,
        footerCallback: footerCallbackFn,
        stateLoadCallback: stateLoadParams,
        stateSaveCallback: stateSaveParams,
        buttons: buttonOptions
    });

    $("#opportunityTypesFilter").change(function () {
        dataTable.api().columns(4).search(this.value ? this.value : '').draw();
        refreshFilterResult();
    })

    $("#opportunityStatusesFilter").change(function () {
        dataTable.api().columns(12).search(this.value ? this.value : '', true, false).draw();
        refreshFilterResult();
    })

    $("#departmentFilter").change(function () {
        //assemble the regex expression for multiple select values
        var regEx = $(this).find(':selected').map(function () {
            return $(this).val();
        }).get().join("|");
        dataTable.api().columns(3).search(regEx, true, false).draw();
        refreshFilterResult();
    })

    $.fn.dataTable.ext.search.push(
        function (settings, data, dataIndex) {
            var min = new Date($("#dueDateFrom").val());
            min.setHours(0);
            min.setMinutes(0);
            min.setSeconds(0);

            var max = new Date($("#dueDateTo").val());
            max.setHours(0);
            max.setMinutes(0);
            max.setSeconds(0);

            var date = convertFromStringToDate(data[10]);

            if (
                (!isValidDate(min) && !isValidDate(max)) ||
                (!isValidDate(min) && date <= max) ||
                (min <= date && !isValidDate(max)) ||
                (min <= date && date <= max)
            ) {
                return true;
            }
            return false;
        }
    );

    $("#dueDateFrom, #dueDateTo").change(function () {
        dataTable.api().draw();
        refreshFilterResult();
    })

    $('#opportunityTypesFilter').trigger('change');
    $('#opportunityStatusesFilter').trigger('change');
    $('#dueDateFrom').trigger('change');
    $('#dueDateTo').trigger('change');
    $("#searchbox").trigger('change');
    $('#departmentFilter').trigger('change');

    refreshFilterResult();

    $('.pdf-text').on('click', function () {
        dataTable.api().button('.buttons-print').trigger('click');
        $(this).parent().toggleClass("open");
    });

    $('.excel-text').on('click', function () {
        dataTable.api().button('.buttons-excel').trigger('click');
        $(this).parent().toggleClass("open");
    });
}

selectProducts = function () {
    var departmentIds = $("#DepartmentId").val();
    var selectedDepartments = "";
    if (departmentIds) {
        selectedDepartments = $("#DepartmentId :selected");
        var selectedText = [];
        $(selectedDepartments).each(function () {
            selectedText.push($(this).text());
        });
    }
    $("#departmentIds").val(departmentIds);
    if (selectedDepartments.length > 0) {
        $("#productDepartmentNames").text(selectedText.join(', '));
    } else {
        $("#productDepartmentNames").text(ERROR_SELECT_DEPARTMENT);
    }

    var productIds = [];
    $("#productsTable>tbody>tr").each(function () {
        var row = $(this);
        let id = row.find("td").eq(1).find("input").val();
        productIds.push(id);
    });
    $("#selected-product-ids").val(productIds);

    $("#saveSelectedItem").on('click', function () {
        let selectedItems = $("#category-item-value").val();
        refreshProducts(selectedItems);
        $("#saveSelectedItem").unbind('click');
        $("#selectProductsModal").modal('hide');
    })
}

refreshProducts = function (items) {
    let itemArr = [];
    if (items) {
        for (let i = 0; i < items.split(',').length; i++) {
            itemArr.push(items.split(',')[i]);
        }
    }
    var model = {};
    model.ProductVMs = [];

    var rows = $("#productsTable>tbody>tr").each(function () {
        var row = $(this);
        var productVM = {};
        productVM.Id = row.find("td").eq(0).find("input").eq(0).val();
        productVM.TechnicalSpecificationId = row.find("td").eq(0).find("input").eq(1).val();
        productVM.ProductName = row.find("td").eq(0).find("input").eq(2).val();
        productVM.ProductNameAr = row.find("td").eq(0).find("input").eq(3).val();
        productVM.ProductId = row.find("td").eq(1).find("input").val();
        productVM.Quantity = row.find("td").eq(2).find("input").val();
        productVM.Description = row.find("td").eq(3).find("input").val();
        //productVM.ProductOriginId = row.find("td").eq(4).find("select").val();
        //let origins = row.find("td").eq(4).find("select").val();
        productVM.RequestedOriginIdsStr = row.find("td").eq(4).find("input").val();
        productVM.AttachmentId = row.find("td").eq(6).find("input.tsproduct-attachmentid").val();
        productVM.AttachmentTitle = row.find("td").eq(6).find("input.tsproduct-attachmenttitle").val();

        var attachmentValue = row.find("td").eq(6).find("input.tsproduct-attachment-input").val();
        var fileToUpload = row.find("td").eq(6).find("input.tsproduct-attachment-input")[0].files[0];
        if (attachmentValue) {
            let formData = new FormData();
            formData.append("file", fileToUpload);

            $.ajax({
                url: '/Opportunities/UploadTechnicalSpecsProductFile/' + productVM.AttachmentId,
                async: false,
                data: formData,
                method: "POST",
                enctype: 'multipart/form-data',
                processData: false,
                contentType: false,
                success: function (data) {
                    productVM.AttachmentId = data.attachmentId;
                    productVM.AttachmentPath = data.filePath;
                }
            });
        }

        model.ProductVMs.push(productVM);
    });

    for (let i = 0; i < itemArr.length; i++) {
        var product = {};
        product.ProductId = itemArr[i];
        model.ProductVMs.push(product);
    }

    showLoader();
    $.ajax({
        url: '/Opportunities/RefreshTechnicalSpecsProduct',
        method: 'POST',
        data: model,
        success: function (data) {
            $("#techSpecsProducts").html(data);

            $('.tsproduct-origin').selectpicker();
            $('select.tsproduct-origin').each(function () {
                reloadProductOriginStr(this);
            })
            $('select.tsproduct-origin').on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
                reloadProductOriginStr(this);
            });

            $(".tsproduct-attachment-input").on("change", function () {
                var fileName = $(this).val().split("\\").pop();
                $(this).siblings(".tsproduct-attachment-label").find(".span-upload").addClass("selected").html(fileName);
            });
        },
        complete: function () {
            hideLoader();
        }
    })
}

reloadProductOriginStr = function (element) {
    var options = $(element).find("option:selected");
    var selected = [];

    $(options).each(function () {
        selected.push($(this).val());
    });

    $(element).parents('td').find(".tsproduct-originstr").val(selected.join(','));
}

clearProducts = function () {
    var model = {};
    model.ProductVMs = [];

    showLoader();
    $.ajax({
        url: '/Opportunities/RefreshTechnicalSpecsProduct',
        method: 'POST',
        data: model,
        success: function (data) {
            $("#techSpecsProducts").html(data);
        },
        complete: function () {
            hideLoader();
        }
    })
}

selectSuppliers = function () {
    var departmentIds = $("#DepartmentId").val();
    var selectedDepartments = $("#DepartmentId :selected");
    var selectedText = [];
    $(selectedDepartments).each(function () {
        selectedText.push($(this).text());
    });
    $("#departmentIds").val(departmentIds);
    if (selectedDepartments.length > 0) {
        $("#supplierDepartmentNames").text(selectedText.join(', '));
    } else {
        $("#supplierDepartmentNames").text(ERROR_NO_DEPARTMENTS_SELECTED);
    }

    var productIds = [];
    $("#productsTable>tbody>tr").each(function () {
        var row = $(this);
        let id = row.find("td").eq(1).find("input").val();
        productIds.push(id);
    });
    $("#productIds").val(productIds);

    var supplierIds = [];
    $("#tblRequestOffers>tbody>tr").each(function () {
        var row = $(this);
        let id = row.find("td").eq(3).find("input").eq(2).val();
        supplierIds.push(id);
    });
    $("#selected-supplier-ids").val(supplierIds);

    $("#saveSelectedSuppliers").on('click', function () {
        let selectedItems = $("#supplier-ids").val();
        refreshSuppliers(selectedItems);
        $("#saveSelectedSuppliers").unbind('click');
        $("#selectSuppliersModal").modal('hide');
    })
}

refreshSuppliers = function (suppliers) {
    let itemArr = [];
    if (suppliers) {
        for (let i = 0; i < suppliers.split(',').length; i++) {
            itemArr.push(suppliers.split(',')[i]);
        }
    }

    var model = {};
    model.RequestOfferVMs = [];
    model.TechnicalSpecificationId = $("#TechnicalSpecificationVM_Id").val();
    model.OpportunityId = $("#Id").val();

    for (let i = 0; i < itemArr.length; i++) {
        var supplier = {};
        supplier.SupplierId = itemArr[i];
        model.RequestOfferVMs.push(supplier);
    }

    showLoader();
    $.ajax({
        url: '/Opportunities/AddRequestOffers',
        method: 'POST',
        data: model,
        success: function (data) {
            $("#requestOffers").html(data);
            refreshAvailableSuppliers();
        },
        complete: function () {
            hideLoader();
        }
    })
}

requestOfferEmailSent = function (index, btn, id) {
    let opportunityId = $("#Id").val();
    showLoader();
    $.ajax({
        url: "/Opportunities/RequestOfferEmailSent/" + opportunityId + "?offerId=" + id,
        success: function (data) {
            $("[name='RequestOfferVMs[" + index + "].IsEmailSent']").val(true);
            $(btn).addClass('d-none');
            $("#emailSentMSG_" + index + " .sent").removeClass("d-none");
            $("#emailSentMSG_" + index + " .notsent").addClass("d-none");

            $("#requestOffers").html(data);

            refreshAvailableSuppliers();
        },
        error: function () {
            toastr.error(ERROR_DB);
        },
        complete: function () {
            hideLoader();
        }
    })
}

loadProductDetails = function (id) {
    showLoader();
    $.ajax({
        url: '/Opportunities/GetTechSpecsProductDetails/' + id,
        success: function (data) {
            $("#productDetailsModal").html(data);
        },
        complete: function () {
            hideLoader();
        }
    })
}

applyToAllOrigins = function () {
    var originIds = $("select.tsproduct-origin").eq(0).val();
    $("select.tsproduct-origin").selectpicker("val", originIds);
}

requestBidBond = function (element) {
    var amount = $("#BidBondVM_Amount").val();
    var assignedTo = $("#BidBondVM_AssignedToId").val();

    if ($("#BidBondVM_Amount").valid() && amount && assignedTo) {
        $("#BidBondVM_IsRequested").val(true);
        $("#bidbondPendingFinancialMSG").removeClass("d-none");
        $(element).addClass("d-none");
        $(".disableBidBond").removeClass("d-none");
    } else {
        toastr.error(ERROR_INVALID_DATA);
    }
}

sendBidBond = function (element) {
    var isValid = false;
    var amount = $("#BidBondVM_Amount").val();
    var assignedTo = $("#BidBondVM_AssignedToId").val();
    if ($("#BidBondVM_Amount").valid() && amount && assignedTo) {
        var isLG = $("#BidBondVM_CashType").is(":checked");
        if (isLG) {
            var bankId = $("#BidBondVM_BidBondOn_BankId").val();
            if (bankId) {
                isValid = true;
            }
        } else {
            isValid = true;
        }
    }

    if (isValid) {
        $("#BidBondVM_IsSent").val(true);
        $("#bidbondPendingManagerMSG").removeClass("d-none");
        $(element).addClass("d-none");
        $(".disableBidBond").removeClass("d-none");
    } else {
        toastr.error(ERROR_INVALID_DATA);
    }
}

approveBidBond = function () {
    var isValid = false;
    var amount = $("#BidBondVM_Amount").val();
    var assignedTo = $("#BidBondVM_AssignedToId").val();
    if ($("#BidBondVM_Amount").valid() && amount && assignedTo) {
        var isLG = $("#BidBondVM_CashType").is(":checked");
        if (isLG) {
            var bankId = $("#BidBondVM_BidBondOn_BankId").val();
            if (bankId) {
                isValid = true;
            }
        } else {
            isValid = true;
        }
    }

    if (isValid) {
        $("#BidBondVM_IsApproved").val(true);
        $("#approvedBidbondBlock").removeClass("d-none");
        $(".disableBidBond").removeClass("d-none");
        $("#btnBidbondApprove").addClass("d-none");
        $("#btnBidbondReject").addClass("d-none");
    } else {
        toastr.error(ERROR_INVALID_DATA);
    }
}

cancelBidbondApproval = function () {
    $("#BidBondVM_IsApproved").val(false);
    $("#approvedBidbondBlock").addClass("d-none");
    $(".disableBidBond").addClass("d-none");
    $("#btnBidbondApprove").removeClass("d-none");
    $("#btnBidbondReject").removeClass("d-none");
}

rejectBidBond = function () {
    $("#BidBondVM_IsRejected").val(true);
    $("#rejectedBidbondBlock").removeClass("d-none");
    $(".disableBidBond").removeClass("d-none");
    $("#btnBidbondApprove").addClass("d-none");
    $("#btnBidbondReject").addClass("d-none");
}

cancelBidbondRejection = function () {
    $("#BidBondVM_IsRejected").val(false);
    $("#rejectedBidbondBlock").addClass("d-none");
    $(".disableBidBond").addClass("d-none");
    $("#btnBidbondApprove").removeClass("d-none");
    $("#btnBidbondReject").removeClass("d-none");
}

printBidBondPage = function (requestId) {
    window.open('/Opportunities/PrintBidbondRequest?requestId=' + requestId, '_blank');
}

printBidbond = function () {
    let isMenuOpen = $("body").hasClass("sidebar-open");
    if (isMenuOpen) {
        $(".sidebar-toggle a").trigger("click");
    }

    window.onafterprint = function () {
        if (window.opener != null && !window.opener.closed) {
            var isPrinted = window.opener.document.getElementById("BidBondVM_IsPrinted");
            $(isPrinted).val(true);

            var btnPrint = window.opener.document.getElementById("btnBidbondPrint");
            $(btnPrint).addClass("d-none");

            var printedBlock = window.opener.document.getElementById("printedBidbondBlock");
            $(printedBlock).removeClass("d-none");
        }
        if (isMenuOpen) {
            $(".sidebar-toggle a").trigger("click");
        }
        window.close();
    }
    window.print();
}

requestBookTender = function (element) {
    var amount = $("#bookTenderFees").val();
    var assignedTo = $("#BookTenderVM_AssignedToId").val();

    if ($("#bookTenderFees").valid() && amount && assignedTo) {
        $("#BookTenderVM_IsRequested").val(true);
        $("#bookTenderPendingFinancialMSG").removeClass("d-none");
        $(element).addClass("d-none");
        $(".disableBookTender").removeClass("d-none");
    } else {
        toastr.error(ERROR_INVALID_DATA);
    }
}

sendBookTender = function (element) {
    var isValid = false;
    var amount = $("#bookTenderFees").val();
    var assignedTo = $("#BookTenderVM_AssignedToId").val();
    if ($("#bookTenderFees").valid() && amount && assignedTo) {
        isValid = true;
    }

    if (isValid) {
        $("#BookTenderVM_IsSent").val(true);
        $("#bookTenderPendingManagerMSG").removeClass("d-none");
        $(element).addClass("d-none");
        $(".disableBookTender").removeClass("d-none");
    } else {
        toastr.error(ERROR_INVALID_DATA);
    }
}

approveBookTender = function () {
    var isValid = false;
    var amount = $("#bookTenderFees").val();
    var assignedTo = $("#BookTenderVM_AssignedToId").val();
    if ($("#bookTenderFees").valid() && amount && assignedTo) {
        isValid = true;
    }

    if (isValid) {
        $("#BookTenderVM_IsApproved").val(true);
        $("#approvedBookTenderBlock").removeClass("d-none");
        $(".disableBookTender").removeClass("d-none");
        $("#btnBookTenderApprove").addClass("d-none");
        $("#btnBookTenderReject").addClass("d-none");
    } else {
        toastr.error(ERROR_INVALID_DATA);
    }
}

cancelBookTenderApproval = function () {
    $("#BookTenderVM_IsApproved").val(false);
    $("#approvedBookTenderBlock").addClass("d-none");
    $(".disableBookTender").addClass("d-none");
    $("#btnBookTenderApprove").removeClass("d-none");
    $("#btnBookTenderReject").removeClass("d-none");
}

rejectBookTender = function () {
    $("#BookTenderVM_IsRejected").val(true);
    $("#rejectedBookTenderBlock").removeClass("d-none");
    $(".disableBookTender").removeClass("d-none");
    $("#btnBookTenderApprove").addClass("d-none");
    $("#btnBookTenderReject").addClass("d-none");
}

cancelBookTenderRejection = function () {
    $("#BookTenderVM_IsRejected").val(false);
    $("#rejectedBookTenderBlock").addClass("d-none");
    $(".disableBookTender").addClass("d-none");
    $("#btnBookTenderApprove").removeClass("d-none");
    $("#btnBookTenderReject").removeClass("d-none");
}

printBookTenderPage = function (requestId) {
    window.open('/Opportunities/PrintBookTenderRequest?requestId=' + requestId, '_blank');
}

printBookTender = function () {
    let isMenuOpen = $("body").hasClass("sidebar-open");
    if (isMenuOpen) {
        $(".sidebar-toggle a").trigger("click");
    }

    window.onafterprint = function () {
        if (window.opener != null && !window.opener.closed) {
            var isPrinted = window.opener.document.getElementById("BookTenderVM_IsPrinted");
            $(isPrinted).val(true);

            var btnPrint = window.opener.document.getElementById("btnBookTenderPrint");
            $(btnPrint).addClass("d-none");

            var printedBlock = window.opener.document.getElementById("printedBookTenderBlock");
            $(printedBlock).removeClass("d-none");
        }
        if (isMenuOpen) {
            $(".sidebar-toggle a").trigger("click");
        }
        window.close();
    }
    window.print();
}

refreshFilterResult = function () {
    let filterResults = currentDataTable.rows({ search: 'applied' }).count();
    $('.result-filter > span').text(filterResults);

    let typeId = $('#opportunityTypesFilter :selected').val();
    if (typeId) {
        $('.type-filter').removeClass('d-none');
    } else {
        $('.type-filter').addClass('d-none');
    }
    $('.type-filter > span').text($('#opportunityTypesFilter :selected').text());

    let dueDateFromFilter = $('#dueDateFrom').val();
    let dueDateToFilter = $('#dueDateTo').val();
    $('.date-start').text(dueDateFromFilter ? moment(dueDateFromFilter).format('D MMM, YYYY') : DATE_FROM_FILTER_EMPTY);
    $('.date-end').text(dueDateToFilter ? moment(dueDateToFilter).format('D MMM, YYYY') : DATE_TO_FILTER_EMPTY);
    if (dueDateFromFilter || dueDateToFilter) {
        $('.date-filter').removeClass('d-none');
    } else {
        $('.date-filter').addClass('d-none');
    }

    let oppStatusesFilter = $('#opportunityStatusesFilter :selected').val();
    if (oppStatusesFilter) {
        $('.status-filter').removeClass('d-none');
    } else {
        $('.status-filter').addClass('d-none');
    }
    $('.status-filter > span').text($('#opportunityStatusesFilter :selected').text());

    let departmentFilter = $('#departmentFilter :selected');
    if (departmentFilter.length > 0) {
        $('.departments-filter').removeClass('d-none');
    } else {
        $('.departments-filter').addClass('d-none');
    }
    let depArr = [];
    $(departmentFilter).each(function () {
        depArr.push($(this).text());
    });
    $('.departments-filter > span').text(depArr.join(', '));

    if (typeId || dueDateFromFilter || dueDateToFilter || oppStatusesFilter || departmentFilter.length > 0) {
        $(".show-filter-choose").removeClass('d-none');
        $('.result-filter').removeClass('d-none');
    } else {
        $(".show-filter-choose").addClass('d-none');
        $('.result-filter').addClass('d-none');
    }
}

$('.type-filter .fa-times').click(function (e) {
    $('#opportunityTypesFilter').val('').trigger('change');
    refreshFilterResult();
});

$('.date-filter .fa-times').click(function (e) {
    $("#dueDateFrom , #dueDateTo").val('').trigger('change');
    refreshFilterResult();
});

$('.status-filter .fa-times').click(function (e) {
    $("#opportunityStatusesFilter").val('').trigger('change');
    refreshFilterResult();
});

$('.departments-filter .fa-times').click(function (e) {
    $("#departmentFilter").val('').trigger('change');
    refreshFilterResult();
});

var soAttachments = document.querySelector('#soAttachments')
if (soAttachments != null) {
    soAttachments.addEventListener("change", function () {
        document.querySelector(".supAttachmentsCountItem").innerHTML = '' + "<br>" + this.files.length + " File(s)";

    });
}

customerChanged = function () {
    let customerId = $("#CustomerId").val();
    if (customerId == "modal") {
        $("#modalCustomer").modal('show');
        $("#CustomerId").val("")
    } else {

        if (customerId) {
            showLoader();
            $.ajax({
                url: "/Opportunities/GetCustomerDetails?customerId=" + customerId,
                success: function (data) {
                    $("#CountryId").val(data.CountryId).trigger('change');
                    $("#Address").val(data.BillingAddress);
                    $("#DepartmentId").val(data.DepartmentId).trigger('change');
                },
                complete: function () {
                    hideLoader();
                }
            })
        }
        else {
            $("#CountryId").val("").trigger('change');
            $("#Address").val("");
        }
    }
}

changeOfferAcceptance = function (offerId) {
    var opportunityId = $("#soOpportunityId").val();

    showLoader();
    $("#supplierOffers").load(`/Opportunities/ChangeOfferAcceptance/${opportunityId}?offerId=${offerId}`, function () {
        hideLoader();
    })
}

deleteConfirmationOpportunity = function () {
    $(".opportunity-confirm-delete").confirmation({
        rootSelector: '[data-toggle=confirmation]',
        // other options
        popout: true,
        singleton: true,
        title: DELETE,
        btnOkLabel: YES,
        btnCancelLabel: NO,
        onConfirm: function () {
            switch ($(this).data('source')) {
                case "archiveOpportunity":
                    removeOpportunity($(this).data('itemid'));
                    hideLoader();
                    break;
                case "unArchiveOpportunity":
                    unRemoveOpportunity($(this).data('itemid'));
                    hideLoader();
                    break;
                case "unArchiveOpportunityArchive":
                    unArchiveOpportunityArchive($(this).data('itemid'));
                    break;
                case "archiveOpportunityArchive":
                    archiveOpportunityArchive($(this).data('itemid'));
                    break;
            }

        }
    })
}

getOpportunities = function () {
    showLoader();
    $.get(`/Opportunities/GetOpportunities`, function (data, status) {
        $("#getOpportunities").html(data);
        initializeIndex("#datatable_Opportunities");
        deleteConfirmationOpportunity();
        hideLoader();
        showLoaderFromAjax();
    })
}

removeOpportunity = function (id) {
    showLoader();
    $.get(`/Opportunities/Archive/${id}`, function (data, status) {
        getOpportunities();
    })
}

unRemoveOpportunity = function (id) {
    showLoader();
    $.get(`/Opportunities/Unarchive/${id}`, function (data, status) {
        getOpportunities();
    })
}

archiveOpportunity = function (id) {
    showLoader();
    $.get(`/Opportunities/Archive/${id}`, function (data, status) {
        hideLoader();
    })
}

unarchiveOpportunity = function (id) {
    showLoader();
    $.get(`/Opportunities/Unarchive/${id}`, function (data, status) {
        hideLoader();
    })
}

unArchiveOpportunityArchive = function (id) {
    showLoader();
    $.get(`/Opportunities/Unarchive/${id}`, function (data, status) {
        reloadOpportunityComponent();
    })
}

archiveOpportunityArchive = function (id) {
    showLoader();
    $.get(`/Opportunities/Archive/${id}`, function (data, status) {
        reloadOpportunityComponent();
    })
}

reloadOpportunityComponent = function () {
    showLoader();
    $.get("/Opportunities/ReloadViewComponent", function (data, status) {
        $("#opportunity").html(data);
        initializeIndex("#datatable_Opportunities_Archive");

        $("#departmentFilter").selectpicker();
        $("#opportunityStatusesFilter").selectpicker();
        $("#opportunityTypesFilter").selectpicker();

        $('.filter-open-opportunity-archive').on('click', function (e) {
            e.stopPropagation();
            if ($(this).hasClass("open")) {
                $(this).removeClass("open");
            } else {
                $(this).addClass("open")
            }
            $('.box-filter-opportunity-archive').toggleClass('open');
            $('.filter-popup-opportunity-archive').toggleClass('open');
            $('.overlay-body').toggleClass('open');
            $('body').toggleClass("no-scroll");
        });

        hideLoader();
        showLoaderFromAjax();
    })
}

initSelectPicker = function () {
    $("#CustomerId,#CountryId,#SalesAgentId,#DepartmentId,#ProjectManagerId,#soDCurrencyId,#soCurrencyId,#GuestId,#BidBondVM_AssignedToId,#BookTenderVM_AssignedToId")
        .selectpicker();
}

addCustomer = function () {
    let form = $("#formCustomer");
    let formData = new FormData(form[0]);
    if (form.valid()) {
        showLoader();
        $.ajax({
            url: "/Opportunities/CreateCustomer",
            data: formData,
            method: "POST",
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            success: function (data) {
                clearData("#formCustomer");
                $("#selectCustomer").html(data);
                $("#CustomerId").trigger("change");
                $("#CustomerId").selectpicker();
            },
            complete: function () {
                hideLoader();
                $("#modalCustomer").modal("hide");
            }
        })
    }
}

showModalAddSupplier = function () {
    $("#modalSupplier").modal("show");
}

addSupplier = function () {
    let form = $("#formSupplier");
    let formData = new FormData(form[0]);

    let productIds = $("#category-item-value").val().split(',');
    if (productIds.length > 0) {
        for (let i = 0; i < productIds.length; i++) {
            formData.append("SupplierProductIds", productIds[i]);
        }
    }

    if (form.valid()) {
        showLoader();
        $.ajax({
            url: "/Opportunities/CreateSupplier",
            data: formData,
            method: "POST",
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            success: function (data) {
                clearData("#formSupplier");
                loadSuppliers();
            },
            complete: function () {
                hideLoader();
                $("#modalSupplier").modal("hide");
            }
        })
    }
}

changeProduct = function () {
    var departmentIdsSupplier = $("#DepartmentIdSupplier").val();

    var queryParam = "";
    for (var i = 0; i < departmentIdsSupplier.length; i++) {
        queryParam += "departmentIds[" + i + "]=" + departmentIdsSupplier[i] + "&";
    }
    $.get(`/ProductCategories/GetByDepartments?${queryParam}isService=${false}`, function (data) {
        $("#suppplierProduct").html(data)
        productTreeInitialize("#suppplierProduct");
        $.get(`/ProductCategories/GetByDepartments?${queryParam}isService=${true}`, function (data) {
            $("#suppplierServices").html(data)
            productTreeInitialize("#suppplierServices");
        })
    })
}
