
deleteConfirmationLookUps = function () {
    $(".LookUps-confirm-delete").confirmation({
        rootSelector: '[data-toggle=confirmation]',
        popout: true,
        singleton: true,
        title: DELETE,
        btnOkLabel: YES,
        btnCancelLabel: NO,
        onConfirm: function () {
            switch ($(this).data('source')) {
                case "myGuaranteeTermsRemove":
                    removeGuaranteeTerm($(this).data('itemid'));
                    break;
                case "myGuaranteeTermsUnRemove":
                    unRemoveGuaranteeTerm($(this).data('itemid'));
                    break;
                case "archiveOriginDocuments":
                    removeGetOriginDocument($(this).data('itemid'))
                    break;
                case "unarchiveOriginDocuments":
                    unRemoveGetOriginDocument($(this).data('itemid'))
                    break;
                case "archiveOfferValidities":
                    removeOfferValidities($(this).data('itemid'))
                    break;
                case "unArchiveOfferValidities":
                    unRemoveOfferValidities($(this).data('itemid'))
                    break;
                case "archiveOfferCertific":
                    removeOfferCertific($(this).data('itemid'))
                    break;
                case "unArchiveOfferCertific":
                    unRemoveOfferCertific($(this).data('itemid'))
                    break;
                case "archiveDeliveryPlaces":
                    removeDeliveryPlaces($(this).data('itemid'))
                    break;
                case "unArchiveDeliveryPlaces":
                    unRemoveDeliveryPlaces($(this).data('itemid'))
                    break;
                case "archiveOrganizationTypes":
                    removeOrganizationTypes($(this).data('itemid'))
                    break;
                case "unarchiveOrganizationTypes":
                    unRemoveOrganizationTypes($(this).data('itemid'))
                    break;
                case "archiveCurrencies":
                    removeCurrencies($(this).data('itemid'))
                    break;
                case "unArchiveCurrencies":
                    unRemoveCurrencies($(this).data('itemid'))
                    break;
                case "archiveClassifications":
                    removeClassifications($(this).data('itemid'))
                    break;
                case "unArchiveClassifications":
                    unRemoveClassifications($(this).data('itemid'))
                    break;
                case "archiveCities":
                    removeCitiess($(this).data('itemid'))
                    break;
                case "unArchiveCities":
                    unRemoveCities($(this).data('itemid'))
                    break;
                case "archiveCountries":
                    removeCountries($(this).data('itemid'))
                    break;
                case "unArchiveCountries":
                    unRemoveCountries($(this).data('itemid'))
                    break;
                case "archiveVisitReasons":
                    removeVisitReasons($(this).data('itemid'))
                    break;
                case "unArchiveVisitReasons":
                    unRemoveVisitReasons($(this).data('itemid'))
                    break;
                case "archivePaymentTypes":
                    removePaymentTypes($(this).data('itemid'));
                    break;
                case "UnarchivePaymentTypes":
                    unRemovePaymentTypes($(this).data('itemid'));
                    break;
                case "archiveVATValues":
                    removeVATValues($(this).data('itemid'));
                    break;
                case "unarchiveVATValues":
                    unRemoveVATValues($(this).data('itemid'));
                    break;
                case "archiveRejectReasons":
                    removeRejectReasons($(this).data('itemid'));
                    break;
                case "unArchiveRejectReasons":
                    unRemoveRejectReasons($(this).data('itemid'));
                    break;
            }
        }
    })
}

//strart GuaraneeTerms
getGuaranteeTerm = function () {
    showLoader();
    $.get(`/GuaranteeTerms/GetGuaraneeTerms`, function (data, status) {
        $("#GuaraneeTerms").html(data);
        handleDataTable({
            selector: ".table-GuaranteeTerm-home",
            stateLoadCallback: stateLoadParams
        });
        deleteConfirmationLookUps()
        hideLoader();
        showLoaderFromAjax()
    })
}

removeGuaranteeTerm = function (id) {
    showLoader();
    $.get(`/GuaranteeTerms/Archive/${id}`, function (data, status) {
        getGuaranteeTerm();
    })
}

unRemoveGuaranteeTerm = function (id) {
    showLoader();
    $.get(`/GuaranteeTerms/Unarchive/${id}`, function (data, status) {
        getGuaranteeTerm();
    })
}


//end GuaraneeTerms


//strart OriginDocuments
getOriginDocument = function () {
    showLoader();
    $.get(`/OriginDocuments/GetOriginDocument`, function (data, status) {
        $("#OriginDocument").html(data);
        handleDataTable({
            selector: ".table-OriginDocument-home",
            stateLoadCallback: stateLoadParams
        });
        deleteConfirmationLookUps()
        hideLoader();
        showLoaderFromAjax()
    })
}

removeGetOriginDocument = function (id) {
    showLoader();
    $.get(`/OriginDocuments/Archive/${id}`, function (data, status) {
        getOriginDocument();
    })
}

unRemoveGetOriginDocument = function (id) {
    showLoader();
    $.get(`/OriginDocuments/Unarchive/${id}`, function (data, status) {
        getOriginDocument();
    })
}


//end OriginDocuments


//strart OfferValidities
getOfferValidities = function () {
    showLoader();
    $.get(`/OfferValidities/GetOfferValidities`, function (data, status) {
        $("#offerValidities").html(data);
        handleDataTable({
            selector: ".table-OfferValidity-home",
            stateLoadCallback: stateLoadParams
        });
        deleteConfirmationLookUps()
        hideLoader();
        showLoaderFromAjax()
    })
}

removeOfferValidities = function (id) {
    showLoader();
    $.get(`/OfferValidities/Archive/${id}`, function (data, status) {
        getOfferValidities();
    })
}

unRemoveOfferValidities = function (id) {
    showLoader();
    $.get(`/OfferValidities/Unarchive/${id}`, function (data, status) {
        getOfferValidities();
    })
}

//end OfferValidities

//strart OfferCertific
getOfferCertific = function () {
    showLoader();
    $.get(`/OfferCertificates/GetOfferCertificate`, function (data, status) {
        $("#offerCertificate").html(data);
        handleDataTable({
            selector: ".table-OfferCertificate-home",
            stateLoadCallback: stateLoadParams
        });
        deleteConfirmationLookUps()
        hideLoader();
        showLoaderFromAjax()
    })
}

removeOfferCertific = function (id) {
    showLoader();
    $.get(`/OfferCertificates/Archive/${id}`, function (data, status) {
        getOfferCertific();
    })
}

unRemoveOfferCertific = function (id) {
    showLoader();
    $.get(`/DeliveryPlaces/Unarchive/${id}`, function (data, status) {
        getOfferCertific();
    })
}

//end OfferCertific

//strart DeliveryPlaces
getDeliveryPlaces = function () {
    showLoader();
    $.get(`/DeliveryPlaces/GetDeliveryPlaces`, function (data, status) {
        $("#deliveryPlaces").html(data);
        handleDataTable({
            selector: ".table-DeliveryPlace-home",
            stateloadcallback: stateloadparams
        });
        deleteConfirmationLookUps()
        hideLoader();
        showLoaderFromAjax()
    })
}

removeDeliveryPlaces = function (id) {
    showLoader();
    $.get(`/DeliveryPlaces/Archive/${id}`, function (data, status) {
        getDeliveryPlaces();
    })
}

unRemoveDeliveryPlaces = function (id) {
    showLoader();
    $.get(`/DeliveryPlaces/Unarchive/${id}`, function (data, status) {
        getDeliveryPlaces();
    })
}

//end DeliveryPlaces

//strart OrganizationTypes
getOrganizationTypes = function () {
    showLoader();
    $.get(`/OrganizationTypes/GetOrganizationTypes`, function (data, status) {
        $("#organizationTypes").html(data);
        handleDataTable({
            selector: ".table-organizationTypes-home",
            stateLoadCallback: stateLoadParams
        });
        deleteConfirmationLookUps()
        hideLoader();
        showLoaderFromAjax()
    })
}

removeOrganizationTypes = function (id) {
    showLoader();
    $.get(`/OrganizationTypes/Archive/${id}`, function (data, status) {
        getOrganizationTypes();
    })
}

unRemoveOrganizationTypes = function (id) {
    showLoader();
    $.get(`/OrganizationTypes/Unarchive/${id}`, function (data, status) {
        getOrganizationTypes();
    })
}

//end OrganizationTypes

//strart Currencies
getCurrencies = function () {
    showLoader();
    $.get(`/Currencies/GetCurrencies`, function (data, status) {
        $("#currency").html(data);
        handleDataTable({
            selector: ".table-currencies-home",
            stateLoadCallback: stateLoadParams
        });
        deleteConfirmationLookUps()
        hideLoader();
        showLoaderFromAjax()
    })
}

removeCurrencies = function (id) {
    showLoader();
    $.get(`/Currencies/Archive/${id}`, function (data, status) {
        getCurrencies();
    })
}

unRemoveCurrencies = function (id) {
    showLoader();
    $.get(`/Currencies/Unarchive/${id}`, function (data, status) {
        getCurrencies();
    })
}

//end Currencies



//strart Classifications
getClassifications = function () {
    showLoader();
    $.get(`/Classifications/GetClassifications`, function (data, status) {
        $("#getClassifications").html(data);
        handleDataTable({
            selector: ".table-classifications-home",
            stateLoadCallback: stateLoadParams
        });
        deleteConfirmationLookUps()
        hideLoader();
        showLoaderFromAjax()
    })
}

removeClassifications = function (id) {
    showLoader();
    $.get(`/Classifications/Archive/${id}`, function (data, status) {
        getClassifications();
    })
}

unRemoveClassifications = function (id) {
    showLoader();
    $.get(`/Classifications/Unarchive/${id}`, function (data, status) {
        getClassifications();
    })
}

//end Classifications


//strart Cities
getCities = function () {
    showLoader();
    $.get(`/Cities/GetCities`, function (data, status) {
        $("#getCities").html(data);
        handleDataTable({
            selector: ".table-cities-home",
            stateLoadCallback: stateLoadParams
        });
        deleteConfirmationLookUps()
        hideLoader();
        showLoaderFromAjax()
    })
}

removeCitiess = function (id) {
    showLoader();
    $.get(`/Cities/Archive/${id}`, function (data, status) {
        getCities();
    })
}

unRemoveCities = function (id) {
    showLoader();
    $.get(`/Cities/Unarchive/${id}`, function (data, status) {
        getCities();
    })
}

//end Cities



//strart Countries
getCountries = function () {
    showLoader();
    $.get(`/Countries/GetCountries`, function (data, status) {
        $("#getCountries").html(data);
        handleDataTable({
            selector: ".table-country-home",
            stateLoadCallback: stateLoadParams
        });
        deleteConfirmationLookUps()
        hideLoader();
        showLoaderFromAjax();
    })
}

removeCountries = function (id) {
    showLoader();
    $.get(`/Countries/Archive/${id}`, function (data, status) {
        getCountries();
    })
}

unRemoveCountries = function (id) {
    showLoader();
    $.get(`/Countries/Unarchive/${id}`, function (data, status) {
        getCountries();
    })
}

//end Countries

//Visit Reasons
getVisitReasons = function () {
    showLoader();
    $.get(`/VisitReasons/GetVisitReasons`, function (data, status) {
        $("#visitReasons").html(data);
        handleDataTable({
            selector: ".table-VisitReason-home",
            stateloadcallback: stateloadparams
        });
        deleteConfirmationLookUps()
        hideLoader();
        showLoaderFromAjax();
    })
}

removeVisitReasons = function (id) {
    showLoader();
    $.get(`/VisitReasons/Archive/${id}`, function (data, status) {
        getVisitReasons();
    })
}

unRemoveVisitReasons = function (id) {
    showLoader();
    $.get(`/VisitReasons/Unarchive/${id}`, function (data, status) {
        getVisitReasons();
    })
}
/////////////

//Payment Types
getPaymentTypes = function () {
    showLoader();
    $.get(`/PaymentTypes/GetPaymentTypes`, function (data, status) {
        $("#paymentTypes").html(data);
        handleDataTable({
            selector: ".table-PaymentType-home",
            stateloadcallback: stateloadparams
        });
        deleteConfirmationLookUps()
        hideLoader();
        showLoaderFromAjax();
    })
}

removePaymentTypes = function (id) {
    showLoader();
    $.get(`/PaymentTypes/Archive/${id}`, function (data, status) {
        getPaymentTypes();
    })
}

unRemovePaymentTypes = function (id) {
    showLoader();
    $.get(`/PaymentTypes/Unarchive/${id}`, function (data, status) {
        getPaymentTypes();
    })
}
////////////

//Payment Types
getVATValues = function () {
    showLoader();
    $.get(`/VATValues/GetVATValues`, function (data, status) {
        $("#vatValues").html(data);
        handleDataTable({
            selector: ".table-VATValue-home",
            stateloadcallback: stateloadparams
        });
        deleteConfirmationLookUps()
        hideLoader();
        showLoaderFromAjax();
    })
}

removeVATValues = function (id) {
    showLoader();
    $.get(`/VATValues/Archive/${id}`, function (data, status) {
        getVATValues();
    })
}

unRemoveVATValues = function (id) {
    showLoader();
    $.get(`/VATValues/Unarchive/${id}`, function (data, status) {
        getVATValues();
    })
}
////////////

//Reject Resons
getRejectReasons = function () {
    showLoader();
    $.get(`/RejectReasons/GetRejectReasons`, function (data, status) {
        $("#rejectReasons").html(data);
        handleDataTable({
            selector: ".table-RejectReason-home",
            stateloadcallback: stateloadparams
        });
        deleteConfirmationLookUps()
        hideLoader();
        showLoaderFromAjax();
    })
}

removeRejectReasons = function (id) {
    showLoader();
    $.get(`/RejectReasons/Archive/${id}`, function (data, status) {
        getRejectReasons();
    })
}

unRemoveRejectReasons = function (id) {
    showLoader();
    $.get(`/RejectReasons/Unarchive/${id}`, function (data, status) {
        getRejectReasons();
    })
}
////////////