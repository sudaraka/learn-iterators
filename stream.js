const
  logContents = require('./data'),

  {
    lines,
    datums,
    stringifyTransition,
    greatestValue,
    pipeline
  } = require('./shared'),

  asStream = function * (iterable) {
    yield * iterable
  },

  userKey = ([ user, _ ]) => user,

  transitionMaker = () => {
    let
      locations = []

    return ([ _, location ]) => {
      locations.push(location)

      if(2 === locations.length) {
        const
          transition = locations

        locations = locations.slice(1)

        return [ transition ]
      }

      return []
    }
  },

  sortedFlatMap = (fMaker, fKey) => function * (values) {
    const
      mappersByKey = new Map()

    for(const val of values) {
      const
        key = fKey(val)

      let
        fMapper

      if(!mappersByKey.has(key)) {
        mappersByKey.set(key, fMaker())
      }

      fMapper = mappersByKey.get(key)

      yield * fMapper(val)
    }
  },

  transitionStream = sortedFlatMap(transitionMaker, userKey),

  mapIterable = function * (f, iterable) {
    for(const val of iterable) {
      yield f(val)
    }
  },

  leftPartialApply = (f, ...values) => f.bind(null, ...values),

  datumizeStream = leftPartialApply(mapIterable, datums),

  stringifyStream = leftPartialApply(mapIterable, stringifyTransition),

  countTransitionStream = keys => {
    const
      counts = new Map()

    for(const key of keys) {
      if(counts.has(key)) {
        counts.set(key, 1 + counts.get(key))
      }
      else {
        counts.set(key, 1)
      }
    }

    return counts
  },

  streamLines = asStream(lines(logContents)),

  // theStreamSolution = content =>
  //   greatestValue(
  //     countTransitionStream(
  //       stringifyStream(
  //         transitionStream(
  //           datumizeStream(
  //             streamLines
  //           )
  //         )
  //       )
  //     )
  //   )

  theStreamSolution = pipeline(
    datumizeStream,
    transitionStream,
    stringifyStream,
    countTransitionStream,
    greatestValue
  )

// Result
console.log(theStreamSolution(streamLines))
