import math

def calculate_hos_logs(total_drive_time_hours, cycle_used_hours=0):
    """
    Calculates the HOS log representation over days given a total drive time.
    Returns an array of daily logs formatted for the frontend LogGrid.
    """
    days = []
    
    current_time_of_day = 0.0 # 0 to 24
    current_drive_in_shift = 0.0
    current_onduty_in_shift = 0.0
    time_since_break = 0.0
    
    current_cycle = cycle_used_hours
    
    remaining_drive = total_drive_time_hours
    
    # helper to start a new day
    def new_day():
        nonlocal current_time_of_day
        days.append([])
        current_time_of_day = 0.0
        
    def add_event(status, duration):
        nonlocal current_time_of_day, current_drive_in_shift, current_onduty_in_shift, time_since_break, current_cycle
        
        while duration > 0:
            if current_time_of_day == 0 and not days:
                new_day()
            if not days:
                new_day()
                
            time_left_in_day = 24.0 - current_time_of_day
            segment_duration = min(duration, time_left_in_day)
            
            days[-1].append({
                'start': current_time_of_day,
                'duration': segment_duration,
                'status': status
            })
            
            current_time_of_day += segment_duration
            duration -= segment_duration
            
            if status == 'DRV':
                current_drive_in_shift += segment_duration
                current_onduty_in_shift += segment_duration
                time_since_break += segment_duration
                current_cycle += segment_duration
            elif status == 'ON':
                current_onduty_in_shift += segment_duration
                current_cycle += segment_duration
                time_since_break += segment_duration # assuming ON doesn't reset 8 hour break
            elif status == 'OFF':
                # IF Off duty is > 10 hours, resets shift
                # handled by specific logic. 
                pass
                
            if math.isclose(current_time_of_day, 24.0, abs_tol=1e-5):
                new_day()
                
    # Start of trip: 1 hour on duty for pickup.
    add_event('ON', 1.0)
    
    while remaining_drive > 0:
        # Check cycle limit (70 hour rule)
        if current_cycle >= 70.0:
            # Must take a 34 hour reset
            add_event('OFF', 34.0)
            current_cycle = 0.0
            current_drive_in_shift = 0.0
            current_onduty_in_shift = 0.0
            time_since_break = 0.0
            continue
            
        # Check shift limits (14 hour on-duty or 11 hour drive)
        if current_onduty_in_shift >= 14.0 or current_drive_in_shift >= 11.0:
            # requires 10 hour off duty
            add_event('OFF', 10.0)
            current_drive_in_shift = 0.0
            current_onduty_in_shift = 0.0
            time_since_break = 0.0
            continue
            
        # 30 minute break after 8 hours driving
        if time_since_break >= 8.0:
            add_event('OFF', 0.5)
            time_since_break = 0.0
            continue
            
        # Determine how long we can drive right now
        available_drive = 11.0 - current_drive_in_shift
        available_onduty = 14.0 - current_onduty_in_shift
        available_before_break = 8.0 - time_since_break
        available_in_cycle = 70.0 - current_cycle
        
        chunk = min(remaining_drive, available_drive, available_onduty, available_before_break, available_in_cycle)
        
        # We will add fuel stops every 15 hours roughly by imposing a small condition, or simplify to just drive chunk
        # It's okay to just drive chunk here for simulation.
        if chunk > 0:
            add_event('DRV', chunk)
            remaining_drive -= chunk

    # End of trip: 1 hour dropoff
    add_event('ON', 1.0)
    
    # Fill remaining of last day with OFF
    if days and current_time_of_day < 24.0:
        add_event('OFF', 24.0 - current_time_of_day)
        
    # Format days for frontend
    formatted_days = []
    for i, day in enumerate(days):
        formatted_days.append({
            'day': i + 1,
            'events': day
        })
        
    return formatted_days
