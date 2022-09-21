
var getAddress = function (lat, lng, addressSelector) {
    return $.ajax({
        url: 'https://nominatim.openstreetmap.org/search', //read comments in search.php for more information usage
        type: 'GET',
        data: {
            q: lat + ',' + lng,
            polygon_geojson: '1',
            format: 'jsonv2',
        },
        dataType: 'json',
        success: function (json) {
            if (json.length > 0)
                $(addressSelector).text(json[0].display_name)
            else
                $(addressSelector).text("")
        }
    });
}

var initMap = function (mapId) {
    var somewhere = L.latLng(26.62781822639305, 31.113281250000004);

    var map = L.map(mapId, {
        doubleClickZoom: false,
        visualClickEvents: 'click contextmenu'
    }).setView(somewhere, 10);

    var lc = L.control.locate({
        initialZoomLevel: 15
    }).addTo(map);

    var markersLayer = L.layerGroup().addTo(map);

    map.on('dblclick', function (e) {
        removeAllMarkers(markersLayer);

        selectAddress(e.latlng.lat, e.latlng.lng, "#selected_address");

        addMarker(markersLayer, e.latlng.lat, e.latlng.lng);
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    map.addControl(new L.Control.Search({
        url: 'https://nominatim.openstreetmap.org/search?format=json&q={s}',
        text: 'Enter Ciry or Area',
        propertyLoc: ['lat', 'lon'],
        propertyName: 'display_name',
        zoom: 15,
        firstTipSubmit: true
    }));
    //add search control to map

    var returnObj = {};
    returnObj.map = map;
    returnObj.locate = lc;
    returnObj.markers = markersLayer;
    return returnObj;
}

initBtn = function (targetLat, targetLng, targetAddress, modalSelector) {
    $("#btn_Select").on('click', function () {
        var lat = $("#selected_lat").val();
        var lng = $("#selected_lng").val();
        if (lat != "" && lng != "") {
            $(targetLat).val($("#selected_lat").val());
            $(targetLng).val($("#selected_lng").val());
            $(targetAddress).text($("#selected_address").text());

            $(modalSelector).modal('hide');
        }
    });
}

goToLocation = function (lat, lng, markersLayer) {
    removeAllMarkers(markersLayer);

    selectAddress(lat, lng, "#selected_address");

    addMarker(markersLayer, lat, lng);
}

removeMarker = function (marker, markersLayer) {
    $("#selected_lat").val("");
    $("#selected_lng").val("");
    $("#selected_address").val("");
    marker.removeFrom(markersLayer);
}

addMarker = function (markersLayer, lat, lng) {
    var marker = L.marker([lat, lng], { interactive: true });
    marker.on('click', function (e) {
        removeMarker(marker, markersLayer);
    })
    markersLayer.addLayer(marker);
}

removeAllMarkers = function (markersLayer) {
    markersLayer.eachLayer(function (marker) {
        marker.removeFrom(markersLayer)
    });
}

selectAddress = function (lat, lng, addressSelector) {
    getAddress(lat, lng, addressSelector);

    $("#selected_lat").val(lat);
    $("#selected_lng").val(lng);
}