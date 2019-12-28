const { Observable } = require('rxjs')
const { toArray } = require('rxjs/operators')

describe('rxjs high', () => {
  let school, kids, director

  beforeEach(() => {
    director = {
      grantPermission: sinon.stub().resolves(1)
    }
    school = proxyquire('school', {
      './director': director,
      './kids': () => kids
    })
  })

  describe('test case 1', () => {
    /**
     * 3 grades: grade 1: 3 ponctuals, grade 2: 1 late 2 ponctuals, grade 3: 3 lates
     */
    beforeEach(() => {
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
        }, 130)
      })
    })
    it('should call director', done => {
      school(120).pipe(
        toArray()
      ).subscribe(x => {
        expect(director.grantPermission).callCount(4)
        done()
      })
    })
    it('should output grouped arrivals', done => {
      const expected = [
        { grade: 1, arrived: 3 },
        { grade: 2, arrived: 2 },
        'RRRRRRRINNG',
        { grade: 2, arrived: 1 },
        { grade: 3, arrived: 3 }
      ]
      school(120).pipe(
        toArray()
      ).subscribe(actual => {
        expect(actual).to.eql(expected)
        done()
      })
    })
  })
})

function grader (g) {
  return {
    grade: g
  }
}
