
const https = require('https');

class DeploySearchPagePlugin {
  constructor(options = {}){
    this.options = options;
    this.hostname = 'platform.cloud.coveo.com';
    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.options.token}`
    }
  }
  apply(compiler) {
    compiler.hooks.done.tapPromise('DeploySearchPagePlugin', (stats) => {
      let promises = [
        // Update Search page
        this.updateSearchPage(),
          // .then(() => console.log(`The search page [${this.options.name}] was successfully updated into Coveo Cloud Platform.`))
          // .catch((error) => console.log(error)),

        this.updateResources('css'),
          // .then(() => console.log(`All CSS resources were successfully updated into Search Page [${this.options.name}].`))
          // .catch((error) => console.log(error)),

        this.updateResources('javascript')
          // .then(body => console.log(`All Javascripts resources were successfully updated into Search Page [${this.options.name}].`))
          // .catch(error => console.log(error))
      ];
      
      return Promise.all(promises)
        .then(() => { console.log(`The search page [${this.options.name}] was successfully updated into Coveo Cloud Platform.`)})
        .catch(error => console.log(error))
      
    });

    compiler.hooks.assetEmitted.tap('DeploySearchPagePlugin', (file, content) => {
      if(this.options.javascript){
        const foundScript = this.options.javascript.find(script => file.indexOf(script.name)>=0);
        if(foundScript){
          foundScript.url = '';
          foundScript.inlineContent = content.toString('utf8');
        }
      }
      if(this.options.css){
        const foundCss = this.options.css.find(css => file.indexOf(css.name)>=0);
        if(foundCss){
          foundCss.url = '';
          foundCss.inlineContent = content.toString('utf8');
        }
      }
    })
  }

  checkResources() {
    const params = {
      hostname: this.hostname,
      method: 'GET',
      path: `/rest/organizations/${this.options.orgId}/pages/${this.options.id}/header`,
      headers: this.headers
    }
    delete params.headers['Content-Length'];
    return httpRequest(params);
  }

  updateResources(resourceType) {
    let promiseUpdateResources = [];
    this.checkResources()
      .then((hostedResources) => {
        // console.log(`hosted resources:${hostedResources}`);
        this.options[resourceType].forEach(resource => {
          // console.log(`processing resource:${resource}`);
          if (hostedResources[resourceType] && hostedResources[resourceType].length) {
            const found = hostedResources[resourceType].find(r => resource.name === r.name);
            // console.log(`found:${found}!`);
            promiseUpdateResources.push(this.updateResource(resourceType, resource, found ? 'PUT': 'POST'))
          } else {
            promiseUpdateResources.push(this.updateResource(resourceType, resource, 'POST'))
          }
        })
      })
      .catch(error => console.log('Cannot get the JSON definition of search page header hosted'))
    
    return Promise.all(promiseUpdateResources);
  }
  updateResource(resourceType, assetOptions, method='PUT') {
    const { name, url, inlineContent } = assetOptions;
    const params = {
      hostname: this.hostname,
      method: method,
      path: `/rest/organizations/${this.options.orgId}/pages/${this.options.id}/header/${resourceType}`,
      headers: this.headers
    }
    params.path = method === 'PUT' ? `${params.path}/${name}` :  params.path;
    const data = JSON.stringify({ name, url, inlineContent });
    params.headers['Content-Length'] = data.length;
    // console.log(data);
    return httpRequest(params, data)
  }
  updateSearchPage() {
    const params = {
      hostname: this.hostname,
      method: 'PUT',
      path: `/rest/organizations/${this.options.orgId}/pages/${this.options.id}`,
      headers: this.headers
    }
    const { name, title, html } = this.options;
    const data = JSON.stringify({ name, title, html });
    params.headers['Content-Length'] = data.length;
    
    //console.log(data);
    return httpRequest(params, data)
  }
}

function httpRequest(params, postData){
  return new Promise((resolve, reject) => {
    const req = https.request(params, res => {
      // console.log(`statusCode: ${res.statusCode}`)
      // reject on bad status
      if (res.statusCode < 200 || res.statusCode >= 300) {
        reject(new Error('statusCode=' + res.statusCode + ' | statusMsg=' + res.statusMessage + ' | params=' + JSON.stringify(params)));
      }
      // cumulate data
      var body = [];
      res.on('data', (chunk) => { body.push(chunk); });
      // resolve on end
      res.on('end', () => {
        try {
          if(body && body.length){
            body = JSON.parse(Buffer.concat(body).toString());
          }
        } catch(e) {
          reject(e);
        }
        resolve(body);
      });
    })
    req.on('error', error => { reject(error); });
    if (postData) {
      //console.log(postData);
      req.write(postData);
    }
    req.end()
  });
}

module.exports = DeploySearchPagePlugin;
module.exports.httpRequest = httpRequest;