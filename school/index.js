const { timer, merge, of } = require('rxjs')
const { windowTime, mergeMap, groupBy, reduce } = require('rxjs/operators')

const kids = require('./kids')

function bell () {
  return timer(4501).pipe(
    mergeMap(() => of('RRRRRRRINNG'))
  )
}

function ponctuality () {
  return kids()
    .pipe(
      windowTime(4500)
    )
}

function ranks () {
  return ponctuality()
    .pipe(
      mergeMap($w => $w.pipe(
        groupBy(x => x.grade)
      ))
    )
}

function startSchool () {
  return ranks()
    .pipe(
      mergeMap($g => $g.pipe(
        reduce(acc => {
          ++acc.arrived
          return acc
        }, { grade: $g.key, arrived: 0 })
      ))
    )
}

module.exports = () => merge(startSchool(), bell())
