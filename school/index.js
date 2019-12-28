const { timer, merge, of, ReplaySubject } = require('rxjs')
const { windowTime, mergeMap, groupBy, map, reduce } = require('rxjs/operators')

const kids = require('./kids')
const director = require('./director')

function bell (x) {
  return timer(x + 1).pipe(map(() => 'RRRRRRRINNG'))
}

function ponctuality (x) {
  return kids().pipe(windowTime(x))
}

function ranks (x) {
  return ponctuality(x)
    .pipe(
      mergeMap($w => $w.pipe(
        groupBy(x => x.grade)
      ))
    )
}

function startSchool (x) {
  return ranks(x)
    .pipe(
      mergeMap(async $g => {
        const $s = new ReplaySubject(100)

        $s.key = $g.key

        $g.subscribe($s)

        const r = await director.grantPermission($g.key)

        return [$s, r]
      }),
      mergeMap(([$g, r]) =>
        r ? $g.pipe(
          reduce(acc => {
            ++acc.arrived

            return acc
          }, { grade: $g.key, arrived: 0 })
        )
          : of(`grade ${$g.key} was refused permission`)
      ))
}

module.exports = x => merge(startSchool(x), bell(x))
