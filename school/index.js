const { timer, merge, of, ReplaySubject, Subject } = require('rxjs')
const { windowTime, mergeMap, groupBy, map, reduce, multicast } = require('rxjs/operators')

const kids = require('./kids')
const director = require('./director')

function bell (x) {
  return timer(x + 1).pipe(map(() => 'RRRRRRRINNG'))
}

function ponctuality (x) {
  return kids().pipe(windowTime(x))
}

function fileRanks (x) {
  return ponctuality(x)
    .pipe(
      mergeMap($w => $w.pipe(
        groupBy(x => x.grade)
      ))
    )
}

async function tellKidsToWaitWhileTeacherAsksForPermission ($g) {
  const $r = new ReplaySubject(100)

  const $s = new Subject()

  const multi = $g.pipe(multicast(() => new Subject()))

  multi.subscribe($r)

  multi.subscribe($s)

  multi.connect()

  const r = await director.grantPermission($g.key)

  $r.complete()

  const $t = merge($r, $s)

  $t.key = $g.key

  return [$t, r]
}

function letGradeIn ($g) {
  return $g.pipe(
    reduce(acc => {
      ++acc.arrived

      return acc
    }, { grade: $g.key, arrived: 0 })
  )
}

function gradeRefused ($g) {
  return of(`grade ${$g.key} was refused permission`)
}

function startSchool (x) {
  return fileRanks(x)
    .pipe(
      mergeMap(tellKidsToWaitWhileTeacherAsksForPermission),
      mergeMap(([$g, ok]) => ok ? letGradeIn($g) : gradeRefused($g)
      ))
}

module.exports = x => merge(startSchool(x), bell(x))
