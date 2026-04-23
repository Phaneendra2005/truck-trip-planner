from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.exceptions import APIException
from .services.route_service import geocode_location, fetch_route
from .services.hos_calculator import calculate_hos_logs

@api_view(['POST'])
def plan_trip(request):
    data = request.data
    
    current_location = data.get('current_location')
    pickup_location = data.get('pickup_location')
    dropoff_location = data.get('dropoff_location')
    
    try:
        current_cycle_used = float(data.get('current_cycle_used', 0))
    except ValueError:
        current_cycle_used = 0.0

    if not pickup_location or not dropoff_location:
         return Response({"error": "Pickup and dropoff locations are required."}, status=400)

    try:
        # Geocode the locations
        pickup_coords = geocode_location(pickup_location)
        dropoff_coords = geocode_location(dropoff_location)
        current_coords = None
        if current_location:
            current_coords = geocode_location(current_location)
            route_data = fetch_route(current_coords, pickup_coords, dropoff_coords)
        else:
            route_data = fetch_route(pickup_coords, dropoff_coords)
            
        distance = route_data['distance_miles']
        duration = route_data['duration_hours']
        geometry = route_data['geometry']
        
        # Calculate HOS Logs
        logs = calculate_hos_logs(duration, current_cycle_used)
        
        response_data = {
            'route_geometry': geometry,
            'summary': {
                'distance': f"{distance:.1f} mi",
                'duration': f"{duration:.1f} hr",
                'stops': len(logs) - 1 if len(logs) > 1 else 0 # Rough estimate based on days
            },
            'logs': logs
        }
        
        return Response(response_data)
        
    except APIException as e:
        return Response({"error": str(e)}, status=500)
    except Exception as e:
        return Response({"error": f"An unexpected error occurred: {str(e)}"}, status=500)

