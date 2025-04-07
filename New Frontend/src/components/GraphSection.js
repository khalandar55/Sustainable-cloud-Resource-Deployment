import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-moment';
Chart.register(...registerables);

const apiToken = 'MHwld3ag6Qslv'; // Replace with your actual token

const GraphSection = ({ selectedZones, selectedFuels }) => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState([]);
  const [hasNonZero, setHasNonZero] = useState(true);
  const fetchTimeoutRef = useRef(null);

  const zoneNames = useMemo(() => ({
    FR: 'France',
    DE: 'Germany',
    GB: 'UK',
    SE: 'Sweden',
    ES: 'Spain',
    IT: 'Italy',
    'US-MIDA-PJM': 'Mid-Atlantic US'
  }), []);

  const colors = useMemo(() => ({
    nuclear: 'rgba(54, 162, 235, 1)',
    geothermal: 'rgba(255, 99, 132, 1)',
    biomass: 'rgba(255, 206, 86, 1)',
    wind: 'rgba(153, 102, 255, 1)',
    solar: 'rgba(255, 159, 64, 1)',
    hydro: 'rgba(100, 200, 150, 1)',
    'hydro discharge': 'rgba(0, 100, 255, 1)',
    'battery discharge': 'rgba(255, 255, 0, 1)'
  }), []);

  useEffect(() => {
    if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);

    fetchTimeoutRef.current = setTimeout(() => {
      if (selectedZones.length > 0 && selectedFuels.length === 3) {
        const fetchData = async () => {
          const newData = await Promise.all(
            selectedZones.map(async (zone) => {
              try {
                const response = await fetch(
                  `https://api.electricitymap.org/v3/power-breakdown/history?zone=${zone.zone}`,
                  {
                    method: 'GET',
                    headers: { 'auth-token': apiToken }
                  }
                );

                const data = await response.json();

                if (data && data.history) {
                  return {
                    zone: zone.zone,
                    productionData: data.history.map(entry => {
                      const breakdown = entry.powerProductionBreakdown || {};
                      const fuelValues = {};

                      selectedFuels.forEach(fuel => {
                        const val = breakdown[fuel];
                        fuelValues[fuel] = val === null || val === undefined ? 0 : val;
                      });

                      return {
                        datetime: entry.datetime,
                        ...fuelValues
                      };
                    })
                  };
                } else {
                  console.warn(`No history for zone ${zone.zone}`);
                  return null;
                }
              } catch (err) {
                console.error(`Error fetching ${zone.zone}:`, err);
                return null;
              }
            })
          );

          setChartData(newData.filter(Boolean));
        };

        fetchData();
      }
    }, 300);
  }, [selectedZones, selectedFuels]);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    if (chartData.length > 0) {
      const ctx = document.getElementById('combinedChart')?.getContext('2d');
      if (!ctx) return;

      const labels = chartData[0]?.productionData.map(entry => new Date(entry.datetime)) || [];
      const datasets = [];

      let foundData = false;

      chartData.forEach(zoneData => {
        selectedFuels.forEach(fuel => {
          const values = zoneData.productionData.map(entry => entry[fuel] || 0);
          const hasNonZeroValue = values.some(val => val > 0);

          if (hasNonZeroValue) foundData = true;

          datasets.push({
            label: `${zoneNames[zoneData.zone] || zoneData.zone} - ${fuel}`,
            data: values,
            borderColor: colors[fuel] || 'rgba(0, 0, 0, 1)',
            backgroundColor: colors[fuel] || 'rgba(0, 0, 0, 1)',
            fill: false,
            pointRadius: 3,
            tension: 0.3,
            borderWidth: 2
          });
        });
      });

      setHasNonZero(foundData);

      chartRef.current = new Chart(ctx, {
        type: 'line',
        data: { labels, datasets },
        options: {
          responsive: true,
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'hour',
                tooltipFormat: 'MMM D, hA'
              },
              title: {
                display: true,
                text: 'Timeline'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Power Production (MW)'
              },
              beginAtZero: true
            }
          },
          plugins: {
            legend: { labels: { color: '#000' } },
            tooltip: { mode: 'index', intersect: false }
          }
        }
      });

      chartRef.current.update();
    }
  }, [chartData, selectedFuels, colors, zoneNames]);

  useEffect(() => {
    return () => {
      if (fetchTimeoutRef.current) clearTimeout(fetchTimeoutRef.current);
    };
  }, []);

  if (selectedZones.length === 0 || selectedFuels.length !== 3) {
    return (
      <div style={{ color: 'white', textAlign: 'center', marginTop: 20 }}>
        Please select 1 region and 3 fuel sources to view the graph.
      </div>
    );
  }

  return (
    <div className="graph-item">
      <h3 style={{ color: 'white' }}>Energy Breakdown for Selected Region</h3>
      {!hasNonZero ? (
        <div style={{ color: 'yellow', textAlign: 'center', padding: 20 }}>
          No non-zero data available for selected fuels in this region.
        </div>
      ) : (
        <canvas id="combinedChart" />
      )}
    </div>
  );
};

export default GraphSection;
