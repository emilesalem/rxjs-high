const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const proxyquire = require('proxyquire')

chai.use(sinonChai)

global.assert = chai.assert
global.expect = chai.expect
global.sinon = sinon
global.chai = chai
global.proxyquire = proxyquire.noPreserveCache().noCallThru()
