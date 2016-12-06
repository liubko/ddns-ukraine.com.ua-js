const axios = require('axios');
const config = require('./config.json');

const getCurrentIP = () =>
  new Promise((resolve, reject) => {
    axios.get('http://ipecho.net/plain')
      .then(response => {
        console.log('Current IP is ', response.data);
        resolve(response.data)
      })
      .catch(error => {
        console.log('[error in getCurrentIP] ', error);
        reject(error)
      });
  })

const getCurrentDomainConfig = () =>
  new Promise((resolve, reject) => {
    axios
      .post(config.admURL, {
        auth_login: config.authLogin,
        auth_token: config.authToken,
        class: 'dns_record',
        method: 'info',
        domain: config.domain
      })
      .then(response => {
        if (response.data.status === 'error') {
          reject(response.data)
        }
        resolve(response.data)
      })
      .catch(error => {
        console.log('[error in getCurrentDomainConfig] ', error);
        reject(error)
      });
  })

const updateDomainConfig = (ip, records) =>
  new Promise((resolve, reject) => {
    const stack = records.map(record => ({
      id: record.id,
      data: ip,
    }));
    axios
      .post(config.admURL, {
        auth_login: config.authLogin,
        auth_token: config.authToken,
        class: 'dns_record',
        method: 'edit',
        domain: config.domain,
        stack: stack
      })
      .then(response => {
        if (response.data.status === 'error') {
          reject(response.data)
        }
        resolve(response.data)
      })
      .catch(error => {
        console.log('[error in getCurrentDomainConfig] ', error);
        reject(error)
      });
  });

const getListOfRecordsToUpdate = (ip, domainConfig) => {
  const res = [];
  for (var recordId in domainConfig) {
    if (domainConfig.hasOwnProperty(recordId)) {
        var record = domainConfig[recordId];

        // check if `record` and `type` are the same as in config.records
        var isValid = config.records.some(r =>
          r.record === record.record && r.type === record.type
        );

        // check if IP is different from current
        if (isValid && record.data !== ip) {
          res.push(record);
        }
    }
  }
  return res;
}

Promise
  .all([
    getCurrentIP(),
    getCurrentDomainConfig()
  ])
  .then(response => {
    const ip = response[0];
    const domainConfig = response[1].data;

    const recordsToUpdate = getListOfRecordsToUpdate(ip, domainConfig);

    if (recordsToUpdate.length) {
      console.log('Going to update IP for this records: \n');
      console.log(recordsToUpdate);
      return updateDomainConfig(ip, recordsToUpdate);
    } else {
      console.log("Nothing to update");
      return;
    }
  })
  .catch(err => {
    console.log('err', err);
  });
