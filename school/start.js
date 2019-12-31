const { Observable } = require('rxjs')

const school = require('.')

function kids () {
  return new Observable(o => process.on('message', x => o.next(x)))
}

school(kids(), 4500).subscribe(x => console.log(x))
