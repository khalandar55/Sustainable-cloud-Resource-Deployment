// const express = require('express');
// const { exec } = require('child_process');
// const fs = require('fs');
// const cors = require('cors');
// const path = require('path');

// const app = express();
// app.use(express.json());
// app.use(cors());

// // Define the Terraform directory path
// const terraformDir = '/Users/naveen/Documents/Documents/Naveen Doc/UEL/UELDissertation/New Backend/Replication';
// const absoluteTerraformDir = path.resolve(terraformDir);

// app.post('/trigger-terraform', (req, res) => {
//   const { accessKey, secretKey } = req.body;

//   // Write the credentials into terraform.tfvars
//   const tfVarsContent = `aws_access_key = "${accessKey}"
// aws_secret_key = "${secretKey}"`;

//   const tfVarsPath = path.join(absoluteTerraformDir, 'terraform.tfvars');

//   // Write terraform.tfvars in the Terraform directory
//   try {
//     fs.writeFileSync(tfVarsPath, tfVarsContent);
//   } catch (writeErr) {
//     console.error('Error writing terraform.tfvars:', writeErr);
//     return res.status(500).json({ error: 'Error writing terraform.tfvars' });
//   }

//   const execOptions = {
//     cwd: absoluteTerraformDir,
//     maxBuffer: 1024 * 1024 * 10, // 10 MB buffer
//   };

//   // Run terraform commands
//   exec('terraform init && terraform apply -auto-approve', execOptions, (err, stdout, stderr) => {
//     if (err) {
//       console.error('Error running Terraform apply:', err);
//       console.error('Terraform apply stderr:', stderr);
//       console.error('Terraform apply stdout:', stdout);
//       return res.status(500).json({ error: 'Error running Terraform apply' });
//     }

//     console.log('Terraform apply stdout:', stdout);
//     console.error('Terraform apply stderr:', stderr);

//     // After successful apply, run 'terraform output -json'
//     exec('terraform output -json', execOptions, (err, stdout, stderr) => {
//       if (err) {
//         console.error('Error running Terraform output:', err);
//         console.error('Terraform output stderr:', stderr);
//         return res.status(500).json({ error: 'Error running Terraform output' });
//       }

//       console.log('Terraform output stdout:', stdout);
//       console.error('Terraform output stderr:', stderr);

//       // Parse the JSON output
//       let outputs;
//       try {
//         outputs = JSON.parse(stdout);
//       } catch (parseErr) {
//         console.error('Error parsing Terraform output JSON:', parseErr);
//         console.log('Raw Terraform output:', stdout);
//         return res.status(500).json({ error: 'Error parsing Terraform output' });
//       }

//       // Extract values safely
//       const ec2Instances = outputs.ec2_instances ? outputs.ec2_instances.value : [];
//       const securityGroups = outputs.security_groups ? outputs.security_groups.value : [];
//       const subnets = outputs.subnets ? outputs.subnets.value : [];

//       // Return the resources as JSON
//       res.json({
//         ec2Instances,
//         securityGroups,
//         subnets,
//       });
//     });
//   });
// });

// app.listen(3002, () => {
//   console.log('Server is running on port 3002');
// });

const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// Define the Terraform directory path
const terraformDir = '/Users/naveen/Documents/Documents/Naveen Doc/UEL/UELDissertation/New Backend/Replication';
const absoluteTerraformDir = path.resolve(terraformDir);

app.post('/trigger-terraform', (req, res) => {
  const { accessKey, secretKey, regions } = req.body;

  if (!regions || regions.length === 0) {
    return res.status(400).json({ error: 'No regions selected' });
  }

  const selectedRegion = regions[0]; // For simplicity, select the first region from the array

  // Write the credentials and region into terraform.tfvars
  const tfVarsContent = `aws_access_key = "${accessKey}"
aws_secret_key = "${secretKey}"
aws_region = "${selectedRegion}"`; // Adding region to terraform.tfvars

  const tfVarsPath = path.join(absoluteTerraformDir, 'terraform.tfvars');

  // Write terraform.tfvars in the Terraform directory
  try {
    fs.writeFileSync(tfVarsPath, tfVarsContent);
  } catch (writeErr) {
    console.error('Error writing terraform.tfvars:', writeErr);
    return res.status(500).json({ error: 'Error writing terraform.tfvars' });
  }

  const execOptions = {
    cwd: absoluteTerraformDir,
    maxBuffer: 1024 * 1024 * 10, // 10 MB buffer
  };

  // Run terraform commands
  exec('terraform init && terraform apply -auto-approve', execOptions, (err, stdout, stderr) => {
    if (err) {
      console.error('Error running Terraform apply:', err);
      console.error('Terraform apply stderr:', stderr);
      console.error('Terraform apply stdout:', stdout);
      return res.status(500).json({ error: 'Error running Terraform apply' });
    }

    console.log('Terraform apply stdout:', stdout);
    console.error('Terraform apply stderr:', stderr);

    // After successful apply, run 'terraform output -json'
    exec('terraform output -json', execOptions, (err, stdout, stderr) => {
      if (err) {
        console.error('Error running Terraform output:', err);
        console.error('Terraform output stderr:', stderr);
        return res.status(500).json({ error: 'Error running Terraform output' });
      }

      console.log('Terraform output stdout:', stdout);
      console.error('Terraform output stderr:', stderr);

      // Parse the JSON output
      let outputs;
      try {
        outputs = JSON.parse(stdout);
      } catch (parseErr) {
        console.error('Error parsing Terraform output JSON:', parseErr);
        console.log('Raw Terraform output:', stdout);
        return res.status(500).json({ error: 'Error parsing Terraform output' });
      }

      // Extract values safely
      const ec2Instances = outputs.ec2_instances ? outputs.ec2_instances.value : [];
      const securityGroups = outputs.security_groups ? outputs.security_groups.value : [];
      const subnets = outputs.subnets ? outputs.subnets.value : [];

      // Return the resources as JSON
      res.json({
        ec2Instances,
        securityGroups,
        subnets,
      });
    });
  });
});

app.listen(3002, () => {
  console.log('Server is running on port 3002');
});
