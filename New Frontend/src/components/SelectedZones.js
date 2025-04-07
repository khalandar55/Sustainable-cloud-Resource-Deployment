import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ZoneCard from './ZoneCard';
import './SelectedZones.css';

const SelectedZones = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedZones, selectedFuels } = location.state;

  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedFuel, setSelectedFuel] = useState(selectedFuels[0]);
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [zoneNameOptions, setZoneNameOptions] = useState([]);
  const [, setCurrentZone] = useState(null);

  const [credentials, setCredentials] = useState({ accessKey: '', secretKey: '' });
  const [vpcDetails, setVpcDetails] = useState({ vpcName: '', natGateway: 'No' });

  const [numEc2Instances, setNumEc2Instances] = useState(1);
  const [ec2Details, setEc2Details] = useState(
    Array.from({ length: numEc2Instances }).map(() => ({
      name: '',
      instance_type: '',
      key_pair_name: '',
      subnet_type: '',
      sg_name: '',
      ami_id: '',
    }))
  );

  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentSuccess, setDeploymentSuccess] = useState(false);

  const handleEc2InstancesChange = (e) => {
    const newNumInstances = parseInt(e.target.value, 10);
    const updatedEc2Details = [...ec2Details];

    if (newNumInstances > ec2Details.length) {
      for (let i = ec2Details.length; i < newNumInstances; i++) {
        updatedEc2Details.push({
          name: '',
          instance_type: '',
          key_pair_name: '',
          subnet_type: '',
          sg_name: '',
          ami_id: '',
        });
      }
    } else if (newNumInstances < ec2Details.length) {
      updatedEc2Details.length = newNumInstances;
    }

    setEc2Details(updatedEc2Details);
    setNumEc2Instances(newNumInstances);
  };

  const handleEc2DetailsChange = (index, field, value) => {
    const updatedEc2Details = [...ec2Details];
    updatedEc2Details[index][field] = value;
    setEc2Details(updatedEc2Details);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleVpcChange = (e) => {
    const { name, value } = e.target;
    setVpcDetails({ ...vpcDetails, [name]: value });
  };

  const [inboundRules, setInboundRules] = useState([
    { fromPort: '', toPort: '', protocol: '', cidrBlock: '' }
  ]);

  const [outboundRules, setOutboundRules] = useState([
    { fromPort: '', toPort: '', protocol: '', cidrBlock: '' }
  ]);

  const handleInboundRuleChange = (index, field, value) => {
    const updatedInboundRules = [...inboundRules];
    updatedInboundRules[index][field] = value;
    setInboundRules(updatedInboundRules);
  };

  const handleOutboundRuleChange = (index, field, value) => {
    const updatedOutboundRules = [...outboundRules];
    updatedOutboundRules[index][field] = value;
    setOutboundRules(updatedOutboundRules);
  };

  const addInboundRule = () => {
    setInboundRules([...inboundRules, { fromPort: '', toPort: '', protocol: '', cidrBlock: '' }]);
  };

  const addOutboundRule = () => {
    setOutboundRules([...outboundRules, { fromPort: '', toPort: '', protocol: '', cidrBlock: '' }]);
  };

  const deleteInboundRule = (index) => {
    const updatedInboundRules = inboundRules.filter((_, i) => i !== index);
    setInboundRules(updatedInboundRules);
  };

  const deleteOutboundRule = (index) => {
    const updatedOutboundRules = outboundRules.filter((_, i) => i !== index);
    setOutboundRules(updatedOutboundRules);
  };

  const handleSubmit = async () => {
    setIsDeploying(true);
    setStatusMessage("Initializing deployment...");
    setProgress(10);

    for (let i = 0; i < ec2Details.length; i++) {
      const currentDetail = ec2Details[i];

      if (!currentDetail.ami_id || !currentDetail.instance_type || !currentDetail.key_pair_name || !currentDetail.sg_name || !currentDetail.subnet_type) {
        alert(`Please fill in all the details for EC2 Instance ${i + 1}`);
        setIsDeploying(false);
        return;
      }
    }

    const ec2Instances = ec2Details.map((details) => ({
      ami_id: details.ami_id,
      instance_type: details.instance_type,
      key_pair_name: details.key_pair_name,
      subnet_type: details.subnet_type,
      name: details.name,
      sg_name: details.sg_name,
      ingress_rules: inboundRules,
      egress_rules: outboundRules,
    }));

    const requestData = {
      accessKey: credentials.accessKey,
      secretKey: credentials.secretKey,
      region: zoneNameOptions,
      vpcName: vpcDetails.vpcName,
      createNatGateway: vpcDetails.natGateway === 'Yes',
      instanceCount: numEc2Instances,
      ec2Instances,
    };

    try {
      const response = await fetch('http://localhost:3002/run-terraform', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();
      if (response.ok) {
        console.log('Terraform applied successfully:', result);
        setProgress(100);
        setStatusMessage("Deployment completed successfully!");
        setDeploymentSuccess(true);
      } else {
        console.error('Error:', result);
        setStatusMessage('Error applying Terraform: ' + result.error);
        setIsDeploying(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setStatusMessage('Error applying Terraform: ' + error.message);
      setIsDeploying(false);
    }
  };

  const amiData = {
    'FR': ['ami-0e141aee2812422a2', 'ami-04a92520784b93e73', 'ami-06eaf4af17aef2a75'],
    'GB': ['ami-0c0493bbac867d427', 'ami-01ec84b284795cbc7', 'ami-0fc7a46876a675c5f'],
    'ES': ['ami-0a57c72ab235b0e48', 'ami-026fd2cb0cb87bea3', 'ami-0a75680a116b5ec60'],
    'SE': ['ami-090abff6ae1141d7d', 'ami-04cdc91e49cb06165', 'ami-0c232c9952bd4be59'],
    'DE': ['ami-0de02246788e4a354', 'ami-0e04bcbe83a83792e', 'ami-0af0e9617aaeff697'],
    'IT': ['ami-0c318278dac68c29a', 'ami-0802649dcda38fef0', 'ami-0c811dc3ab1f88794']
  };

  const zoneName = {
    'FR': ['eu-west-3'],
    'GB': ['eu-west-2'],
    'ES': ['eu-south-2'],
    'SE': ['eu-north-1'],
    'DE': ['eu-central-1'],
    'IT': ['eu-south-1']
  };

  const handleRegionSelect = (zone) => {
    setSelectedRegion(zone.zone);
    setCurrentZone(zone.zone);
    setDropdownOptions(amiData[zone.zone] || []);
    setZoneNameOptions(zoneName[zone.zone] || []);
  };

  const handleFuelSelect = (fuel) => {
    setSelectedFuel(fuel);  // Allow only one fuel selection at a time
  };

  const handleNext = () => {
    navigate('/next-page');
  };

  return (
    <div className="selected-zones-page">
      <h1 className="selected-zones-heading">These are the Zones you have selected</h1>
      <h4 className="subheading">Now select the zone in which you need to deploy the environment</h4>
      <div className="zones">
        {selectedZones.map((zone) => (
          <button
            key={zone.zone}
            onClick={() => handleRegionSelect(zone)}
            className={`zone-button ${selectedRegion === zone.zone ? 'selected-zone' : ''}`}
          >
            <ZoneCard zone={zone} />
          </button>
        ))}
      </div>

      {/* Display the fuel selection area */}
      <div className="form-section">
        <h2>Select One Fuel Source</h2>
        <div className="fuel-options">
          {selectedFuels.map((fuel, index) => (
            <label key={index} className="fuel-option">
              <input
                type="radio"
                name="fuel"
                value={fuel}
                checked={selectedFuel === fuel}
                onChange={() => handleFuelSelect(fuel)}
              />
              {fuel}
            </label>
          ))}
        </div>
      </div>

      <div className="form-section">
        <h2>Enter your AWS Access Credentials*</h2>
        <div className="form-group">
          <label>Zone Name:</label>
          <select>
            {zoneNameOptions.map((zoneName, i) => (
              <option key={i} value={zoneName}>
                {zoneName}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="accessKey">Access Key:</label>
          <input
            type="text"
            id="accessKey"
            name="accessKey"
            value={credentials.accessKey}
            onChange={handleInputChange}
            required
            placeholder="Enter your Access Key"
          />
        </div>
        <div className="form-group">
          <label htmlFor="secretKey">Secret Access Key:</label>
          <input
            type="password"
            id="secretKey"
            name="secretKey"
            value={credentials.secretKey}
            onChange={handleInputChange}
            required
            placeholder="Enter your Secret Access Key"
          />
        </div>
      </div>

      <div className="form-section">
        <h2>Enter your VPC Details</h2>
        <div className="form-group">
          <label htmlFor="vpcName">VPC Name:</label>
          <input
            type="text"
            id="vpcName"
            name="vpcName"
            value={vpcDetails.vpcName}
            onChange={handleVpcChange}
            required
            placeholder="Enter your VPC Name"
          />
        </div>
        <div className="form-group">
          <label>NAT Gateway:</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="natGateway"
                value="Yes"
                checked={vpcDetails.natGateway === 'Yes'}
                onChange={handleVpcChange}
              />
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="natGateway"
                value="No"
                checked={vpcDetails.natGateway === 'No'}
                onChange={handleVpcChange}
              />
              No
            </label>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h2>Select Number of EC2 Instances</h2>
        <div className="form-group">
          <label htmlFor="numEc2Instances">Number of EC2 Instances:</label>
          <select id="numEc2Instances" value={numEc2Instances} onChange={handleEc2InstancesChange}>
            {[...Array(10)].map((_, index) => (
              <option key={index + 1} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </select>
        </div>
      </div>

      {Array.from({ length: numEc2Instances }).map((_, index) => (
        <div key={index} className="form-section">
          <h2>EC2 Instance {index + 1} Details</h2>
          <div className="form-group">
            <label>EC2 Name:</label>
            <input type="text" placeholder="Enter EC2 Name"
              value={ec2Details[index].name}
              onChange={(e) => handleEc2DetailsChange(index, "name", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>AMI ID:</label>
            <select
              value={ec2Details[index]?.ami_id || ''}
              onChange={(e) => handleEc2DetailsChange(index, "ami_id", e.target.value)}
            >
              <option value="" disabled>Select AMI ID</option>
              {dropdownOptions.map((ami, i) => (
                <option key={i} value={ami}>
                  {ami}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Instance Type:</label>
            <select
              value={ec2Details[index]?.instance_type || ''}
              onChange={(e) => handleEc2DetailsChange(index, "instance_type", e.target.value)}
            >
              <option value="" disabled>Select Instance Type</option>
              <option value="t3.micro">t3.micro</option>
              <option value="t3.medium">t3.medium</option>
              <option value="t3.large">t3.large</option>
            </select>
          </div>
          <div className="form-group">
            <label>Keypair Name*:</label>
            <input type="text" placeholder="Enter Keypair Name"
              value={ec2Details[index].key_pair_name}
              onChange={(e) => handleEc2DetailsChange(index, "key_pair_name", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Security Group Name:</label>
            <input type="text" placeholder="Enter Security Name"
              value={ec2Details[index].sg_name}
              onChange={(e) => handleEc2DetailsChange(index, "sg_name", e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Subnet Type:</label>
            <select
              value={ec2Details[index]?.subnet_type || ''}
              onChange={(e) => handleEc2DetailsChange(index, "subnet_type", e.target.value)}
            >
              <option value="" disabled>Select Subnet Type</option>
              <option value="Public">Public</option>
              <option value="Private">Private</option>
            </select>
          </div>

          <div className="form-section">
            <h2>Security Group Rules for EC2 Instance {index + 1}</h2>
            <h3>Inbound Rules</h3>
            {inboundRules.map((rule, idx) => (
              <div key={idx} className="form-group">
                <label>From Port:</label>
                <input
                  type="number"
                  value={rule.fromPort}
                  placeholder="Enter From Port"
                  onChange={(e) =>
                    handleInboundRuleChange(idx, "fromPort", e.target.value)
                  }
                />
                <label>To Port:</label>
                <input
                  type="number"
                  value={rule.toPort}
                  placeholder="Enter To Port"
                  onChange={(e) =>
                    handleInboundRuleChange(idx, "toPort", e.target.value)
                  }
                />
                <label>Protocol:</label>
                <input
                  type="text"
                  value={rule.protocol}
                  placeholder="Enter Protocol"
                  onChange={(e) =>
                    handleInboundRuleChange(idx, "protocol", e.target.value)
                  }
                />
                <label>CIDR Block:</label>
                <input
                  type="text"
                  value={rule.cidrBlock}
                  placeholder="Enter CIDR Block"
                  onChange={(e) =>
                    handleInboundRuleChange(idx, "cidrBlock", e.target.value)
                  }
                />
                <button
                  type="button"
                  onClick={() => deleteInboundRule(idx)}
                  className="delete-button"
                >
                  Delete Rule
                </button>
              </div>
            ))}
            <button type="button" onClick={addInboundRule}>
              Add Inbound Rule
            </button>
            <h3>Outbound Rules</h3>
            {outboundRules.map((rule, idx) => (
              <div key={idx} className="form-group">
                <label>From Port:</label>
                <input
                  type="number"
                  value={rule.fromPort}
                  placeholder="Enter From Port"
                  onChange={(e) =>
                    handleOutboundRuleChange(idx, "fromPort", e.target.value)
                  }
                />
                <label>To Port:</label>
                <input
                  type="number"
                  value={rule.toPort}
                  placeholder="Enter To Port"
                  onChange={(e) =>
                    handleOutboundRuleChange(idx, "toPort", e.target.value)
                  }
                />
                <label>Protocol:</label>
                <input
                  type="text"
                  value={rule.protocol}
                  placeholder="Enter Protocol"
                  onChange={(e) =>
                    handleOutboundRuleChange(idx, "protocol", e.target.value)
                  }
                />
                <label>CIDR Block:</label>
                <input
                  type="text"
                  value={rule.cidrBlock}
                  placeholder="Enter CIDR Block"
                  onChange={(e) =>
                    handleOutboundRuleChange(idx, "cidrBlock", e.target.value)
                  }
                />
                <button
                  type="button"
                  onClick={() => deleteOutboundRule(idx)}
                  className="delete-button"
                >
                  Delete Rule
                </button>
              </div>
            ))}
            <button type="button" onClick={addOutboundRule}>
              Add Outbound Rule
            </button>
          </div>

          <button onClick={handleSubmit} className="submit-button">Deploy with Terraform</button>

          {isDeploying && (
            <div className="progress-container">
              <div className="progress-bar">
                <div style={{ width: `${progress}%` }}></div>
              </div>
              <div className="status-message">{statusMessage}</div>
            </div>
          )}

          {/* Shows the "Next" button after successful deployment */}
          {deploymentSuccess && (
            <button onClick={handleNext} className="next-button">
              Next
            </button>
          )}
          <div className="legend">
            * - Case Sensitive
          </div>
        </div>
      ))}
    </div>
  );
};

export default SelectedZones;
