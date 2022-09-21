// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

$(document).ready(function () {
    //$(".clickable-row td").not("td.clickable-row-actions, td.toggle-td").click(function () {
    //    showLoader();
    //    window.location = $(this).parent().data("href");
    //});

    var isSidebarOpen = localStorage.getItem("isSidebarOpen")
    if (isSidebarOpen == "true") {
        $('body').removeClass('sidebar-collapse');
        $('body').addClass('sidebar-open').css('transition', 'all 1s');
    }
    else {
        $('body').removeClass('sidebar-open');
        $('body').addClass('sidebar-collapse').css('transition', 'all 1s');
    }

    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }

    initRichText(".richText");

    refreshNotificationsComponent(false);
    pendingNotifications();
    refreshFavouriteComponent(false);
    refreshStickyNoteComponent();
});

function playNotificationSound() {
    const audio = new Audio("sound/sound-notification.wav");
    audio.play();
}

//not(".th.dtr-control:before , td.dtr-control:before")
function showNotification(title, body) {
    if (Notification.permission === "granted") {
        new Notification(title, { body: body });
        playNotificationSound();
    }
}
function convertFromStringToDate(responseDate) {
    let dateComponents = responseDate.split('/');
    return (new Date(dateComponents[2], (dateComponents[1] - 1), dateComponents[0], 0, 0, 0));
}

const isValidDate = function (date) {
    return (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
}

var handelNameInputUpload = function (selesctor) {
    selesctor.on("change", function () {
        var fileName = $(this).val().split("\\").pop();
        if (fileName == '') {
            $(this).siblings(".file-name").text(UPLOAD_LABEL);
        } else {
            $(this).siblings(".file-name").addClass("selected").html(fileName);
        }
    });
}
handelNameInputUpload($("#BidBondFile"));
handelNameInputUpload($("#BookTender"));

showLoader = function () {
    $("#global-spinner").removeClass("d-none");
}

hideLoader = function () {
    $("#global-spinner").addClass("d-none");
}

$("a.show-loader").on("click", function () {
    showLoader();
})

$("input.show-loader").on("click", function () {
    if ($("#form").valid()) {
        showLoader();
        $("#form").submit();
    }
})

$("button.show-loader").on("click", function () {
    showLoader();
})

$('#supplierTab li').on('click', function () {
    $('#supplierTab li').removeClass('active')
    $(this).addClass('active')
})

// open profile setting
$('.avatar-user .user-panel').on('click', function (e) {
    e.stopPropagation();
    $('.dropdown-menu-setting').toggleClass('active');
    $('.notifications').removeClass('active');
    $('.fav-dropdown').removeClass('active');
    $('.company-change').removeClass('active');
})

$(document).on('click', function () {
    $('.dropdown-menu-setting').removeClass('active')
})

// open popup add new
$('.sidebar .user-panel').on('click', function () {
    $('.poup-add-new').addClass('active');
    $("html, body").css({ "overflow": "hidden" });
})

//close popup add new
$('.close-icon').on('click', function () {
    $('.poup-add-new').removeClass('active')
    $("html, body").css({ "overflow": "auto" });
})

// any click in body close profle menu
$('.poup-add-new').on('click', function (e) {
    e.stopPropagation();
    $('.dropdown-menu-setting').removeClass('active');
});

// open taskbar right
$('.open-sidebar-right-toggle').on('click', function (e) {
    e.stopPropagation()
    $('.sidebar-right-toggle').addClass('active');
})

// close taskbar right
$('.sidebar-right-toggle .sidebar-right-notif .icon-toggle').on('click', function (e) {

    $('.sidebar-right-toggle').removeClass('active');
    $('.open-notes-sidebar-right ,.open-tasks-sidebar-right ,.open-NewTask-sidebar-right, .open-NewRequest-sidebar-right').removeClass('active')

})

// add and remove class active in box taskbar
$('.sidebar-right-toggle .sidebar-right-notif .note-task .box').on('click', function () {
    $('.sidebar-right-toggle .sidebar-right-notif .note-task .box').removeClass('active');
    $(this).addClass('active')
})

// open taskbar notes and close any box view
$('.sidebar-right-toggle .sidebar-right-notif .note-task .box-notes').on('click', function () {
    //$('.open-tasks-sidebar-right').removeClass('active');
    $('.open-NewTask-sidebar-right').removeClass('active');
    $('.open-NewRequest-sidebar-right').removeClass('active');

    $('.open-notes-sidebar-right').toggleClass('active');

})

// open taskbar tasks and close any box view
//$('.sidebar-right-toggle .sidebar-right-notif .note-task .box-tasks').on('click', function () {
//    //$('.open-notes-sidebar-right').removeClass('active');
//    $('.open-NewTask-sidebar-right').removeClass('active');
//    $('.open-tasks-sidebar-right').toggleClass('active');

//})

// open taskbar NewTask and close any box view
$('.sidebar-right-toggle .sidebar-right-notif .note-task .box-Newtasks').on('click', function () {
    //$('.open-tasks-sidebar-right').removeClass('active');
    $('.open-notes-sidebar-right').removeClass('active');
    $('.open-NewRequest-sidebar-right').removeClass('active');

    $('.open-NewTask-sidebar-right').toggleClass('active');

})

// open taskbar Request and close any box view
$('.sidebar-right-toggle .sidebar-right-notif .note-task .box-Request').on('click', function () {
    //$('.open-tasks-sidebar-right').removeClass('active');
    $('.open-notes-sidebar-right').removeClass('active');
    $('.open-NewTask-sidebar-right').removeClass('active');
    $('.open-NewRequest-sidebar-right').toggleClass('active');

})

// close all tab taskbar open and remove class active in box taskbar
$('.open-tasks-sidebar-right .header-top-tasks i').on('click', function () {
    $('.sidebar-right-toggle .sidebar-right-notif .note-task .box-tasks').removeClass('active');
    $('.open-tasks-sidebar-right').removeClass('active');

})

// close all tab taskbar open and remove class active in box taskbar
closeNotes = function () {
    $('.sidebar-right-toggle .sidebar-right-notif .note-task .box-notes').removeClass('active');
    $('.open-notes-sidebar-right').removeClass('active');
}

// close all tab NewTask open and remove class active in box taskbar
closeNewTask = function () {
    $('.sidebar-right-toggle .sidebar-right-notif .note-task .box-NewTask').removeClass('active');
    $('.open-NewTask-sidebar-right').removeClass('active');
}

closeNewRequest = function () {
    $('.sidebar-right-toggle .sidebar-right-notif .note-task .box-Request').removeClass('active');
    $('.open-NewRequest-sidebar-right').removeClass('active');
}

// add new hide and show
$('.nav-item .nav-link .fa-bars').on('click', function () {
    $('.box-add-new span').toggleClass('active')
})

// open search mobile
$('.mobile-search').on('click', function () {
    $('.search-inp-header form').toggleClass('active')
})

// close add new popup in click any  body
$('.poup-add-new').click(function () {
    $(this).removeClass('active')
    $("html, body").css({ "overflow": "auto" });

})

$('.popup-box').click(function (e) {
    e.stopPropagation();
})

$('.sidebar-right-toggle').click(function (e) {
    e.stopPropagation();
})
$('.open-notes-sidebar-right,open-NewTask-sidebar-right ,.open-NewTask-sidebar-right, .open-tasks-sidebar-right , .dropdown-menu-setting').click(function (e) {
    e.stopPropagation();
})
$('.open-NewRequest-sidebar-right').on('click', function (e) {
    e.stopPropagation();
})
//Click In Any Body Remove Active Open popu ir side bar or any  open
$('body').click(function (e) {

    $('.dropdown-menu-setting').removeClass('active');
    $('.notifications').removeClass('active');
    $('.fav-dropdown').removeClass('active');
    $('.company-change').removeClass('active');
    $('.sub-menu-count').removeClass('active');
    $('.sub-menu-country-img').removeClass('open');
    $('.child-exp').removeClass('open');
    $('.actions-product-tree').removeClass('open');
    $('.action-branches').removeClass('open');
    $('.list-menu-switchdepartment').removeClass('open');
    $('#child-month').removeClass('open');
    $('.navbar-nav.setting-admin').removeClass('open');
    $('.conversation-parent .head .list-choise-show-message ul li .sub-menu').removeClass('open');
    $('.notifications').removeClass('active');
    $(".tree-financials .all-box .box .setting-box").removeClass("active");

})

initRichText = function (selector) {
    $(selector).richText({
        // text formatting
        bold: true,
        italic: true,
        underline: true,

        // text alignment
        leftAlign: true,
        centerAlign: true,
        rightAlign: true,
        justify: true,

        // lists
        ol: true,
        ul: true,

        // title
        heading: true,

        // fonts
        fonts: true,
        fontList: ["Arial", "Arial Black", "Comic Sans MS", "Courier New", "Geneva", "Georgia", "Helvetica", "Impact", "Lucida Console", "Tahoma", "Times New Roman", "Verdana"],
        fontColor: true,
        fontSize: true,

        // uploads
        imageUpload: false,
        fileUpload: false,
        // media


        urls: false,
        table: false,
        removeStyles: false,
        code: false,
        Embed: false,

        // colors
        colors: [],

        // dropdowns

        // privacy
        youtubeCookies: false,

        // preview
        preview: false,

        // placeholder
        placeholder: '',

        // dev settings
        useSingleQuotes: false,
        height: 0,
        heightPercentage: 0,
        id: "",
        class: "",
        useParagraph: false,
        maxlength: 0,
        useTabForNext: false,

        // callback function after init
        callback: undefined,
    });
}

var fileUpload = document.getElementById("file-upload");
if (fileUpload != null) {
    fileUpload.addEventListener("change", function () {
        document.getElementById("file-count-upload").innerHTML = "" + "<br>" + this.files.length + " File(s)";

    });
}
var supplierOfferUpload = document.querySelector('.upload-supplierOffer')
if (supplierOfferUpload != null) {
    supplierOfferUpload.addEventListener("change", function () {
        document.querySelector(".count-upload-supplierOffer").innerHTML = '' + "<br>" + this.files.length + " File(s)";

    });
}

// close popup
$.fn.dataTable.render.moment = function (from, to, locale) {
    // Argument shifting
    if (arguments.length === 1) {
        locale = 'en';
        to = from;
        from = 'YYYY-MM-DD';
    }
    else if (arguments.length === 2) {
        locale = 'en';
    }

    return function (d, type, row) {
        if (!d) {
            return type === 'sort' || type === 'type' ? 0 : d;
        }

        var m = window.moment(d, from, locale, true);

        // Order and type get a number value from Moment, everything else
        // sees the rendered value
        return m.format(type === 'sort' || type === 'type' ? 'x' : to);
    };
};

var csUploadVendor = document.querySelector('#upload-recipe-attachment-2')
if (csUploadVendor != null) {
    csUploadVendor.addEventListener("change", function () {
        document.querySelector(".csUploadVendorCount").innerHTML = '<span>' + '' + '</span>' + '<span>' + this.files.length + " File(s)" + '</span>';

    });
}

// save open or close sidebar in local storage
$('.header-logo-and-toggle .sidebar-toggle').click(function () {
    var isSidebarOpen = $('body').hasClass('sidebar-collapse');
    localStorage.setItem("isSidebarOpen", isSidebarOpen);

})

toggleNotificationPanel = function (e) {
    e.stopPropagation();
    $('.notifications').toggleClass('active');
    $('.dropdown-menu-setting').removeClass('active')
    $('.fav-dropdown').removeClass('active')
    $('.company-change').removeClass('active')
}

$('.fav-dropdown , .company-change').click(function (e) {
    e.stopPropagation();

})

$('.header-panels-container .fav .fa-star').on('click', function (e) {
    e.stopPropagation();
    $('.fav-dropdown').toggleClass('active')
    $('.notifications').removeClass('active');
    $('.company-change').removeClass('active');
    $('.dropdown-menu-setting').removeClass('active')
})

//Open Sub Menu Mobile
$('.flags-change').click(function (e) {
    $('.sub-menu-count').removeClass('active')
    $(this).find('.sub-menu-count').toggleClass('active');
    e.stopPropagation();
})

//Filter open
$('.filter-open').on('click', function (e) {
    e.stopPropagation();
    if ($(this).hasClass("open")) {
        $(this).removeClass("open");
    } else {
        $(this).addClass("open")
    }
    $('.box-filter').toggleClass('open');
    $('.filter-popup').toggleClass('open');
    $('.overlay-body').toggleClass('open');
    $('body').toggleClass("no-scroll");
});

$(".overlay-body").click(function () {
    $('.box-filter').removeClass('open');
    $('.filter-open').removeClass('open');
    $(this).removeClass("open");
    $('body').removeClass("no-scroll");
});

var fileUploadHandel = function (selector) {
    selector.on("change", function () {
        var fileName = $(this).val().split("\\").pop();
        $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
        $(this).siblings(".file-upload-label").find(".span-upload").addClass("selected").html(fileName);
    });
}

fileUploadHandel($("#roAttachmentFiles"));
fileUploadHandel($("#SupplierOfferAtash"));
fileUploadHandel($("#SupplierOfferAtash"));
fileUploadHandel($("#soAttachmentFile"));
fileUploadHandel($("#roFile"));
fileUploadHandel($("#supOfferAttachment"));
fileUploadHandel($("#OfferAttachment"));
fileUploadHandel($(".custom-file-input"));

$('.sub-dropdown-product-list li').click(function () {
    $('.sub-dropdown-product-list li').removeClass('active')
    $(this).addClass('active')
})

$('.popup-product-list .box .header-box a i').click(function () {
    $('.popup-product-list').removeClass('open')
})

$('.toggleCateg').click(function () {
    $(this).find('.children.nav-child').first().addClass('show');
})

changeSign = function (element) {
    $(element).find('i').toggleClass('fa-plus').toggleClass("fa-minus")
}

$("#selectProductsModal").on('shown.bs.modal', function (event) {
    var button = $(event.relatedTarget);

    var isHideCategoryChk = button.data('hidecategorychk');
    if (isHideCategoryChk)
        loadItems(new Boolean(isHideCategoryChk));
    else
        loadItems(false);
})

loadItems = function (isHideCategoryChk = false) {
    showLoader();
    let isService = $("#btnSelectServices").hasClass("active");
    var departmentIds = $("#departmentIds").val().split(",");
    var queryParam = "";
    for (var i = 0; i < departmentIds.length; i++) {
        queryParam += "departmentIds[" + i + "]=" + departmentIds[i] + "&";
    }
    $("#productsModal").load('/ProductCategories/GetByDepartments?' + queryParam + 'isService=' + isService, function () {
        productTreeInitialize("#productsModal");
        if (isHideCategoryChk) {
            $(".name-category-parents").find(".inp-checked").remove();
        }
        hideLoader();
    });
}

$("#selectSuppliersModal").on('shown.bs.modal', function (e) {
    loadSuppliers();
});

loadSuppliers = function () {
    showLoader();
    var departmentIds = $("#departmentIds").val().split(",");
    var departmentQueryParam = "";
    for (var i = 0; i < departmentIds.length; i++) {
        departmentQueryParam += "departmentIds[" + i + "]=" + departmentIds[i] + "&";
    }

    var productIds = $("#productIds").val().split(",");
    var productQueryParam = "";
    for (var i = 0; i < productIds.length; i++) {
        productQueryParam += "productIds[" + i + "]=" + productIds[i] + "&";
    }

    $("#suppliersModal").load('/Suppliers/GetByDepartments?' + departmentQueryParam + productQueryParam, function () {
        supplierTreeInitialize();
        refreshSelectedSuppliers();
        hideLoader();
    });
}

$("#btnSelectServices").on("click", function () {
    let isService = $("#btnSelectServices").hasClass("active");
    if (!isService) {
        $("#btnSelectProducts").removeClass("active");
        $("#btnSelectServices").addClass("active");
        loadItems();
    }
});

$("#btnSelectProducts").on("click", function () {
    let isService = $("#btnSelectServices").hasClass("active");
    if (isService) {
        $("#btnSelectServices").removeClass("active");
        $("#btnSelectProducts").addClass("active");
        loadItems();
    }
});

handleDataTable = function (args) {
    initTable(args);
    var dataTable = $(args.selector).dataTable();
    initConfirmation(args.selector);

    dataTable.fnFilter("");
    $("#searchbox").keyup(function () {
        dataTable.fnFilter(this.value);
        try {
            refreshFilterResult();
        } catch { }
    });

    var searchData = $("#searchbox").val();
    if (searchData) {
        dataTable.api().search(searchData).draw();
    }

    return dataTable;
}

toggleChilds = function (id, e) {
    $(".child_" + id).toggleClass("d-none");
    $("#parent_" + id).find("i.closed, i.opened").toggleClass("d-none");
}

$("td.clickable-row-actions").click(function (e) {
    e.stopPropagation();
});

changeFavouriteIcon = function (isFavourite, itemId) {
    if (isFavourite) {
        $("#favouriteIcon_" + itemId).removeClass("far");
        $("#favouriteIcon_" + itemId).addClass("fas");
    } else {
        $("#favouriteIcon_" + itemId).removeClass("fas");
        $("#favouriteIcon_" + itemId).addClass("far");
    }
}

var FirstNameuser = $("#FirstNameuser").val();
var LastNameuser = $("#LastNameuser").val();

$(".nameUserProfile , .nameUserProfile-small").html("<p>" + FirstNameuser[0] + LastNameuser[0] + "</p>");

$(".export-table-data > li").click(function (e) {
    $('.child-exp').toggleClass('open');
    e.stopPropagation();
})

$('.child-exp').click(function (e) {
    e.stopPropagation();
});

// All Input In Focus Placeholder Hidden And Blur Display Placeholder Again 
$('input').focus(function () {
    $(this).attr('data-place', $(this).attr('placeholder'));
    $(this).attr('placeholder', '');
}).blur(function () {
    $(this).attr('placeholder', $(this).attr('data-place'));
});

$('.monthly-year span').click(function () {

    $('.monthly-year span').removeClass("active");
    $(this).addClass("active");
});

$('.item.switchdepartment').click(function () {

    $(this).children('.list-menu-switchdepartment').toggleClass("open");

});

$('.list-menu-switchdepartment').click(function (e) {
    e.stopPropagation();
});

$('.list-menu-switchdepartment li').click(function () {
    if ($(this).hasClass("active")) {
        $(this).removeClass('active');
    } else {
        $('.list-menu-switchdepartment li').removeClass("active");
        $(this).addClass('active');
    }
});

$('.filter-hidden').click(function () {

    $('.filter-hidden-history').addClass("d-none");
});

$('.filter-show').click(function () {

    $('.filter-hidden-history').removeClass("d-none");
});

function createNewTask() {
    let form = $("#createTaskForm");
    if (form.valid()) {
        showLoader();
        $.post('/api/Shared/CreateTask', form.serialize(), function (data, status) {
            if (data.result) {
                clearData("#createTaskForm");
                if (data.refreshDashboard) {
                    getMyTasks();
                    getMyTeamTasks();
                }
                hideLoader();
                successDone();
            } else {
                hideLoader();
                toastr.error(OPERATION_FAILED);
            }
        });
    }

};

CreateGeneralRequest = function () {
    let form = $("#createRequestForm");
    if (form.valid()) {
        showLoader();
        $.post('/api/Shared/CreateGeneralRequest', form.serialize(), function (data, status) {
            if (data.result) {
                clearData("#createRequestForm");
                if (data.refreshDashboard) {
                    getMyRequests();
                    getPendingOnTeam();
                }
                hideLoader();
                requestSuccessDone();
            } else {
                hideLoader();
                toastr.error(OPERATION_FAILED);
            }
        })
    }
}

//to Clear Input of create new  task 
clearData = function (formSelector) {
    $(formSelector).trigger('reset');
    $(formSelector).find('.text-danger').removeClass('field-validation-error').addClass('field-validation-valid').html('');
}

cancelNewTask = function () {
    clearData("#createTaskForm");
    closeNewTask();
}

closeRequest = function () {
    clearData("#createRequestForm");
    closeNewRequest();
}

successDone = function () {
    $("#add-new-task").toggleClass("d-none");
    $("#success-task").toggleClass("d-none")
}

requestSuccessDone = function () {
    $("#add-new-GeneralRequest").toggleClass("d-none");
    $("#success-GeneralRequest").toggleClass("d-none")
}

function myFunction() {
    var element = document.getElementById(".collapsible");
    element.classList.add("active");
}

//getCompanyData = function () {
//    showLoader();
//    $.ajax({
//        url: "/api/Shared/CompanyData",
//        success: function (data) {
//            return data;
//        },
//        complete: function () {
//            hideLoader();
//        }
//    })
//}

$(".toggle-comp").click(function (e) {
    e.stopPropagation();
    $(".company-change").toggleClass("active");
});

scrollGrabInit = function (elementId) {
    let pos = { top: 0, left: 0, x: 0, y: 0 };
    const ele = document.getElementById(elementId);

    const mouseDownHandler = function (e) {
        ele.style.cursor = 'grabbing';
        ele.style.userSelect = 'none';

        pos = {
            // The current scroll
            left: ele.scrollLeft,
            top: ele.scrollTop,
            // Get the current mouse position
            x: e.clientX,
            y: e.clientY,
        };

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };

    const mouseMoveHandler = function (e) {
        // How far the mouse has been moved
        const dx = e.clientX - pos.x;
        const dy = e.clientY - pos.y;

        // Scroll the element
        ele.scrollTop = pos.top - dy;
        ele.scrollLeft = pos.left - dx;
    };

    const mouseUpHandler = function () {
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);

        ele.style.cursor = 'grab';
        ele.style.removeProperty('user-select');
    };
    ele.addEventListener('mousedown', mouseDownHandler);
}

//$(".btn-fa-bell-alarm").click(function () {

//    $(this).children().toggleClass("fas fa-bell").toggleClass("far fa-bell");
//})

$(".home-tab-payment").click(function () {
    $("#home-tab-payment-trigger").trigger('click');


})

$('#myTabContent .btn-next-primary').click(function () {

    $('#myTabContent .btn-next-primary').removeClass("active")
})

$("#myTabContent .nav-item.top-tab-links-create-envelop.active .nav-link").click(function () {
    $("#myTabContent .nav-item.top-tab-links-create-envelop.active .nav-link").removeClass("active")
})

$('.is-payment-cash-click').click(function () {
    $('.all-tab-fade .row').addClass('d-none');
    $('.all-tab-fade .row.row-cash').removeClass('d-none');

});

$('.is-payment-transfer-click').click(function () {
    $('.all-tab-fade .row').addClass('d-none');
    $('.all-tab-fade .row.row-transfer').removeClass('d-none');

});

$('.is-payment-cheque-click').click(function () {
    $('.all-tab-fade .row').addClass('d-none');
    $('.all-tab-fade .row.row-cheque').removeClass('d-none');

})


$('.ProfileImage').on('change', function () {
    const [file] = document.querySelector(".ProfileImage").files
    if (file) {
        var blah = document.querySelector('.profile-user-img-edit');
        blah.src = URL.createObjectURL(file)
    }
});

$('.imgUpload').click(function () {
    $("#ImageFile").trigger("click");
});

changeImgSrc = function (selector, srcChange) {
    $(selector).on('change', function () {
        debugger
        const [file] = document.querySelector(selector).files
        if (file) {
            var blah = document.querySelector(srcChange);
            blah.src = URL.createObjectURL(file)
        }
    });
}

String.prototype.format = function () {
    // store arguments in an array
    var args = arguments;
    // use replace to iterate over the string
    // select the match and check if related argument is present
    // if yes, replace the match with the argument
    return this.replace(/{([0-9]+)}/g, function (match, index) {
        // check if the argument is present
        return typeof args[index] == 'undefined' ? match : args[index];
    });
};

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
                case "myOpportunity":
                    deleteOpportunity($(this).data('itemid'));
                    break;
            }

        }
    })
}

$(".icon-open-noti ").click(function (e) {
    e.stopPropagation();
})

$(".icon-open-noti i").click(function (e) {
    $(this).parent().next().toggleClass('open');
    e.stopPropagation();
});

function refreshFavouriteComponent(isOpen) {

    $.ajax({
        url: "/Favourite/ReloadViewComponent",
        async: false,
        success: function (data) {
            $('#favourites').html(data);
            $("#favourites-moblie").html(data);
            if (isOpen)
                toggleFavouritePanel(event);
        }
    })
}

toggleFavouritePanel = function (e) {
    e.stopPropagation();
    $('.fav-dropdown').toggleClass('active');
    $('.dropdown-menu-setting').removeClass('active')
    $('.notifications').removeClass('active')
    $('.company-change').removeClass('active')
}

function getFileSize(url) {
    var fileSize = '';
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false); // false = Synchronous

    try {
        http.send(null); // it will stop here until this http request is complete

        // when we are here, we already have a response, b/c we used Synchronous XHR

        if (http.status === 200) {
            fileSize = http.getResponseHeader('content-length');
        }
        if (fileSize) {
            return (parseFloat(fileSize) / 1024).toFixed(2) + " " + KILO_BYTES;
        }
        return "";
    }
    catch {
        return "";
    }
}

function showLoaderFromAjax() {
    $(".show-loader-ajax").on("click", function () {
        showLoader();
    })
}

function showNote() {
    $("#displayNote").slideDown();
    $('.take-anotes').addClass("d-none")
}

function hideNote() {
    $('.take-anotes').removeClass("d-none")
    $("#displayNote").slideUp();
    $('#Title , #Description, #IsSavePage').val('');

}

function AddNote() {
    var dataNote = $("#note-data");
    if (dataNote.valid()) {
        $.post(`/api/Shared/CreateStickyNote`, dataNote.serialize(), function (data) {
            hideNote();
            $('#Title , #Description, #IsSavePage').val('');
            refreshStickyNoteComponent();
        })
    }
}

$("#confirmation487195").click(function (e) {
    e.stopPropagation();
});

function refreshStickyNoteComponent() {
    $.ajax({
        url: "/Home/ReloadStickyNoteViewComponent?offset=" + timeZoneOffset,
        async: false,
        success: function (data) {
            $('#stickyNotes').html(data);
            deleteConfirmationStickyNote();
        }
    })
}

deleteConfirmationStickyNote = function (e) {
    $(".note-confirm-delete").confirmation({
        rootSelector: '[data-toggle=confirmation]',
        // other options
        popout: true,
        singleton: true,
        title: DELETE,
        btnOkLabel: YES,
        btnCancelLabel: NO,
        onConfirm: function (e) {
            switch ($(this).data('source')) {
                case "DeletedNote":
                    deleteStickyNote($(this).data('itemid'));
                    break;
            }

        }
    })
}

function deleteStickyNote(id) {
    $.get(`/api/Shared/DeleteStickyNote/${id}`, function (data) {
        refreshStickyNoteComponent()
    })
}

$(".popover-body").on("click", function (e) {
    alert("ddd")
})

