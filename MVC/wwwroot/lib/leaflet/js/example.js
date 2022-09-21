$(document).ready(function() {
    //example
    // initMap(26.62781822639305, 31.113281250000004);
})

var getAddress = function(lat, lng) {
    return $.ajax({
        url: 'https://nominatim.openstreetmap.org/search', //read comments in search.php for more information usage
        type: 'GET',
        data: {
            q: lat + ',' + lng,
            polygon_geojson: '1',
            format: 'jsonv2',
        },
        dataType: 'json',
        success: function(json) {
            if (json.length > 0)
                $("#selected_address").val(json[0].display_name)
            else
                $("#selected_address").val("")
        }
    });
}

var initMap = function(lat, lng) {
    var somewhere = L.latLng(27.078691552927534, 31.113281250000004);
    if (lat != null && lng != null) {
        somewhere = L.latLng(lat, lng);
    }
    var map = L.map('map', {
        doubleClickZoom: false,
        visualClickEvents: 'click contextmenu'
    }).setView(somewhere, 7);
    var lc = L.control.locate({
        initialZoomLevel: 15
    }).addTo(map);
    if (lat == null || lng == null) {
        lc.start();
    }

    var markers = L.layerGroup().addTo(map);

    map.on('dblclick', function(e) {
        markers.eachLayer(function(marker) {
            marker.removeFrom(markers)
        })

        getAddress(e.latlng.lat, e.latlng.lng);
        $("#selected_lat").val(e.latlng.lat);
        $("#selected_lng").val(e.latlng.lng);
        var marker = L.marker(e.latlng, { interactive: true });
        marker.on('click', function(e) {
            marker.removeFrom(markers)
        })
        markers.addLayer(marker);
    });

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidW1zY28tYWRtaW4iLCJhIjoiY2t5MDc0bzd1MDBicTJ2cDE0bjRhNmtyNyJ9.2GWjPK1lkbshJDQMhmtHdw', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoidW1zY28tYWRtaW4iLCJhIjoiY2t5MDc0bzd1MDBicTJ2cDE0bjRhNmtyNyJ9.2GWjPK1lkbshJDQMhmtHdw',
    }).addTo(map);

    function searchByAjax(text, callResponse) //callback for 3rd party ajax requests
    {
        return $.ajax({
            url: 'https://nominatim.openstreetmap.org/search', //read comments in search.php for more information usage
            type: 'GET',
            data: {
                q: text,
                polygon_geojson: '1',
                format: 'jsonv2',
            },
            dataType: 'json',
            success: function(json) {
                callResponse(json);
            }
        });
    }

    map.addControl(new L.Control.Search({
        sourceData: searchByAjax,
        text: 'Enter Ciry or Area',
        markerLocation: false,
        propertyLoc: ['lat', 'lon'],
        propertyName: 'display_name',
        zoom: 15,
        firstTipSubmit: true,
        marker: false
    }));
    //add search control to map

    if (lat != null && lng != null) {
        getAddress(lat, lng);
        $("#selected_lat").val(lat);
        $("#selected_lng").val(lng);
        var marker = L.marker([lat, lng], { interactive: true });
        marker.on('click', function(e) {
            marker.removeFrom(markers)
        })
        markers.addLayer(marker);
    }
}