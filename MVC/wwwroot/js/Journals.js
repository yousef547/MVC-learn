$(document).ready(function () {
    GetJournals();

})

addEntry = function () {
    let model = $("#addEntry input, #addEntry select").serialize();
    showLoader();
    $.ajax({
        url: `/Journals/AddEntry`,
        method: "POST",
        data: model,
        success: function (data) {
            $("#addEntry").html(data);
            disableCredit();
            disableDebit();
        },
        complete: function () {
            hideLoader();
        }
    })
}

deleteEntry = function (index) {
    let model = $("#addEntry input, #addEntry select").serialize();
    showLoader();
    $.ajax({
        url: `/Journals/DeleteEntry?index=${index}`,
        method: "POST",
        data: model,
        success: function (data) {
            $("#addEntry").html(data);
            disableCredit();
            disableDebit();
        },
        complete: function () {
            hideLoader();
        }
    })
}

saveForm = function () {
    let isValid = $("#entriesForm").valid();
    if (isValid) {
        $("#entriesForm").submit();
    }
}

saveFormEdit = function () {
    let isValid = $("#editEntriesForm").valid();
    if (isValid) {
        $("#editEntriesForm").submit();
    }
}

disableCredit = function () {
    $('.debitamount').each(function () {
        if ($(this).val() == "" || $(this).val() == 0) {
            $(this).parent().next().children('input').attr("disabled", false);
            $(this).val("0.00")
        } else {
            $(this).parent().next().children('input').attr("disabled", true);
            $(this).parent().next().children('input').val("0.00")
        }
    })
}

disableDebit = function () {
    $('.creditamount').each(function () {
        console.log("ffffffff");
        if ($(this).val() == "" || $(this).val() == 0) {
            $(this).parent().prev().children('input').attr("disabled", false);
            $(this).val("0.00")
        } else {
            $(this).parent().prev().children('input').attr("disabled", true);
            $(this).parent().prev().children('input').val("0.00")
        }
    })
}

GetJournals = function () {
    showLoader();
    $.get(`/Journals/GetJournals`, function (data, status) {
        $("#JournalEntry").html(data);
        var clickFn = function () {

            var tr = $(this).closest('tr');
            var row = table.api().row(tr);
            if (row.child.isShown()) {
                // This row is already open - close it
                row.child.hide();
                tr.removeClass('shown');
            } else {
                // Open this row
                let itemId = row.data()["DT_RowId"];
                $.get(`/Journals/GetEntryById/${itemId}`, function (result) {
                    row.child(result).show();
                    tr.addClass('shown');
                })
            }
        }
        var stateLoadParams = function (settings, data) {
            var searchData = data.search.search;
            $("#searchbox").val(searchData);
        }
        var columnDefs = [
            { "width": "5%", "targets": 0 }
        ]
        let table = handleDataTable({
            selector: ".table-JournalEntry",
            stateLoadCallback: stateLoadParams,
            childClickFn: clickFn,
            columnDefs: columnDefs,

        });
        hideLoader();
    })
}

ApproveJournal = function (id) {
    showLoader();
    $.get(`/Journals/ApproveJournal/${id}`, function (data, status) {
        if (data) {
            GetJournals();
        }
       
        hideLoader();
    })
}

unDoJournal = function (id) {
    showLoader();
    $.get(`/Journals/UnDoJournal/${id}`, function (data, status) {
        if (data) {
            GetJournals();
        }
        hideLoader();
    })
}





