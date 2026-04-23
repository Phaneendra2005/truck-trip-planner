# Loom Video Script: Truck Trip Planner

## 1. Problem Explanation (0:00 - 0:45)
"Hi, I'm presenting the Truck Trip Planner. Truck drivers manage highly complex schedules dictated by the FMCSA's Hours of Service rules. A seemingly simple trip from Chicago to Los Angeles isn't just about driving—it's about managing 11-hour driving limits, 14-hour on-duty windows, mandatory 30-minute breaks, and tracking the restrictive 70-hour/8-day cycles. Trying to estimate arrival times without simulating these stops leads to compliance violations and late deliveries. That's the problem this app solves."

## 2. Architecture & Tech Stack (0:45 - 1:30)
"Our architecture is built for speed and reliability. The frontend is a snappy React application powered by Vite, styled beautifully with Tailwind CSS for a dark, glassmorphism aesthetic. It integrates `react-leaflet` for dynamic mapping. The backend is powered by Python and Django REST Framework. Rather than relying on paid API tiers, I've integrated OpenStreetMap's Nominatim for geocoding and the Open Source Routing Machine (OSRM) to calculate drive times and distances entirely for free."

## 3. Demo (1:30 - 2:45)
"Let me show you how it works. I'll enter a trip starting in Chicago, picking up a load in Dallas, and heading to Los Angeles. I'll simulate that I've already exhausted 60 hours of my cycle this week.
[Click Calculate Route]
Instantly, we see our trip rendered on the map. Notice the drive time and distance summarized precisely. But the magic is right here in the ELD logs. As you can see, the app dynamically generated the breaks. You'll notice on day 2, because we started with high cycle hours, the app automatically forced a 34-hour off-duty reset to stay legally compliant."

## 4. Code Walkthrough (2:45 - 3:45)
"Let's dive into the code. The heart of the application is the `hos_calculator.py` Python service on our Django backend. It acts as a finite state machine. We start with total drive time and advance the clock hour by hour, checking against an array of constraints—have we hit 8 hours without a 30 min break? 14 hours on duty? It builds a chronological array of log segments. Over on the frontend, `LogGrid.jsx` mathematically parses those hourly segments into SVG coordinates to dynamically draw these grid lines accurately without hardcoded pixel values."

## 5. Challenges & Conclusion (3:45 - 4:30)
"The primary challenge was managing edge cases where breaks or rests overlap with the end of the 24-hour day. Handling carrying-over logic over midnight required careful segment splitting in our python generator. Visualizing this purely via SVG mathematics rather than heavy charting libraries ensures the logs look identical to authentic DOT logbooks while remaining extremely fast to render.
This architecture is modular, fully scalable, and effectively modernizes a traditionally error-prone workflow. Thank you."
