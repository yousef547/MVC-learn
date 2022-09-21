
var supplierTreeInitialize = function () {
    $('.item-supplier-id').click(function () {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            deSelectSupplier($(this).attr("data-supplierid"));
        } else {
            $(this).addClass('active');
            selectSupplier($(this).attr("data-supplierid"));
        }
    })

    $('li.name-items').on('click', function () {
        $(this).toggleClass('active');
        $(this).children('ul.list-items').toggleClass('active');
        $(this).children('ul.list-items').find('li.item-supplier-id').toggleClass('open');
    })

    $('li.name-items ul.list-items').on('click', function (e) {
        e.stopPropagation();
    })

    //Search Item In Tree
    $('#searchText').bind('keyup', function () {
        var searchString = $(this).val();

        $(".list-items li").each(function (index, value) {
            currentName = $(value).text()
            if (currentName.toUpperCase().indexOf(searchString.toUpperCase()) > -1) {
                $(value).show();
            } else {
                $(value).hide();
            }
        });
    });

    var supplierIds = $("#selected-supplier-ids").val();
    if (supplierIds != null) {
        $("#list-parent-item, .list-items").find(".item-supplier-id").each(function () {
            var id = $(this).data("supplierid");
            var idExist = false;
            for (var i = 0; i < supplierIds.split(',').length; i++) {
                if (supplierIds.split(',')[i] == id) {
                    idExist = true;
                }
            }
            if (idExist) {
                $(this).addClass("active").addClass("disabled");
            } else {
                $(this).removeClass("active").removeClass("disabled");
            }
        })
    }

    let selectedSupplierIds = [];
    for (var i = 0; i < supplierIds.split(',').length; i++) {
        selectedSupplierIds.push(supplierIds.split(',')[i]);
    }

    //$("#supplier-ids").val(selectedSupplierIds);
}

var selectSupplier = function (supplierId) {
    let itemArr = [];
    let selectedItems = $('#supplier-ids').val();
    if (selectedItems.length > 0) {
        if (selectedItems.length == 1) {
            itemArr.push(selectedItems);
        } else {
            for (let i = 0; i < selectedItems.split(',').length; i++) {
                itemArr.push(selectedItems.split(',')[i]);
            }
        }
    }
    itemArr.push(supplierId);

    $("#list-parent-item, .list-items").find(".item-supplier-id").each(function () {
        var id = $(this).data("supplierid");
        if (id == supplierId) {
            $(this).addClass("active");
        }
        //else {
        //    $(this).removeClass("active");
        //}
    })

    $('#supplier-ids').val(itemArr);

    refreshSelectedSuppliers();
}

var deSelectSupplier = function (supplierId) {
    let selectedItems = $('#supplier-ids').val();
    let itemArr = selectedItems.split(',');
    let index = itemArr.indexOf(supplierId);
    if (index !== -1) {
        itemArr.splice(index, 1);
    }

    $("#list-parent-item, .list-items").find(".item-supplier-id").each(function () {
        var id = $(this).data("supplierid");
        if (id == supplierId) {
            $(this).removeClass("active");
        }
    })

    $('#supplier-ids').val(itemArr);

    refreshSelectedSuppliers();
}

var refreshSelectedSuppliers = function () {
    showLoader();

    let finalSelectedSuppliers = [];
    var supplierQueryParam = "";
    var supplierIds = $('#supplier-ids').val().split(',');
    for (var i = 0; i < supplierIds.length; i++) {
        if (supplierIds[i])
            finalSelectedSuppliers.push(supplierIds[i]);
    }

    for (var i = 0; i < finalSelectedSuppliers.length; i++) {
        supplierQueryParam += "supplierIds[" + i + "]=" + finalSelectedSuppliers[i] + "&";
    }

    var productIds = $("#productIds").val().split(",");
    var productQueryParam = "";
    for (var i = 0; i < productIds.length; i++) {
        productQueryParam += "productIds[" + i + "]=" + productIds[i] + "&";
    }

    $.ajax({
        url: "/Suppliers/RefreshSelected?" + supplierQueryParam + productQueryParam,
        success: function (data) {
            $("#selectedSuppliers").html(data);
            $(".supplier-items-tooltip").tooltip();
        },
        complete: function () {
            hideLoader();
        }
    })
}