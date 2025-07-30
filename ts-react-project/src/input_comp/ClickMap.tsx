import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useUserContext, Address } from "../user_comp/UserContext";
import { IMap, myIcon } from "./Map";
import Loader from "../image_comp/Loader";

const ClickableMap: React.FC<IMap> = ({ zoom = 16 }) => {
    const { user, updateUserAddress } = useUserContext();
    const [position, setPosition] = useState<LatLngExpression>([44.8176, 20.4569]);
    const [loading, setLoading] = useState(false);


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

    const MapEffect: React.FC = () => {
        const map = useMapEvents({
            click(event) {
                setLoading(true);
                const { lat, lng } = event.latlng;
                setPosition([lat, lng]);

                const getAddressFromCoordinates = async (lat: number, lng: number) => {
                    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`;
                    try {
                        const response = await fetch(url);
                        const data = await response.json();

                        if (data.address) {

                            const newAddress: Address = {
                                country: data.address.country || '',
                                place: data.address.city || data.address.town || data.address.village || '',
                                street: data.address.road || '',
                                houseNumber: data.address.house_number || '',
                            };

                            updateUserAddress(newAddress);
                        }
                    } catch (error) {
                    }
                };

                getAddressFromCoordinates(lat, lng);
            },
        });

        useEffect(() => {
            if (map) {
                map.setView(position, zoom);
            }
        }, [map, position]);

        return null;
    };

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
        <MapContainer style={{ height: "100%", width: "100%" }} className='map-container'>
            <MapEffect />
            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
            <Marker position={position} icon={myIcon}>
                <Popup>Click on map to select your address!</Popup>
            </Marker>
        </MapContainer>
    );
};

export default ClickableMap;