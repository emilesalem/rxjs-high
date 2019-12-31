const { range, timer } = require('rxjs')
const { mergeMap, concatMap, map, delayWhen, windowCount } = require('rxjs/operators')

range(1, 7)
  .pipe(
    mergeMap(x => range(1, 100000000)
      .pipe(
        windowCount(300000),
        concatMap($x => $x.pipe(
          map(() => ({ grade: x })),
          delayWhen(() => timer(Math.ceil(5000 * Math.random())))
        ))
      )
    ))
  .subscribe(x => process.send(x))
