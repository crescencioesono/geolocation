import { useState, useEffect, useMemo } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow, OverlayView } from "@react-google-maps/api";
import { Typography, Card, CardContent } from "@mui/material";

const getPixelPositionOffset = (width, height) => ({
  x: -(width / 2),
  y: -(height + 10),
});

const Map = ({ vendors, center }) => {
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [map, setMap] = useState(null);

  // Definir íconos dentro del componente
  const espanolIcon = useMemo(() => ({
    path: window.google?.maps?.SymbolPath?.CIRCLE || "M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0",
    fillColor: "#ff0000", // Rojo para Española
    fillOpacity: 1,
    scale: 2,
    strokeColor: "#ffffff",
    strokeWeight: 2,
  }), []);

  const francesaIcon = useMemo(() => ({
    path: window.google?.maps?.SymbolPath?.CIRCLE || "M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0",
    fillColor: "#0288d1", // Azul para Francesa
    fillOpacity: 1,
    scale: 2,
    strokeColor: "#ffffff",
    strokeWeight: 2,
  }), []);

  const mixedIcon = useMemo(() => ({
    path: window.google?.maps?.SymbolPath?.CIRCLE || "M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0",
    fillColor: "#800080", // Morado para ambos tipos
    fillOpacity: 1,
    scale: 2,
    strokeColor: "#ffffff",
    strokeWeight: 2,
  }), []);

  // Ajustar los límites del mapa dinámicamente
  useEffect(() => {
    if (map && vendors.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      vendors.forEach((vendor) => {
        console.log("Vendedor en mapa:", vendor); // Depuración
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
        {vendors.map((vendor) => {
          const icon =
            vendor.cylinders.espanol > 0 && vendor.cylinders.francesa > 0
              ? mixedIcon
              : vendor.cylinders.espanol > 0
              ? espanolIcon
              : francesaIcon;
          return (
            <div key={vendor.id}>
              <Marker
                position={vendor.position}
                onClick={() => {
                  console.log("Clic en marcador:", vendor); // Depuración
                  setSelectedVendor(vendor);
                }}
                icon={icon}
                zIndex={1000}
              />
              <OverlayView
                position={vendor.position}
                mapPaneName={OverlayView.FLOAT_PANE}
                getPixelPositionOffset={getPixelPositionOffset}
              >
                <div
                  style={{
                    background: "rgba(0, 0, 0, 0.7)",
                    color: "#0288d1",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "14px",
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                    pointerEvents: "none",
                  }}
                >
                  Punto de venta: {vendor.name}
                </div>
              </OverlayView>
            </div>
          );
        })}
        {selectedVendor && (
          <InfoWindow
            position={selectedVendor.position}
            onCloseClick={() => setSelectedVendor(null)}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary">
                  Punto de venta: {selectedVendor.name}
                </Typography>
                <Typography variant="body2">
                  Dirección: {selectedVendor.address}
                </Typography>
                <Typography variant="body2">
                  Cantidad Española: {selectedVendor.cylinders.espanol}
                </Typography>
                <Typography variant="body2">
                  Cantidad Francesa: {selectedVendor.cylinders.francesa}
                </Typography>
                <Typography variant="body2">
                  Lat: {selectedVendor.position.lat.toFixed(4)}
                </Typography>
                <Typography variant="body2">
                  Lng: {selectedVendor.position.lng.toFixed(4)}
                </Typography>
              </CardContent>
            </Card>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;