require('dotenv').config({ path: '/app/.env' });
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const {
  host, midHost, clientId, developerIdToken, userProfileSystemApiKey,
} = process.env;
const rpcUrl = `http://${host}/jsonrpc/v1`;
const midUrl = `http://${midHost}`;
const baseUrl = `http://${host}/${clientId}`;
const edgeImageUrl = `http://${host}/mcm/v1/images`;
const edgeContainerUrl = `http://${host}/mcm/v1/containers`;
const tarImage = 'microservice-v1-1.0.3.tar';

let edgeIdToken = null;
let edgeToken = null;

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${edgeToken}`,
  },
});

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
  formData.append('image', fs.createReadStream(`./deploy/${tarImage}`));

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
      return null;
    }
    return result.data;
  } catch (error) {
    return null;
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
        API_KEY: userProfileSystemApiKey,
      },
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

(async function () {
  let result = await getEdgeIdToken();
  if (result && result.result && result.result.id_token) {
    edgeIdToken = result.result.id_token;
    result = await getEdgeAccessToken();
    if (result && result.access_token) {
      edgeToken = result.access_token;
      result = await associateTokenWithDevice();
      console.log(result);
    }
  }
}());
