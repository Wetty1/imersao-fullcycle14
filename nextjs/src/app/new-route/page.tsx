'use client'

import type { FindPlaceFromTextResponseData } from "@googlemaps/google-maps-services-js";
import { Loader } from "@googlemaps/js-api-loader";
import { FormEvent, useEffect, useRef } from "react";
import { useMap } from "../hooks/useMap";

export function NewRoutePage() {

    const mapContainerRef = useRef<HTMLDivElement>(null);
    const map = useMap(mapContainerRef);

    useEffect(() => {
        (async () => {
            const loader = new Loader({
                apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
                libraries: ['routes', 'geometry']
            });

            await Promise.all([
                loader.importLibrary('routes'),
                loader.importLibrary('geometry')
            ]);

            new google.maps.Map(document.getElementById("map") as any, {
                zoom: 15,
                center: { lat: -3.7551969, lng: -38.5931551 }
            })

        })();

    })

    async function searchPlaces(event: FormEvent) {
        event.preventDefault();
        const source = (document.getElementById("source") as HTMLInputElement).value;
        const destination = (document.getElementById("destination") as HTMLInputElement).value;

        const [sourceResponse, destinationResponse] = await Promise.all([
            await fetch(`http:localhost:3000/places?text=${source}`),
            await fetch(`http:localhost:3000/places?text=${destination}`),
        ]);

        const [sourcePlace, destinationPlace]: FindPlaceFromTextResponseData[] = await Promise.all([
            sourceResponse.json(),
            destinationResponse.json(),
        ])

        if (sourcePlace.status !== 'OK') {
            console.error("Não foi possível encontrar a origem");
            alert("Não foi possível encontrar a origem");
            return;
        }

        if (destinationPlace.status !== "OK") {
            console.error("Não foi possível encontrar o destino");
            alert("Não foi possível encontrar o destino");
            return;
        }

        const placeSourceId = sourcePlace.candidates[0].place_id;
        const placeDestinationId = destinationPlace.candidates[0].place_id;

        const directionsResponse = await fetch(`http://localhost:3000/direction?originId=${placeSourceId}&destinationId=${placeDestinationId}`);
        const directionsData = await directionsResponse.json();

        console.log(directionsData);
    }

    return (
        <div style={{ display: "flex", flexDirection: 'row', height: '100%', width: '100%' }}>
            <div>
                <h1>Nova rota</h1>
                <form
                    style={{ display: "flex", flexDirection: "column" }}
                    onSubmit={searchPlaces}
                >
                    <div>
                        <input id="source" type="text" placeholder="origem" />
                    </div>

                    <div>
                        <input id="source" type="text" placeholder="origem" />
                    </div>

                    <button type="submit">Pesquisar</button>
                </form>
            </div>
            <div id="map" style={{ height: '100%', width: '100%' }} ref={mapContainerRef}>

            </div>
        </div>
    )
}

export default NewRoutePage;