import { useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation } from "lucide-react";
import { useEffect, useState } from "react";
import Map from "./components/Map";

interface Mechanic {
  name: string;
  distance: string;
  phone: string;
  coordinates: [number, number];
  place_name: string;
  distanceValue: number;
}

interface MapboxFeature {
  text: string;
  center: [number, number];
  place_name: string;
  properties: Record<string, unknown>;
  type: string;
  place_type: string[];
}

interface MapboxResponse {
  type: string;
  features: MapboxFeature[];
  attribution: string;
}

function Results() {
  const { state } = useLocation();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords: [number, number] = [
          position.coords.longitude,
          position.coords.latitude,
        ];
        setUserLocation(coords);

        try {
          const searchTerms = [
            "auto repair",
            "car mechanic",
            "auto service",
            "vehicle maintenance",
            "car repair",
          ];

          const promises = searchTerms.map(async (term) => {
            const query = encodeURIComponent(term);
            const response = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?` +
                `proximity=${coords[0]},${coords[1]}&` +
                `types=poi&` +
                `limit=5&` +
                `access_token=${
                  import.meta.env.VITE_PUBLIC_MAPBOX_ACCESS_TOKEN
                }`
            );

            return response.json() as Promise<MapboxResponse>;
          });

          const responses = await Promise.all(promises);

          // Use a regular object instead of Map for deduplication
          const uniqueFeaturesMap: Record<string, MapboxFeature> = {};

          responses.forEach((response) => {
            response.features.forEach((feature) => {
              uniqueFeaturesMap[feature.place_name] = feature;
            });
          });

          const uniqueFeatures = Object.values(uniqueFeaturesMap);

          // Calculate distances and create mechanic objects
          const mechanicsWithDistance: Mechanic[] = uniqueFeatures.map(
            (feature: MapboxFeature) => {
              const distance = calculateDistance(
                coords[1],
                coords[0],
                feature.center[1],
                feature.center[0]
              );

              return {
                name: feature.text,
                distance: `${distance.toFixed(1)} miles`,
                distanceValue: distance,
                phone: "Contact info unavailable",
                coordinates: feature.center,
                place_name: feature.place_name,
              };
            }
          );

          // Sort by distance and take the nearest 3
          const nearestMechanics = mechanicsWithDistance
            .sort((a, b) => a.distanceValue - b.distanceValue)
            .slice(0, 3);

          setMechanics(nearestMechanics);
        } catch (error) {
          console.error("Error fetching nearby mechanics:", error);
        }

        setLoading(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        setLoading(false);
      }
    );
  }, []);

  // Add this helper function at the top of the component or as a utility function
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center p-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center text-foreground">
          CarGPT Analysis Results
        </h1>

        <Card>
          <CardHeader>
            <CardTitle>Potential Issues</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {JSON.parse(state).likelyCause.map(
              (cause: { issue: string; severity: string }, index: number) => (
                <p key={index}>
                  <Badge
                    variant={
                      cause.severity === "critical"
                        ? "destructive"
                        : cause.severity === "moderate"
                        ? "outline"
                        : "default"
                    }
                  >
                    {cause.severity.charAt(0).toUpperCase() +
                      cause.severity.slice(1)}
                  </Badge>{" "}
                  {cause.issue}
                </p>
              )
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estimated Cost to Fix</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {JSON.parse(state).estimatedCost}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              This is an estimate. Actual costs may vary.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nearby Mechanics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <p>Loading nearby mechanics...</p>
            ) : mechanics.length > 0 ? (
              mechanics.map((mechanic, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="bg-primary text-primary-foreground rounded-full p-2">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{mechanic.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {mechanic.place_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {mechanic.distance}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      window.open(
                        `https://www.google.com/maps/dir/?api=1&destination=${mechanic.coordinates[1]},${mechanic.coordinates[0]}`,
                        "_blank"
                      );
                    }}
                  >
                    <Navigation className="h-4 w-4 mr-1" />
                    Navigate
                  </Button>
                </div>
              ))
            ) : (
              <p>No mechanics found nearby. Try expanding your search area.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Map of Nearby Mechanics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-64 rounded-lg overflow-hidden">
              {userLocation && (
                <Map userLocation={userLocation} mechanics={mechanics} />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Results;
