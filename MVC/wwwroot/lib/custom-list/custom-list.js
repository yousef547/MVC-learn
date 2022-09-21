
initCustomList = function (selector) {
    let isEdit = false;
    if ($(selector).data('isedit')) {
        isEdit = true;
    }

    if (!isEdit) {
        $(selector).find(".custom-list-item").on('click', function () {
            clearActive(selector);
            setActiveItem(selector, this, isEdit);
        })

        setNextActiveItem(selector, isEdit);
    }

    let selectedId = $(selector).data('selectedid');
    if (selectedId) {
        let selectedId = $(selector).data('selectedid');
        $(selector).find(".custom-list-item").each(function () {
            let itemId = $(this).data('alternateid');
            if (itemId == selectedId) {
                clearActive(selector);
                setActiveItem(selector, this, isEdit);
            }
        })
    }
}

clearActive = function (selector) {
    $(selector).find(".custom-list-item").removeClass('active');
    $(selector).find('.list-selected-id').val('').trigger('change');
}

setActiveItem = function (selector, element, isEdit) {
    $(element).removeClass("not-done");
    $(element).addClass('active');
    $(selector).find('.list-selected-id').val($(element).data('itemid'));
    if (!isEdit) {
        $(selector).find('.list-selected-id').trigger('change');
    }
    let offerCount = $(element).data('offer-count');
    if (offerCount) {
        $("#soOfferNo").val(parseInt(offerCount) + 1);
    } else {
        $("#soOfferNo").val(1);
    }
}

setNextActiveItem = function (selector, isEdit) {
    let selectedItem = null;
    $(selector).find('.custom-list-item').each(function () {
        let offerCount = $(this).data('offer-count');
        if (offerCount == 0) {
            selectedItem = this;
            return false;
        }
    })

    clearActive(selector);
    if (selectedItem != null) {
        setActiveItem(selector, selectedItem, isEdit);
    } else {
        setActiveItem(selector, $(selector).find('.custom-list-item').first(), isEdit);
    }
}

skipCurrentItem = function (selector, isEdit) {
    let selectedItem = null;
    let selectedItemId = $(selector).find('.list-selected-id').val();
    let isNext = false;

    $(selector).find('.custom-list-item').each(function () {
        let itemId = $(this).data('itemid');
        if (isNext) {
            selectedItem = this;
            return false;
        }
        if (itemId == selectedItemId) {
            if (!$(this).hasClass("done")) {
                $(this).addClass("not-done");
            }
            isNext = true;
        }
    })

    clearActive(selector);
    if (selectedItem != null) {
        setActiveItem(selector, selectedItem, isEdit);
    } else {
        setActiveItem(selector, $(selector).find('.custom-list-item').first(), isEdit);
    }
}

setCurrentItemDone = function (selector) {
    let selectedItemId = $(selector).find('.list-selected-id').val();

    $(selector).find('.custom-list-item').each(function () {
        let itemId = $(this).data('itemid');
        if (itemId == selectedItemId) {
            $(this).addClass('done');
        }
    })
}