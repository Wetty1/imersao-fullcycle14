import type { FindPlaceFromTextResponseData } from "@googlemaps/google-maps-services-js";
import { Loader } from "@googlemaps/js-api-loader";
import { FormEvent, useEffect, useState } from "react";
import { getCurrentPosition } from "../utils/geolocation"

export function useMap(containerRef: React.RefObject<HTMLDivElement>) {
    // const [map, setMap] = useState<Map>();

    useEffect(() => {
        (async () => {
            const loader = new Loader({
                apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
                libraries: ['routes', 'geometry']
            });

            await Promise.all([
                loader.importLibrary('routes'),
                loader.importLibrary('geometry'),
                getCurrentPosition({
                    enableHighAccuracy: true,
                })
            ]);

            new google.maps.Map(document.getElementById("map") as any, {
                zoom: 15,
                center: { lat: -3.7551969, lng: -38.5931551 }
            })
        })();

    }, [])
}