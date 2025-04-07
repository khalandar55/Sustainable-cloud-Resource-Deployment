SUSTAINABLE CLOUD RESOURCE DEPLOYMENT
-------------------------------------

**Presented at IEEE/ACM UCC 2024 and Published in IEEE Xplore**

This system enables sustainable cloud resource management by integrating real-time energy data into AWS deployment workflows and offering edge continuum replication to enhance performance and availability.

PROJECT FEATURES
----------------
- Real-Time Energy Data Integration using Electricity Maps API
- AWS Region Selection Based on Renewable & Fossil-Free Sources
- EC2 Instance Deployment with Full VPC Automation
- Edge Continuum: Cross-Region Resource Replication
- Full Infrastructure Automation using Terraform
- React.js Frontend Dashboard for Region and Energy Visualization
- Secure API Gateway and Terraform Integration via Node.js Backend

PROJECT STRUCTURE
-----------------
Sustainability-project/
├── New Frontend/         # React.js frontend
├── New Backend/          # Node.js backend & Terraform scripts
│   ├── *.tf              # Terraform configurations
│   ├── index.js          # Entry point for backend API
|--   └── .env.example      # Sample environment variables


HOW TO SET UP
-------------

1. Clone the repo:
   git clone https://github.com/khalandar55/Sustainable-cloud-Resource-Deployment.git
   cd Sustainable-cloud-Resource-Deployment

2. Set up the Frontend:
   cd "New Frontend"
   npm install
   npm start
   - Runs at http://localhost:3000

3. Set up the Backend:
   cd "../New Backend"
   npm install

   Create a `.env` file with the following:
   AWS_ACCESS_KEY_ID=your_aws_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   ELECTRICITY_MAPS_API_KEY=your_api_key

   Start the server:
   node index.js

4. Terraform Setup (Infrastructure Deployment):
   terraform init
   terraform apply
   - Choose region, instance type, etc.

TESTED DEPLOYMENT REGIONS
--------------------------
| Region     | Renewable | Fossil-Free | Notes                  |
|------------|-----------|-------------|-------------------------|
| Stockholm  | 76%       | 100%        | Best green deployment  |
| Frankfurt  | 41%       | 60%         | Mixed source           |
| Paris      | 28%       | 97%         | Clean & limited region |
| London     | 28%       | 51%         | Fossil-heavy           |
| Spain      | 58%       | 87%         | Good replication zone  |
| Milan      | 49%       | 72%         | Balanced                |

SECURITY NOTICE
---------------
- Never commit your `.env` file or any AWS credentials.
- Use environment variables and secrets management for deployment.

ACKNOWLEDGMENT
--------------
Developed by Khalander Shariff Rafiulla Shariff.  
Presented at IEEE/ACM UCC 2024, University of Sharjah.

Paper: "Sustainable Cloud Resource Deployment: Integrating Real-Time Energy Data and Edge Continuum for Optimized Cloud Operations"

LICENSE
-------
MIT License – Open for academic and non-commercial use.
