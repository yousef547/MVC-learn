
openTablePayment = function (element, tableId) {
    $(`#${tableId}`).removeClass('d-none').siblings().addClass('d-none');
    $(element).addClass('active').parent().siblings().children("div").removeClass("active");
}

showActionBtn = function (btnsId, tableId) {
    var inputsCheckBox = $(`#${tableId} input:checked`);
    if (inputsCheckBox.length >= 1) {
        $(`#${btnsId}`).removeClass('d-none')
    } else {
        $(`#${btnsId}`).addClass('d-none')
    }

    if (inputsCheckBox.length >= 2) {
        $(`#${btnsId}.add-btn`).attr('disabled', true);
    } else {
        $(`#${btnsId}.add-btn`).attr('disabled', false);
    }
}

getProjectCode = function () {
    let projectId = $("#ProjectId").val();
    if (projectId) {
        let code = $("#ProjectId option:selected").data("code");
        $("#spanProjectCode").text(code);
    } else {
        $("#spanProjectCode").text("");
    }
}

changeSpanAmount = function () {
    let amount = $("#TotalAmount").val();
    if (amount) {
        $(".AmountSpan").text(`/ ${amount}`);
    } else {
        $(".AmountSpan").text(`/`);
    }
}

checkIsProject = function () {
    let isProject = $("[name='IsProject']:checked").val();
    if (isProject == "true") {
        $(".project-on").removeClass('d-none');
        $(".direction-on").addClass('d-none');
    } else {
        $(".direction-on").removeClass('d-none');
        $(".project-on").addClass('d-none');
    }
}

addDirection = function () {
    let model = $("#directionVMs input, #directionVMs select").serialize();

    showLoader();

    $.ajax({
        url: '/Payments/AddDirection',
        data: model,
        method: "POST",
        success: function (result) {
            $("#directionVMs").html(result);
            changeSpanAmount();
        },
        complete: function () {
            hideLoader();
        }
    })
}

saveForm = function () {
    let isValid = $("#paymentRequestForm").valid();

    if (isValid) {
        let isValidAmount = checkValidAmount();
        if (isValidAmount) {
            showLoader();

            $("#paymentRequestForm").submit();
        }
    }
}

checkValidAmount = function () {
    $("#TotalAmount").removeClass("border-danger");
    $(".child-amount").removeClass("border-danger");

    let amount = parseFloat($("#TotalAmount").val());

    let isProject = $("[name='IsProject']:checked").val();
    if (isProject == "true") {
        let childsAmount = 0;
        $(".child-amount").each(function () {
            childsAmount += parseFloat($(this).val());
        })

        if (amount != childsAmount) {
            $("#TotalAmount").addClass("border-danger");
            $(".child-amount").addClass("border-danger");
            toastr.error(INVALID_AMOUNTS);
            return false;
        }
        return true;
    }
    return true;
}

deleteDirection = function (index) {
    let model = $("#directionVMs input, #directionVMs select").serialize();

    showLoader();

    $.ajax({
        url: '/Payments/DeleteDirection?index=' + index,
        data: model,
        method: "POST",
        success: function (result) {
            $("#directionVMs").html(result);
            changeSpanAmount();
        },
        complete: function () {
            hideLoader();
        }
    })
}