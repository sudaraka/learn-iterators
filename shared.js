const
  lines = str => str.split('\n'),

  datums = str => str.split(', '),

  stringifyTransition = transition => transition.join(' -> '),

  greatestValue = inMap => Array.from(inMap.entries()).reduce(
    ([ grateTransitions, grateCount ], [ key, count ]) => {
      if(count === grateCount) {
        grateTransitions.add(key)
      }
      else if(count > grateCount) {
        return [ new Set([ key ]), count ]
      }

      return [ grateTransitions, grateCount ]
    },
    [ new Set(), 0 ]
  ),

  pipeline = (...fs) => fs.reduceRight((a, b) => c => a(b(c)))

module.exports = {
  lines,
  datums,
  stringifyTransition,
  greatestValue,
  pipeline
}
