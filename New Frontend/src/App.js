import React, { useState, useEffect } from 'react';
import ZoneCard from './components/ZoneCard';
import Map from './components/Map';  
import GraphSection from './components/GraphSection';
import { useNavigate } from 'react-router-dom';
import './App.css';

const apiToken = 'MHwld3ag6Qslv'; // Replace with actual token from https://portal.electricitymaps.com

// Updated zone objects with lat/lon
const zones = [
  { code: 'FR', lat: 46.603354, lon: 1.888334 },
  { code: 'DE', lat: 51.1657, lon: 10.4515 },
  { code: 'SE', lat: 60.1282, lon: 18.6435 },
  { code: 'GB', lat: 55.3781, lon: -3.4360 },
  { code: 'ES', lat: 40.4637, lon: -3.7492 },
  { code: 'IT', lat: 41.8719, lon: 12.5674 }
];

const fuelSources = ['Nuclear', 'Geothermal', 'Biomass', 'Wind', 'Solar', 'Hydro', 'Hydro Discharge', 'Battery Discharge'];

function App() {
  const [mostSustainable, setMostSustainable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedZones, setSelectedZones] = useState([]);
  const [selectedFuels, setSelectedFuels] = useState([]);
  const navigate = useNavigate();

  // Fetch updated power breakdown using lat/lon
  const fetchZoneData = async (zone) => {
    try {
      const response = await fetch(
        `https://api.electricitymap.org/v3/power-breakdown/latest?lat=${zone.lat}&lon=${zone.lon}`,
        {
          headers: {
            'auth-token': apiToken
          }
        }
      );

      if (!response.ok) {
        console.error(`Failed to fetch data for ${zone.code}:`, response.status);
        return null;
      }

      const data = await response.json();
      data.latitude = zone.lat;
      data.longitude = zone.lon;
      data.zone = zone.code; // Maintain compatibility with UI
      return data;
    } catch (error) {
      console.error(`Error fetching zone ${zone.code}:`, error);
      return null;
    }
  };

  useEffect(() => {
    const loadSustainabilityData = async () => {
      const zoneDataPromises = zones.map(fetchZoneData);
      const zoneDataArray = await Promise.all(zoneDataPromises);
      const validData = zoneDataArray.filter(Boolean); // Remove nulls
      setMostSustainable(validData);
      setLoading(false);
    };

    loadSustainabilityData();
  }, []);

  const handleZoneSelect = (zone) => {
    if (selectedZones.includes(zone)) {
      setSelectedZones([]);
      setSelectedFuels([]);
    } else {
      setSelectedZones([zone]);
    }
  };

  const handleFuelSelect = (fuel) => {
    if (selectedFuels.includes(fuel)) {
      setSelectedFuels(selectedFuels.filter(f => f !== fuel));
    } else if (selectedFuels.length < 3) {
      setSelectedFuels([...selectedFuels, fuel]);
    }
  };

  const handleNext = () => {
    if (selectedZones.length === 1 && selectedFuels.length === 3) {
      navigate('/selected-zones', { state: { selectedZones, selectedFuels } });
    }
  };

  return (
    <div className="App">
      <h1 className="homepage-heading">Sustainable Energy Dashboard</h1>

      {loading ? (
        <div className="loading">Loading data, please wait...</div>
      ) : (
        <div className="main-container">
          <div className="map-container">
            <Map zones={mostSustainable} />
          </div>

          <div className="zones-container">
            <h2 className="heading-2">Most Sustainable Zones in Europe</h2>
            <div className="zones">
              {mostSustainable.map(zone => (
                <ZoneCard 
                  key={zone.zone}
                  zone={zone}
                  isSelected={selectedZones.includes(zone)}
                  handleZoneSelect={() => handleZoneSelect(zone)}
                />
              ))}
            </div>
          </div>

          {selectedZones.length === 1 && (
            <div className="fuel-selection-container">
              <h3>Select up to 3 Fuel Sources</h3>
              <div className="fuel-checkboxes">
                {fuelSources.map(fuel => (
                  <label key={fuel} className="fuel-checkbox">
                    <input
                      type="checkbox"
                      value={fuel}
                      checked={selectedFuels.includes(fuel)}
                      onChange={() => handleFuelSelect(fuel)}
                      disabled={!selectedFuels.includes(fuel) && selectedFuels.length === 3}
                    />
                    {fuel}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <GraphSection selectedZones={selectedZones} selectedFuels={selectedFuels} />

      <div className="next-button-container">
        <button
          className="next-button"
          onClick={handleNext}
          disabled={selectedZones.length !== 1 || selectedFuels.length !== 3}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
