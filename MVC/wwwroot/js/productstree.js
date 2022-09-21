
showProductsLoader = function () {
    $("#products-spinner").removeClass("d-none");
}

hideProductsLoader = function () {
    $("#products-spinner").addClass("d-none");
}

showServicesLoader = function () {
    $("#services-spinner").removeClass("d-none");
}

hideServicesLoader = function () {
    $("#services-spinner").addClass("d-none");
}

productsDepartmentChanged = function () {
    let departmentId = $("#productDepartmentId").val();

    showProductsLoader();
    $.ajax({
        url: "/ProductsTree/GetProductsTree?departmentId=" + departmentId,
        success: function (data) {
            $("#productsTree").html(data);
            productsTreeInitialize("#productsTree");
        },
        complete: function () {
            hideProductsLoader();
        }
    })
}

servicesDepartmentChanged = function () {
    let departmentId = $("#serviceDepartmentId").val();

    showServicesLoader();
    $.ajax({
        url: "/ProductsTree/GetServicesTree?departmentId=" + departmentId,
        success: function (data) {
            $("#servicesTree").html(data);
            servicesTreeInirialize("#servicesTree");
        },
        complete: function () {
            hideServicesLoader();
        }
    })
}

editCategory = function (categoryId) {
    clearEditModal();
    $("#editIsCategory").val(true);

    showLoader();
    $.ajax({
        url: "/ProductsTree/GetCategoryDetails?categoryId=" + categoryId,
        success: function (data) {
            $("#editItemId").val(data.Id);
            $("#editParentId").val(data.ParentId);
            $("#editDepartmentId").val(data.DepartmentId);
            $("#editIsService").val(data.IsService);
            $("#editName").val(data.Name);
            $("#editNameAr").val(data.NameAr);
            $("#editCode").val(data.Code);
            $("#editGeneratedCode").text(data.GeneratedCode);
            $("#editAutoCode").val(data.AutoCode);
            $("#modalInfo").modal('show');
        },
        complete: function () {
            hideLoader();
        }
    })
}

editProduct = function (productId) {
    clearEditModal();
    $("#editIsCategory").val(false);

    showLoader();
    $.ajax({
        url: "/ProductsTree/GetProductDetails/" + productId,
        success: function (data) {
            $("#editItemId").val(data.Id);
            $("#editParentId").val(data.CategoryId);
            $("#editDepartmentId").val(data.DepartmentId);
            $("#editIsService").val(data.IsService);
            $("#editName").val(data.Name);
            $("#editNameAr").val(data.NameAr);
            $("#editCode").val(data.Code);
            $("#editGeneratedCode").text(data.GeneratedCode);
            $("#editAutoCode").val(data.AutoCode);
            $("#modalInfo").modal('show');
        },
        complete: function () {
            hideLoader();
        }
    })
}

updateItem = function () {
    let isService = $("#editIsService").val();
    let name = $("#editName").val();
    let nameAr = $("#editNameAr").val();
    let code = $("#editCode").val();
    let parentId = $("#editParentId").val();

    if (name == "" || nameAr == "" || code == "") {
        toastr.error(ERROR_INVALID_DATA);
        return;
    }

    let model = {};
    model.Id = $("#editItemId").val();
    model.DepartmentId = $("#editDepartmentId").val();
    model.Code = code;
    model.Name = name;
    model.nameAr = nameAr;
    model.IsService = isService;
    model.AutoCode = $("#editAutoCode").val();
    let isCategory = $("#editIsCategory").val();
    if (isCategory == "true") {
        model.ParentId = parentId;
        showLoader();
        $.ajax({
            url: "/ProductsTree/EditCategory",
            method: "POST",
            data: model,
            success: function (data) {
                if (isService == "false") {
                    $("#productsTree").html(data);
                    productsTreeInitialize("#productsTree");
                } else {
                    $("#servicesTree").html(data);
                    servicesTreeInirialize("#servicesTree");
                }
            },
            complete: function () {
                $("#modalInfo").modal('hide');
                hideLoader();
            }
        })
    } else {
        model.CategoryId = parentId;
        showLoader();
        $.ajax({
            url: "/ProductsTree/EditProduct",
            method: "POST",
            data: model,
            success: function (data) {
                if (isService == "false") {
                    $("#productsTree").html(data);
                    productsTreeInitialize("#productsTree");
                } else {
                    $("#servicesTree").html(data);
                    servicesTreeInirialize("#servicesTree");
                }
            },
            complete: function () {
                $("#modalInfo").modal('hide');
                hideLoader();
            }
        })
    }
}

generateCategoryCode = function () {
    let parentId = $("#addParentId").val();
    showProductsLoader();
    $.ajax({
        url: "/ProductsTree/GenerateNewCategoryCode?parentId=" + parentId,
        success: function (data) {
            $("#addGeneratedCode").text(data);
        },
        complete: function () {
            hideProductsLoader();
        }
    })
}

generateProductCode = function () {
    let categoryId = $("#addParentId").val();
    showProductsLoader();
    $.ajax({
        url: "/ProductsTree/GenerateNewProductCode?categoryId=" + categoryId,
        success: function (data) {
            $("#addGeneratedCode").text(data);
        },
        complete: function () {
            hideProductsLoader();
        }
    })
}

addItem = function (parentId) {
    clearAddModal();
    showLoader();
    $.ajax({
        url: "/ProductsTree/GetCategoryDetails?categoryId=" + parentId,
        success: function (data) {
            $("#addIsService").val(data.IsService);
            $("#addParentId").val(parentId);
            if (!data.IsService) {
                $("#addDepartmentId").val($("#productDepartmentId").val());
            } else {
                $("#addDepartmentId").val($("#serviceDepartmentId").val());
            }
            generateCategoryCode();

            $("#modalAdd").modal('show');
        },
        complete: function () {
            hideLoader();
        }
    })
}

addParentCategory = function (isService) {
    clearAddModal();
    $("#addIsService").val(isService);
    $("#rbProduct").attr("disabled", true);
    let departmentId = 0;
    if (!isService) {
        departmentId = $("#productDepartmentId").val();
    } else {
        departmentId = $("#serviceDepartmentId").val();
    }
    $("#addDepartmentId").val(departmentId);

    showLoader();
    $.ajax({
        url: "/ProductsTree/GenerateNewCode?departmentId=" + departmentId,
        success: function (data) {
            $("#addGeneratedCode").text(data);
        },
        complete: function () {
            hideLoader();
        }
    })

    $("#modalAdd").modal('show');
}

createItem = function () {
    let isService = $("#addIsService").val();
    let name = $("#addName").val();
    let nameAr = $("#addNameAr").val();
    let code = $("#addCode").val();
    let parentId = $("#addParentId").val();

    if (name == "" || nameAr == "" || code == "") {
        toastr.error(ERROR_INVALID_DATA);
        return;
    }

    let model = {};
    model.DepartmentId = $("#addDepartmentId").val();
    model.Code = code;
    model.Name = name;
    model.nameAr = nameAr;
    model.IsService = isService;
    let isCategory = $("#rbCategory").is(":checked");
    if (isCategory) {
        model.ParentId = parentId;
        showLoader();
        $.ajax({
            url: "/ProductsTree/AddCategory",
            method: "POST",
            data: model,
            success: function (data) {
                if (isService == "false") {
                    $("#productsTree").html(data);
                    productsTreeInitialize("#productsTree");
                } else {
                    $("#servicesTree").html(data);
                    servicesTreeInirialize("#servicesTree");
                }
            },
            complete: function () {
                $("#modalAdd").modal('hide');
                hideLoader();
            }
        })
    } else {
        if (!parentId) {
            toastr.error(ERROR_INVALID_DATA);
            return;
        }
        model.CategoryId = parentId;

        showLoader();
        $.ajax({
            url: "/ProductsTree/AddProduct",
            method: "POST",
            data: model,
            success: function (data) {
                if (isService == "false") {
                    $("#productsTree").html(data);
                    productsTreeInitialize("#productsTree");
                } else {
                    $("#servicesTree").html(data);
                    servicesTreeInirialize("#servicesTree");
                }
            },
            complete: function () {
                $("#modalAdd").modal('hide');
                hideLoader();
            }
        })
    }
}

clearAddModal = function () {
    $("#rbCategory").prop("checked", true);
    $("#rbCategory").removeAttr("disabled");
    $("#rbProduct").removeAttr("disabled");
    $("#addName").val("");
    $("#addNameAr").val("");
    $("#addCode").val("");
    $("#addParentId").val("");
    $("#addDepartmentId").val("");
    $("#addIsService").val("");
    $("#addGeneratedCode").text("");
}

clearEditModal = function () {
    $("#editParentId").val("");
    $("#editDepartmentId").val("");
    $("#editIsService").val(false);
    $("#editIsCategory").val(true);
    $("#editItemId").val("");
    $("#editName").val("");
    $("#editNameAr").val("");
    $("#editCode").val("");
    $("#editGeneratedCode").text("");
}

deleteCategory = function (categoryId, isService, departmentId) {
    showLoader();
    $.ajax({
        url: "/ProductsTree/DeleteCategory?categoryId=" + categoryId + "&isService=" + isService + "&departmentId=" + departmentId,
        success: function (data) {
            if (isService == "False") {
                $("#productsTree").html(data);
                productsTreeInitialize("#productsTree");
            } else {
                $("#servicesTree").html(data);
                servicesTreeInirialize("#servicesTree");
            }
        },
        complete: function () {
            hideLoader();
        }
    })
}

deleteProduct = function (productId, isService, departmentId) {
    showLoader();
    $.ajax({
        url: "/ProductsTree/DeleteProduct/" + productId + "?isService=" + isService + "&departmentId=" + departmentId,
        success: function (data) {
            if (isService == "False") {
                $("#productsTree").html(data);
                productsTreeInitialize("#productsTree");
            } else {
                $("#servicesTree").html(data);
                servicesTreeInirialize("#servicesTree");
            }
        },
        complete: function () {
            hideLoader();
        }
    })
}

getCategoryInfo = function (categoryId) {
    showLoader();
    $.ajax({
        url: "/ProductsTree/GetCategoryDetails?categoryId=" + categoryId,
        success: function (data) {
            $("#infoName").text(data.Name);
            $("#infoNameAr").text(data.NameAr);
            $("#infoCode").text(data.Code);
            $("#infoGeneratedCode").text(data.GeneratedCode);
            $("#modalInfoNew").modal("show");
        },
        complete: function () {
            hideLoader();
        }
    })
}

getProductInfo = function (productId) {
    showLoader();
    $.ajax({
        url: "/ProductsTree/GetProductDetails/" + productId,
        success: function (data) {
            $("#infoName").text(data.Name);
            $("#infoNameAr").text(data.NameAr);
            $("#infoCode").text(data.Code);
            $("#infoGeneratedCode").text(data.GeneratedCode);
            $("#modalInfoNew").modal("show");
        },
        complete: function () {
            hideLoader();
        }
    })
}

hideInfoModal = function () {
    $("#modalInfoNew").modal("hide");
}