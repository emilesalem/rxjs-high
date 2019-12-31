const { timer, merge, of, ReplaySubject, Subject } = require('rxjs')
const { windowTime, mergeMap, groupBy, map, reduce, multicast } = require('rxjs/operators')

const director = require('./director')

function bell (x) {
  return timer(x + 1).pipe(map(() => 'RRRRRRRINNG'))
}

function ponctuality (kids, x) {
  return kids.pipe(
    windowTime(x)
  )
}

function fileRanks (kids, x) {
  return ponctuality(kids, x)
    .pipe(
      mergeMap($w => $w.pipe(
        groupBy(x => x.grade)
      ))
    )
}

async function tellKidsToWaitWhileIAskForPermission ($g) {
  // $r captures elements coming in while waiting for director
  const $r = new ReplaySubject()

  // $m measures the captured elements
  const $m = new ReplaySubject()

  const multi = $g.pipe(multicast(() => new Subject()))

  const replaySubscription = multi.subscribe($r)

  const metricsReplaySubscription = multi.subscribe(x => {
    $m.next(x)
    process.send({
      label: 'stored_in_replay',
      type: 'inc'
    })
  })

  multi.connect()

  const r = await director.grantPermission($g.key)

  $m.subscribe(() => process.send({
    label: 'stored_in_replay',
    type: 'dec'
  }))

  $r.complete()

  replaySubscription.unsubscribe()

  metricsReplaySubscription.unsubscribe()

  const $t = merge($r, $g)

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

function startSchool (kids, x) {
  return fileRanks(kids, x)
    .pipe(
      mergeMap(tellKidsToWaitWhileIAskForPermission),
      mergeMap(([$g, ok]) => ok ? letGradeIn($g) : gradeRefused($g))
    )
}

module.exports = (kids, x) => merge(
  startSchool(kids, x),
  bell(x)
)
