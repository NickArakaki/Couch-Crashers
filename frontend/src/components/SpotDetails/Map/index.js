import { useMemo } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api"

import "./Map.css"


function Map({ spot }) {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY
    })

    const center = useMemo(() => ({ lat: Number(spot.lat), lng: Number(spot.lng)}), [])

    if (!isLoaded) return <div>Loading...</div>

    return (
        <GoogleMap zoom={10} center={center} mapContainerClassName="map">
            <Marker position={center}></Marker>
        </GoogleMap>
    )
}

export default Map;
