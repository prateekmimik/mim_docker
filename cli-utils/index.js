const envAbsPath = '/app/.env';
require('dotenv').config({ path: envAbsPath });
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const {
  host, midHost, clientId, developerIdToken, userProfileSystemApiKey,
} = process.env;
const rpcUrl = `http://${host}/jsonrpc/v1`;
const midUrl = `https://${midHost}`;
const edgeImageUrl = `http://${host}/mcm/v1/images`;
const edgeContainerUrl = `http://${host}/mcm/v1/containers`;
const deployAbsPath = '/app/deploy/';
const tarImage = 'microservice-v1-1.0.3.tar';

let edgeIdToken = null;
let edgeToken = null;

const updateEnv = (key, newValue) => {
  let envContent = fs.readFileSync(envAbsPath, 'utf8').split('\n');
  let updated = false;

  envContent = envContent.map(line => {
    if (line.startsWith(`${key}=`)) {
      updated = true;
      return `${key}=${newValue}`;
    }
    return line;
  });
  
  if (!updated) {
    envContent.push(`${key}=${newValue}`);
  }

  fs.writeFileSync(envAbsPath, envContent.join('\n'), 'utf8');
};

const authHeader = {
  headers: {
    Authorization: `Bearer ${process.env.edgeToken}`,
  },
};

const getEdgeIdToken = async () => {
  const requestConfig = {
    method: 'POST',
    url: rpcUrl,
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      jsonrpc: '2.0',
      method: 'getEdgeIdToken',
      params: [],
      id: 1,
    },
  };

  try {
    const result = await axios(requestConfig);
    if (!result || !result.data) {
      return null;
    }
    return result.data;
  } catch (error) {
    return null;
  }
};

const getEdgeAccessToken = async () => {
  const requestConfig = {
    method: 'POST',
    url: midUrl,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: {
      client_id: clientId,
      grant_type: 'id_token_signin',
      id_token: developerIdToken,
      scope: 'openid edge:mcm edge:clusters edge:account:associate',
      edge_id_token: edgeIdToken,
    },
  };

  try {
    const result = await axios(requestConfig);
    if (!result || !result.data) {
      return null;
    }
    return result.data;
  } catch (error) {
    console.log('Error getting edge access token:', JSON.stringify(error));
    return null;
  }
};

const associateTokenWithDevice = async () => {
  const requestConfig = {
    method: 'POST',
    url: rpcUrl,
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      jsonrpc: '2.0',
      method: 'associateAccount',
      params: [edgeToken],
      id: 1,
    },
  };

  try {
    const result = await axios(requestConfig);
    if (!result || !result.data) {
      return null;
    }
    return result.data;
  } catch (error) {
    return null;
  }
};

const deployImage = async () => {
  const formData = new FormData();
  formData.append('image', fs.createReadStream(`${deployAbsPath}${tarImage}`));

  const requestConfig = {
    method: 'POST',
    url: edgeImageUrl,
    headers: {
      ...formData.getHeaders(),
      ...authHeader.headers,
    },
    data: formData,
  };

  try {
    const result = await axios(requestConfig);
    if (!result || !result.data) {
      console.log('Error deploying image');
    } else {
      console.log('Image deployed successfully');
      console.log(result.data);
    }
  } catch (error) {
    console.log('Error deploying image');
    console.log(error.response);
  }
};

const startContainer = async () => {
  const requestConfig = {
    method: 'POST',
    url: edgeContainerUrl,
    headers: {
      'Content-Type': 'application/json',
      ...authHeader.headers,
    },
    data: {
      name: 'microservice-v1',
      image: 'microservice-v1',
      env: {
        'MCM.BASE_API_PATH': '/microservice/v1',
        'API_KEY': userProfileSystemApiKey,
        'MCM.API_ALIAS': 'true',
        'MCM.WEBSOCKET_SUPPORT': 'true',
        'MCM.DB_ENCRYPTION_SUPPORT': 'true'
      },
    },
  };

  try {
    const result = await axios(requestConfig);
    if (!result || !result.data) {
      console.log('Error starting container');
    } else {
      console.log('Container started successfully');
      console.log(result.data);
    }
  } catch (error) {
    console.log('Error starting container');
    console.log(error.response);
  }
};

(async function () {
  const args = process.argv.slice(2);
  if (args.length > 0 && args[0] === 'deploy') {
    await deployImage();
    await startContainer();
  } else {
    let result = await getEdgeIdToken();
    if (result && result.result && result.result.id_token) {
      edgeIdToken = result.result.id_token;
      updateEnv('edgeIdToken', edgeIdToken);
      result = await getEdgeAccessToken();
      if (result && result.access_token) {
        edgeToken = result.access_token;
        updateEnv('edgeToken', edgeToken);
        result = await associateTokenWithDevice();
        console.log(result);
      }
    }
  }
}());