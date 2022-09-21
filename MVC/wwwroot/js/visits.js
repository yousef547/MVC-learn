
refreshFilterResult = function () {
    let filterResults = currentDataTable.rows({ search: 'applied' }).count();
    $('.result-filter > span').text(filterResults);

    let dueDateFromFilter = $('#dueDateFrom').val();
    let dueDateToFilter = $('#dueDateTo').val();
    $('.date-start').text(dueDateFromFilter ? moment(dueDateFromFilter).format('D MMM, YYYY') : DATE_FROM_FILTER_EMPTY);
    $('.date-end').text(dueDateToFilter ? moment(dueDateToFilter).format('D MMM, YYYY') : DATE_TO_FILTER_EMPTY);
    if (dueDateFromFilter || dueDateToFilter) {
        $('.date-filter').removeClass('d-none');
    } else {
        $('.date-filter').addClass('d-none');
    }

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

    if (dueDateFromFilter || dueDateToFilter || departmentFilter.length > 0) {
        $(".show-filter-choose").removeClass('d-none');
        $('.result-filter').removeClass('d-none');
    } else {
        $(".show-filter-choose").addClass('d-none');
        $('.result-filter').addClass('d-none');
    }
}

$('.date-filter .fa-times').click(function (e) {
    $("#dueDateFrom , #dueDateTo").val('').trigger('change');
    refreshFilterResult();
});

$('.departments-filter .fa-times').click(function (e) {
    $("#departmentFilter").val('').trigger('change');
    refreshFilterResult();
});

showVisitDetails = function (visitId) {
    showLoader();
    $.get(`/Visits/Details/${visitId}`, function (data, status) {
        $("#visitDetails").html(data);
        $("#detailsVisit").modal("show");
        hideLoader();
    })
}

initializeVisitTable = function () {
    var orderOptions = [];
    var dateOrder = [2, 'desc'];
    var timeOrder = [3, 'desc'];
    orderOptions.push(dateOrder);
    orderOptions.push(timeOrder);

    var buttonOptions = [
        {
            extend: 'excel',
            exportOptions: {
                columns: [0, 1, 2, 3, 4, 5, 6]
            }
        },
        {
            extend: 'print',
            orientation: 'landscape',
            exportOptions: {
                columns: [0, 1, 2, 3, 4, 5, 6]
            },
        }
    ];

    var stateLoadParams = function (settings, data) {
        try {
            var dueDateFrom = data.dueDateFrom;
            var dueDateTo = data.dueDateTo;
            var optionFilter = data.columns[8].search.search;
            var searchData = data.search.search;

            $('#dueDateFrom').val(dueDateFrom);
            $('#dueDateTo').val(dueDateTo);
            $("#searchbox").val(searchData);
            deptFilter = optionFilter.split('|');
            $('#departmentFilter').val(deptFilter);
        } catch {}
    }

    var stateSaveParams = function (settings, data) {
        data.dueDateFrom = $("#dueDateFrom").val();
        data.dueDateTo = $("#dueDateTo").val();
    }

    var dataTable = handleDataTable({
        selector: ".tables-visitor-home",
        order: orderOptions,
        stateLoadCallback: stateLoadParams,
        stateSaveCallback: stateSaveParams,
        buttons: buttonOptions
    });

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

            var date = convertFromStringToDate(data[2]);

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

    $("#departmentFilter").change(function () {
        //assemble the regex expression for multiple select values
        var regEx = $(this).find(':selected').map(function () {
            return $(this).val();
        }).get().join("|");
        dataTable.api().columns(8).search(regEx, true, false).draw();
        refreshFilterResult();
    })

    $("#dueDateFrom, #dueDateTo").change(function () {
        dataTable.api().draw();
        refreshFilterResult();
    })

    $('#dueDateFrom').trigger('change');
    $('#dueDateTo').trigger('change');
    $("#searchbox").trigger('change');
    $('#departmentFilter').trigger('change');

    $('.pdf-text').on('click', function () {
        dataTable.api().button('.buttons-print').trigger('click');
        $(this).parent().toggleClass("open");
    });

    $('.excel-text').on('click', function () {
        dataTable.api().button('.buttons-excel').trigger('click');
        $(this).parent().toggleClass("open");
    });
}

deleteConfirmationVisit = function () {
    $(".visits-confirm-delete").confirmation({
        rootSelector: '[data-toggle=confirmation]',
        // other options
        popout: true,
        singleton: true,
        title: DELETE,
        btnOkLabel: YES,
        btnCancelLabel: NO,
        onConfirm: function () {
            switch ($(this).data('source')) {
                case "archiveVisits":
                    removeVisit($(this).data('itemid'));
                    break;
                case "unArchiveVisits":
                    unRemoveVisit($(this).data('itemid'));
                    break;
            }

        }
    })
}

getVisits = function () {
    showLoader();
    $.get(`/Visits/GetVisits`, function (data, status) {
        $("#getVisits").html(data);
        initializeVisitTable();
        deleteConfirmationVisit()
        hideLoader();
    })
}

removeVisit = function (id) {
    showLoader();
    $.get(`/Visits/Archive/${id}`, function (data, status) {
        getVisits();
    })
}

unRemoveVisit = function (id) {
    showLoader();
    $.get(`/Visits/Unarchive/${id}`, function (data, status) {
        getVisits();
    })
}
