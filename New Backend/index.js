// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const { exec } = require('child_process');
// const path = require('path');

// const app = express();

// app.use(cors({ origin: 'http://localhost:3001', methods: ['GET', 'POST'] }));
// app.use(bodyParser.json());

// app.post('/run-terraform', (req, res) => {
//     const {
//         accessKey,
//         secretKey,
//         region,
//         vpcName,
//         createNatGateway,
//         instanceCount,
//         ec2Instances
//     } = req.body;

//     // Function to convert JSON-style object to Terraform-style string
//     const toTerraformString = (obj) => {
//         const terraformString = Object.entries(obj).map(([key, value]) => {
//             const terraformKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
            
//             if (Array.isArray(value)) {
//                 return `${terraformKey} = [${value.map(v => `{${toTerraformString(v)}}`).join(', ')}]`;
//             } else if (typeof value === 'object') {
//                 return `${terraformKey} = {${toTerraformString(value)}}`;
//             } else if (typeof value === 'string') {
//                 return `${terraformKey} = "${value}"`;
//             } else {
//                 return `${terraformKey} = ${value}`;
//             }
//         }).join(', ');
//         return terraformString;
//     };

//     console.log("Environment Variables:", process.env);

//     const ec2InstancesString = ec2Instances.map(instance => `{${toTerraformString(instance)}}`).join(', ');

//     const terraformCommand = `terraform apply -auto-approve \
//     -var="region=${region}" \
//     -var="access_key=${accessKey}" \
//     -var="secret_key=${secretKey}" \
//     -var="vpc_name=${vpcName}" \
//     -var="create_nat_gateway=${createNatGateway}" \
//     -var="instance_count=${instanceCount}" \
//     -var='ec2_instances=[${ec2InstancesString}]'`;

//     const terraformDirectory = path.resolve('/path/to/your/terraform/configuration');

//     // Run terraform init first
//     exec('terraform init', { cwd: terraformDirectory}, (initError, initStdout, initStderr) => {
//         if (initError) {
//             console.error(`Error initializing Terraform: ${initError.message}`);
//             return res.status(500).json({ error: initError.message });
//         }

//         console.log("Terraform init stdout:", initStdout);

//         // Now run terraform apply
//         exec(terraformCommand, { cwd: terraformDirectory}, (applyError, applyStdout, applyStderr) => {
//             if (applyError) {
//                 console.error(`Error executing Terraform: ${applyError.message}`);
//                 return res.status(500).json({ error: applyError.message });
//             }

//             console.log("Terraform apply stdout:", applyStdout);

//             // After apply, capture the outputs
//             exec('terraform output -json', { cwd: terraformDirectory}, (outputError, outputStdout, outputStderr) => {
//                 if (outputError) {
//                     console.error(`Error capturing Terraform outputs: ${outputError.message}`);
//                     return res.status(500).json({ error: outputError.message });
//                 }

//                 console.log("Terraform output:", outputStdout);

//                 // Parse the JSON outputs and send them to the frontend
//                 const terraformOutputs = JSON.parse(outputStdout);
//                 res.status(200).json({ message: 'Terraform applied successfully', outputs: terraformOutputs });
//             });
//         });
//     });
// });

// const PORT = process.env.PORT || 3002;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const path = require('path');

const app = express();

app.use(cors({ origin: 'http://localhost:3000/*', methods: ['GET', 'POST'] }));
app.use(bodyParser.json());

app.post('/run-terraform', (req, res) => {
    const {
        accessKey,
        secretKey,
        region,
        vpcName,
        createNatGateway,
        instanceCount,
        ec2Instances
    } = req.body;

    const toTerraformString = (obj) => {
        const terraformString = Object.entries(obj).map(([key, value]) => {
            const terraformKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
            
            if (Array.isArray(value)) {
                return `${terraformKey} = [${value.map(v => `{${toTerraformString(v)}}`).join(', ')}]`;
            } else if (typeof value === 'object') {
                return `${terraformKey} = {${toTerraformString(value)}}`;
            } else if (typeof value === 'string') {
                return `${terraformKey} = "${value}"`;
            } else {
                return `${terraformKey} = ${value}`;
            }
        }).join(', ');
        return terraformString;
    };

    const ec2InstancesString = ec2Instances.map(instance => `{${toTerraformString(instance)}}`).join(', ');

    const terraformCommand = `terraform apply -auto-approve \
    -var="region=${region}" \
    -var="access_key=${accessKey}" \
    -var="secret_key=${secretKey}" \
    -var="vpc_name=${vpcName}" \
    -var="create_nat_gateway=${createNatGateway}" \
    -var="instance_count=${instanceCount}" \
    -var='ec2_instances=[${ec2InstancesString}]'`;

    const terraformDirectory = path.resolve('/Users/khalandarsharieff/Desktop/UCC 2024/sustainaibility project/New Backend');

    exec('terraform init', { cwd: terraformDirectory }, (initError, initStdout, initStderr) => {
        if (initError) {
            console.error(`Error initializing Terraform: ${initError.message}`);
            return res.status(500).json({ error: initError.message });
        }

        console.log("Terraform init stdout:", initStdout);

        exec(terraformCommand, { cwd: terraformDirectory }, (applyError, applyStdout, applyStderr) => {
            if (applyError) {
                console.error(`Error executing Terraform: ${applyError.message}`);
                return res.status(500).json({ error: applyError.message });
            }

            console.log("Terraform apply stdout:", applyStdout);

            exec('terraform output -json', { cwd: terraformDirectory }, (outputError, outputStdout, outputStderr) => {
                if (outputError) {
                    console.error(`Error capturing Terraform outputs: ${outputError.message}`);
                    return res.status(500).json({ error: outputError.message });
                }

                // Parse the JSON outputs here
                const terraformOutputs = JSON.parse(outputStdout);

                console.log("Terraform Outputs:", terraformOutputs);

                res.status(200).json({
                    message: 'Terraform applied successfully',
                    outputs: {
                        vpcId: terraformOutputs.vpc_id.value,
                        natGatewayId: terraformOutputs.nat_gateway_id.value,
                        ec2Instances: terraformOutputs.custom_instances.value
                    }
                });
            });
        });
    });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
