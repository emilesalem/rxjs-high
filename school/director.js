module.exports = {
  grantPermission: () =>
    new Promise(resolve => setTimeout(() => resolve((Math.random() < 0.8)), 10000)),
  immediateGrant: () => new Promise(resolve => setImmediate(resolve(1)))
}
