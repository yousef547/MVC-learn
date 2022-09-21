
favourite = function (itemId) {
    showLoader();
    $.ajax({
        url: '/Quotations/ToggleFavourite?itemId=' + itemId,
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

currencyChanged = function (id) {
    let currencyId = $("#currency_" + id).val();
    if (currencyId) {
        showLoader();
        $.get("/Quotations/GetCurrencyData?currencyId=" + currencyId, function (data, status) {
            $("#currencySymbol_" + id).text(data.Symbol);
            $("#rate_" + id).val(data.ExchangeRate);
            hideLoader();
        })
    } else {
        $("#currencySymbol_" + id).text('');
        $("#rate_" + id).val(0);
    }
}

addCurrency = function () {
    let quotationId = $("#quotationId").val();
    let model = {};
    let isValid = true;
    model.Currencies = [];
    $(".offer_model").each(function () {
        let currencyId = $(this).find(".offer_currencyid").val();
        let currencyRate = parseFloat($(this).find(".offer_rate").val());
        if (currencyId == "" || currencyRate <= 0) {
            isValid = false;
        }

        let currency = {};
        currency.Id = $(this).find(".offer_id").val();
        currency.CurrencyId = $(this).find(".offer_currencyid").val();
        currency.ExchangeRate = $(this).find(".offer_rate").val();

        model.Currencies.push(currency);
    })

    if (!isValid) {
        toastr.error(ERROR_INVALID_DATA);
        return;
    }

    showLoader();
    $.post(`/Quotations/AddCurrency/${quotationId}`, model, function (data, status) {
        $("#quotationCurrencies").html(data);
        hideLoader();
    })
}

deleteDbCurrency = function (id) {
    let quotationId = $("#quotationId").val();

    showLoader();
    $.get(`/Quotations/DeleteDbCurrency/${quotationId}?quotationCurrencyId=${id}`, function (data, success) {
        $("#quotationCurrencies").html(data);
        hideLoader();
    })
}

deleteCurrency = function (index) {
    $("#model_" + index).parent().remove();
}

productSupplierChanged = function (index) {
    let exchangeRate = parseFloat($("#item_" + index).find(".product-supplier option:selected").data('rate'));
    $("#item_" + index).find(".item-rate").val(exchangeRate);

    let productPrice = parseFloat($("#item_" + index).find(".product-supplier option:selected").data('price'));
    $("#item_" + index).find(".item-price").val(productPrice.toFixed(2));
    $("#item_" + index).find(".product-price").val(productPrice.toFixed(2));

    let factor = parseFloat($("#Factor").val()).toFixed(2);
    let vatPercentage = parseFloat($("#VATValueIds").val()).toFixed(2);
    calculateRowPrice(index, factor, vatPercentage);
}

calculateRowWoutFactor = function (index) {
    let vatPercentage = parseFloat($("#VATValueIds").val()).toFixed(2);
    let itemQTY = parseFloat($("#item_" + index).find(".item-quantity").val());

    let productPrice = parseFloat($("#item_" + index).find(".product-price").val());
    $("#item_" + index).find(".product-price").val(productPrice.toFixed(2));

    let subTotal = productPrice * itemQTY;
    $("#item_" + index).find(".product-subtotal").val(subTotal.toFixed(2));

    let productTotal = ((vatPercentage / 100) * subTotal) + subTotal;
    $("#item_" + index).find(".product-total").val(productTotal.toFixed(2));
}

calculateRowPrice = function (index, factor, vatPercentage) {
    let itemPrice = $("#item_" + index).find(".item-price").val();
    let itemQTY = $("#item_" + index).find(".item-quantity").val();

    let productPrice = itemPrice * factor;
    $("#item_" + index).find(".product-price").val(productPrice.toFixed(2));

    let subTotal = productPrice * itemQTY;
    $("#item_" + index).find(".product-subtotal").val(subTotal.toFixed(2));

    let productTotal = ((vatPercentage / 100) * subTotal) + subTotal;
    $("#item_" + index).find(".product-total").val(productTotal.toFixed(2));
}

calculateAllRowsPrice = function () {
    let factor = parseFloat($("#Factor").val()).toFixed(2);
    if (factor) {
        let vatPercentage = parseFloat($("#VATValueIds").val()).toFixed(2);
        $(".item-vat").val(vatPercentage);

        $(".item-row").each(function () {
            let index = $(this).attr('id').split('_')[1];
            calculateRowPrice(index, factor, vatPercentage);
        })
    }
}

checkGuaranteeTerms = function () {
    let isDelivery = $("#rbDelivery").is(":checked");
    if (isDelivery) {
        $("#DeliveryGuaranteeMonths").removeAttr("disabled");
        $("#CommissionGuaranteeMonths").val(0);
        $("#CommissionGuaranteeMonths").attr("disabled", true);
    } else {
        $("#CommissionGuaranteeMonths").removeAttr("disabled");
        $("#DeliveryGuaranteeMonths").val(0);
        $("#DeliveryGuaranteeMonths").attr("disabled", true);
    }
}

isIncludedChanged = function (index) {
    let isIncluded = $("#itemIncluded_" + index).is(":checked");
    if (isIncluded) {
        $(".include-item-" + index).removeClass('d-none');
    } else {
        $(".include-item-" + index).addClass('d-none');
    }
}

addOffer = function () {
    let isValid = $("#addOfferForm").valid();
    if (isValid) {
        showLoader();
        let formData = new FormData($("#addOfferForm")[0]);
        $.ajax({
            url: "/Quotations/AddOffer",
            data: formData,
            method: "POST",
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            success: function (result) {
                if (result.success) {
                    clearAddOfferForm(result.quotationId);
                    loadOffers(result.quotationId);
                } else {
                    $("#addOffer").html(result);

                    $("#CurrencyId").selectpicker();
                    $("#ValidityId").selectpicker();
                    $("#DeliveryPlaceId").selectpicker();
                    $("#OriginDocumentId").selectpicker();
                    $("#CertificateIds").selectpicker();
                    $("#GuaranteeTermId").selectpicker();
                    $(".product-origin").selectpicker();

                    checkGuaranteeTerms();

                    let i = 0;
                    $(".item-row").each(function () {
                        isIncludedChanged(i);
                        i++;
                    })

                    calculateAllRowsPrice();

                    initRichText("#TechnicalSpecifications");

                    initRichText("#CoverLetter");
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
        toastr.error(ERROR_INVALID_DATA);
    }
}

addOfferVersion = function () {
    let isValid = $("#addOfferForm").valid();
    if (isValid) {
        showLoader();
        $("#addOfferForm").submit();
    } else {
        toastr.error(ERROR_INVALID_DATA);
    }
}

loadOffers = function (quotationId) {
    showLoader();
    $.ajax({
        url: '/Quotations/GetOffers/' + quotationId,
        success: function (offers) {
            $("#offers").html(offers);
        },
        complete: function () {
            hideLoader();
        }
    })
}

updateOffer = function () {
    let isValid = $("#editOfferForm").valid();
    if (isValid) {
        showLoader();
        $("#editOfferForm").submit();
    } else {
        toastr.error(ERROR_INVALID_DATA);
    }
}

clearAddOfferForm = function (quotationId) {
    $.ajax({
        url: '/Quotations/ClearAddOffer/' + quotationId,
        success: function (result) {
            if (result.offersDone) {
                $("#addOffer").html("");
            } else {
                $("#addOffer").html(result);

                $("#CurrencyId").selectpicker();
                $("#ValidityId").selectpicker();
                $("#DeliveryPlaceId").selectpicker();
                $("#OriginDocumentId").selectpicker();
                $("#CertificateIds").selectpicker();
                $("#GuaranteeTermId").selectpicker();
                $(".product-origin").selectpicker();

                checkGuaranteeTerms();

                let i = 0;
                $(".item-row").each(function () {
                    isIncludedChanged(i);
                    i++;
                })

                calculateAllRowsPrice();

                initRichText("#TechnicalSpecifications");

                initRichText("#CoverLetter");
            }
        }
    })
}

deleteConfirmationQuotations = function () {
    $(".quotations-confirm-delete").confirmation({
        rootSelector: '[data-toggle=confirmation]',
        // other options
        popout: true,
        singleton: true,
        title: DELETE,
        btnOkLabel: YES,
        btnCancelLabel: NO,
        onConfirm: function () {
            switch ($(this).data('source')) {
                case "myQuotations":
                    deleteQuotations($(this).data('itemid'), $(this).data('status'));
                    break;
                case "convertQuotation":
                    convertToOpportunity($(this).data('itemid'), $(this).data('status'));
                    break;
            }

        }
    })
}

deleteConfirmationConversation = function () {
    $(".conversation-confirm-delete").confirmation({
        rootSelector: '[data-toggle=confirmation]',
        // other options
        popout: true,
        singleton: true,
        title: DELETE,
        btnOkLabel: YES,
        btnCancelLabel: NO,
        onConfirm: function () {
            switch ($(this).data('source')) {
                case "archiveConversationSupplier":
                    archiveConversationSupplier($(this).data('itemid'));
                    break;
                case "archiveConversationCustomer":
                    archiveConversationCustomer($(this).data('itemid'));
                    break;
                case "archiveNegotiationSupplier":
                    archiveNegotiationSupplier($(this).data('itemid'));
                    break;
                case "archiveNegotiationCustomer":
                    archiveNegotiationCustomer($(this).data('itemid'));
                    break;

            }

        }
    })
}

initquotationsTable = function () {
    var stateLoadParams = function (settings, data) {
        var searchData = data.search.search;
        $("#searchbox").val(searchData);
    }

    var orderOptions = [];
    var dateOrder = [6, 'asc'];
    orderOptions.push(dateOrder);

    handleDataTable({
        selector: ".table-quotations",
        stateLoadCallback: stateLoadParams,
        order: orderOptions
    });
}

getQuotations = function (statusEnum) {
    showLoader();
    $.get(`/Quotations/GetQuotations?statusEnum=${statusEnum}`, function (data, status) {
        $("#getQuotations").html(data);
        initquotationsTable();
        deleteConfirmationQuotations();
        hideLoader();
        showLoaderFromAjax();
    })
}

deleteQuotations = function (id, statusEnum) {
    showLoader();
    $.get(`/Quotations/Archive/${id}`, function (data, status) {
        getQuotations(statusEnum);
    });
}

convertToOpportunity = function (id, statusEnum) {
    showLoader();
    $.get(`/Quotations/ConvertToOpportunity/${id}`, function (data, status) {
        getQuotations(statusEnum);
    });
}

// Open Menu List Show Message Comarison
$('.parent-list').click(function (e) {
    e.stopPropagation();
    $(this).children(".sub-menu").toggleClass("open");
});

$(".list-choise-show-message .sub-menu li.all").click(function () {
    $(this).parent().prev('a').text($(this).text())
});

$(".list-choise-show-message .dateMessage").on('change', function () {
    $(this).parent().parent().prev('a').text($(this).val());
});

$('.add-message button').click(function () {

    $('#modalAddMessage').modal("show");
});

getConversationMessages = function () {
    let quotationId = $("#detailsQuotationId").val();
    let supplierId = $("#conversationSuppliers").val();
    let dateMessage = $("#dateMessage").val();
    //$(".msg-conversation").removeClass("d-none");
    var imageSupplier = $('#conversationSuppliers').find(":selected").attr('data-image');
    $("#logoSupplier").attr("src", imageSupplier);
    $.ajax({
        url: `/Quotations/GetMassageSupplier/${quotationId}?supplierId=${supplierId}&&date=${dateMessage}`,
        async: false,
        success: function (data) {
            $("#supplier-msg").html(data);
            deleteConfirmationConversation();

            $(".attach-supplier.file-attach").each(function () {
                let url = $(this).find("a").attr('href');
                if (url) {
                    let size = getFileSize(url);
                    $(this).find("span").text(size);
                }
            })

            dateMessage = $("#dateMessageCustomer").val();
            $.ajax({
                url: `/Quotations/GetMassageCustomer/${quotationId}?date=${dateMessage}`,
                async: false,
                success: function (data) {
                    $("#customer-msg").html(data);
                    deleteConfirmationConversation();

                    $(".attach-customer.file-attach").each(function () {
                        let url = $(this).find("a").attr('href');
                        if (url) {
                            let size = getFileSize(url);
                            $(this).find("span").text(size);
                        }
                    })
                }
            });
        }
    });
}

getSupplierMassages = function () {
    showLoaderConversation("spinner-supplier");
    var imageSupplier = $('#conversationSuppliers').find(":selected").attr('data-image');
    $("#logoSupplier").attr("src", imageSupplier);
    let quotationId = $("#detailsQuotationId").val();
    let supplierId = $("#conversationSuppliers").val();
    let dateMessage = $("#dateMessage").val();
    $.ajax({
        url: `/Quotations/GetMassageSupplier/${quotationId}?supplierId=${supplierId}&&date=${dateMessage}`,
        //async: false, //blocks window close
        success: function (data) {
            $("#supplier-msg").html(data);
            deleteConfirmationConversation();

            $(".attach-supplier.file-attach").each(function () {
                let url = $(this).find("a").attr('href');
                if (url) {
                    let size = getFileSize(url);
                    $(this).find("span").text(size);
                }
            })

            hideLoaderConversation("spinner-supplier");
        }
    });

}

emptysupplierDate = function () {
    $("#dateMessage").val("");
    getSupplierMassages();
}

CreateConversationSupplier = function () {
    let form = $("#conversationSupplier");
    let formData = new FormData(form[0]);
    if (form.valid()) {
        showLoader();
        $.ajax({
            url: "/Quotations/CreateConversationSupplier",
            data: formData,
            method: "POST",
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            success: function (data) {
                clearData("#conversationSupplier");
                $("#modalAddMessageSupplier").modal('hide');
                getSupplierMassages();
            },
            complete: function () {
                hideLoader();

            }
        })
    }
}

checkGuarantee = function () {
    let guaranteeTermId = $("#GuaranteeTermId").val();

    if (guaranteeTermId) {
        $(".is-guarantee").show();
    } else {
        $(".is-guarantee").hide();
    }
}

changeSelectedOffer = function (quotationId, versionId) {
    showLoader();
    $.ajax({
        url: "/Quotations/ChangeSelectedOfferVersion/" + quotationId + "?versionId=" + versionId,
        success: function (data) {
            loadOffers(quotationId);
        },
        complete: function () {
            hideLoader();
        }
    })
}

shwoModalConvarsation = function (modalId) {
    $("#SupplierId").val($("#conversationSuppliers").val());
    $("#QuotationId").val($("#detailsQuotationId").val());
    $(`#${modalId}`).modal("show");
};

showModalEditConvarsation = function (modalId, msgId) {
    showLoader();
    var quotationId = $("#detailsQuotationId").val();
    $.get(`/Quotations/EditConversationSupplier/${msgId}?quotationId=${quotationId}`, function (data) {
        $("#editMessagesupplier").html(data);
        hideLoader();
    })
    $("#supplierIdEdit").val($("#conversationSuppliers").val());
    $("#quotationIdEdit").val(quotationId);
    $(`#${modalId}`).modal("show");
};

updateConversationSupplier = function () {
    showLoader();
    let form = $("#conversationSupplierEdit");
    let formData = new FormData(form[0]);
    if (form.valid()) {
        $.ajax({
            url: "/Quotations/UpdateConversationSupplier",
            data: formData,
            method: "POST",
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            success: function (data) {
                if (data.result) {
                    $("#modalEditMessageSupplier").modal('hide');
                    getSupplierMassages();
                } else {
                    $("#conversationSupplierEdit").html(data);
                }
            },
            error: function (data) {
                toastr.error(ERROR_DB);
            },
            complete: function () {
                hideLoader();
            }
        })
    }
}

archiveConversationSupplier = function (id) {
    showLoaderConversation("spinner-supplier");
    $.get(`/Quotations/ArchiveConversationSupplier/${id}`, function () {
        getSupplierMassages();

    })
}

getCutomersMassages = function () {
    let quotationId = $("#detailsQuotationId").val();
    let dateMessage = $("#dateMessageCustomer").val();
    showLoaderConversation("global-spinner-Customer")
    $.ajax({
        url: `/Quotations/GetMassageCustomer/${quotationId}?date=${dateMessage}`,
        //async: false, //blocks window close
        success: function (data) {
            $("#customer-msg").html(data);
            deleteConfirmationConversation();

            $(".attach-customer.file-attach").each(function () {
                let url = $(this).find("a").attr('href');
                if (url) {
                    let size = getFileSize(url);
                    $(this).find("span").text(size);
                }
            })

            hideLoaderConversation("global-spinner-Customer");
        }
    });
}

emptyCustomerrDate = function () {
    $("#dateMessageCustomer").val("");
    getCutomersMassages();
}

shwoModalConvarsationCustomer = function (modalId) {
    $("#QuotationIdCustomer").val($("#detailsQuotationId").val());
    $(`#${modalId}`).modal("show");
};

showModalEditConvarsationCustomer = function (modalId, msgId) {
    showLoader();
    var quotationId = $("#detailsQuotationId").val();
    $.get(`/Quotations/EditConversationCustomer/${msgId}?quotationId=${quotationId}`, function (data) {
        $("#editMessageCustomer").html(data);
        hideLoader();
    })
    $("#supplierIdEdit").val(quotationId);
    $("#quotationIdEdit").val(quotationId);
    $(`#${modalId}`).modal("show");
}

updateConversationCustomer = function () {
    showLoader()
    let form = $("#conversationCustomerEdit");
    let formData = new FormData(form[0]);
    if (form.valid()) {

        $.ajax({
            url: "/Quotations/UpdateConversationCustomer",
            data: formData,
            method: "POST",
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            success: function (data) {
                if (data.result) {
                    $("#modalEditMessageCustomer").modal('hide');
                    getCutomersMassages();
                } else {
                    $("#editMessageCustomer").html(data);
                }
            },
            error: function (data) {
                toastr.error(ERROR_DB);
            },
            complete: function () {
                hideLoader();
            }
        });
    }
}

CreateConversationCustomer = function () {
    let form = $("#conversationCustomer");
    let formData = new FormData(form[0]);
    if (form.valid()) {
        showLoader();
        $.ajax({
            url: "/Quotations/CreateConversationCustomer",
            data: formData,
            method: "POST",
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            success: function (data) {
                clearData("#conversationCustomer");
                $("#modalAddMessageCustomer").modal('hide');
                getCutomersMassages();
            },
            complete: function () {
                hideLoader();
            }
        })
    }


}

archiveConversationCustomer = function (id) {
    showLoaderConversation("global-spinner-Customer")
    $.get(`/Quotations/ArchiveConversationCustomer/${id}`, function () {
        getCutomersMassages();

    });
};

showLoaderConversation = function (loaderId) {
    $(`#${loaderId}`).removeClass("d-none");

}

hideLoaderConversation = function (loaderId) {
    $(`#${loaderId}`).addClass("d-none");
}

$(".ChooseCompanies").click(function () {
    $(".visible-cheked").toggleClass('open');
});

$('.icheck-primary #selectAll').click(function () {
    $(this).toggleClass("checked");

    if ($(this).is(":checked")) {
        $(".accordion-sp .icheck-primary input").prop("checked", true);
        $(".ShowComparison button").removeClass('disabled');
        $(".ShowComparison button").removeAttr('disabled');
    } else {
        $(".accordion-sp .icheck-primary input").prop("checked", false);
        $(".ShowComparison button").addClass("disabled");
        $(".ShowComparison button").attr("disabled", "disabled");
    }
});

$(".accordion-sp .icheck-primary input").click(function () {
    if ($(".accordion-sp .icheck-primary input").is(':checked')) {
        $(this).toggleClass("checked");
        $('.icheck-primary #selectAll').prop("checked", false);

        if ($('.accordion-sp .icheck-primary input.checked').length > 1) {
            $(".ShowComparison button").removeClass('disabled');
            $(".ShowComparison button").removeAttr('disabled');
        } else {
            $(".ShowComparison button").addClass("disabled");
            $(".ShowComparison button").attr("disabled", "disabled");
        }
    } else {
        $(this).toggleClass("checked");
        $(".ShowComparison button").addClass("disabled");
        $(".ShowComparison button").attr("disabled", "disabled");
    }
})

// Create Charts Function Comparison
var chartComparison = function () {
    let quotationId = $("#detailsQuotationId").val();
    $("#loader-chartsComparison").removeClass("d-none");
    $.ajax({
        url: `/Quotations/FinancialSessionComparison/${quotationId}`,
        //async: false,
        success: function (response) {
            const data = {
                labels: response.companyName,
                datasets: [
                    {
                        label: NUMBER_PRODUCT,
                        yAxisID: 'B',
                        data: response.numberOfProduct,
                        backgroundColor: [
                            '#0D68A9',
                        ],
                        borderColor: [
                            '#0D68A9',
                        ],
                        borderWidth: 1,
                        borderRadius: 5,
                        categoryPercentage: .25,
                        barPercentage: .75,
                    },
                    {
                        label: TOTAL,
                        yAxisID: 'A',
                        data: response.totalPrice,
                        backgroundColor: [
                            '#3786BA',
                        ],
                        borderColor: [
                            '#3786BA',
                        ],
                        borderWidth: 1,
                        borderRadius: 5,
                        categoryPercentage: .25,
                        barPercentage: .75,
                    },
                    {
                        label: SUB_TOTAL,
                        yAxisID: 'A',
                        data: response.subTotal,
                        backgroundColor: [
                            '#69A4CB',
                        ],
                        borderColor: [
                            '#69A4CB',
                        ],
                        borderWidth: 1,
                        borderRadius: 5,
                        categoryPercentage: .25,
                        barPercentage: .75,
                    },
                ]
            };

            // config 
            const config = {
                type: 'bar',
                data: data,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        A: {
                            position: 'left',
                            beginAtZero: true
                        },
                        B: {
                            position: 'right',
                            beginAtZero: true,
                            ticks: {
                                // forces step size to be 1 unit
                                stepSize: 1
                            },
                            grid: {
                                display: false,
                                drawBorder: false,
                                drawOnChartArea: false,
                                drawTicks: true,
                            }
                        }
                    },
                    plugins: {
                        tooltip: {
                            yAlign: "bottom",
                            backgroundColor: "#262B41",
                        },
                        legend: {
                            position: 'top',
                            align: 'center',
                            color: "#262262",
                        }
                    }
                }
            };

            // render init block
            const ctx = document.getElementById('chartsComparison').getContext('2d');
            const myChart = new Chart(
                ctx,
                config
            );

            $("#loader-chartsComparison").addClass("d-none")

        }
    })
}

acceptALetterClicked = function () {
    $(".letter-accept").addClass('d-none');
    $(".accept-block").removeClass('d-none');
}

rejectALetterClicked = function () {
    $(".letter-accept").addClass('d-none');
    $(".reject-block").removeClass('d-none');
}

cancelALetterClicked = function () {
    $(".letter-accept").removeClass('d-none');
    $(".accept-block").addClass('d-none');
    $(".reject-block").addClass('d-none');

    previousAcceptTechnicalSession();
    previousRejectTechnicalSession();
}

rejectTechnicalSession = function () {
    let quotationId = $("#detailsQuotationId").val();
    let financialSessionDate = $("#rejectFinancialSessionDate").val();
    let rejectionDate = $("#rejectDate").val();
    let rejectLetterFile = $("#rejectFile")[0].files;
    let attachmentValue = $("#rejectFile").val();
    let rejectReasonId = $("#rejectReasonId").val();

    let isValid = true;
    if (financialSessionDate == "") {
        isValid = false;
        toastr.error(INVALID_FINANCIAL_DATE);
    }

    if (rejectionDate == "") {
        isValid = false;
        toastr.error(INVALID_REJECTION_DATE);
    }

    if (attachmentValue == "") {
        isValid = false;
        toastr.error(INVALID_SINGLE_ATTCHAMENT);
    }

    if (!rejectReasonId) {
        isValid = false;
        toastr.error(INVALID_REJECT_REASON_ID);
    }

    if (isValid) {
        let formData = new FormData();
        formData.append("FinancialSessionDate", financialSessionDate);
        formData.append("RejectionDate", rejectionDate);
        formData.append("RejectReasonId", rejectReasonId);
        formData.append("RejectionFile", rejectLetterFile[0]);

        $(".reject-accepted-competitor").each(function () {
            let isChecked = $(this).find("input[type='checkbox']").is(':checked');
            if (isChecked) {
                let competitorId = $(this).attr('id').split('_').pop();
                formData.append("AcceptedCompetitorIds", competitorId);
            }
        })

        showLoader();
        $.ajax({
            url: '/Quotations/RejectTechnicalSession/' + quotationId,
            data: formData,
            method: 'POST',
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            success: function (result) {
                if (result) {
                    $("#modalLetterRejected").modal('show');
                } else {
                    toastr.error(ERROR_DB);
                }
            },
            complete: function () {
                hideLoader();
            }
        })
    }
}

acceptTechnicalSession = function () {
    let quotationId = $("#detailsQuotationId").val();
    let financialSessionDate = $("#financialSessionDate").val();
    let acceptanceLetterDate = $("#acceptanceLetterDate").val();
    let acceptanceLetterFile = $("#acceptanceLetterFile")[0].files;
    let attachmentValue = $("#acceptanceLetterFile").val();

    let isValid = true;
    if (financialSessionDate == "") {
        isValid = false;
        toastr.error(INVALID_FINANCIAL_DATE);
    }

    if (acceptanceLetterDate == "") {
        isValid = false;
        toastr.error(INVALID_ACCEPTANCE_DATE);
    }

    if (attachmentValue == "") {
        isValid = false;
        toastr.error(INVALID_SINGLE_ATTCHAMENT);
    }

    if (isValid) {
        let formData = new FormData();
        formData.append("FinancialSessionDate", financialSessionDate);
        formData.append("AcceptanceLetterDate", acceptanceLetterDate);
        formData.append("AcceptanceLetter", acceptanceLetterFile[0]);

        $(".accept-accepted-competitor").each(function () {
            let isChecked = $(this).find("input[type='checkbox']").is(':checked');
            if (isChecked) {
                let competitorId = $(this).attr('id').split('_').pop();
                formData.append("AcceptedCompetitorIds", competitorId);
            }
        })

        showLoader();
        $.ajax({
            url: '/Quotations/AcceptTechnicalSession/' + quotationId,
            data: formData,
            method: 'POST',
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            success: function (result) {
                if (result) {
                    $("#modalLetterAccepted").modal('show');
                } else {
                    toastr.error(ERROR_DB);
                }
            },
            complete: function () {
                hideLoader();
            }
        })
    }
}

nextAcceptTechnicalSession = function () {
    $('#accept-technical-tabs a[href="#accept-info"]').parent().removeClass('active');
    $('#accept-technical-tabs a[href="#accept-competitors"]').parent().addClass('active');
    $('#accept-technical-tabs a[href="#accept-competitors"]').tab('show');
}

previousAcceptTechnicalSession = function () {
    $('#accept-technical-tabs a[href="#accept-competitors"]').parent().removeClass('active');
    $('#accept-technical-tabs a[href="#accept-info"]').parent().addClass('active');
    $('#accept-technical-tabs a[href="#accept-info"]').tab('show');
}

acceptCheckCompetitor = function (id) {
    $("#accept-competitor-check-" + id).trigger('click');
}

nextRejectTechnicalSession = function () {
    $('#reject-technical-tabs a[href="#reject-info"]').parent().removeClass('active');
    $('#reject-technical-tabs a[href="#reject-competitors"]').parent().addClass('active');
    $('#reject-technical-tabs a[href="#reject-competitors"]').tab('show');
}

previousRejectTechnicalSession = function () {
    $('#reject-technical-tabs a[href="#reject-competitors"]').parent().removeClass('active');
    $('#reject-technical-tabs a[href="#reject-info"]').parent().addClass('active');
    $('#reject-technical-tabs a[href="#reject-info"]').tab('show');
}

rejectCheckCompetitor = function (id) {
    $("#reject-competitor-check-" + id).trigger('click');
}

checkAllAcceptCompetitors = function () {
    let isChecked = $("#acceptSelectAllCompetitors").is(":checked");
    if (isChecked) {
        $(".accept-accepted-competitor").each(function () {
            let isCompetitorChecked = $(this).find('input[type="checkbox"]').is(":checked");
            if (!isCompetitorChecked) {
                acceptCheckCompetitor($(this).attr('id').split('_').pop());
            }
        })
    } else {
        $(".accept-accepted-competitor").each(function () {
            let isCompetitorChecked = $(this).find('input[type="checkbox"]').is(":checked");
            if (isCompetitorChecked) {
                acceptCheckCompetitor($(this).attr('id').split('_').pop());
            }
        })
    }
}

checkAllRejectCompetitors = function () {
    let isChecked = $("#rejectSelectAllCompetitors").is(":checked");
    if (isChecked) {
        $(".reject-accepted-competitor").each(function () {
            let isCompetitorChecked = $(this).find('input[type="checkbox"]').is(":checked");
            if (!isCompetitorChecked) {
                rejectCheckCompetitor($(this).attr('id').split('_').pop());
            }
        })
    } else {
        $(".reject-accepted-competitor").each(function () {
            let isCompetitorChecked = $(this).find('input[type="checkbox"]').is(":checked");
            if (isCompetitorChecked) {
                rejectCheckCompetitor($(this).attr('id').split('_').pop());
            }
        })
    }
}

getCompetitorOfferProducts = function () {
    let offerId = $("#soOfferId").val();
    if (offerId) {
        $.get(`/Quotations/GetCompetitorOfferProducts?offerId=${offerId}`, function (data) {
            $("#competitorOfferProducts").html(data);
            $(".product-origin").selectpicker();

            let i = 0;
            $(".item-row").each(function () {
                $(this).find("input[type='checkbox']").trigger('change');
                priceChanged(i);
                i++;
            })
        });
    }
}

saveFinancialDetails = function () {
    let isValid = $("#competitorFinancialDetailsForm").valid();
    let isOneIncluded = false;
    let isValidPrices = true;
    let isValidOrigins = true;
    $(".item-row").each(function () {
        let isIncluded = $(this).find("input[type='checkbox']").is(":checked")
        if (isIncluded) {
            isOneIncluded = true;
            if ($(this).find(".product-origin option:selected").length == 0) {
                isValidOrigins = false;
            }
            if ($(this).find(".product-price").val() == "") {
                isValidPrices = false;
            }
        }
    })

    if (!isOneIncluded) {
        toastr.error(INVALID_INCLUDE_PRODUCT);
        return;
    }

    if (!isValidOrigins) {
        toastr.error(INVALID_PRODUCTS);
        return;
    }

    if (!isValidPrices) {
        toastr.error(INVALID_PRODUCTS);
        return;
    }

    if (isValid) {
        showLoader();
        $.ajax({
            url: "/Quotations/SaveFinancialDetails",
            data: $("#competitorFinancialDetailsForm").serialize(),
            method: "POST",
            success: function (result) {
                if (result) {
                    setCurrentItemDone('#availableCompetitors');
                    setNextActiveItem("#competitorOfferProducts", false);
                }
            },
            complete: function () {
                hideLoader();
            }
        })
    }
}

getNegotiationCutomersMassages = function () {
    let quotationId = $("#detailsQuotationId").val();
    let dateMessage = $("#dateMessageCustomerNegotiation").val();
    showLoaderConversation("global-spinner-CustomerNegotiation");
    $.ajax({
        url: `/Quotations/GetNegotiationCustomer/${quotationId}?date=${dateMessage}`,
        //async: false, //blocks window close
        success: function (data) {
            $("#customer-msg-negotiation").html(data);

            deleteConfirmationConversation();

            $(".attach-customer.file-attach").each(function () {
                let url = $(this).find("a").attr('href');
                if (url) {
                    let size = getFileSize(url);
                    $(this).find("span").text(size);
                }
            })

            hideLoaderConversation("global-spinner-CustomerNegotiation");
        }
    });
}

CreateNegotiationCustomer = function () {
    let form = $("#NegotiationCustomer");
    let formData = new FormData(form[0]);
    if (form.valid()) {
        showLoader();
        $.ajax({
            url: "/Quotations/CreateNegotationCustomer",
            data: formData,
            method: "POST",
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            success: function (data) {
                clearData("#NegotiationCustomer");
                $("#modalAddNegotiationCustomer").modal('hide');
                getNegotiationCutomersMassages();
            },
            complete: function () {
                hideLoader();
            }
        })
    }


}

showModalEditConvarsationCustomer = function (modalId, msgId) {
    showLoader();
    var quotationId = $("#detailsQuotationId").val();
    $.get(`/Quotations/EditNegotiationCustomer/${msgId}?quotationId=${quotationId}`, function (data) {
        $("#editNegotiationCustomer").html(data);
        hideLoader();
    })
    $("#quotationIdEditCustomerNegotiation").val(quotationId);
    $(`#${modalId}`).modal("show");
}

updateNegotiationCustomer = function () {
    showLoader()
    let form = $("#NegotiationCustomerEdit");
    let formData = new FormData(form[0]);
    if (form.valid()) {

        $.ajax({
            url: "/Quotations/UpdateNegotiationCustomer",
            data: formData,
            method: "POST",
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            success: function (data) {
                if (data.result) {
                    $("#modalEditNegotiationCustomer").modal('hide');
                    getNegotiationCutomersMassages();
                } else {
                    $("#editNegotiationCustomer").html(data);
                }
            },
            error: function (data) {
                toastr.error(ERROR_DB);
            },
            complete: function () {
                hideLoader();
            }
        });
    }
}

archiveNegotiationCustomer = function (id) {
    showLoaderConversation("global-spinner-CustomerNegotiation")
    $.get(`/Quotations/ArchiveNegotiationCustomer/${id}`, function () {
        getNegotiationCutomersMassages();
    });
}

emptyCustomerrDateNegotiation = function () {
    $("#dateMessageCustomerNegotiation").val("");
    getNegotiationCutomersMassages();
}

getNegotiationSupplierMassages = function () {
    $("#SupplierIdNegotiation").val($("#conversationSuppliersNegotiation").val());
    //showLoaderConversation("spinner-supplier-negotiation");
    var imageSupplier = $('#conversationSuppliersNegotiation').find(":selected").attr('data-image');
    $("#logoSupplierNegotiation").attr("src", imageSupplier);
    let quotationId = $("#detailsQuotationId").val();
    let supplierId = $("#conversationSuppliersNegotiation").val();
    let dateMessage = $("#dateMessageNegotiation").val();
    $.ajax({
        url: `/Quotations/GetMassageNegotiationSupplier/${quotationId}?supplierId=${supplierId}&&date=${dateMessage}`,
        //async: false, //blocks window close
        success: function (data) {
            $("#supplier-msg-negotiation").html(data);

            $(".attach-supplier.file-attach").each(function () {
                let url = $(this).find("a").attr('href');
                if (url) {
                    let size = getFileSize(url);
                    $(this).find("span").text(size);
                }
            })

            deleteConfirmationConversation();
        }
    });

}

CreateNegotiationSupplier = function () {
    let form = $("#NegotiationSupplier");
    let formData = new FormData(form[0]);

    if (form.valid()) {
        showLoader();
        $.ajax({
            url: "/Quotations/CreateNegotiationSupplier",
            data: formData,
            method: "POST",
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            success: function (data) {
                clearData("#NegotiationSupplier");
                $("#modalAddNegotiationSupplier").modal('hide');
                getNegotiationSupplierMassages();
            },
            complete: function () {
                hideLoader();

            }
        })
    }
}

showModalEditNegotiation = function (modalId, msgId) {
    showLoader();
    var quotationId = $("#detailsQuotationId").val();
    $.get(`/Quotations/EditNegotiationSupplier/${msgId}?quotationId=${quotationId}`, function (data) {
        $("#editNegotiationSupplier").html(data);
        hideLoader();
    })
    $("#supplierIdEditNegotiation").val($("#conversationSuppliers").val());
    $("#quotationIdEditNegotiation").val(quotationId);
    $(`#${modalId}`).modal("show");
};

updateNegotiationSupplier = function () {
    showLoader();
    let form = $("#NegotiationSupplierEdit");
    let formData = new FormData(form[0]);
    if (form.valid()) {
        $.ajax({
            url: "/Quotations/UpdateNegotiationSupplier",
            data: formData,
            method: "POST",
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            success: function (data) {
                if (data.result) {
                    $("#modalEditNegotiationSupplier").modal('hide');
                    getNegotiationSupplierMassages();
                } else {
                    $("#editNegotiationSupplier").html(data);
                }
            },
            error: function (data) {
                toastr.error(ERROR_DB);
            },
            complete: function () {
                hideLoader();
            }
        })
    }
}

archiveNegotiationSupplier = function (id) {
    showLoaderConversation("spinner-supplier-negotiation")
    $.get(`/Quotations/ArchiveNegotiationSupplier/${id}`, function () {
        getNegotiationSupplierMassages();
    });
};

emptysupplierDateNegotiation = function () {
    $("#dateMessageNegotiation").val("");
    getNegotiationSupplierMassages();
}

addOtherNegotiationResult = function () {
    if ($("#negotiationResultsForm").valid()) {
        showLoader();
        $.ajax({
            url: "/Quotations/AddOtherNegotiationResult",
            method: "POST",
            data: $("#negotiationResultsForm").serialize(),
            success: function (data) {
                $("#negotiationResults").html(data);
            },
            complete: function () {
                hideLoader();
            }
        })
    }
}

deleteOtherNegotiationResult = function (index) {
    showLoader();
    $.ajax({
        url: "/Quotations/DeleteOtherNegotiationResult?index=" + index,
        method: "POST",
        data: $("#negotiationResultsForm").serialize(),
        success: function (data) {
            $("#negotiationResults").html(data);
        },
        complete: function () {
            hideLoader();
        }
    })
}

acceptFALetterClicked = function () {
    $(".awarding-letter").addClass('d-none');
    $(".f-accept-block").removeClass('d-none');
}

cancelFALetterClicked = function () {
    $(".awarding-letter").removeClass('d-none');
    $(".f-accept-block").addClass('d-none');
    $(".f-reject-block").addClass('d-none');
}

rejectFALetterClicked = function () {
    $(".awarding-letter").addClass('d-none');
    $(".f-reject-block").removeClass('d-none');
}

rejectFinancialSession = function () {
    let quotationId = $("#detailsQuotationId").val();
    let rejectionDate = $("#fRejectDate").val();
    let rejectLetterFile = $("#fRejectFile")[0].files;
    let attachmentValue = $("#fRejectFile").val();
    let rejectReasonId = $("#fRejectReasonId").val();

    let isValid = true;

    if (rejectionDate == "") {
        isValid = false;
        toastr.error(INVALID_REJECTION_DATE);
    }

    if (attachmentValue == "") {
        isValid = false;
        toastr.error(INVALID_SINGLE_ATTCHAMENT);
    }

    if (!rejectReasonId) {
        isValid = false;
        toastr.error(INVALID_REJECT_REASON_ID);
    }

    if (isValid) {
        let formData = new FormData();
        formData.append("RejectionDate", rejectionDate);
        formData.append("RejectReasonId", rejectReasonId);
        formData.append("RejectionFile", rejectLetterFile[0]);

        showLoader();
        $.ajax({
            url: '/Quotations/RejectFinancialSession/' + quotationId,
            data: formData,
            method: 'POST',
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            success: function (result) {
                if (result) {
                    $("#modalAwardingRejected").modal('show');
                } else {
                    toastr.error(ERROR_DB);
                }
            },
            complete: function () {
                hideLoader();
            }
        })
    }
}

checkLG = function () {
    let lgType = $("input[type='radio'][name='LGType']:checked").val();

    switch (lgType) {
        case '0':
            $("#performanceLGBlock").fadeOut();
            $("#finalLGBlock").fadeOut();
            break;
        case '1':
            $("#performanceLGBlock").fadeOut('d-none');
            $("#finalLGBlock").fadeIn('d-none');
            break;
        case '2':
            $("#performanceLGBlock").fadeIn('d-none');
            $("#finalLGBlock").fadeIn('d-none');
            break;
    }
}

getBankBranches = function (selector) {
    let branchId = $(`#${selector}-branch-id`).val();
    let bankId = $(`#${selector}-bank-id`).val();

    showLoader();
    $.ajax({
        url: "/Quotations/GetBankBranches?bankId=" + bankId,
        success: function (data) {
            $(`#${selector}-bank-branch-id`).html(data);
            $(`#${selector}-bank-branch-id`).val(branchId);
        },
        complete: function () {
            hideLoader();
        }
    })
}

calculatePaidAmount = function (selector) {
    let amount = $(`#${selector}-amount`).val();
    if (!amount) {
        amount = 0;
    }

    let percentage = $(`#${selector}-percentage`).val();

    let isCredit = $(`#${selector}-is-credit`).is(":checked");
    if (!isCredit) {
        percentage = 100;
        $(`#${selector}-percentage`).val(100);
        $(`#lbl-${selector}-percentage`).text('100%');
    }

    let paidAmount = amount * (percentage / 100);
    $(`#${selector}-paid-amount`).val(paidAmount);
    $(`#lbl-${selector}-paid-amount`).text(paidAmount);
}

getBankDetails = function (selector) {
    let bankId = $(`#${selector}-bank-id`).val();
    if (bankId) {
        showLoader();
        $.ajax({
            url: "/Quotations/GetBankDetails?bankId=" + bankId,
            success: function (data) {
                if (selector == 'performance') {
                    $(`#${selector}-percentage`).val(data.PerformanceLGPercentage);
                    $(`#lbl-${selector}-percentage`).text(data.PerformanceLGPercentage + "%");

                    $(`#${selector}-bank-fees`).val(data.PerformanceLGMinFees);
                    $(`#lbl-${selector}-bank-fees`).text(data.PerformanceLGMinFees);
                } else {
                    $(`#${selector}-percentage`).val(data.FinalLGPercentage);
                    $(`#lbl-${selector}-percentage`).text(data.FinalLGPercentage + "%");

                    $(`#${selector}-bank-fees`).val(data.FinalLGMinFees);
                    $(`#lbl-${selector}-bank-fees`).text(data.FinalLGMinFees);
                }

                calculatePaidAmount(selector);

                getBankBranches(selector);
            },
            complete: function () {
                hideLoader();
            }
        })
    } else {
        $(`#${selector}-percentage`).val(0);
        $(`#lbl-${selector}-percentage`).text("0%");

        $(`#${selector}-bank-fees`).val(0);
        $(`#lbl-${selector}-bank-fees`).text("0");

        calculatePaidAmount(selector);

        getBankBranches(selector);
    }
}

calculateExpiryDate = function (selector) {
    showLoader();
    var issueDate = $(`#${selector}-issue-date`).val();
    var periodNo = $(`#${selector}-periods-no`).val();

    $.ajax({
        url: '/Quotations/CalculateExpiryDate?issueDate=' + issueDate + '&periodNo=' + periodNo,
        success: function (data) {
            $(`#${selector}-expiry-date`).val(data.expiryDate);
        },
        complete: function () {
            hideLoader();
        }
    })
}

showHideSections = function (selector) {
    //calculateHoldAmount();
    var isChecked = $(`#${selector}-cash-type`).is(":checked");
    if (isChecked) {
        $(`.${selector}-cash-type-on`).show();
        $(`.${selector}-cash-type-off`).hide();
    } else {
        $(`.${selector}-cash-type-off`).show();
        $(`.${selector}-cash-type-on`).hide();
    }
}

acceptFinancialSession = function () {
    let attachmentValue = $("#awardingLetterFile").val();
    if (attachmentValue == "") {
        toastr.error(INVALID_SINGLE_ATTCHAMENT);
        return;
    }

    let isValid = $("#lgForm").valid();

    if (isValid) {
        let quotationId = $("#detailsQuotationId").val();
        formData = new FormData($("#lgForm")[0]);

        showLoader();
        $.ajax({
            url: '/Quotations/AcceptFinancialSession/' + quotationId,
            data: formData,
            method: 'POST',
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            success: function (result) {
                if (result) {
                    $("#modalAwardingAccepted").modal('show');
                } else {
                    toastr.error(ERROR_DB);
                }
            },
            complete: function () {
                hideLoader();
            }
        })
    } else {
        toastr.error(ERROR_INVALID_DATA);
    }
}

saveLetterOfGuarantees = function () {
    let advanceType = $("input[type='radio'][name='PerformanceLGVM.AdvanceType']:checked").val();
    if (advanceType) {
        if (advanceType == 0 && $("#advance-cheque-value").val()) {
            let isValid = checkAdvanceValue($("#advance-cheque-value")[0]);
            if (!isValid) {
                return;
            }
        } else {
            if ($("#advance-transfer-value").val()) {
                let isValid = checkAdvanceValue($("#advance-transfer-value")[0]);
                if (!isValid) {
                    return;
                }
            }
        }
    }
    let quotationId = $("#detailsQuotationId").val();
    formData = new FormData($("#lgForm")[0]);

    showLoader();
    $.ajax({
        url: '/Quotations/SaveLetterOfGuarantees/' + quotationId,
        data: formData,
        method: 'POST',
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        success: function (result) {
            if (result) {
                toastr.success(SUCCESS_DATA_SAVED);
                getLetterOfGuarantees();
            } else {
                toastr.error(ERROR_DB);
            }
        },
        complete: function () {
            hideLoader();
        }
    })
}

getLetterOfGuarantees = function () {
    let quotationId = $("#detailsQuotationId").val();
    showLoader();
    $.ajax({
        url: `/Quotations/GetLetterOfGuarantees/${quotationId}`,
        success: function (result) {
            $("#lgBlock").html(result);

            showHideSections('performance');
            showHideSections('final');
            calculatePaidAmount('performance');
            calculatePaidAmount('final');
            calculateExpiryDate('performance');
            calculateExpiryDate('final');
            getBankDetails('performance');
            getBankDetails('final');
            checkAdvanceType();
            checkAdvanceValue($("#advance-cheque-value")[0]);
            checkAdvanceValue($("#advance-transfer-value")[0]);
        },
        complete: function () {
            hideLoader();
        }
    })
}

requestLG = function (selector) {
    var amount = $(`#${selector}-amount`).val();
    var assignedTo = $(`#${selector}-assigned-to`).val();

    if ($(`#${selector}-amount`).valid() && amount && assignedTo) {
        $(`#${selector}-is-requested`).val(true);
        $(`#${selector}-pending-financial-msg`).removeClass("d-none");
        $(`#${selector}-request`).addClass("d-none");
        $(`.disable-${selector}`).removeClass("d-none");
    } else {
        toastr.error(ERROR_INVALID_DATA);
    }
}

sendLG = function (selector) {
    var isValid = false;
    var amount = $(`#${selector}-amount`).val();
    var assignedTo = $(`#${selector}-assigned-to`).val();
    if ($(`#${selector}-amount`).valid() && amount && assignedTo) {
        var isLG = $(`#${selector}-cash-type`).is(":checked");
        if (isLG) {
            var bankId = $(`#${selector}-bank-id`).val();
            var branchId = $(`#${selector}-bank-branch-id`).val();
            if (bankId && branchId) {
                isValid = true;
            }
        } else {
            isValid = true;
        }
    }

    if (isValid) {
        $(`#${selector}-is-sent`).val(true);
        $(`#${selector}-pending-manager-msg`).removeClass("d-none");
        $(`#${selector}-send`).addClass("d-none");
        $(`.disable-${selector}`).removeClass("d-none");
    } else {
        toastr.error(ERROR_INVALID_DATA);
    }
}

approveLG = function (selector) {
    var isValid = false;
    var amount = $(`#${selector}-amount`).val();
    var assignedTo = $(`#${selector}-assigned-to`).val();
    if ($(`#${selector}-amount`).valid() && amount && assignedTo) {
        var isLG = $(`#${selector}-cash-type`).is(":checked");
        if (isLG) {
            var bankId = $(`#${selector}-bank-id`).val();
            var branchId = $(`#${selector}-bank-branch-id`).val();
            if (bankId && branchId) {
                isValid = true;
            }
        } else {
            isValid = true;
        }
    }

    if (isValid) {
        $(`#${selector}-is-approved`).val(true);
        $(`#${selector}-approved-block`).removeClass("d-none");
        $(`.disable-${selector}`).removeClass("d-none");
        $(`#btn-${selector}-approve`).addClass("d-none");
        $(`#btn-${selector}-reject`).addClass("d-none");
    } else {
        toastr.error(ERROR_INVALID_DATA);
    }
}

cancelLGApproval = function (selector) {
    $(`#${selector}-is-approved`).val(false);
    $(`#${selector}-approved-block`).addClass("d-none");
    $(`.disable-${selector}`).addClass("d-none");
    $(`#btn-${selector}-approve`).removeClass("d-none");
    $(`#btn-${selector}-reject`).removeClass("d-none");
}

rejectLG = function (selector) {
    $(`#${selector}-is-rejected`).val(true);
    $(`#${selector}-rejected-block`).removeClass("d-none");
    $(`.disable-${selector}`).removeClass("d-none");
    $(`#btn-${selector}-approve`).addClass("d-none");
    $(`#btn-${selector}-reject`).addClass("d-none");
}

cancelLGRejection = function (selector) {
    $(`#${selector}-is-rejected`).val(false);
    $(`#${selector}-rejected-block`).addClass("d-none");
    $(`.disable-${selector}`).addClass("d-none");
    $(`#btn-${selector}-approve`).removeClass("d-none");
    $(`#btn-${selector}-reject`).removeClass("d-none");
}

printLGPage = function (requestId, selector) {
    window.open('/Quotations/PrintLGRequest?requestId=' + requestId + '&isFinal=' + (selector == 'final'), '_blank');
}

printLG = function (selector) {
    let isMenuOpen = $("body").hasClass("sidebar-open");
    if (isMenuOpen) {
        $(".sidebar-toggle a").trigger("click");
    }

    window.onafterprint = function () {
        if (window.opener != null && !window.opener.closed) {
            var isPrinted = window.opener.document.getElementById(`${selector}-is-printed`);
            $(isPrinted).val(true);

            var btnPrint = window.opener.document.getElementById(`btn-${selector}-print`);
            $(btnPrint).addClass("d-none");

            var printedBlock = window.opener.document.getElementById(`printed-${selector}-block`);
            $(printedBlock).removeClass("d-none");
        }
        if (isMenuOpen) {
            $(".sidebar-toggle a").trigger("click");
        }
        window.close();
    }
    window.print();
}

compareCompanies = function () {
    let quotationId = $("#detailsQuotationId").val();
    let companyIds = "";

    $(".compare-chk").each(function () {
        if ($(this).is(":checked")) {
            companyIds += ("companyIds=" + $(this).data("id") + "&");
        }
    })

    window.open('/Quotations/Comparison/' + quotationId + '?' + companyIds, '_blank');
}

checkAdvanceType = function () {
    let advanceType = $("input[type='radio'][name='PerformanceLGVM.AdvanceType']:checked").val();

    switch (advanceType) {
        case '0':
            $(".advance-cheque").removeClass('d-none');
            $(".advance-transfer").addClass('d-none');
            break;
        case '1':
            $(".advance-transfer").removeClass('d-none');
            $(".advance-cheque").addClass('d-none');
            break;
    }
}

checkAdvanceValue = function (element) {
    let LGAmount = parseFloat($("#PerformanceLGVM_Amount").val());
    let advanceAmount = parseFloat($(element).val());

    if (advanceAmount == LGAmount) {
        $(element).removeClass("text-danger").removeClass("border-danger");
        $(element).removeClass("text-warning").removeClass("border-warning");
        return true;
    } else if (advanceAmount < LGAmount) {
        $(element).removeClass("text-danger").removeClass("border-danger");
        $(element).addClass("text-warning").addClass("border-warning");
        return true;
    } else {
        $(element).removeClass("text-warning").removeClass("border-warning");
        $(element).addClass("text-danger").addClass("border-danger");
        return false;
    }
}