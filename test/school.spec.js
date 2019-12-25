const { Observable } = require('rxjs')

describe('rxjs high', () => {
  let school, kids, asyncApiStub, clock

  beforeEach(() => {
    asyncApiStub = {
      fetchGradeInfo: sinon.stub()
    }
    school = proxyquire('school', {
      './async-api': asyncApiStub,
      './kids': () => kids
    })
    clock = sinon.useFakeTimers()
  })

  afterEach(() => {
    clock.restore()
  })

  describe('test case 1', () => {
    /**
     * 3 grades: grade 1 no lates, 3 ponctuals, grade 2: 1 late 2 ponctuals, grade 3: 2 lates, 1 ponctual
     */
    let test
    beforeEach(() => {
      test = sinon.spy()

      kids = new Observable(o => {
        setTimeout(() => {
          o.next(grader(1))
          o.next(grader(1))
          o.next(grader(1))
          o.next(grader(2))
          o.next(grader(2))
        }, 100)

        setTimeout(() => {
          o.next(grader(2))
          o.next(grader(3))
          o.next(grader(3))
          o.next(grader(3))
          o.complete()
        }, 4600)
      })
    })

    it('should output ponctuals', () => {
      school().subscribe(test)
      clock.tick(4500)
      expect(test).calledTwice
      expect(test).calledWith({ grade: 1, arrived: 3 })
      expect(test).calledWith({ grade: 2, arrived: 2 })
    })
    it('should output bell', () => {
      school().subscribe(test)
      clock.tick(4501)
      expect(test).calledWith('RRRRRRRINNG')
    })
    it('should output smoochers', () => {
      school().subscribe(test)
      clock.tick(4700)
      expect(test).calledWith({ grade: 2, arrived: 1 })
      expect(test).calledWith({ grade: 3, arrived: 3 })
    })
    it('should call async api', () => {
      school().subscribe(test)
      clock.tick(4500)
      expect(asyncApiStub.fetchGradeInfo).calledTwice()
      expect(test).calledWith({ grade: 1, arrived: 3 })
      expect(test).calledWith({ grade: 2, arrived: 2 })
    })
  })
})

function grader (g) {
  return {
    grade: g
  }
}
