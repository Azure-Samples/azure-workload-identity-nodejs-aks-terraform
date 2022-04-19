const express = require('express');
const router = express.Router();
const os = require('os');

const { DefaultAzureCredential } = require("@azure/identity");
const { AuthorizationManagementClient } = require("@azure/arm-authorization");

const subscriptionId = process.env["AZURE_SUBSCRIPTION_ID"];
const servicePrincipalObjectId = process.env["AZURE_SERVICE_PRINCIPAL_OBJECT_ID"];

async function getAppRoleAssignments() {

  const credential = new DefaultAzureCredential();
  const client = new AuthorizationManagementClient(credential, subscriptionId);

  return client.roleAssignments.listForScope(`subscriptions/${subscriptionId}`, { filter: `assignedTo('{${servicePrincipalObjectId}}')` });

}

async function getAppInfo(req, res, next) {

  let status = 'OK';
  let roleAssignments = [];

  try {
    const result = await getAppRoleAssignments();
    console.log("The result is:", result);

    roleAssignments = JSON.parse(JSON.stringify(result));
    console.log(roleAssignments);

  } catch (error) {
    status = error;
    console.log("An error occurred:");
    console.error(error);

  }

  const podInfo = [
    {
      name: 'Pod Host',
      value: os.hostname()
    },
    {
      name: 'Pod uptime',
      value: os.uptime() + ' secs'
    },
    {
      name: 'Pod CPU load',
      value: os.loadavg()
    },
    {
      name: 'Pod Total Memory',
      value: (os.totalmem() / (1024 * 1024 * 1024), 2).toFixed(2) + ' GB'
    },
    {
      name: 'Pod Free Memory',
      value: (os.freemem() / (1024 * 1024 * 1024), 2).toFixed(2) + ' GB'
    },
    {
      name: 'Pod CPU Count',
      value: os.cpus().length
    }
  ]

  res.render('index', { title: 'Pod Info', status, podInfo, roleAssignments });

}

/* GET home page. */
router.get('/', getAppInfo);


module.exports = router;
