
var initDropDownCountry = function (selector) {
    $(selector).click(function (e) {
        e.stopPropagation();
        $(this).find('.sub-menu-country-img').toggleClass('open')
    })

    $(selector).find('.sub-menu-country-img li').click(function () {
        var pathImgClick = $(this).find('img').attr('src');
        $(this).parents('.flags-change').find('.change-country').attr('src', pathImgClick);
        var codeCountry = $(this).data("countrychild");
        var idCountry = $(this).data("id");
        $(this).parents('.flags-change').find('.code-country').text(codeCountry)
        $(this).parents('.flags-change').find('.id-country').val(idCountry)
    })

    $(selector).each(function () {
        var selectedItem = $(this).find('li.selected:first');
        if (selectedItem.length == 0)
            selectedItem = $(this).find('li:first');
        var pathImgClick = selectedItem.find('img').attr('src');
        selectedItem.parents('.flags-change').find('.change-country').attr('src', pathImgClick);
        var codeCountry = selectedItem.data("countrychild");
        var idCountry = selectedItem.data("id");
        selectedItem.parents('.flags-change').find('.code-country').text(codeCountry)
        selectedItem.parents('.flags-change').find('.id-country').val(idCountry)
    })
}