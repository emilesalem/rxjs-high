module.exports = {
  fetchGradeInfo: new Promise(resolve => setTimeout(() => resolve(Math.floor(2 * Math.random())), () => Math.ceil(5000 * Math.random())))
}
