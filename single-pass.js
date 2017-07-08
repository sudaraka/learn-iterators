const
  logContents = require('./data'),

  {
    lines,
    datums,
    stringifyTransition
  } = require('./shared'),

  theSinglePassSolution = content => {
    const
      logLines = lines(content),
      locationByUser = new Map(),
      transitionsToCounts = new Map()

    let
      wasKeys = new Set(),
      wasCount = 0

    for(const line  of logLines) {
      const
        [ user, location ] = datums(line)

      if(locationByUser.has(user)) {
        const
          locations = locationByUser.get(user)

        let
          count

        locations.push(location)

        const
          transitionKey = stringifyTransition(locations)

        locationByUser.set(user, locations.slice(1))

        if(transitionsToCounts.has(transitionKey)) {
          count = 1 + transitionsToCounts.get(transitionKey)
        }
        else {
          count = 1
        }

        transitionsToCounts.set(transitionKey, count)

        if(count > wasCount) {
          wasKeys = new Set([ transitionKey ])
          wasCount = count
        }
        else if(count === wasCount) {
          wasKeys.add(transitionKey)
        }
      }
      else {
        locationByUser.set(user, [ location ])
      }
    }

    return [ wasKeys, wasCount ]
  }

// Result
console.log(theSinglePassSolution(logContents))
