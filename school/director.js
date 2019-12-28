module.exports = {
  grantPermission: () =>
    new Promise(resolve => setTimeout(() => resolve((Math.random() < 0.8)), () => Math.ceil(5000 * Math.random())))
}
