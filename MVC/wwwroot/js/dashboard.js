
$(document).ready(function () {
    getPendingOnMe();
    getMyRequests();
    getMyTasks();
    getMyTeamTasks();
    getPendingOnTeam();
    getExpiryDocument();
    // Call Charts Function Dashboard
    //chartDashboard();
})

//Pending On Me
getPendingOnMe = function () {
    showHideLoader('#pom-spinner', true);
    $.ajax({
        url: "/Home/GetPendingRequests?offset=" + timeZoneOffset,
        success: function (data) {
            $("#pendingOnMe").html(data);
        },
        complete: function () {
            $(".pom").tooltip({ placement: TOOLTIP_POSITION });
            initPendingOnMeTable();
            $('#pendingOnMeCreatedByFilter').selectpicker();
            showHideLoader('#pom-spinner', false);
        }
    })
}

initPendingOnMeTable = function () {
    let stateLoadParams = function (settings, data) {
        try {
            var createdByFilter = data.columns[1].search.search;

            var createdDateFrom = data.createdDateFrom;
            var createdDateTo = data.createdDateTo;

            var deadlineDateFrom = data.deadlineDateFrom;
            var deadlineDateTo = data.deadlineDateTo;

            $('#pendingOnMeCreatedByFilter').val(createdByFilter);

            $('#pendingOnMeCreatedDateFrom').val(createdDateFrom);
            $('#pendingOnMeCreatedDateTo').val(createdDateTo);

            $('#pendingOnMeDeadlineFrom').val(deadlineDateFrom);
            $('#pendingOnMeDeadlineTo').val(deadlineDateTo);
        } catch { }
    }

    let stateSaveParams = function (settings, data) {
        data.createdDateFrom = $("#pendingOnMeCreatedDateFrom").val();
        data.createdDateTo = $("#pendingOnMeCreatedDateTo").val();

        data.deadlineDateFrom = $("#pendingOnMeDeadlineFrom").val();
        data.deadlineDateTo = $("#pendingOnMeDeadlineTo").val();
    }

    let dataTable = handleDataTable({
        selector: "#table_pending",
        //columnDefs: colDefsOptions,
        stateLoadCallback: stateLoadParams,
        stateSaveCallback: stateSaveParams
    });

    $("#pendingOnMeCreatedDateFrom, #pendingOnMeCreatedDateTo").change(function () {
        dataTable.api().draw();
        refreshPendingOnMeFilterResult();
    });

    $("#pendingOnMeDeadlineFrom, #pendingOnMeDeadlineTo").change(function () {
        dataTable.api().draw();
        refreshPendingOnMeFilterResult();
    });

    $("#pendingOnMeCreatedByFilter").change(function () {
        dataTable.api().columns(1).search(this.value ? this.value : '').draw();
        refreshPendingOnMeFilterResult();
    })

    $.fn.dataTable.ext.search.push(
        function (settings, data, dataIndex) {
            if (settings.nTable.id !== "table_pending") {
                return true;
            }

            var minCreatedDate = new Date($("#pendingOnMeCreatedDateFrom").val());
            minCreatedDate.setHours(0);
            minCreatedDate.setMinutes(0);
            minCreatedDate.setSeconds(0);

            var maxCreatedDate = new Date($("#pendingOnMeCreatedDateTo").val());
            maxCreatedDate.setHours(0);
            maxCreatedDate.setMinutes(0);
            maxCreatedDate.setSeconds(0);

            var minDeadline = new Date($("#pendingOnMeDeadlineFrom").val());
            minDeadline.setHours(0);
            minDeadline.setMinutes(0);
            minDeadline.setSeconds(0);

            var maxDeadline = new Date($("#pendingOnMeDeadlineTo").val());
            maxDeadline.setHours(0);
            maxDeadline.setMinutes(0);
            maxDeadline.setSeconds(0);

            var createdDate = convertFromStringToDate(data[2]);
            var deadlineDate = convertFromStringToDate(data[3]);

            if (
                ((!isValidDate(minDeadline) && !isValidDate(maxDeadline)) ||
                    (!isValidDate(minDeadline) && deadlineDate <= maxDeadline) ||
                    (minDeadline <= deadlineDate && !isValidDate(maxDeadline)) ||
                    (minDeadline <= deadlineDate && deadlineDate <= maxDeadline)) &&
                ((!isValidDate(minCreatedDate) && !isValidDate(maxCreatedDate)) ||
                    (!isValidDate(minCreatedDate) && createdDate <= maxCreatedDate) ||
                    (minCreatedDate <= createdDate && !isValidDate(maxCreatedDate)) ||
                    (minCreatedDate <= createdDate && createdDate <= maxCreatedDate))
            ) {
                return true;
            }
            return false;
        }
    )

    $('.pendingOnMeCreatedDate-filter .fa-times').click(function (e) {
        $("#pendingOnMeCreatedDateFrom , #pendingOnMeCreatedDateTo").val('').trigger('change');
        refreshPendingOnMeFilterResult();
    });

    $('.pendingOnMeDate-filter .fa-times').click(function (e) {
        $("#pendingOnMeDeadlineFrom , #pendingOnMeDeadlineTo").val('').trigger('change');
        refreshPendingOnMeFilterResult();
    });

    $('.pendingOnMeCreatedBy-filter .fa-times').click(function (e) {
        $("#pendingOnMeCreatedByFilter").val('').trigger('change');
        refreshPendingOnMeFilterResult();
    });

    $("#pendingOnMeCreatedDateFrom, #pendingOnMeCreatedDateTo").trigger('change');

    $("#pendingOnMeDeadlineFrom, #pendingOnMeDeadlineTo").trigger('change');

    $("#pendingOnMeCreatedByFilter").trigger('change');

    refreshPendingOnMeFilterResult();
}

refreshPendingOnMeFilterResult = function () {
    let filterResults = $("#table_pending").DataTable().rows({ search: 'applied' }).count();
    $('.pendingOnMeResult-filter > span').text(filterResults);

    let createdByFilter = $('#pendingOnMeCreatedByFilter :selected').val();
    if (createdByFilter) {
        $('.pendingOnMeCreatedBy-filter').removeClass('d-none');
    } else {
        $('.pendingOnMeCreatedBy-filter').addClass('d-none');
    }
    $('.pendingOnMeCreatedBy-filter > span').text($('#pendingOnMeCreatedByFilter :selected').text());

    let createdDateFrom = $('#pendingOnMeCreatedDateFrom').val();
    let createdDateTo = $('#pendingOnMeCreatedDateTo').val();
    $('.pendingOnMeCreatedDate-start').text(createdDateFrom ? moment(createdDateFrom).format('D MMM, YYYY') : DATE_FROM_FILTER_EMPTY);
    $('.pendingOnMeCreatedDate-end').text(createdDateTo ? moment(createdDateTo).format('D MMM, YYYY') : DATE_TO_FILTER_EMPTY);
    if (createdDateFrom || createdDateTo) {
        $('.pendingOnMeCreatedDate-filter').removeClass('d-none');
    } else {
        $('.pendingOnMeCreatedDate-filter').addClass('d-none');
    }

    let deadlineFrom = $('#pendingOnMeDeadlineFrom').val();
    let deadlineTo = $('#pendingOnMeDeadlineTo').val();
    $('.pendingOnMeDate-start').text(deadlineFrom ? moment(deadlineFrom).format('D MMM, YYYY') : DATE_FROM_FILTER_EMPTY);
    $('.pendingOnMeDate-end').text(deadlineTo ? moment(deadlineTo).format('D MMM, YYYY') : DATE_TO_FILTER_EMPTY);
    if (deadlineFrom || deadlineTo) {
        $('.pendingOnMeDate-filter').removeClass('d-none');
    } else {
        $('.pendingOnMeDate-filter').addClass('d-none');
    }

    if (createdByFilter || deadlineFrom || deadlineTo || createdDateFrom || createdDateTo) {
        $(".pendingOnMe-show-filter-choose").removeClass('d-none');
        $(".pendingOnMeResult-filter").removeClass('d-none');
    } else {
        $(".pendingOnMe-show-filter-choose").addClass('d-none');
        $('.pendingOnMeResult-filter').addClass('d-none');
    }
}
//////////////////

//My Requests
getMyRequests = function () {
    showHideLoader('#myr-spinner', true);
    $.ajax({
        url: "/Home/GetMyRequests?offset=" + timeZoneOffset,
        success: function (data) {
            $("#myRequests").html(data);
        },
        complete: function () {
            $(".myr").tooltip({ placement: TOOLTIP_POSITION });
            initMyRequestTable();
            $('#myRequestassignToFilter').selectpicker();
            showHideLoader('#myr-spinner', false);
        }
    })
}

initMyRequestTable = function () {
    deleteConfirmation();

    let stateLoadParams = function (settings, data) {
        try {
            var assignedToFilter = data.columns[1].search.search;

            var createdDateFrom = data.createdDateFrom;
            var createdDateTo = data.createdDateTo;

            var deadlineDateFrom = data.deadlineDateFrom;
            var deadlineDateTo = data.deadlineDateTo;

            $('#myRequestassignToFilter').val(assignedToFilter);

            $('#myRequestCreatedDateFrom').val(createdDateFrom);
            $('#myRequestCreatedDateTo').val(createdDateTo);

            $('#myRequestDeadlineFrom').val(deadlineDateFrom);
            $('#myRequestDeadlineTo').val(deadlineDateTo);
        } catch { }
    }

    let stateSaveParams = function (settings, data) {
        data.createdDateFrom = $("#myRequestCreatedDateFrom").val();
        data.createdDateTo = $("#myRequestCreatedDateTo").val();

        data.deadlineDateFrom = $("#myRequestDeadlineFrom").val();
        data.deadlineDateTo = $("#myRequestDeadlineTo").val();
    }

    let dataTable = handleDataTable({
        selector: "#my_requests_table",
        stateLoadCallback: stateLoadParams,
        stateSaveCallback: stateSaveParams
    });

    $("#myRequestDeadlineFrom, #myRequestDeadlineTo, #myRequestCreatedDateFrom, #myRequestCreatedDateTo").change(function () {
        dataTable.api().draw();
        refreshMyRequestFilterResult();
    });

    $("#myRequestassignToFilter").change(function () {
        dataTable.api().columns(1).search(this.value ? this.value : '').draw();
        refreshMyRequestFilterResult();
    })

    $.fn.dataTable.ext.search.push(
        function (settings, data, dataIndex) {
            if (settings.nTable.id !== "my_requests_table") {
                return true;
            }

            var minCreatedDate = new Date($("#myRequestCreatedDateFrom").val());
            minCreatedDate.setHours(0);
            minCreatedDate.setMinutes(0);
            minCreatedDate.setSeconds(0);

            var maxCreatedDate = new Date($("#myRequestCreatedDateTo").val());
            maxCreatedDate.setHours(0);
            maxCreatedDate.setMinutes(0);
            maxCreatedDate.setSeconds(0);

            var minDeadline = new Date($("#myRequestDeadlineFrom").val());
            minDeadline.setHours(0);
            minDeadline.setMinutes(0);
            minDeadline.setSeconds(0);

            var maxDeadline = new Date($("#myRequestDeadlineTo").val());
            maxDeadline.setHours(0);
            maxDeadline.setMinutes(0);
            maxDeadline.setSeconds(0);

            var createdDate = convertFromStringToDate(data[2]);
            var deadline = convertFromStringToDate(data[3]);

            if (
                ((!isValidDate(minDeadline) && !isValidDate(maxDeadline)) ||
                    (!isValidDate(minDeadline) && deadline <= maxDeadline) ||
                    (minDeadline <= deadline && !isValidDate(maxDeadline)) ||
                    (minDeadline <= deadline && deadline <= maxDeadline)) &&
                ((!isValidDate(minCreatedDate) && !isValidDate(maxCreatedDate)) ||
                    (!isValidDate(minCreatedDate) && createdDate <= maxCreatedDate) ||
                    (minCreatedDate <= createdDate && !isValidDate(maxCreatedDate)) ||
                    (minCreatedDate <= createdDate && createdDate <= maxCreatedDate))
            ) {
                return true;
            }
            return false;
        }
    )

    $('.myRequestCreatedDate-filter .fa-times').click(function (e) {
        $("#myRequestCreatedDateFrom , #myRequestCreatedDateTo").val('').trigger('change');
        refreshMyRequestFilterResult();
    });

    $('.myRequestDate-filter .fa-times').click(function (e) {
        $("#myRequestDeadlineFrom , #myRequestDeadlineTo").val('').trigger('change');
        refreshMyRequestFilterResult();
    });

    $('.myRequestAssignTo-filter .fa-times').click(function (e) {
        $("#myRequestassignToFilter").val('').trigger('change');
        refreshMyTasksFilterResult();
    });

    $("#myRequestDeadlineFrom, #myRequestDeadlineTo, #myRequestCreatedDateFrom, #myRequestCreatedDateTo").trigger('change');

    $("#myRequestassignToFilter").trigger('change');

    refreshMyRequestFilterResult();
}

refreshMyRequestFilterResult = function () {
    let filterResults = $("#my_requests_table").DataTable().rows({ search: 'applied' }).count();
    $('.myRequestResult-filter > span').text(filterResults);

    let myassignToFilter = $('#myRequestassignToFilter :selected').val();
    if (myassignToFilter) {
        $('.myRequestAssignTo-filter').removeClass('d-none');
    } else {
        $('.myRequestAssignTo-filter').addClass('d-none');
    }
    $('.myRequestAssignTo-filter > span').text($('#myRequestassignToFilter :selected').text());

    let myRequestCreatedDateFrom = $('#myRequestCreatedDateFrom').val();
    let myRequestCreatedDateTo = $('#myRequestCreatedDateTo').val();
    $('.myRequestCreatedDate-start').text(myRequestCreatedDateFrom ? moment(myRequestCreatedDateFrom).format('D MMM, YYYY') : DATE_FROM_FILTER_EMPTY);
    $('.myRequestCreatedDate-end').text(myRequestCreatedDateTo ? moment(myRequestCreatedDateTo).format('D MMM, YYYY') : DATE_TO_FILTER_EMPTY);
    if (myRequestCreatedDateFrom || myRequestCreatedDateTo) {
        $('.myRequestCreatedDate-filter').removeClass('d-none');
    } else {
        $('.myRequestCreatedDate-filter').addClass('d-none');
    }

    let myRequestDateFrom = $('#myRequestDeadlineFrom').val();
    let myRequestDateTo = $('#myRequestDeadlineTo').val();
    $('.myRequestDate-start').text(myRequestDateFrom ? moment(myRequestDateFrom).format('D MMM, YYYY') : DATE_FROM_FILTER_EMPTY);
    $('.myRequestDate-end').text(myRequestDateTo ? moment(myRequestDateTo).format('D MMM, YYYY') : DATE_TO_FILTER_EMPTY);
    if (myRequestDateFrom || myRequestDateTo) {
        $('.myRequestDate-filter').removeClass('d-none');
    } else {
        $('.myRequestDate-filter').addClass('d-none');
    }

    if (myassignToFilter || myRequestDateFrom || myRequestDateTo || myRequestCreatedDateFrom || myRequestCreatedDateTo) {
        $(".Request-show-filter-choose").removeClass('d-none');
        $(".myRequestResult-filter").removeClass('d-none');
    } else {
        $(".Request-show-filter-choose").addClass('d-none');
        $('.myRequestResult-filter').addClass('d-none');
    }
}
/////////////////

//My Tasks
getMyTasks = function () {
    showHideLoader('#myt-spinner', true);
    $.ajax({
        url: "/Home/GetAssignedTasks?offset=" + timeZoneOffset,
        success: function (data) {
            $("#myTasks").html(data);
        },
        complete: function () {
            $(".myt").tooltip({ placement: TOOLTIP_POSITION });
            initMyTasksTable();
            $('#myTasksCreatedByFilter').selectpicker();
            $('#myTasksDepartmentFilter').selectpicker();
            showHideLoader('#myt-spinner', false);
        }
    })
}

initMyTasksTable = function () {
    deleteConfirmation();

    let stateLoadParams = function (settings, data) {
        try {
            var createdByFilter = data.columns[2].search.search;
            var departmentFilter = data.columns[7].search.search;

            var createdDateFrom = data.createdDateFrom;
            var createdDateTo = data.createdDateTo;

            var deadlineDateFrom = data.deadlineDateFrom;
            var deadlineDateTo = data.deadlineDateTo;

            $('#myTasksCreatedByFilter').val(createdByFilter);
            $('#myTasksDepartmentFilter').val(departmentFilter);

            $('#myTasksCreatedDateFrom').val(createdDateFrom);
            $('#myTasksCreatedDateTo').val(createdDateTo);

            $('#myTasksDeadlineFrom').val(deadlineDateFrom);
            $('#myTasksDeadlineTo').val(deadlineDateTo);
        } catch { }
    }

    let stateSaveParams = function (settings, data) {
        data.createdDateFrom = $("#myTasksCreatedDateFrom").val();
        data.createdDateTo = $("#myTasksCreatedDateTo").val();

        data.deadlineDateFrom = $("#myTasksDeadlineFrom").val();
        data.deadlineDateTo = $("#myTasksDeadlineTo").val();
    }

    let dataTable = handleDataTable({
        selector: "#table_task",
        stateLoadCallback: stateLoadParams,
        stateSaveCallback: stateSaveParams
    });

    $("#myTasksDeadlineFrom, #myTasksDeadlineTo, #myTasksCreatedDateFrom, #myTasksCreatedDateTo").change(function () {
        dataTable.api().draw();
        refreshMyTasksFilterResult();
    });

    $("#myTasksCreatedByFilter").change(function () {
        dataTable.api().columns(2).search(this.value ? this.value : '').draw();
        refreshMyTasksFilterResult();
    })

    $("#myTasksDepartmentFilter").change(function () {
        dataTable.api().columns(7).search(this.value ? this.value : '').draw();
        refreshMyTasksFilterResult();
    })

    $.fn.dataTable.ext.search.push(
        function (settings, data, dataIndex) {
            if (settings.nTable.id !== "table_task") {
                return true;
            }

            var minCreatedDate = new Date($("#myTasksCreatedDateFrom").val());
            minCreatedDate.setHours(0);
            minCreatedDate.setMinutes(0);
            minCreatedDate.setSeconds(0);

            var maxCreatedDate = new Date($("#myTasksCreatedDateTo").val());
            maxCreatedDate.setHours(0);
            maxCreatedDate.setMinutes(0);
            maxCreatedDate.setSeconds(0);

            var minDeadline = new Date($("#myTasksDeadlineFrom").val());
            minDeadline.setHours(0);
            minDeadline.setMinutes(0);
            minDeadline.setSeconds(0);

            var maxDeadline = new Date($("#myTasksDeadlineTo").val());
            maxDeadline.setHours(0);
            maxDeadline.setMinutes(0);
            maxDeadline.setSeconds(0);

            var createdDate = convertFromStringToDate(data[3]);
            var deadline = convertFromStringToDate(data[4]);

            if (
                ((!isValidDate(minDeadline) && !isValidDate(maxDeadline)) ||
                    (!isValidDate(minDeadline) && deadline <= maxDeadline) ||
                    (minDeadline <= deadline && !isValidDate(maxDeadline)) ||
                    (minDeadline <= deadline && deadline <= maxDeadline)) &&

                ((!isValidDate(minCreatedDate) && !isValidDate(maxCreatedDate)) ||
                    (!isValidDate(minCreatedDate) && createdDate <= maxCreatedDate) ||
                    (minCreatedDate <= createdDate && !isValidDate(maxCreatedDate)) ||
                    (minCreatedDate <= createdDate && createdDate <= maxCreatedDate))
            ) {
                return true;
            }
            return false;
        }
    )

    $('.myTasksCreatedDate-filter .fa-times').click(function (e) {
        $("#myTasksCreatedDateFrom , #myTasksCreatedDateTo").val('').trigger('change');
        refreshMyTasksFilterResult();
    });

    $('.myTasksDate-filter .fa-times').click(function (e) {
        $("#myTasksDeadlineFrom , #myTasksDeadlineTo").val('').trigger('change');
        refreshMyTasksFilterResult();
    });

    $('.myTasksCreated-filter .fa-times').click(function (e) {
        $("#myTasksCreatedByFilter").val('').trigger('change');
        refreshMyTasksFilterResult();
    });

    $('.myTasksDepartment-filter .fa-times').click(function (e) {
        $("#myTasksDepartmentFilter").val('').trigger('change');
        refreshMyTasksFilterResult();
    });

    $("#myTasksDeadlineFrom, #myTasksDeadlineTo, #myTasksCreatedDateFrom, #myTasksCreatedDateTo").trigger('change');

    $("#myTasksCreatedByFilter").trigger('change');

    $("#myTasksDepartmentFilter").trigger('change');

    refreshMyTasksFilterResult();
}

refreshMyTasksFilterResult = function () {
    let filterResults = $("#table_task").DataTable().rows({ search: 'applied' }).count();
    $('.myTasksResult-filter > span').text(filterResults);

    let createdById = $('#myTasksCreatedByFilter :selected').val();
    if (createdById) {
        $('.myTasksCreated-filter').removeClass('d-none');
    } else {
        $('.myTasksCreated-filter').addClass('d-none');
    }
    $('.myTasksCreated-filter > span').text($('#myTasksCreatedByFilter :selected').text());

    let myTasksDepartment = $('#myTasksDepartmentFilter :selected').val();
    if (myTasksDepartment) {
        $('.myTasksDepartment-filter').removeClass('d-none');
    } else {
        $('.myTasksDepartment-filter').addClass('d-none');
    }
    $('.myTasksDepartment-filter > span').text($('#myTasksDepartmentFilter :selected').text());

    let myTasksCreatedDateFromFilter = $('#myTasksCreatedDateFrom').val();
    let myTasksCreatedDateToFilter = $('#myTasksCreatedDateTo').val();
    $('.myTasksCreatedDate-start').text(myTasksCreatedDateFromFilter ? moment(myTasksCreatedDateFromFilter).format('D MMM, YYYY') : DATE_FROM_FILTER_EMPTY);
    $('.myTasksCreatedDate-end').text(myTasksCreatedDateToFilter ? moment(myTasksCreatedDateToFilter).format('D MMM, YYYY') : DATE_TO_FILTER_EMPTY);
    if (myTasksCreatedDateFromFilter || myTasksCreatedDateToFilter) {
        $('.myTasksCreatedDate-filter').removeClass('d-none');
    } else {
        $('.myTasksCreatedDate-filter').addClass('d-none');
    }

    let myTasksDateFromFilter = $('#myTasksDeadlineFrom').val();
    let myTasksDateToFilter = $('#myTasksDeadlineTo').val();
    $('.myTasksDate-start').text(myTasksDateFromFilter ? moment(myTasksDateFromFilter).format('D MMM, YYYY') : DATE_FROM_FILTER_EMPTY);
    $('.myTasksDate-end').text(myTasksDateToFilter ? moment(myTasksDateToFilter).format('D MMM, YYYY') : DATE_TO_FILTER_EMPTY);
    if (myTasksDateFromFilter || myTasksDateToFilter) {
        $('.myTasksDate-filter').removeClass('d-none');
    } else {
        $('.myTasksDate-filter').addClass('d-none');
    }

    if (createdById || myTasksDateFromFilter || myTasksDateToFilter || myTasksDepartment || myTasksCreatedDateFromFilter || myTasksCreatedDateToFilter) {
        $(".mytasks-show-filter-choose").removeClass('d-none');
        $('.myTasksResult-filter').removeClass('d-none');
    } else {
        $(".mytasks-show-filter-choose").addClass('d-none');
        $('.myTasksResult-filter').addClass('d-none');
    }
}

deleteMyTask = function (taskId) {
    showHideLoader('#myt-spinner', true);
    $.get(`/Home/DeleteTask?taskId=${taskId}`, function (data, status) {
        if (data) {
            getMyTasks();
        } else {
            showHideLoader('#myt-spinner', false);
            toastr.error(OPERATION_FAILED);
        }
    })
}
/////////////////

//My Team Tasks
getMyTeamTasks = function () {
    showHideLoader('#mtt-spinner', true);
    $.ajax({
        url: "/Home/GetMyTeamTasks?offset=" + timeZoneOffset,
        success: function (data) {
            $("#myTeamTasks").html(data);
        },
        complete: function () {
            $(".mtt").tooltip({ placement: TOOLTIP_POSITION });

            initMyTeamTasksTable();
            $('#myTeamTasksDepartmentFilter').selectpicker();
            $('#myTeamTasksAssignedToFilter').selectpicker();

            showHideLoader('#mtt-spinner', false);
        }
    })
}

initMyTeamTasksTable = function () {
    deleteConfirmation();

    let stateLoadParams = function (settings, data) {
        try {
            var createdByFilter = data.columns[0].search.search;
            var departmentFilter = data.columns[7].search.search;
            var deadlineDateFrom = data.deadlineDateFrom;
            var deadlineDateTo = data.deadlineDateTo;
            var createdDateFrom = data.createdDateFrom;
            var createdDateTo = data.createdDateTo;

            $('#myTeamTasksAssignedToFilter').val(createdByFilter);
            $('#myTeamTasksDepartmentFilter').val(departmentFilter);
            $('#myTeamTasksdeadlineFrom').val(deadlineDateFrom);
            $('#myTeamTasksdeadlineTo').val(deadlineDateTo);
            $("#myTeamTasksCreatedDateFrom").val(createdDateFrom);
            $("#myTeamTasksCreatedDateTo").val(createdDateTo);
        } catch { }
    }

    let stateSaveParams = function (settings, data) {
        data.deadlineDateFrom = $("#myTeamTasksdeadlineFrom").val();
        data.deadlineDateTo = $("#myTeamTasksdeadlineTo").val();
        data.createdDateFrom = $("#myTeamTasksCreatedDateFrom").val();
        data.createdDateTo = $("#myTeamTasksCreatedDateTo").val();
    }

    let dataTable = handleDataTable({
        selector: "#table_team_task",
        //columnDefs: colDefsOptions,
        stateLoadCallback: stateLoadParams,
        stateSaveCallback: stateSaveParams
    });

    $("#myTeamTasksdeadlineFrom, #myTeamTasksdeadlineTo").change(function () {
        dataTable.api().draw();
        refreshMyTeamTasksFilterResult();
    });

    $("#myTeamTasksCreatedDateFrom, #myTeamTasksCreatedDateTo").change(function () {
        dataTable.api().draw();
        refreshMyTeamTasksFilterResult();
    });

    $("#myTeamTasksAssignedToFilter").change(function () {
        dataTable.api().columns(0).search(this.value ? this.value : '').draw();
        refreshMyTeamTasksFilterResult();
    })

    $("#myTeamTasksDepartmentFilter").change(function () {
        dataTable.api().columns(7).search(this.value ? this.value : '').draw();
        refreshMyTeamTasksFilterResult();
    })

    $.fn.dataTable.ext.search.push(
        function (settings, data, dataIndex) {
            if (settings.nTable.id !== "table_team_task") {
                return true;
            }

            var minDeadline = new Date($("#myTeamTasksdeadlineFrom").val());
            minDeadline.setHours(0);
            minDeadline.setMinutes(0);
            minDeadline.setSeconds(0);

            var maxDeadline = new Date($("#myTeamTasksdeadlineTo").val());
            maxDeadline.setHours(0);
            maxDeadline.setMinutes(0);
            maxDeadline.setSeconds(0);

            var minCreatedDate = new Date($("#myTeamTasksCreatedDateFrom").val());
            minCreatedDate.setHours(0);
            minCreatedDate.setMinutes(0);
            minCreatedDate.setSeconds(0);

            var maxCreatedDate = new Date($("#myTeamTasksCreatedDateTo").val());
            maxCreatedDate.setHours(0);
            maxCreatedDate.setMinutes(0);
            maxCreatedDate.setSeconds(0);

            var deadline = convertFromStringToDate(data[4]);
            var createdDate = convertFromStringToDate(data[3]);

            if (
                ((!isValidDate(minDeadline) && !isValidDate(maxDeadline)) ||
                    (!isValidDate(minDeadline) && deadline <= maxDeadline) ||
                    (minDeadline <= deadline && !isValidDate(maxDeadline)) ||
                    (minDeadline <= deadline && deadline <= maxDeadline)) &&
                ((!isValidDate(minCreatedDate) && !isValidDate(maxCreatedDate)) ||
                    (!isValidDate(minCreatedDate) && createdDate <= maxCreatedDate) ||
                    (minCreatedDate <= createdDate && !isValidDate(maxCreatedDate)) ||
                    (minCreatedDate <= createdDate && createdDate <= maxCreatedDate))
            ) {
                return true;
            }
            return false;
        }
    )

    $('.myTeamTasksDate-filter .fa-times').click(function (e) {
        $("#myTeamTasksdeadlineFrom , #myTeamTasksdeadlineTo").val('').trigger('change');
        refreshMyTasksFilterResult();
    });

    $('.myTeamTasksAssignedTo-filter .fa-times').click(function (e) {
        $("#myTeamTasksAssignedToFilter").val('').trigger('change');
        refreshMyTasksFilterResult();
    });

    $('.myTeamTasksDepartment-filter .fa-times').click(function (e) {
        $("#myTeamTasksDepartmentFilter").val('').trigger('change');
        refreshMyTasksFilterResult();
    });

    $('.myTeamTasksCreatedDate-filter .fa-times').click(function (e) {
        $("#myTeamTasksCreatedDateFrom , #myTeamTasksCreatedDateTo").val('').trigger('change');
        refreshMyTasksFilterResult();
    });

    $("#myTeamTasksdeadlineFrom, #myTeamTasksdeadlineTo").trigger('change');
    $("#myTeamTasksAssignedToFilter").trigger('change');
    $("#myTeamTasksDepartmentFilter").trigger('change');
    $("#myTeamTasksCreatedDateFrom, #myTeamTasksCreatedDateTo").trigger('change');

    refreshMyTeamTasksFilterResult();
}

refreshMyTeamTasksFilterResult = function () {
    let filterResults = $("#table_team_task").DataTable().rows({ search: 'applied' }).count();
    $('.myTeamTasksResult-filter > span').text(filterResults);

    let createdById = $('#myTeamTasksAssignedToFilter :selected').val();
    if (createdById) {
        $('.myTeamTasksAssignedTo-filter').removeClass('d-none');
    } else {
        $('.myTeamTasksAssignedTo-filter').addClass('d-none');
    }
    $('.myTeamTasksAssignedTo-filter > span').text($('#myTeamTasksAssignedToFilter :selected').text());


    let myTasksDepartment = $('#myTeamTasksDepartmentFilter :selected').val();
    if (myTasksDepartment) {
        $('.myTeamTasksDepartment-filter').removeClass('d-none');
    } else {
        $('.myTeamTasksDepartment-filter').addClass('d-none');
    }
    $('.myTeamTasksDepartment-filter > span').text($('#myTeamTasksDepartmentFilter :selected').text());

    let myTasksDateFromFilter = $('#myTeamTasksdeadlineFrom').val();
    let myTasksDateToFilter = $('#myTeamTasksdeadlineTo').val();
    $('.myTeamTasksDate-start').text(myTasksDateFromFilter ? moment(myTasksDateFromFilter).format('D MMM, YYYY') : DATE_FROM_FILTER_EMPTY);
    $('.myTeamTasksDate-end').text(myTasksDateToFilter ? moment(myTasksDateToFilter).format('D MMM, YYYY') : DATE_TO_FILTER_EMPTY);
    if (myTasksDateFromFilter || myTasksDateToFilter) {
        $('.myTeamTasksDate-filter').removeClass('d-none');
    } else {
        $('.myTeamTasksDate-filter').addClass('d-none');
    }

    let myTasksCreatedDateFromFilter = $('#myTeamTasksCreatedDateFrom').val();
    let myTasksCreatedDateToFilter = $('#myTeamTasksCreatedDateTo').val();
    $('.myTeamTasksCreatedDate-start').text(myTasksCreatedDateFromFilter ? moment(myTasksCreatedDateFromFilter).format('D MMM, YYYY') : DATE_FROM_FILTER_EMPTY);
    $('.myTeamTasksCreatedDate-end').text(myTasksCreatedDateToFilter ? moment(myTasksCreatedDateToFilter).format('D MMM, YYYY') : DATE_TO_FILTER_EMPTY);
    if (myTasksCreatedDateFromFilter || myTasksCreatedDateToFilter) {
        $('.myTeamTasksCreatedDate-filter').removeClass('d-none');
    } else {
        $('.myTeamTasksCreatedDate-filter').addClass('d-none');
    }

    if (createdById || myTasksDateFromFilter || myTasksDateToFilter || myTasksDepartment || myTasksCreatedDateFromFilter || myTasksCreatedDateToFilter) {
        $(".myTeamtasks-show-filter-choose").removeClass('d-none');
        $('.myTeamTasksResult-filter').removeClass('d-none');
    } else {
        $(".myTeamtasks-show-filter-choose").addClass('d-none');
        $('.myTeamTasksResult-filter').addClass('d-none');
    }
}

deleteMyTeamTask = function (taskId) {
    showHideLoader('#mtt-spinner', true);
    $.get(`/Home/DeleteTask?taskId=${taskId}`, function (data, status) {
        if (data) {
            getMyTeamTasks();
        } else {
            showHideLoader('#mtt-spinner', false);
            toastr.error(OPERATION_FAILED);
        }
    })
}
/////////////////

//My Team Pending Requests
getPendingOnTeam = function () {
    showHideLoader('#pot-spinner', true);
    $.ajax({
        url: "/Home/GetMyTeamPendingRequests?offset=" + timeZoneOffset,
        success: function (data) {
            $("#pendingOnTeam").html(data);
        },
        complete: function () {
            $(".pot").tooltip({ placement: TOOLTIP_POSITION });

            initPendingOnTeamTable();
            $('#pendingOnTeamPendingOn').selectpicker();

            showHideLoader('#pot-spinner', false);
        }
    })
}

initPendingOnTeamTable = function () {
    deleteConfirmation();

    let stateLoadParams = function (settings, data) {
        try {
            var createdByFilter = data.columns[1].search.search;

            var createdDateFrom = data.createdDateFrom;
            var createdDateTo = data.createdDateTo;

            var deadlineDateFrom = data.deadlineDateFrom;
            var deadlineDateTo = data.deadlineDateTo;

            $('#pendingOnTeamPendingOn').val(createdByFilter);

            $('#pendingOnTeamCreatedDateFrom').val(createdDateFrom);
            $('#pendingOnTeamCreatedDateTo').val(createdDateTo);

            $('#pendingOnTeamDeadlineFrom').val(deadlineDateFrom);
            $('#pendingOnTeamDeadlineTo').val(deadlineDateTo);
        } catch { }
    }

    let stateSaveParams = function (settings, data) {
        data.createdDateFrom = $("#pendingOnTeamCreatedDateFrom").val();
        data.createdDateTo = $("#pendingOnTeamCreatedDateTo").val();

        data.deadlineDateFrom = $("#pendingOnTeamDeadlineFrom").val();
        data.deadlineDateTo = $("#pendingOnTeamDeadlineTo").val();
    }

    let dataTable = handleDataTable({
        selector: "#table_team_pending",
        //columnDefs: colDefsOptions,
        stateLoadCallback: stateLoadParams,
        stateSaveCallback: stateSaveParams
    });

    $("#pendingOnTeamCreatedDateFrom, #pendingOnTeamCreatedDateTo").change(function () {
        dataTable.api().draw();
        refreshPendingOnTeamFilterResult();
    });

    $("#pendingOnTeamDeadlineFrom, #pendingOnTeamDeadlineTo").change(function () {
        dataTable.api().draw();
        refreshPendingOnTeamFilterResult();
    });

    $("#pendingOnTeamPendingOn").change(function () {
        dataTable.api().columns(1).search(this.value ? this.value : '').draw();
        refreshPendingOnTeamFilterResult();
    })

    $.fn.dataTable.ext.search.push(
        function (settings, data, dataIndex) {
            if (settings.nTable.id !== "table_team_pending") {
                return true;
            }

            var minCreatedDate = new Date($("#pendingOnTeamCreatedDateFrom").val());
            minCreatedDate.setHours(0);
            minCreatedDate.setMinutes(0);
            minCreatedDate.setSeconds(0);

            var maxCreatedDate = new Date($("#pendingOnTeamCreatedDateTo").val());
            maxCreatedDate.setHours(0);
            maxCreatedDate.setMinutes(0);
            maxCreatedDate.setSeconds(0);

            var minDeadline = new Date($("#pendingOnTeamDeadlineFrom").val());
            minDeadline.setHours(0);
            minDeadline.setMinutes(0);
            minDeadline.setSeconds(0);

            var maxDeadline = new Date($("#pendingOnTeamDeadlineTo").val());
            maxDeadline.setHours(0);
            maxDeadline.setMinutes(0);
            maxDeadline.setSeconds(0);

            var createdDate = convertFromStringToDate(data[3]);
            var deadlineDate = convertFromStringToDate(data[4]);

            if (
                ((!isValidDate(minDeadline) && !isValidDate(maxDeadline)) ||
                    (!isValidDate(minDeadline) && deadlineDate <= maxDeadline) ||
                    (minDeadline <= deadlineDate && !isValidDate(maxDeadline)) ||
                    (minDeadline <= deadlineDate && deadlineDate <= maxDeadline)) &&
                ((!isValidDate(minCreatedDate) && !isValidDate(maxCreatedDate)) ||
                    (!isValidDate(minCreatedDate) && createdDate <= maxCreatedDate) ||
                    (minCreatedDate <= createdDate && !isValidDate(maxCreatedDate)) ||
                    (minCreatedDate <= createdDate && createdDate <= maxCreatedDate))
            ) {
                return true;
            }
            return false;
        }
    )

    $('.pendingOnTeamCreatedDate-filter .fa-times').click(function (e) {
        $("#pendingOnTeamCreatedDateFrom , #pendingOnTeamCreatedDateTo").val('').trigger('change');
        refreshPendingOnTeamFilterResult();
    });

    $('.pendingOnTeamDate-filter .fa-times').click(function (e) {
        $("#pendingOnTeamDeadlineFrom , #pendingOnTeamDeadlineTo").val('').trigger('change');
        refreshPendingOnTeamFilterResult();
    });

    $('.pendingOnTeamCreatedBy-filter .fa-times').click(function (e) {
        $("#pendingOnTeamPendingOn").val('').trigger('change');
        refreshPendingOnTeamFilterResult();
    });

    $("#pendingOnTeamCreatedDateFrom, #pendingOnTeamCreatedDateTo").trigger('change');

    $("#pendingOnTeamDeadlineFrom, #pendingOnTeamDeadlineTo").trigger('change');

    $("#pendingOnTeamPendingOn").trigger('change');

    refreshPendingOnTeamFilterResult();
}

refreshPendingOnTeamFilterResult = function () {
    let filterResults = $("#table_team_pending").DataTable().rows({ search: 'applied' }).count();
    $('.pendingOnTeamResult-filter > span').text(filterResults);

    let createdByFilter = $('#pendingOnTeamPendingOn :selected').val();
    if (createdByFilter) {
        $('.pendingOnTeamCreatedBy-filter').removeClass('d-none');
    } else {
        $('.pendingOnTeamCreatedBy-filter').addClass('d-none');
    }
    $('.pendingOnTeamCreatedBy-filter > span').text($('#pendingOnTeamPendingOn :selected').text());

    let createdDateFrom = $('#pendingOnTeamCreatedDateFrom').val();
    let createdDateTo = $('#pendingOnTeamCreatedDateTo').val();
    $('.pendingOnTeamCreatedDate-start').text(createdDateFrom ? moment(createdDateFrom).format('D MMM, YYYY') : DATE_FROM_FILTER_EMPTY);
    $('.pendingOnTeamCreatedDate-end').text(createdDateTo ? moment(createdDateTo).format('D MMM, YYYY') : DATE_TO_FILTER_EMPTY);
    if (createdDateFrom || createdDateTo) {
        $('.pendingOnTeamCreatedDate-filter').removeClass('d-none');
    } else {
        $('.pendingOnTeamCreatedDate-filter').addClass('d-none');
    }

    let DateFrom = $('#pendingOnTeamDeadlineFrom').val();
    let DateTo = $('#pendingOnTeamDeadlineTo').val();
    $('.pendingOnTeamDate-start').text(DateFrom ? moment(DateFrom).format('D MMM, YYYY') : DATE_FROM_FILTER_EMPTY);
    $('.pendingOnTeamDate-end').text(DateTo ? moment(DateTo).format('D MMM, YYYY') : DATE_TO_FILTER_EMPTY);
    if (DateFrom || DateTo) {
        $('.pendingOnTeamDate-filter').removeClass('d-none');
    } else {
        $('.pendingOnTeamDate-filter').addClass('d-none');
    }

    if (createdByFilter || DateFrom || DateTo || createdDateFrom || createdDateTo) {
        $(".pendingOnTeam-show-filter-choose").removeClass('d-none');
        $(".pendingOnTeamResult-filter").removeClass('d-none');
    } else {
        $(".pendingOnTeam-show-filter-choose").addClass('d-none');
        $('.pendingOnTeamResult-filter').addClass('d-none');
    }
}
/////////////////

//Global Request Functions
approveRequest = function (requestId, source) {
    showHideLoader('#pom-spinner', true);
    $.get(`/Home/ApproveRequest?requestId=${requestId}&source=${source}`, function (data, status) {
        if (data) {
            getPendingOnMe();
        } else {
            showHideLoader('#pom-spinner', false);
            toastr.error(OPERATION_FAILED);
        }
    })
}

rejectRequest = function (requestId, source) {
    showHideLoader('#pom-spinner', true);
    $.get(`/Home/RejectRequest?requestId=${requestId}&source=${source}`, function (data, status) {
        if (data) {
            getPendingOnMe();
        } else {
            showHideLoader('#pom-spinner', false);
            toastr.error(OPERATION_FAILED);
        }
    })
}

undoRequest = function (requestId, source) {
    showHideLoader('#pom-spinner', true);
    $.get(`/Home/UndoRequest?requestId=${requestId}&source=${source}`, function (data, status) {
        if (data) {
            getPendingOnMe();
        } else {
            showHideLoader('#pom-spinner', false);
            toastr.error(OPERATION_FAILED);
        }
    })
}

deleteRequest = function (requestId, source) {
    showHideLoader('#pot-spinner', true);
    showHideLoader('#myr-spinner', true);
    $.get(`/Home/DeleteRequest?requestId=${requestId}&source=${source}`, function (data, status) {
        if (data) {
            getPendingOnTeam();
            getMyRequests();
        } else {
            showHideLoader('#pot-spinner', false);
            showHideLoader('#myr-spinner', false);
            toastr.error(OPERATION_FAILED);
        }
    })
}
////////////////

doneTask = function (id) {
    showHideLoader('#myt-spinner', true);
    $.get(`/Home/DoneTask?taskId=${id}`, function (data, status) {
        if (data) {
            getMyTasks();
        } else {
            showHideLoader('#myt-spinner', false);
            toastr.error(OPERATION_FAILED);
        }
    });
}

unDoTask = function (id) {
    showHideLoader('#myt-spinner', true);
    showHideLoader('#mtt-spinner', true);
    $.get(`/Home/UnDoTask?taskId=${id}`, function (data, status) {
        if (data) {
            getMyTasks();
            getMyTeamTasks();
        } else {
            showHideLoader('#myt-spinner', false);
            showHideLoader('#mtt-spinner', false);
            toastr.error(OPERATION_FAILED);
        }
    });
}

showTaskDetails = function (taskId) {
    showLoader();
    $.get(`/Home/GetDetailsTask/${taskId}?offset=${timeZoneOffset}`, function (data, status) {
        if (status == "success") {
            $("#taskDetails").html(data);
            $('#taskDetailsModal').modal('show');
        }
        hideLoader();
    })
}

editDetailsTask = function (taskId) {
    showLoader();
    $.get(`/Home/EditTask/?taskId=${taskId}`, function (data, status) {
        if (status == "success") {
            $("#edittaskDetails").html(data);
            $('#editTaskModal').modal('show');
        }
        hideLoader();
    })
}

updateDetailsTask = function () {
    let form = $("#editTaskForm");
    if (form.valid()) {
        showLoader();
        $.post('/api/Shared/EditTask', form.serialize(), function (data, status) {
            if (data) {
                clearData("#editTaskForm");
                getMyTeamTasks();
                getMyTasks();
                $('#editTaskModal').modal('hide');
                hideLoader();
            } else {
                hideLoader();
                toastr.error(OPERATION_FAILED);
            }
        });
    }
}

taskReminder = function (taskId) {
    $.get(`/Notifications/TaskReminder/${taskId}`, function () { });
}

requestkReminder = function (requestd) {
    $.get(`/Notifications/RequestReminder/${requestd}`, () => { });
}
//Global Functions
OpenModel = function (modelId, e) {

    //$('html, body').animate({ scrollTop: 600 }, 500);
    e.stopPropagation();
    if ($(e.target).hasClass("open")) {
        $(e.target).removeClass("open");
    } else {
        $(e.target).addClass("open")
    }
    $(`#${modelId} .box-filter`).toggleClass('open');
    $('#' + modelId).toggleClass('open');
    $('.overlay-body').toggleClass('open');
    $('body').toggleClass("no-scroll");
}

deleteConfirmation = function () {
    $(".btn-confirm-delete").confirmation({
        rootSelector: '[data-toggle=confirmation]',
        // other options
        popout: true,
        singleton: true,
        title: DELETE,
        btnOkLabel: YES,
        btnCancelLabel: NO,
        onConfirm: function () {
            switch ($(this).data('source')) {
                case "myTask":
                    deleteMyTask($(this).data('itemid'));
                    break;
                case "myTeamTask":
                    deleteMyTeamTask($(this).data('itemid'));
                    break;
                case "myRequest":
                    deleteRequest($(this).data('itemid'), $(this).data('request-source'))
                    break;
                case "pendingOnTeam":
                    deleteRequest($(this).data('itemid'), $(this).data('request-source'))
                    break;
                default:
                    break;
            }

        }
    })
}

showHideLoader = function (selector, isShow) {
    if (isShow) {
        $(selector).removeClass('d-none');
    } else {
        $(selector).addClass('d-none');
    }
}

//open Month Menu
$('.month-calendar > li').click(function (e) {
    e.stopPropagation();
    $("#child-month").toggleClass("open");
});

//Function Get All Month
function getMonth() {


    var months = {
        1: 'Jan',
        2: 'Feb',
        3: 'Mar',
        4: 'Apr',
        5: 'May',
        6: 'Jun',
        7: 'Jul',
        8: 'Aug',
        9: 'Sep',
        10: 'Oct',
        11: 'Nov',
        12: 'Dec'
    };

    let lis = '';
    $.each(months, function (key, value) {

        lis += `<li class="list-month" data-month="${key - 1}">${value}</li>`;
        $("#child-month").html(lis);
    });

    let allDate = new Date();
    $(".month-calendar > li span").html(months[allDate.getMonth() + 1]);



    // Change Month
    for (i = 0; i < $('#child-month .list-month').length; i++) {

        $('#child-month .list-month')[i].addEventListener('click', function onClick(e) {
            $(".month-calendar li span").text($(this).text());
            drwCalendar($(this).data("month"));
        })
    }


}

getMonth();

function drwCalendar(month) {
    var calendarEl = document.getElementById('calendarDash');

    var calendar = new FullCalendar.Calendar(calendarEl, {

        headerToolbar: {
            left: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
            center: 'title',
            right: 'prev,next today'
        },
        initialDate: new Date().setMonth(month),
        navLinks: true, // can click day/week names to navigate views
        businessHours: true, // display business hoursThis month
        editable: true,
        selectable: true,
        events: [
            {
                title: 'Business Lunch',
                start: '2022-05-24T13:00:00',
                constraint: 'businessHours'
            },
            {
                title: 'Meeting',
                start: '2022-05-23T11:00:00',
                constraint: 'availableForMeeting', // defined below
                color: '#257e4a'
            },
            {
                title: 'Conference',
                start: '2020-09-18',
                end: '2020-09-20'
            },
            {
                title: 'Party',
                start: '2020-09-29T20:00:00'
            },


            {
                groupId: 'availableForMeeting',
                start: '2020-09-11T10:00:00',
                end: '2020-09-11T16:00:00',
                display: 'background'
            },
            {
                groupId: 'availableForMeeting',
                start: '2020-09-13T10:00:00',
                end: '2020-09-13T16:00:00',
                display: 'background'
            },


            {
                start: '2020-09-24',
                end: '2020-09-28',
                overlap: false,
                display: 'background',
                color: '#ff9f89'
            },
            {
                start: '2020-09-06',
                end: '2020-09-08',
                overlap: false,
                display: 'background',
                color: '#ff9f89'
            }
        ]
    });

    calendar.render();

}

getDatails = function (id) {
    showLoader();
    $.get(`Home/GetDetailsRequest?RequestId=${id}&offset=${timeZoneOffset}`, function (data, status) {
        if (status == "success") {
            $("#requestDetails").html(data);
            $('#requestDetailsModal').modal('show');
        }
        hideLoader();
    })

}

// Create Charts Function Dashboard 
var chartDashboard = function () {
    const data = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: '',
            data: [0, 12, 6, 9, 12, 3, 9],
            backgroundColor: [
                '#FFF',
            ],
            borderColor: [
                '#0D68A9',

            ],
            segment: {
                borderDash: [6, 6],
            },
            borderWidth: 4,
            lineTension: 0,
            fill: false,
            pointBackgroundColor: '#34335B',
            pointBorderColor: "#eee",
            pointRadius: 8,
        }]
    };

    // config 
    const config = {
        type: 'line',
        data,
        options: {
            responsive: true,
            scales: {
                y: {
                    ticks: {
                        min: 10,
                        max: 100,
                        stepSize: 10,
                        callback: function (value, index, values) {
                            return value + 'm';
                        }
                    },
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    align: 'start',
                    labels: {
                        boxWidth: 0,
                        borderRadius: 0,
                    }
                }
            }
        },

    };

    // render init block
    const myChart = new Chart(
        document.getElementById('myChart'),
        config
    );


}


function getExpiryDocument() {
    $.get(`/Home/GetAllDocumentExpiryDate`, function (data) {
        $("#documentExpiryDate").html(data)
    })
}