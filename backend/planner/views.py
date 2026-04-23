from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.exceptions import APIException
from .services.route_service import geocode_location, fetch_route
from .services.hos_calculator import calculate_hos_logs
import json


@api_view(['POST'])
def plan_trip(request):
    try:
        # 🔴 STEP 1 — Read data safely
        data = request.data

        # Fallback if DRF fails to parse JSON
        if not data:
            try:
                data = json.loads(request.body)
            except:
                data = {}

        print("DATA RECEIVED:", data)  # debug (check in Render logs)

        # 🔴 STEP 2 — Extract fields (MATCH YOUR FRONTEND)
        current_location = data.get('current_location')
        pickup_location = data.get('pickup_location')
        dropoff_location = data.get('dropoff_location')

        try:
            current_cycle_used = float(data.get('current_cycle_used', 0))
        except:
            current_cycle_used = 0.0

        # 🔴 STEP 3 — Validate input
        if not pickup_location or not dropoff_location:
            return Response(
                {"error": "Pickup and dropoff locations are required."},
                status=400
            )

        # 🔴 STEP 4 — Geocode
        pickup_coords = geocode_location(pickup_location)
        dropoff_coords = geocode_location(dropoff_location)

        if current_location:
            current_coords = geocode_location(current_location)
            route_data = fetch_route(current_coords, pickup_coords, dropoff_coords)
        else:
            route_data = fetch_route(pickup_coords, dropoff_coords)

        # 🔴 STEP 5 — Extract route data
        distance = route_data['distance_miles']
        duration = route_data['duration_hours']
        geometry = route_data['geometry']

        # 🔴 STEP 6 — HOS calculation
        logs = calculate_hos_logs(duration, current_cycle_used)

        # 🔴 STEP 7 — Response
        response_data = {
            'route_geometry': geometry,
            'summary': {
                'distance': f"{distance:.1f} mi",
                'duration': f"{duration:.1f} hr",
                'stops': len(logs) - 1 if len(logs) > 1 else 0
            },
            'logs': logs
        }

        return Response(response_data)

    except APIException as e:
        return Response({"error": str(e)}, status=500)

    except Exception as e:
        print("ERROR:", str(e))  # debug
        return Response(
            {"error": f"An unexpected error occurred: {str(e)}"},
            status=500
        )