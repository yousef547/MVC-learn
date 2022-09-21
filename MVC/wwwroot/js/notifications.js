"use strict";

//const { offset } = require("@popperjs/core");

var connection = new signalR.HubConnectionBuilder().withUrl("/notificationHub").build();

connection.on("ReceiveNotification", function (model) {
    var returnNotification = JSON.parse(model);
    refreshNotificationsComponent(false);
    toastr.success(returnNotification.type, returnNotification.createdBy, { timeOut: 5000 });
    showNotification(returnNotification.createdBy, returnNotification.type);
    reload(returnNotification.reloadFunction);
});

function isRead(isRead, notificationId, page = null) {
    $('#spinner-notification').removeClass('d-none');
    if (window.matchMedia('(max-width: 992px)').matches) {
        $(".notifications").addClass("overflow-hidden")
    } else {
        $(".notifications").removeClass("overflow-hidden")
    }
    $.get(`/Notifications/IsRead?isRead=${isRead}&&notificationId=${notificationId}`, function (data, status) {
        $('#spinner-notification').addClass('d-none');
        if (page == null) {
            refreshNotificationsComponent(true);
        } else {
            refreshNotificationsComponent(false);
            isReadNotifications();
            isNotReadNotifications();
            allNotifications();
        }
    })
}

function reload(func) {
    switch (func) {
        case "getMyTasks":
            getMyTasks();
            getMyTeamTasks()
            break;
        case "refrashRequest":
            getPendingOnMe();
            getMyRequests();
            getPendingOnTeam();
            break;
    }
}

connection.on("Connected", function (connectionId) {
    //console.log("ConnectionId: " + connectionId);
})

connection.on("OnlineUsers", function (connections) {
    for (var i = 0; i < connections.length; i++) {
        //console.log("#" + i + ": " + connections[i]);
    }
})

connection.start().then(function () {
    connection.invoke("GetConnectionId").catch(function (err) {
        //return console.error(err.toString());
    });
})

function sendMessage(user, message) {
    connection.invoke("SendMessage", user, message).catch(function (err) {
        //return console.error(err.toString());
    });
}

function refreshNotificationsComponent(isOpen) {
    $('#spinner-notification').removeClass('d-none');

    $.ajax({
        url: "/Notifications/ReloadViewComponent?offset=" + timeZoneOffset,
        async: false,
        success: function (data) {
            $('#box').html(data);
            $('#box-moblie').html(data);

            $('#spinner-notification').addClass('d-none');

            $('.notifications').click(function (e) {
                e.stopPropagation();
            })

            if (isOpen)
                toggleNotificationPanel(event);
        }
    })
}

function isReadNotifications() {
    $.ajax({
        url: '/Notifications/GetNotifications?isRead=true&offset=' + timeZoneOffset,
        async: false,
        success: function (data) {
            $("#isRead").html(data);
        }
    })
}

function isNotReadNotifications() {
    $.ajax({
        url: '/Notifications/GetNotifications?isRead=false&offset=' + timeZoneOffset,
        async: false,
        success: function (data) {
            $("#notRead").html(data);
        }
    })
}

function allNotifications() {
    $.ajax({
        url: '/Notifications/GetNotifications&offset=' + timeZoneOffset,
        async: false,
        success: function (data) {
            $("#allRead").html(data);
        }
    })
}

function pendingNotifications() {
    $.get(`/Notifications/GetNotificationsNotDelivered`, function (data, status) {
        let formatStr = NOTIFICATIONS_PENDING_MSG;
        if (data.notification_count > 0) {
            toastr.success(NOTIFICATIONS_PENDING_MSG.toString().format(data.notification_count), { timeOut: 5000 });
            updatePendingNotification();
        }

    })
}

function updatePendingNotification() {
    $.get(`/Notifications/updateDelivered`, function (data, status) { })
}

function openNotificationModel(notificationId) {
    showLoader();
    $.get(`/Notifications/GetNotificationsById/${notificationId}`, function (data) {
        $("#detailsNotification").html(data);
        $('#notificationModal').modal('show');
        hideLoader();
    });
}
