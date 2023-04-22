// MAZE MAP

// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.

import { adventures } from "./adventures/data.js";

const showMissingAdventureMsg = (msg) => {
  document.getElementById("not-found").style =
    "display: flex; display: -webkit-box; display: -ms-flexbox;";
  document.getElementById("err-msg").innerHTML = msg;
  // console.log("fair not found");
};

let map, infoWindow;

function initMap() {
  let adv = [];

  map = new google.maps.Map(document.getElementById("mazeMap"), {
    center: { lat: 53.40889996737653, lng: -2.981239934137192 },
    zoom: 17,
    mapId: "116b56ec96574c87",
    // zoomControl: true,
    mapTypeControl: false,
    // scaleControl: boolean,
    streetViewControl: false,
    // rotateControl: boolean,
    // fullscreenControl: false,
  });

  let iconBase = "assets/img/markers/";

  const icons = {
    lofi: {
      icon: {
        url: iconBase + "marker-purblue.png",

        scaledSize: new google.maps.Size(30, 42),
      },
    },
    // pano: {
    //   icon: {
    //     url: iconBase + "marker-gra.png",
    //     scaledSize: new google.maps.Size(30, 42),
    //   },
    // },
    pano: {
      icon: {
        url: iconBase + "marker-gra.png",
        scaledSize: new google.maps.Size(30, 42),
      },
    },
    end: {
      icon: {
        url: iconBase + "marker-greblue.png",
        scaledSize: new google.maps.Size(30, 42),
      },
    },
  };

  let locations = [];

  // TODO create error handle for new tags
  const createTags = (tags) => {
    const colors = [
      { id: 2, color: "green" },
      { id: 5, color: "pink" },
      { id: 6, color: "black" },
      { id: 7, color: "purple" },
      { id: 8, color: "gold" },
      { id: 9, color: "red" },
      { id: 10, color: "gold" },
      { id: 11, color: "gold" },
      { id: 12, color: "gold" },
      { id: 13, color: "gold" },
      { id: 14, color: "gold" },
      { id: 15, color: "toilets" },
    ];

    // A FUNCTION SHOULD HAVE ONE OBJECTIVE

    const wrapper = tags.data.map((tag) => {
      const colorToShow = colors.find(({ id }) => id === tag.id);
      const content = `<span class="maptag ${colorToShow.color}">${tag.attributes.name}</span>`;
      return content;
    });
    // console.log(wrapper);
    return wrapper.join("");
  };

  const createAdventures = async (adventures) => {
    // const adventures = await fetchAdventures();
    adventures.map((adventure) => {
      const { name, latitude, longitude, slug, type, logistics } =
        adventure.attributes;

      if (type === "end") {
        const location = {
          position: new google.maps.LatLng(latitude, longitude),
          // position: new google.maps.LatLng(51.51202, -0.09088),
          type: type,
          content: `<div id="content" class="infoContent"><h3 class="adventureName">${name}</h3><p>${logistics}</p>
      <a href="https://withfireandrageliverpool.com/words" rel="noreferrer"><button><h3 class="info">I'm here</h3></button></a></div>`,
        };
        locations.push(location);
      } else {
        const location = {
          position: new google.maps.LatLng(latitude, longitude),
          // position: new google.maps.LatLng(51.51202, -0.09088),
          type: type,
          content: `<div id="content" class="infoContent"><h3 class="adventureName">${name}</h3><p>${logistics}</p>
      <a href="locations/${slug}.html"><button><h3 class="info">I'm here</h3></button></a></div>`,
        };
        locations.push(location);
      }

      // console.log(locations);
    });
    showAllMarkers();
  };

  const showAllMarkers = () => {
    locations.map((location) => {
      // console.log("location", location);
      const marker = new google.maps.Marker({
        position: location.position,
        icon: icons[location.type].icon,
        map: map,
      });
      const placewindow = new google.maps.InfoWindow({
        content: location.content,
      });

      marker.addListener("click", () => {
        if (currentInfoWindow != null) {
          currentInfoWindow.close();
        }
        placewindow.open({
          anchor: marker,
          map,
          shouldFocus: false,
        });
        currentInfoWindow = placewindow;
      });
    });
  };

  createAdventures(adventures);

  const clearMarkers = () => {
    if (activeMarkers) {
      activeMarkers = [];
    }
  };

  let currentInfoWindow = null;

  infoWindow = new google.maps.InfoWindow();

  // const locationButton = document.getElementById("locateBtn");
  // locationButton.addEventListener("click", () => {
  //   // Try HTML5 geolocation.
  //   if (navigator.geolocation) {
  //     // navigator.geolocation.getCurrentPosition(
  //     navigator.geolocation.watchPosition(
  //       (position) => {
  //         const pos = {
  //           lat: position.coords.latitude,
  //           lng: position.coords.longitude,
  //         };
  //         const userMarker = new google.maps.Marker({
  //           icon: {
  //             path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
  //             fillColor: "#1fb9aa",
  //             fillOpacity: 0.9,
  //             strokeWeight: 2,
  //             strokeColor: "#1fb9aa",
  //             rotation: 40,
  //             scale: 6,
  //           },
  //           position: pos,
  //           map: map,
  //         });
  //         userMarker.setPosition(pos);
  //         userMarker.addListener("click", () => {
  //           placewindow.open({
  //             anchor: marker,
  //             map,
  //             shouldFocus: false,
  //           });
  //         });

  //         infoWindow.setPosition(pos);
  //         // infoWindow.setContent("You are here.");
  //         // infoWindow.open(map);
  //         map.setCenter(pos);
  //       },
  //       () => {
  //         handleLocationError(true, infoWindow, map.getCenter());
  //       },
  //     );
  //   } else {
  //     // Browser doesn't support Geolocation
  //     handleLocationError(false, infoWindow, map.getCenter());
  //   }
  // });
  // google.maps.event.addListener(map, "click", function () {
  //   if (currentInfoWindow != null) {
  //     currentInfoWindow.close();
  //   }
  // });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation.",
  );
  infoWindow.open(map);
}

window.initMap = initMap;
