const locations = JSON.parse(document.getElementById("map").dataset.locations);

mapboxgl.accessToken =
    "pk.eyJ1Ijoic2V2ZXJ1c3ZhcGUiLCJhIjoiY2w2c2RybnVmMWQ4eDNqdGVuaTR4em5yZiJ9.2XCGOk4iNY_gUFQ90wiO2g";
const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/mapbox/streets-v11", // style URL
    center: [-74.5, 40], // starting position [lng, lat]
    zoom: 9, // starting zoom
});
