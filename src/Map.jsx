import { useState, useEffect, useMemo } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { Typography, Paper } from "@mui/material";

const Map = ({ vendors, center }) => {
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [map, setMap] = useState(null);

  // Ajustar los límites del mapa dinámicamente
  useEffect(() => {
    if (map && vendors.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      vendors.forEach((vendor) => {
        bounds.extend(vendor.position);
      });
      map.fitBounds(bounds);
    }
  }, [map, vendors]);

  const mapOptions = useMemo(
    () => ({
      zoom: 12,
      center,
      mapTypeId: "roadmap",
    }),
    [center]
  );

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={{
          width: "100%",
          height: "100vh",
        }}
        options={mapOptions}
        onLoad={(mapInstance) => setMap(mapInstance)}
      >
        {vendors.map((vendor) => (
          <Marker
            key={vendor.id}
            position={vendor.position}
            label={{
              text: `Punto de venta: ${vendor.name}`,
              color: "#00f7ff",
              fontWeight: "bold",
              fontSize: "14px",
            }}
            onClick={() => setSelectedVendor(vendor)}
          />
        ))}
        {selectedVendor && (
          <InfoWindow
            position={selectedVendor.position}
            onCloseClick={() => setSelectedVendor(null)}
          >
            <Paper sx={{ padding: "8px" }}>
              <Typography variant="h6" color="primary">
                Punto de venta: {selectedVendor.name}
              </Typography>
              <Typography variant="body2">
                Lat: {selectedVendor.position.lat.toFixed(4)}
              </Typography>
              <Typography variant="body2">
                Lng: {selectedVendor.position.lng.toFixed(4)}
              </Typography>
            </Paper>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;