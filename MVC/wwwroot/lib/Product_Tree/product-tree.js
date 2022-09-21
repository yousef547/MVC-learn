
var productTreeInitialize = function (selector) {
    $(selector).find('.item-category-child').click(function () {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            deSelectItem($(this).attr("data-categoryitem"));
        } else {
            $(this).addClass('active');
            selectItem($(this).attr("data-categoryitem"));
        }
    })

    $(selector).find('li.name-category-parents').on('click', function () {
        $(this).toggleClass('active');
        $(this).children('ul.list-category-child').toggleClass('active');
        $(this).children('ul.list-category-child').find('li.sub-category').toggleClass('active');
        $(this).children('ul.list-category-child').find('li.item-category-child').toggleClass('open');

        saveActiveProductIds(selector);
    })

    $(selector).find('li.name-category-parents ul.list-category-child , .count-items').on('click', function (e) {
        e.stopPropagation();
    });


    $(selector).find('li.name-category-parents ul.list-category-child').children('li.sub-category').on('click', function (e) {
        e.stopPropagation();
        $(this).toggleClass('open');
        $(this).children('.list-category-child').toggleClass('active');

        saveActiveProductIds(selector);
    })

    //Search Item In Tree
    $(selector).find('#searchText').bind('keyup', function () {
        var searchString = $(this).val();

        $(selector).find(".list-category-child li").each(function (index, value) {
            currentName = $(value).text()
            if (currentName.toUpperCase().indexOf(searchString.toUpperCase()) > -1) {
                $(value).show();
            } else {
                $(value).hide();
            }
        });
    });

    var productIds = $("#selected-product-ids").val();
    if (productIds != null) {
        $(selector).find(".list-parent-category, .list-category-child").find(".item-category-child").each(function () {
            var id = $(this).data("categoryitem");
            var idExist = false;
            for (var i = 0; i < productIds.split(',').length; i++) {
                if (productIds.split(',')[i] == id) {
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
    $('#category-item-value').val('');
    getActiveProductIds(selector);
}

var selectItem = function (itemId) {
    let itemArr = [];
    let selectedItems = $('#category-item-value').val();
    if (selectedItems.length > 0) {
        if (selectedItems.length == 1) {
            itemArr.push(selectedItems);
        } else {
            for (let i = 0; i < selectedItems.split(',').length; i++) {
                itemArr.push(selectedItems.split(',')[i]);
            }
        }
    }
    itemArr.push(itemId);
    $('#category-item-value').val(itemArr);
}

var deSelectItem = function (itemId) {
    let selectedItems = $('#category-item-value').val();
    let itemArr = selectedItems.split(',');
    let index = itemArr.indexOf(itemId.toString());
    if (index !== -1) {
        itemArr.splice(index, 1);
    }
    $('#category-item-value').val(itemArr);
}

productsTreeInitialize = function (selector) {
    $(selector).find('li.name-category-parents').on('click', function () {
        $(this).toggleClass('active');
        $(this).children('ul.list-category-child').toggleClass('active');
        $(this).children('ul.list-category-child').find('li.sub-category').toggleClass('active');
        $(this).children('ul.list-category-child').find('li.item-category-child').toggleClass('open');

        saveActiveProductIds(selector);
    })

    $(selector).find('li.name-category-parents ul.list-category-child , #productsTree .count-items').on('click', function (e) {
        e.stopPropagation();
    });

    $(selector).find('li.name-category-parents ul.list-category-child').children('li.sub-category').on('click', function (e) {
        e.stopPropagation();
        $(this).toggleClass('open');
        $(this).children('.list-category-child').toggleClass('active');

        saveActiveProductIds(selector);
    })

    $(selector).find('.full-act-tree i').click(function () {
        let isOpen = false;
        if ($(this).parent().next(".actions-product-tree").hasClass('open'))
            isOpen = true;

        $('#productsTree .actions-product-tree').removeClass('open');

        if (!isOpen) {
            $(this).parent().next(".actions-product-tree").addClass('open');
            $(this).parent().next(".actions-product-tree").css(POSITION, $(this).position().left + 65);
            $(this).parent().next(".actions-product-tree").css('top', $(this).position().top - 45);
        }
    });

    $(selector).find('.full-act-tree').click(function (e) {
        e.stopPropagation();
    });

    $(selector).find(".add-cat-item").click(function (e) {
        e.stopPropagation();
    });

    $(selector).find(".info-cat").click(function (e) {
        e.stopPropagation();
    });

    $(selector).find(".add-cat-new").click(function (e) {
        e.stopPropagation();
    })

    //Search searchProduct
    $('#searchProduct').bind('keyup', function () {
        var searchString = $(this).val();

        $("#productsTree .list-parent-category li").each(function (index, value) {
            currentName = $(value).text()
            if (currentName.toUpperCase().indexOf(searchString.toUpperCase()) > -1) {
                $(value).show();
            } else {
                $(value).hide();
            }
        });
    });


    //Search searchServices
    $('#searchServices').bind('keyup', function () {
        var searchString = $(this).val();

        $("#servicesTree .list-parent-category li").each(function (index, value) {
            currentName = $(value).text()
            if (currentName.toUpperCase().indexOf(searchString.toUpperCase()) > -1) {
                $(value).show();
            } else {
                $(value).hide();
            }
        });
    });

    getActiveProductIds(selector);
}

servicesTreeInirialize = function (selector) {
    $(selector).find('li.name-category-parents').on('click', function () {
        $(this).toggleClass('active');
        $(this).children('ul.list-category-child').toggleClass('active');
        $(this).children('ul.list-category-child').find('li.sub-category').toggleClass('active');
        $(this).children('ul.list-category-child').find('li.item-category-child').toggleClass('open');

        saveActiveProductIds(selector);
    })

    $(selector).find('li.name-category-parents ul.list-category-child , #servicesTree .count-items').on('click', function (e) {
        e.stopPropagation();
    });

    $(selector).find('li.name-category-parents ul.list-category-child').children('li.sub-category').on('click', function (e) {
        e.stopPropagation();
        $(this).toggleClass('open');
        $(this).children('.list-category-child').toggleClass('active');

        saveActiveProductIds(selector);
    })

    $(selector).find('.full-act-tree i').click(function () {
        let isOpen = false;
        if ($(this).parent().next(".actions-product-tree").hasClass('open'))
            isOpen = true;

        $('#servicesTree .actions-product-tree').removeClass('open');

        if (!isOpen) {
            $(this).parent().next(".actions-product-tree").addClass('open');
            $(this).parent().next(".actions-product-tree").css(POSITION, $(this).position().left + 65);
            $(this).parent().next(".actions-product-tree").css('top', $(this).position().top - 45);
        }
    });

    $(selector).find('.full-act-tree').click(function (e) {
        e.stopPropagation();
    });

    $(selector).find(".add-cat-item").click(function (e) {
        e.stopPropagation();
    });

    $(selector).find(".info-cat").click(function (e) {
        e.stopPropagation();
    });

    $(selector).find(".add-cat-new").click(function (e) {
        e.stopPropagation();
    });

    getActiveProductIds(selector);
}

banksTreeInitialize = function () {
    $('.item-category-child').click(function () {

        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            deSelectItem($(this).attr("data-categoryitem"));
        } else {
            $(this).addClass('active');
            selectItem($(this).attr("data-categoryitem"));
        }
    })

    $('li.name-category-parents').on('click', function () {
        $(this).toggleClass('active');
        $(this).children('ul.list-category-child').toggleClass('active');
        $(this).children('ul.list-category-child').find('li.sub-category').toggleClass('active');
        $(this).children('ul.list-category-child').find('li.item-category-child').toggleClass('open');
    })

    $('li.name-category-parents ul.list-category-child , .count-items').on('click', function (e) {
        e.stopPropagation();
    });


    $('li.name-category-parents ul.list-category-child').children('li.sub-category').on('click', function (e) {
        e.stopPropagation();
        $(this).toggleClass('open');
        $(this).children('.list-category-child').toggleClass('active');
    })

    $(".add-another-countr , .action-branches , .open-actions").on("click", function (e) {
        e.stopPropagation();
    });

    $('.open-actions').click(function () {
        let isOpen = false;
        if ($(this).next(".action-branches").hasClass('open'))
            isOpen = true;

        $('#banksTree .action-branches').removeClass('open');

        if (!isOpen) {
            $(this).next(".action-branches").addClass('open');
            $(this).next(".action-branches").css(POSITION, $(this).position().left + 20);
            $(this).next(".action-branches").css('top', $(this).position().top - 45);
        }
    });


    $('#banksTreeSearch').bind('keyup', function () {
        var searchString = $(this).val();

        $("#banksTree .list-branch-bank li").each(function (index, value) {
            currentName = $(value).text()
            if (currentName.toUpperCase().indexOf(searchString.toUpperCase()) > -1) {
                $(value).show();
            } else {
                $(value).hide();
            }
        });
    });
}

saveActiveProductIds = function (selector) {
    let activeBoxes = [];
    $(selector).find(".name-category-parents.active").each(function () {
        activeBoxes.push($(this).attr("id").split("_")[1]);
    })

    $(selector).find(".sub-category.open").each(function () {
        activeBoxes.push($(this).attr("id").split("_")[1]);
    })

    localStorage.setItem("productTree_" + selector, activeBoxes);
}

getActiveProductIds = function (selector) {
    let activeBoxes = localStorage.getItem("productTree_" + selector);
    if (activeBoxes) {
        var activeBoxIds = activeBoxes.split(',').map(function (item) {
            return parseInt(item);
        });
        for (let i = 0; i < activeBoxIds.length; i++) {
            $(selector).find("#item_" + activeBoxIds[i]).trigger("click");
        }
    }
}

checkAllChilds = function (e, categoryId, element) {
    e.stopPropagation();
    let isChecked = $(element).is(":checked");
    $("#item_" + categoryId).find(".list-category-child").find(".item-category-child").each(function () {
        let isItemSelected = $(this).hasClass('active');
        let isItemDisabled = $(this).hasClass('disabled');
        if (isChecked) {
            if (!isItemSelected) {
                $(this).addClass('active');
                selectItem($(this).data("categoryitem"));
            }
        } else {
            if (isItemSelected && !isItemDisabled) {
                $(this).removeClass('active');
                deSelectItem($(this).data("categoryitem"));
            }
        }
    })
}
