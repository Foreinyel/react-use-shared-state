# react-use-shared-state

communication, sharing state between components. a replacement of ReactContext.

## installation

```console
yarn add react-use-shared-state

npm i react-use-shared-state
```

## usage

### duplex communication with `useSharedState`

```javascript
import useSharedState from 'react-use-shared-state';

// Component A
const ComponentA = () => {
  const [count, setCount] = useSharedState('clickedTimes', 0); // create a global state with state name and default value
  ///...

  return (
    <div onClick={() => setCount(count + 1)}>
      I am ComponentA: {count}
    </div>
  )
}

// Component B
const ComponentB = () => {
  const [count, setCount] = useSharedState('clickedTimes'); // get state with state name
  ///...

  return (
    <div onClick={() => setCount(count + 1)}>
      I am ComponentB: {count}
    </div>
  )
}
```

### simplex communication with `usePubState`

Sometimes you want to publish data changes to other component but you don't rely on the value and the current component shouldn't refresh when the other components update the state. Now you can use `usePubState` to only publish changes to other components, without subscribing data changes from the global state.

```javascript
import { usePubState } from 'react-use-shared-state';

const [setData] = usePubState('stateKey');
setData(1); // only publish, no self state

```

### getSharedState

In some function which is not in Component context, you can't, or don't want to use `useSharedState`. But you need to access the global state, you can use `getSharedState`.

```javascript
import { getSharedState } from 'react-use-shared-state';

const data = getSharedState('stateKey')

```


## example

```console
cd example && yarn dev
```
