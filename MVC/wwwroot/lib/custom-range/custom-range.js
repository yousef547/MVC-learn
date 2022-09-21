$('.list-dashed li').click(function () {
    $(this).siblings().removeClass('active-bg');
    $(this).removeClass('active-bg');
    $(this).addClass('active-bg');
    $(this).nextAll().removeClass('list-bg');
    $(this).prevAll().addClass('list-bg');

    let valueRangeInput = $(this).data('range_val');
    $(this).parents(".range").siblings('.value-input-range').val(valueRangeInput);
})

