
saveForm = function () {
    var isFormValid = $("#banksForm").valid();
    if (isFormValid) {
        showLoader();
        $("#banksForm").submit();
    }
}

addBranch = function () {
    let model = {};
    model.Branches = [];

    $("#branches tbody tr").each(function () {
        let branch = {};
        branch.Name = $(this).find(".branchname").val();
        branch.NameAr = $(this).find(".branchnamear").val();
        branch.Address = $(this).find(".branchaddress").val();
        branch.SwiftCode = $(this).find(".branchswiftcode").val();

        model.Branches.push(branch);
    })

    showLoader();
    $.ajax({
        url: "/Banks/AddBranch",
        method: "POST",
        data: model,
        success: function (data) {
            $("#branches").html(data);
        },
        complete: function () {
            hideLoader();
        }
    })
}

deleteBranch = function (index) {
    let model = {};
    model.Branches = [];

    $("#branches tbody tr").each(function () {
        let branch = {};
        branch.Name = $(this).find(".branchname").val();
        branch.NameAr = $(this).find(".branchnamear").val();
        branch.Address = $(this).find(".branchaddress").val();
        branch.SwiftCode = $(this).find(".branchswiftcode").val();

        model.Branches.push(branch);
    })

    showLoader();
    $.ajax({
        url: "/Banks/DeleteBranch?index=" + index,
        method: "POST",
        data: model,
        success: function (data) {
            $("#branches").html(data);
        },
        complete: function () {
            hideLoader();
        }
    })
}

addNewBank = function (countryId) {
    resetForm('bankInfoForm');
    clearBankInfoModal();
    $("#bankCountryId").val(countryId);
    $("#bankinfo").modal("show");
}

createBank = function () {
    let isValid = $("#bankInfoForm").valid();
    if (isValid) {
        let form = $("#bankInfoForm");
        showLoader();
        $.ajax({
            url: "/BanksTree/CreateBank",
            method: "POST",
            data: form.serialize(),
            success: function (data) {
                $("#banksTree").html(data);
                banksTreeInitialize();
                $("#bankinfo").modal("hide");
            },
            complete: function () {
                hideLoader();
            }
        })
    }
}

deleteBank = function (bankId) {
    showLoader();
    $.ajax({
        url: "/BanksTree/DeleteBank/" + bankId,
        success: function (data) {
            $("#banksTree").html(data);
            banksTreeInitialize();
        },
        complete: function () {
            hideLoader();
        }
    })
}

clearBankInfoModal = function () {
    $("#Id").val("");
    $("#CountryId").val("");
    $("#Name").val("");
    $("#NameAr").val("");
    $("#btnCreate").removeClass("d-none");
    $("#btnUpdate").addClass("d-none");
}

editBank = function (bankId) {
    showLoader();
    $("#bankInfoModal").load("/BanksTree/GetBankInfo/" + bankId, function () {
        $.validator.unobtrusive.parse("#bankInfoForm");
        $("#btnCreate").addClass("d-none");
        $("#btnUpdate").removeClass("d-none");
        hideLoader();
    })

    $("#bankinfo").modal("show");
}

updateBank = function () {
    let isValid = $("#bankInfoForm").valid();
    if (isValid) {
        let form = $("#bankInfoForm");
        showLoader();
        $.ajax({
            url: "/BanksTree/UpdateBank",
            method: "POST",
            data: form.serialize(),
            success: function (data) {
                $("#banksTree").html(data);
                banksTreeInitialize();
                $("#bankinfo").modal("hide");
                resetForm('bankInfoForm');
            },
            complete: function () {
                hideLoader();
            }
        })
    }
}

addBranch = function (bankId) {
    clearBranchInfoModal();
    $("#branchBankId").val(bankId);
    $("#branchInfo").modal("show");
}

createBranch = function () {
    let isValid = $("#branchInfoForm").valid();
    if (isValid) {
        let form = $("#branchInfoForm");
        showLoader();
        $.ajax({
            url: "/BanksTree/CreateBranch",
            method: "POST",
            data: form.serialize(),
            success: function (data) {
                $("#banksTree").html(data);
                banksTreeInitialize();
                $("#branchInfo").modal("hide");
            },
            complete: function () {
                hideLoader();
            }
        })
    }
}

clearBranchInfoModal = function () {
    $("#branchId").val("");
    $("#branchBankId").val("");
    $("#branchName").val("");
    $("#branchNameAr").val("");
    $("#Address").val("");
    $("#SwiftCode").val("");
    $("#btnCreateBranch").removeClass("d-none");
    $("#btnUpdateBranch").addClass("d-none");
}

deleteBranch = function (branchId) {
    showLoader();
    $.ajax({
        url: "/BanksTree/DeleteBranch?branchId=" + branchId,
        success: function (data) {
            $("#banksTree").html(data);
            banksTreeInitialize();
        },
        complete: function () {
            hideLoader();
        }
    })
}

editBranch = function (branchId) {
    showLoader();
    $("#branchInfoModal").load("/BanksTree/GetBranchInfo?branchId=" + branchId, function () {
        $.validator.unobtrusive.parse("#branchInfoForm");
        $("#btnCreateBranch").addClass("d-none");
        $("#btnUpdateBranch").removeClass("d-none");
        hideLoader();
    })

    $("#branchInfo").modal("show");
}

updateBranch = function () {
    let isValid = $("#branchInfoForm").valid();
    if (isValid) {
        let form = $("#branchInfoForm");
        showLoader();
        $.ajax({
            url: "/BanksTree/UpdateBranch",
            method: "POST",
            data: form.serialize(),
            success: function (data) {
                $("#banksTree").html(data);
                banksTreeInitialize();
                $("#branchInfo").modal("hide");
            },
            complete: function () {
                hideLoader();
            }
        })
    }
}


resetForm = function (formId) {
    $(`#${formId}`).find('input:text,input:hidden')
        .each(function () {
            $(this).val('');
        });
}