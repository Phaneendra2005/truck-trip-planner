import React, { useState } from 'react'
import axios from 'axios'
import TripForm from './components/TripForm'
import SummaryPanel from './components/SummaryPanel'
import MapView from './components/MapView'
import LogGrid from './components/LogGrid'

function App() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [results, setResults] = useState(null)

  const handlePlanTrip = async (data) => {
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      // 🔴 FIX 1 — Send correct field names
      const payload = {
        pickup_location: data.pickup,
        dropoff_location: data.dropoff,
        current_cycle_used: data.cycle,
        current_location: data.current_location || ""
      }

      const response = await axios.post(
        'https://truck-trip-planner-ka19.onrender.com/api/plan-trip/',
        payload
      )

      const apiData = response.data

      console.log("API RESPONSE:", apiData)

      // 🔴 FIX 2 — Correct backend keys
      const normalized = {
        route_geometry: apiData.route_geometry || [],
        summary: {
          distance: apiData.summary?.distance || "0 mi",
          duration: apiData.summary?.duration || "0 hr",
        },
        logs: (apiData.logs || []).map(log => ({
          day: log.day,
          segments: (log.events || []).map(e => ({
            type:
              e.status === "DRV" ? "driving" :
              e.status === "ON" ? "on_duty" :
              e.status === "SB" ? "sleeper" :
              "off_duty",
            hours: e.duration || 0
          }))
        }))
      }

      setResults(normalized)

    } catch (err) {
      console.error(err)

      if (err.response?.data?.error) {
        setError(err.response.data.error)
      } else {
        setError("Failed to connect to the server or calculate the route.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-darkBg text-slate-200 p-4 md:p-8 font-sans bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-800 via-darkBg to-black">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <header className="text-center py-6">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 mb-4 tracking-tight">
            Truck Driver Trip Planner
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            HOS-compliant route simulation. Automatically calculates drive time, mandated breaks, and visualizes ELD logs.
          </p>
        </header>

        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          <div className="lg:col-span-1 h-full flex">
            <TripForm onSubmit={handlePlanTrip} isLoading={loading} />
          </div>

          <div className="lg:col-span-2 h-full">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-4">
                <p className="font-semibold">Error</p>
                <p>{error}</p>
              </div>
            )}

            {!results && !error ? (
              <div className="glass h-full rounded-2xl flex items-center justify-center min-h-[400px] text-slate-500 flex-col gap-4">
                <p className="text-lg uppercase">
                  Your map and results will appear here
                </p>
              </div>
            ) : results && (
              <MapView routeGeometry={results.route_geometry} />
            )}
          </div>
        </div>

        {/* Bottom Section */}
        {results && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <SummaryPanel summary={results.summary} />
            </div>
            <div className="lg:col-span-3">
              <LogGrid logs={results.logs} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App