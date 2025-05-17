import { useState, useEffect } from 'react';
import { Location } from '../types';

interface LocationState {
  location: Location | null;
  loading: boolean;
  error: string | null;
}

export default function useLocation() {
  const [state, setState] = useState<LocationState>({
    location: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        location: null,
        loading: false,
        error: 'Geolocation is not supported by your browser'
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Try to get the location name using reverse geocoding
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`)
          .then(response => response.json())
          .then(data => {
            setState({
              location: {
                latitude,
                longitude,
                name: data.display_name ? data.display_name.split(',')[0] : 'Current Location'
              },
              loading: false,
              error: null
            });
          })
          .catch(() => {
            // If reverse geocoding fails, just use coordinates
            setState({
              location: {
                latitude,
                longitude
              },
              loading: false,
              error: null
            });
          });
      },
      (error) => {
        setState({
          location: null,
          loading: false,
          error: `Unable to retrieve your location: ${error.message}`
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  }, []);

  return state;
} 