getAllProjects = function () {
    $.get('/Projects/GetAllProject', function (data) {
        $("#getProjects").html(data)
        handleDataTable({
            selector: "#datatable_Projects",
            stateloadcallback: stateLoadParams
        });
    })
}

toggleProject = function (classProject) {
    $(`.${classProject} .fa-angle-up`).toggleClass('d-none')
    $(`.${classProject} .fa-angle-down`).toggleClass('d-none')
    $(`.${classProject} + .card`).fadeToggle();
}