const locations = JSON.parse(document.getElementById("map").dataset.locations);

mapboxgl.accessToken =
    "pk.eyJ1Ijoiam9uYXNzY2htZWR0bWFubiIsImEiOiJjam54ZmM5N3gwNjAzM3dtZDNxYTVlMnd2In0.ytpI7V7w7cyT1Kq5rT9Z1A";
const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
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
    // extend bounds
    bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
    padding: {
        top: 200,
        bottom: 200,
        left: 100,
        right: 100,
    },
});
