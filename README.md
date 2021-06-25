# react-use-shared-state

communication, sharing state between components. a replacement of ReactContext.

## installation

```console
yarn add react-use-shared-state

npm i react-use-shared-state
```

## usage

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

## example

```console
cd example && yarn dev
```
