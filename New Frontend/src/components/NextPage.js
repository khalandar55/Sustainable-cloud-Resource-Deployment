// import React, { useState, useEffect } from 'react';
// import './NextPage.css';
// import ZoneCard from './ZoneCard'; // Import ZoneCard

// const apiToken = 'your_api_token'; // Replace with your actual API token
// const zones = ['FR', 'DE', 'SE', 'GB', 'ES', 'IT']; // Define the zones

// // Mapping between zones and AWS regions
// const zoneName = {
//   'FR': ['eu-west-3'],
//   'GB': ['eu-west-2'],
//   'ES': ['eu-south-2'],
//   'SE': ['eu-north-1'],
//   'DE': ['eu-central-1'],
//   'IT': ['eu-south-1']
// };

// const NextPage = () => {
//   const [accessKey, setAccessKey] = useState('');
//   const [secretKey, setSecretKey] = useState('');
//   const [resources, setResources] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [mostSustainable, setMostSustainable] = useState([]);
//   const [selectedZone, setSelectedZone] = useState(null); // Only one zone can be selected

//   // Function to fetch zone data from the Electricity Maps API
//   const fetchZoneData = async (zone) => {
//     const response = await fetch(`https://api.electricitymap.org/v3/power-breakdown/latest?zone=${zone}`, {
//       headers: {
//         'auth-token': apiToken,
//       },
//     });
//     const data = await response.json();
//     return data;
//   };

//   // Fetch and display data for the available zones
//   useEffect(() => {
//     const loadZoneData = async () => {
//       const zoneDataPromises = zones.map((zone) => fetchZoneData(zone));
//       const zoneDataArray = await Promise.all(zoneDataPromises);
//       setMostSustainable(zoneDataArray); // Set the data for rendering
//     };

//     loadZoneData();
//   }, []);

//   // Handle selecting a zone (only one zone can be selected)
//   const handleZoneSelect = (zone) => {
//     setSelectedZone(zone === selectedZone ? null : zone); // Toggle selection
//   };

//   // Trigger Terraform to capture AWS resources
//   const handleCaptureDetails = async () => {
//     if (!selectedZone) {
//       alert('Please select a zone first!');
//       return;
//     }

//     const awsRegion = zoneName[selectedZone.zone][0]; // Get the AWS region for the selected zone

//     setLoading(true);

//     try {
//       const response = await fetch('http://localhost:3002/trigger-terraform', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           accessKey,
//           secretKey,
//           regions: [awsRegion], // Pass the mapped AWS region
//         }), 
//       });

//       const data = await response.json();
//       setResources(data); // Set the captured resources
//     } catch (error) {
//       console.error('Error capturing AWS resources:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="next-page">
//       <h1>Capture AWS Resources for Selected Zone</h1>

//       {/* Input fields for AWS credentials */}
//       <div>
//         <label>
//           AWS Access Key:
//           <input
//             type="text"
//             value={accessKey}
//             onChange={(e) => setAccessKey(e.target.value)}
//           />
//         </label>
//         <br />
//         <label>
//           AWS Secret Key:
//           <input
//             type="password"
//             value={secretKey}
//             onChange={(e) => setSecretKey(e.target.value)}
//           />
//         </label>
//       </div>

//       {/* Display the zone cards for selection */}
//       <h2>Select a Zone:</h2>
//       <div className="zones-container">
//         <div className="zones">
//           {mostSustainable.map((zone) => (
//             <ZoneCard
//               key={zone.zone}
//               zone={zone}
//               isSelected={selectedZone === zone} // Only one zone can be selected
//               handleZoneSelect={() => handleZoneSelect(zone)} // Pass the zone selection handler
//             />
//           ))}
//         </div>
//       </div>

//       {/* Display the selected zone */}
//       <div>
//         <h2>Selected Zone:</h2>
//         {selectedZone ? (
//           <p>
//             {selectedZone.zone} ({zoneName[selectedZone.zone][0]})
//           </p>
//         ) : (
//           <p>No zone selected</p>
//         )}
//       </div>

//       {/* Capture AWS resources button */}
//       <button
//         onClick={handleCaptureDetails}
//         disabled={!selectedZone || !accessKey || !secretKey} // Disable if no zone or credentials
//       >
//         Capture Details
//       </button>

//       {/* Display loading or resource information */}
//       {loading ? <p>Loading...</p> : null}
//       {resources && (
//         <div>
//           <h2>EC2 Instances</h2>
//           {resources.ec2Instances?.length > 0 ? (
//             <ul>
//               {resources.ec2Instances.map((instance, index) => (
//                 <li key={index}>ID: {instance}</li>
//               ))}
//             </ul>
//           ) : (
//             <p>No EC2 Instances found</p>
//           )}

//           <h2>Subnets</h2>
//           {resources.subnets?.length > 0 ? (
//             <ul>
//               {resources.subnets.map((subnet, index) => (
//                 <li key={index}>ID: {subnet}</li>
//               ))}
//             </ul>
//           ) : (
//             <p>No Subnets found</p>
//           )}

//           <h2>Security Groups</h2>
//           {resources.securityGroups?.length > 0 ? (
//             <ul>
//               {resources.securityGroups.map((sg, index) => (
//                 <li key={index}>ID: {sg}</li>
//               ))}
//             </ul>
//           ) : (
//             <p>No Security Groups found</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default NextPage;

import React, { useState, useEffect } from 'react';
import './NextPage.css';
import ZoneCard from './ZoneCard'; // Import ZoneCard

const apiToken = 'your_api_token'; // Replace with your actual API token
const zones = ['FR', 'DE', 'SE', 'GB', 'ES', 'IT']; // Define the zones

// Mapping between zones and AWS regions
const zoneName = {
  'FR': ['eu-west-3'],
  'GB': ['eu-west-2'],
  'ES': ['eu-south-2'],
  'SE': ['eu-north-1'],
  'DE': ['eu-central-1'],
  'IT': ['eu-south-1']
};

const NextPage = () => {
  const [accessKey, setAccessKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [resources, setResources] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mostSustainable, setMostSustainable] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null); // Only one zone can be selected
  const [selectedInstance, setSelectedInstance] = useState(null); // To track the selected EC2 instance
  const [targetRegion, setTargetRegion] = useState(''); // To track the target region for replication

  // Function to fetch zone data from the Electricity Maps API
  const fetchZoneData = async (zone) => {
    const response = await fetch(`https://api.electricitymap.org/v3/power-breakdown/latest?zone=${zone}`, {
      headers: {
        'auth-token': apiToken,
      },
    });
    const data = await response.json();
    return data;
  };

  // Fetch and display data for the available zones
  useEffect(() => {
    const loadZoneData = async () => {
      const zoneDataPromises = zones.map((zone) => fetchZoneData(zone));
      const zoneDataArray = await Promise.all(zoneDataPromises);
      setMostSustainable(zoneDataArray); // Set the data for rendering
    };

    loadZoneData();
  }, []);

  // Handle selecting a zone (only one zone can be selected)
  const handleZoneSelect = (zone) => {
    setSelectedZone(zone === selectedZone ? null : zone); // Toggle selection
  };

  // Trigger Terraform to capture AWS resources
  const handleCaptureDetails = async () => {
    if (!selectedZone) {
      alert('Please select a zone first!');
      return;
    }

    const awsRegion = zoneName[selectedZone.zone][0]; // Get the AWS region for the selected zone

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3002/trigger-terraform', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessKey,
          secretKey,
          regions: [awsRegion], // Pass the mapped AWS region
        }), 
      });

      const data = await response.json();
      setResources(data); // Set the captured resources
    } catch (error) {
      console.error('Error capturing AWS resources:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle replication of an EC2 instance to a different region
  const handleInstanceClick = (instanceId) => {
    setSelectedInstance(instanceId); // Store the selected instance ID
  };

  const handleReplication = async () => {
    if (!selectedInstance || !targetRegion) {
      alert('Please select an instance and target region');
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await fetch('http://localhost:3002/replicate-instance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessKey,
          secretKey,
          instanceId: selectedInstance,
          targetRegion
        }), 
      });
  
      const data = await response.json();
      alert(`Replication successful: ${data.message}`);
    } catch (error) {
      console.error('Error replicating EC2 instance:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter out the current zone from the available target regions
  const availableRegions = Object.keys(zoneName).filter((zone) => zone !== selectedZone?.zone);

  return (
    <div className="next-page">
      <h1>Capture AWS Resources for Selected Zone</h1>

      {/* Input fields for AWS credentials */}
      <div>
        <label>
          AWS Access Key:
          <input
            type="text"
            value={accessKey}
            onChange={(e) => setAccessKey(e.target.value)}
          />
        </label>
        <br />
        <label>
          AWS Secret Key:
          <input
            type="password"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
          />
        </label>
      </div>

      {/* Display the zone cards for selection */}
      <h2>Select a Zone:</h2>
      <div className="zones-container">
        <div className="zones">
          {mostSustainable.map((zone) => (
            <ZoneCard
              key={zone.zone}
              zone={zone}
              isSelected={selectedZone === zone} // Only one zone can be selected
              handleZoneSelect={() => handleZoneSelect(zone)} // Pass the zone selection handler
            />
          ))}
        </div>
      </div>

      {/* Display the selected zone */}
      <div>
        <h2>Selected Zone:</h2>
        {selectedZone ? (
          <p>
            {selectedZone.zone} ({zoneName[selectedZone.zone][0]})
          </p>
        ) : (
          <p>No zone selected</p>
        )}
      </div>

      {/* Capture AWS resources button */}
      <button
        onClick={handleCaptureDetails}
        disabled={!selectedZone || !accessKey || !secretKey} // Disable if no zone or credentials
      >
        Capture Details
      </button>

      {/* Display loading or resource information */}
      {loading ? <p>Loading...</p> : null}
      {resources && (
        <div>
          <h2>EC2 Instances (Click to replicate)</h2>
          {resources.ec2Instances?.length > 0 ? (
            <ul>
              {resources.ec2Instances.map((instance, index) => (
                <li key={index} onClick={() => handleInstanceClick(instance)}>ID: {instance}</li>
              ))}
            </ul>
          ) : (
            <p>No EC2 Instances found</p>
          )}

          <h2>Subnets</h2>
          {resources.subnets?.length > 0 ? (
            <ul>
              {resources.subnets.map((subnet, index) => (
                <li key={index}>ID: {subnet}</li>
              ))}
            </ul>
          ) : (
            <p>No Subnets found</p>
          )}

          <h2>Security Groups</h2>
          {resources.securityGroups?.length > 0 ? (
            <ul>
              {resources.securityGroups.map((sg, index) => (
                <li key={index}>ID: {sg}</li>
              ))}
            </ul>
          ) : (
            <p>No Security Groups found</p>
          )}
        </div>
      )}

      {/* Display target region dropdown if an instance is selected */}
      {selectedInstance && (
        <div>
          <h2>Replicate EC2 Instance: {selectedInstance}</h2>
          <label htmlFor="targetRegion">Select Target Region: </label>
          <select
            id="targetRegion"
            value={targetRegion}
            onChange={(e) => setTargetRegion(e.target.value)}
          >
            <option value="">Select a region</option>
            {availableRegions.map((zone) => (
              <option key={zone} value={zoneName[zone][0]}>
                {zone} ({zoneName[zone][0]})
              </option>
            ))}
          </select>
          <button onClick={handleReplication}>Replicate Instance</button>
        </div>
      )}
    </div>
  );
};

export default NextPage;


