import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L, { LatLngExpression, Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useUserContext } from "../user_comp/UserContext";
import Loader from "../image_comp/Loader";
import './Map.css'

export interface IMap {
  zoom?: number;
}

export const myIcon = L.icon({
  iconUrl: '/dump/location-pin-solid.svg',
  iconSize: [25, 50],
  iconAnchor: [10, 50],
  shadowUrl: '/dump/markers-shadow@2x.png',
  shadowAnchor: [6, 28],
  popupAnchor: [3, -41],
});

const Map: React.FC<IMap> = ({ zoom = 17 }) => {
  const { user } = useUserContext();
  const [position, setPosition] = useState<LatLngExpression>([44.8176, 20.4569]);
  const [loading, setLoading] = useState(false);

  const MapEffect: React.FC = () => {
    const map = useMap();
    useEffect(() => {
      if (map) {
        map.setView(position, zoom);
      }
    }, [map, position]);

    return null;
  };

  useEffect(() => {
    const getCoordinatesFromAddress = async (address: string) => {
      const url = `https://nominatim.openstreetmap.org/search?q=${address}&format=json&addressdetails=1`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data[0]) {
          const { lat, lon } = data[0];
          setPosition([parseFloat(lat), parseFloat(lon)]);
          setLoading(false);
        } else {
        }
      } catch (error) {
      }
    };

    const fullAddress = `${user?.street} ${user?.houseNumber}, ${user?.place}, ${user?.country}`;
    if (user) {
      getCoordinatesFromAddress(fullAddress);
    }
  }, [user]);

  useEffect(() => {
    const zoomInButton = document.querySelector('.leaflet-control-zoom-in');
    const zoomOutButton = document.querySelector('.leaflet-control-zoom-out');

    if (zoomInButton) zoomInButton.removeAttribute('title');
    if (zoomOutButton) zoomOutButton.removeAttribute('title');
  }, []);

  if (loading) {
    return (
      <div style={{ height: "100%", width: "100%", backgroundColor: "lightgray", color: "white", display: "flex", justifyContent: "center", alignItems: "center" }}><Loader></Loader></div>
    );
  };

  return (
    <MapContainer style={{ height: "100%", width: "100%", zIndex: "1" }} className='map-container'>
      <MapEffect />
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
      <Marker position={position} icon={myIcon} >
        <Popup>{`${user?.street} ${user?.houseNumber}, ${user?.place}, ${user?.country}`}</Popup>
      </Marker>
      {/* <CustomZoomControl /> */}
    </MapContainer>
  );
};

export default Map;
