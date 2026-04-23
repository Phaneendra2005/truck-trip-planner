import requests
import urllib.parse
from rest_framework.exceptions import APIException

def geocode_location(location_name):
    """Uses Nominatim OpenStreetMap API to get lat/lng for a string."""
    known_cities = {
        'chicago, il': {'lat': 41.8781, 'lng': -87.6298},
        'dallas, tx': {'lat': 32.7767, 'lng': -96.7970},
        'los angeles, ca': {'lat': 34.0522, 'lng': -118.2437},
        'new york, ny': {'lat': 40.7128, 'lng': -74.0060},
        'seattle, wa': {'lat': 47.6062, 'lng': -122.3321},
    }
    
    clean_name = location_name.strip().lower()
    if clean_name in known_cities:
        return known_cities[clean_name]

    url = f"https://nominatim.openstreetmap.org/search?q={urllib.parse.quote(location_name)}&format=json&limit=1"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200 and response.json():
        result = response.json()[0]
        return {
            'lat': float(result['lat']),
            'lng': float(result['lon'])
        }
    raise APIException(f"Could not geocode location {location_name}. Nominatim: {response.status_code}")

def fetch_route(loc1, loc2, loc3=None):
    """
    Fetches the route from OSRM. loc1, loc2, loc3 are dicts with lat/lng.
    Requires longitude first in the URL path.
    """
    coordinates = f"{loc1['lng']},{loc1['lat']};{loc2['lng']},{loc2['lat']}"
    if loc3:
        coordinates += f";{loc3['lng']},{loc3['lat']}"
        
    url = f"http://router.project-osrm.org/route/v1/driving/{coordinates}?overview=full&geometries=geojson"
    
    response = requests.get(url)
    if response.status_code != 200:
        raise APIException("Failed to fetch route from OSRM.")
        
    data = response.json()
    if data.get('code') != 'Ok':
        raise APIException("OSRM could not form a valid route.")
        
    route = data['routes'][0]
    
    # distance is in meters, translate to miles
    distance_miles = route['distance'] * 0.000621371
    # duration is in seconds, translate to hours
    duration_hours = route['duration'] / 3600.0
    
    # OSRM geojson uses coordinates in [lng, lat] while react-leaflet needs [lat, lng].
    # We will flip them before sending.
    geometry = route['geometry']
    flipped_geometry = [[coord[1], coord[0]] for coord in geometry['coordinates']]
    
    return {
        'distance_miles': distance_miles,
        'duration_hours': duration_hours,
        'geometry': flipped_geometry
    }
