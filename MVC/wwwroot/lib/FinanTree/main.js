financeTreeInitialize = function (selector) {
    $('.tree-financials ' + selector + ' .box > .toggle-down').click(function () {
        $(this).parent().siblings().removeClass("active");
        $(this).parent().siblings().find(".boxes-child").addClass("d-none");

        if ($(this).hasClass('active')) {
            $(this).parent().removeClass("active");
            $(this).parent().siblings().removeClass("disabled");
            $(this).removeClass('active');
            $(this).find('.fas').toggleClass("fa-chevron-down").toggleClass("fa-chevron-up");
            $(this).siblings(".boxes-child").addClass("d-none");
        } else {
            $('.tree-financials ' + selector + ' .box > .toggle-down').removeClass("active");
            $(this).parent().siblings().addClass("disabled");
            $(this).addClass('active');
            $(this).parent().addClass("active");
            $(this).find('.fas').toggleClass("fa-chevron-up").toggleClass("fa-chevron-down");
            $(this).siblings(".boxes-child").removeClass("d-none");

            if ($(this).next(".boxes-child").children().length > 3) {
                $(this).next(".boxes-child").css(POSITION, -($(this).next(".boxes-child").innerWidth() / $(this).next(".boxes-child").children().length) - 100);
            } else if ($(this).next(".boxes-child").children().length == 2) {
                $(this).next(".boxes-child").css(POSITION, -($(this).next(".boxes-child").innerWidth() / $(this).next(".boxes-child").children().length) + 100);
            }
            else if ($(this).next(".boxes-child").children().length == 1) {
                $(this).next(".boxes-child").css(POSITION, -($(this).next(".boxes-child").innerWidth() / $(this).next(".boxes-child").children().length) + 200);
            }
            else {
                $(this).next(".boxes-child").css(POSITION, -($(this).next(".boxes-child").innerWidth() / $(this).next(".boxes-child").children().length));
            }
        }

        saveActiveIds(selector);
    });

    $('.tree-financials ' + selector + ' .box .boxes-child .box-child > .toggle-down').click(function () {
        $(this).parent().siblings().removeClass("active");
        $(this).parent().siblings().find(".box-child-child").addClass("d-none");

        if ($(this).hasClass('active')) {
            $(this).parent().removeClass("active");
            $(this).parent().siblings().removeClass("disabled");
            $(this).removeClass('active');
            $(this).find('.fas').toggleClass("fa-chevron-down").toggleClass("fa-chevron-up");
            $(this).siblings(".box-child-child").addClass("d-none");
        } else {
            $(this).parentsUntil(".box-child-child").parent().find('.box-child').find(".toggle-down").removeClass("active");
            $(this).addClass('active');
            $(this).parent().siblings().addClass("disabled");
            $(this).parent().addClass("active");
            $(this).find('.fas').toggleClass("fa-chevron-up").toggleClass("fa-chevron-down");
            $(this).siblings(".box-child-child").removeClass("d-none");
            if ($(this).next(".box-child-child").children().length == 1) {
                $(this).next(".box-child-child").css(POSITION, -($(this).next(".box-child-child").innerWidth() / $(this).next(".box-child-child").children().length) + 210);
            } else {
                $(this).next(".box-child-child").css(POSITION, -($(this).next(".box-child-child").innerWidth() / $(this).next(".box-child-child").children().length) + 100);
            }
        }

        saveActiveIds(selector);
    });

    $('.tree-financials ' + selector + ' .box .setting-box').click(function (e) {
        e.stopPropagation();
    });

    getActiveIds(selector);
}

function openMenu(e, element) {
    e.stopPropagation();
    if ($(element).next(".setting-box").hasClass("active")) {
        $(element).next(".setting-box").removeClass("active");
    } else {
        $(".setting-box").removeClass("active");
        $(element).next(".setting-box").addClass("active");

    }

}

saveActiveIds = function (selector) {
    let activeBoxes = [];
    $(selector).find(".box.active").each(function () {
        activeBoxes.push($(this).attr("id").split("_")[1]);
    })

    $(selector).find(".box-child.active").each(function () {
        activeBoxes.push($(this).attr("id").split("_")[1]);
    })

    localStorage.setItem("financeTree_" + selector, activeBoxes);
}

getActiveIds = function (selector) {
    let activeBoxes = localStorage.getItem("financeTree_" + selector);
    if (activeBoxes) {
        var activeBoxIds = activeBoxes.split(',').map(function (item) {
            return parseInt(item);
        });
        for (let i = 0; i < activeBoxIds.length; i++) {
            $(selector).find("#account_" + activeBoxIds[i]).children(".toggle-down").trigger("click");
        }
    }
}