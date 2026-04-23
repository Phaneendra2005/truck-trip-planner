import React, { useState } from 'react';

const TripForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    current_location: 'Chicago, IL',
    pickup_location: 'Dallas, TX',
    dropoff_location: 'Los Angeles, CA',
    current_cycle_used: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="glass p-6 rounded-2xl shadow-xl w-full">
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7l6-2.5 5.447 2.724A1 1 0 0121 8.118v10.764a1 1 0 01-1.447.894L15 17l-6 2.5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20V7m6 10V5" />
        </svg>
        Plan Your Route
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Current Location (Optional)</label>
          <input 
            type="text" name="current_location" value={formData.current_location} onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-800/50" placeholder="e.g. Chicago, IL"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Pickup Location *</label>
          <input 
            type="text" name="pickup_location" value={formData.pickup_location} onChange={handleChange} required
            className="w-full px-4 py-3 bg-slate-800/50" placeholder="e.g. Dallas, TX"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Dropoff Location *</label>
          <input 
            type="text" name="dropoff_location" value={formData.dropoff_location} onChange={handleChange} required
            className="w-full px-4 py-3 bg-slate-800/50" placeholder="e.g. Los Angeles, CA"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Current Cycle Used (Hours)</label>
          <input 
            type="number" name="current_cycle_used" value={formData.current_cycle_used} onChange={handleChange} min="0" max="70" step="0.5"
            className="w-full px-4 py-3 bg-slate-800/50" placeholder="0"
          />
        </div>
        <button 
          type="submit" 
          disabled={isLoading}
          className="mt-4 w-full bg-primary hover:bg-primaryHover text-white font-medium py-3 px-4 rounded-md transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : "Calculate Route"}
        </button>
      </form>
    </div>
  );
};

export default TripForm;
