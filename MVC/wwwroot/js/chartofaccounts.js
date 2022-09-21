
showIncomeLoader = function () {
    $("#income-spinner").removeClass('d-none');
}

hideIncomeLoader = function () {
    $("#income-spinner").addClass('d-none');
}

incomeDepartmentChanged = function () {
    let departmentId = $("#incomeDepartmentId").val();

    showLoader();
    $.ajax({
        url: "/ChartOfAccounts/GetIncomeTree?departmentId=" + departmentId,
        success: function (data) {
            $("#incomeTree").html(data);
            financeTreeInitialize("#incomeTree");
        },
        complete: function () {
            hideLoader();
        }
    })
}

addParentAccount = function () {
    clearAccountForm();

    let departmentId = $("#incomeDepartmentId").val();
    $("#DepartmentId").val(departmentId);

    $("#btnCreate").removeClass('d-none');
    $("#btnUpdate").addClass('d-none');

    showLoader();
    $.ajax({
        url: "/ChartOfAccounts/GenerateNewParentCode?departmentId=" + departmentId,
        success: function (data) {
            $("#GeneratedCode").val(data);
        },
        complete: function () {
            hideLoader();
        }
    })

    $("#modalCreate").modal('show');
}

addAccount = function (parentId) {
    clearAccountForm();
    $('#ParentId').val(parentId);
    $("#DepartmentId").val($("#incomeDepartmentId").val())
    $("#btnCreate").removeClass('d-none');
    $("#btnUpdate").addClass('d-none');

    showLoader();
    $.ajax({
        url: "/ChartOfAccounts/GenerateNewCode?parentId=" + parentId,
        success: function (data) {
            $("#GeneratedCode").val(data);
        },
        complete: function () {
            hideLoader();
        }
    })

    $("#modalCreate").modal('show');
} 

clearAccountForm = function () {
    $('#Id').val('');
    $('#ParentId').val('');
    $('#Name').val('');
    $('#NameAr').val('');
    $('#Code').val('');
    $('#AutoCode').val('');
    $('#accountInfoForm').find('.text-danger').removeClass('field-validation-error').addClass('field-validation-valid').html('');
    $("#btnCreate").removeClass('d-none');
    $("#btnUpdate").addClass('d-none');
}

createAccount = function () {
    let isValid = $("#accountInfoForm").valid();

    if (isValid) {
        let form = $("#accountInfoForm");
        showLoader();
        $.ajax({
            url: '/ChartOfAccounts/Create',
            method: 'POST',
            data: form.serialize(),
            success: function (data) {
                $("#incomeTree").html(data);
                financeTreeInitialize("#incomeTree");
                $("#modalCreate").modal('hide');
                incomeDepartmentChanged();
            },
            complete: function () {
                hideLoader();
            }
        })
    }

} 

editAccount = function (accountId) {
    //checkIsIncome();
    showLoader();
    $.ajax({
        url: '/ChartOfAccounts/GetAccountInfo/' + accountId,
        success: function (data) {
            $("#accountInfoModal").html(data);

            $("#btnCreate").addClass('d-none');
            $("#btnUpdate").removeClass('d-none');
            $("#modalCreate").modal('show');
        },
        complete: function () {
            hideLoader();
        }
    })
}

updateAccount = function () {
    let isValid = $("#accountInfoForm").valid();

    if (isValid) {
        let form = $("#accountInfoForm");
        showLoader();
        $.ajax({
            url: '/ChartOfAccounts/Edit',
            method: 'POST',
            data: form.serialize(),
            success: function (data) {
                $("#incomeTree").html(data);
                financeTreeInitialize("#incomeTree");
                incomeDepartmentChanged();
                $("#modalCreate").modal('hide');
            },
            complete: function () {
                hideLoader();
            }
        })
    }
} 

deleteAccount = function (accountId, departmentId) {
    showLoader();
    $.ajax({
        url: '/ChartOfAccounts/Delete/' + accountId + '?departmentId=' + departmentId,
        success: function (data) {
            $("#incomeTree").html(data);
            financeTreeInitialize("#incomeTree");

        },
        complete: function () {
            hideLoader();
        }
    })
}  

viewAccount = function (accountId) {
    //checkIsIncome();
    showLoader();
    $.ajax({
        url: '/ChartOfAccounts/Details/' + accountId,
        success: function (data) {
            $("#viewInfoModal").html(data);
            $("#modalViewBox").modal('show');
        },
        complete: function () {
            hideLoader();
        }
    })
}


//$(document).ready(function () {
//    viewRun();
//})


viewRun = function (id) {

    showLoader();
    $.get(`/ChartOfAccounts/GetEntiesOfAccount/${id}`, function (data, status) {
        $("#JournalEntry").html(data);
        $("#modalViewRun").modal('show');

        //var clickFn = function () {

        //    var tr = $(this).closest('tr');
        //    var row = table.api().row(tr);
        //    if (row.child.isShown()) {
        //        // This row is already open - close it
        //        row.child.hide();
        //        tr.removeClass('shown');
        //    } else {
        //        // Open this row
        //        let itemId = row.data()["DT_RowId"];
        //        $.get(`/Journals/GetEntryById/${itemId}`, function (result) {
        //            row.child(result).show();
        //            tr.addClass('shown');
        //        })
        //    }
        //}
        //var stateLoadParams = function (settings, data) {
        //    var searchData = data.search.search;
        //    $("#searchbox").val(searchData);
        //}
        //var columnDefs = [
        //    { "width": "5%", "targets": 0 }
        //]
        //let table = handleDataTable({
        //    selector: ".table-JournalEntry",
        //    stateLoadCallback: stateLoadParams,
        //    childClickFn: clickFn,
        //    columnDefs: columnDefs,

        //});
        hideLoader();
    })
}





GetJournals = function () {
  
}
