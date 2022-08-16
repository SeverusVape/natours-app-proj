const locations = JSON.parse(document.getElementById("map").dataset.locations);

mapboxgl.accessToken =
    "pk.eyJ1Ijoiam9uYXNzY2htZWR0bWFubiIsImEiOiJjam54ZmM5N3gwNjAzM3dtZDNxYTVlMnd2In0.ytpI7V7w7cyT1Kq5rT9Z1A";
const map = new mapboxgl.Map({

    container: "map", // container ID
    style: "mapbox://styles/mapbox/streets-v11",
    scrollZoom: false, // style URL

});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach((loc) => {
    // Add marker
    const el = document.createElement("div");
    el.className = "marker";
    // Add marker
    new mapboxgl.Marker({
        element: el,
        anchor: "bottom",
    })
        .setLngLat(loc.coordinates)
        .addTo(map);

    // Pop up info
    new mapboxgl.Popup({
        offset: 30,
    })
        .setLngLat(loc.coordinates)
        .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
        .addTo(map);
    // extend bounds
    bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
    padding: {
        top: 200,
        bottom: 150,
        left: 100,
        right: 100,
    },
});
