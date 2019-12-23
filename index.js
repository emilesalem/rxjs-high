const { range, timer, merge } = require('rxjs')
const { windowTime, mergeMap, groupBy, reduce, map, delayWhen, tap } = require('rxjs/operators')

function kids () {
  return range(1, 7)
    .pipe(
      mergeMap(x => range(1, 20)
        .pipe(
          map(() => ({ grade: x })),
          delayWhen(() => timer(Math.ceil(5000 * Math.random())))
        )
      ))
}

function bell () {
  return timer(4502).pipe(
    tap(() => console.log('RRRRRRRINNG'))
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

merge(startSchool(), bell()).subscribe(x => console.log(x))
