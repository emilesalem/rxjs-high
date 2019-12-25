const { range, timer } = require('rxjs')
const { mergeMap, map, delayWhen } = require('rxjs/operators')

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

module.exports = kids