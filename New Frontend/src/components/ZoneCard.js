import React from 'react';
import './ZoneCard.css';

const zoneFullNames = {
  'FR': 'Paris',
  'DE': 'Frankfurt',
  'SE': 'Stockholm',
  'GB': 'London',
  'ES': 'Spain',
  'IT': 'Milan'
};

const ZoneCard = ({ zone, isSelected, handleZoneSelect }) => {
  const fullZoneName = zoneFullNames[zone.zone] || zone.zone;

  return (
    <div 
      className={`zone-card ${isSelected ? 'selected' : ''}`} 
      onClick={handleZoneSelect}
      style={{ cursor: 'pointer' }}
    >
      <h3>{fullZoneName}</h3>
      <p>Fossil-Free Percentage: {zone.fossilFreePercentage}%</p>
      <p>Renewable Energy: {zone.renewablePercentage}%</p>
    </div>
  );
};

export default ZoneCard;
