const
  logContents = require('./data'),

  {
    lines,
    datums,
    stringifyTransition,
    greatestValue,
    pipeline
  } = require('./shared'),

  datumize = arr => arr.map(datums),

  listize = arr => arr.reduce(
    (map, [ user, location]) => {
      if(map.has(user)) {
        map
          .get(user)
          .push(location)
      }
      else {
        map.set(user, [ location ])
      }

      return map
    },
    new Map()
  ),

  sliceOf = (sliceSize, arr) => Array(arr.length - sliceSize + 1)
    .fill()
    .map((_, i) => arr.slice(i, i + sliceSize)),

  transitions = list => sliceOf(2, list),

  mapValues = (f, inMap) => Array.from(inMap.entries()).reduce(
    (outMap, [ key, value ]) => {
      outMap.set(key, f(value))

      return outMap
    },
    new Map()
  ),

  transitionize = mapValues.bind(null, transitions),

  countTransitions = arr => arr.reduce(
    (counts, key) => {
      if(counts.has(key)) {
        counts.set(key, 1 + counts.get(key))
      }
      else {
        counts.set(key, 1)
      }

      return counts
    },
    new Map()
  ),

  stringifyAllTransitions = arr => arr.map(stringifyTransition),

  reduceValues = (f, inMap) => Array.from(inMap.entries())
    .map(([ _, value ]) => value)
    .reduce(f),

  concatValues = reduceValues.bind(null, (a, b) => a.concat(b)),

  // logLines = lines(logContents),
  // data = datumize(logLines),
  // locationByUser = listize(data),
  // transitionsByUser = transitionize(locationByUser),
  // allTransitions = concatValues(transitionsByUser),
  // stringTransitions = stringifyAllTransitions(allTransitions),
  // counts = countTransitions(stringTransitions),
  // commonTransitions = greatestValue(counts)

  // theStagedSolution = content =>
  //   greatestValue(
  //     countTransitions(
  //       stringifyAllTransitions(
  //         concatValues(
  //           transitionize(
  //             listize(
  //               datumize(
  //                 lines(
  //                   content
  //                 )
  //               )
  //             )
  //           )
  //         )
  //       )
  //     )
  //   )

  theStagedSolution = pipeline(
    lines,
    datumize,
    listize,
    transitionize,
    concatValues,
    stringifyAllTransitions,
    countTransitions,
    greatestValue
  )

// Result
// console.log(commonTransitions)
console.log(theStagedSolution(logContents))
