import React, { useEffect } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";

const CustomZoomControl: React.FC = () => {
  const map = useMap();

  useEffect(() => {
    const customZoom = L.Control.extend({
      onAdd: function () {
        const container = L.DomUtil.create("div", "custom-control-zoom");

        const zoomInButton = L.DomUtil.create("button", "custom-control-zoom-in", container);
        zoomInButton.innerHTML = "+";
        zoomInButton.onclick = () => map.zoomIn();

        const zoomOutButton = L.DomUtil.create("button", "custom-control-zoom-out", container);
        zoomOutButton.innerHTML = "-";
        zoomOutButton.onclick = () => map.zoomOut();

        return container;
      },
    });

    map.addControl(new customZoom({ position: "topleft" }));
  }, [map]);

  return null;
};

export default CustomZoomControl;
