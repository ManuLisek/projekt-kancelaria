interface ContactMapProps {
  address?: string;
  lat?: number;
  lng?: number;
}

const DEFAULT_LOCATION = {
  lat: 53.59186,
  lng: 19.569062,
};

export function ContactMap({ address, lat, lng }: ContactMapProps) {
  const markerLat = lat ?? DEFAULT_LOCATION.lat;
  const markerLng = lng ?? DEFAULT_LOCATION.lng;
  const delta = 0.01;
  const params = new URLSearchParams({
    bbox: [
      markerLng - delta,
      markerLat - delta,
      markerLng + delta,
      markerLat + delta,
    ].join(","),
    layer: "mapnik",
    marker: `${markerLat},${markerLng}`,
  });

  return (
    <div className="overflow-hidden border border-zinc-200 bg-zinc-100">
      <iframe
        className="aspect-[4/3] w-full lg:aspect-square"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.openstreetmap.org/export/embed.html?${params.toString()}`}
        title={address ? `Mapa dojazdu: ${address}` : "Mapa dojazdu do kancelarii"}
      />
    </div>
  );
}
