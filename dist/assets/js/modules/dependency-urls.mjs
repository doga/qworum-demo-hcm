const
locationUrl      = new URL(`${location}`),
isRunningLocally = ['127.0.0.1', 'localhost'].includes(locationUrl.hostname),
authServiceUrl   = isRunningLocally ?
  new URL('http://127.0.0.1:5500/v1/') :
  new URL('https://auth.demo.qworum.net/v1/');

export {authServiceUrl};