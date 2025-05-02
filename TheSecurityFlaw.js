const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const { error } = require('console');

const app = express();
const port = 50001;

app.use(express.static('public'));
app.use(cors());

app.get('/meow', (req, res) => {
    const command = req.query.command;
    const target = req.query.target;
    const host = req.query.host;
    const service = req.query.service;
    switch(command){
        case "start-vm":
        exec(`ansible-playbook ansible/start-vm-playbook.yml --extra-vars "target=${target} host=${host}"`);
        break;
        case "stop-vm":
        exec(`ansible-playbook ansible/stop-vm-playbook.yml --extra-vars "target=${target} host=${host}"`);
        break;
        case "create-docker-challenge":
        exec(`ansible-playbook ansible/run-docker-image-playbook.yml -i ansible/inventory.yml --extra-vars "target_host=${req.query.target_host} docker_name=${req.query.docker_name} flag=${req.query.flag}"`
, (error, stdout, stderr) => {

  console.log(`Stdout: ${stdout}`);
    });
        break;
        case "add-volunteer-vm":
        exec(`echo "    ${req.query.hostname}:\n      ansible_host: ${req.query.address}\n      ansible_port: ${req.query.port}\n      ansible_user: ${req.query.user}\n      ansible_ssh_private_key_file: ansible/keys/id_rsa" >> ansible/inventory.yml `);
        break;
    }
    console.log(`${req.query.command}, ${req.query.hostname}, ${req.query.address}, ${req.query.port}, ${req.query.user}`);
}

);

app.listen(port);