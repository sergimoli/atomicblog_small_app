import { Children, useState } from "react";

function SlowComponent() {
  // If this is too slow on your maching, reduce the `length`
  const words = Array.from({ length: 100_000 }, () => "WORD");
  return (
    <ul>
      {words.map((word, i) => (
        <li key={i}>
          {i}: {word}
        </li>
      ))}
    </ul>
  );
}

//now works completly different!
// now when you click is instant. why? the slowcomponent is NOT rendered because it is passed as children prop. It means that SlowCompoenet was already created before the Counter compoent re-rendered and it does not affect the counter state. REact is smart!!!!
export default function Test() {
  return (
    <div>
      <h1>Slow counter?!?</h1>
      <Counter>
        <SlowComponent />
      </Counter>
    </div>
  );

  function Counter({ children }) {
    const [count, setCount] = useState(0);
    return (
      <div>
        <h1>Slow counter?!?</h1>
        <button onClick={() => setCount((c) => c + 1)}>
          Increase: {count}
        </button>
        {children}
      </div>
    );
  }

  //  check it! from App is called Test function.
  //  every time the state is changed (setCount) this function is rendered. (and also the SlowComponet). In this case it tooks a lot of time because it generates 100000 words... to solve it look at the function above... USE CHILDREN PROP!
  // The same happens in the PostProvider. it passes children... look at that...

  function TestBeforeImprovement() {
    const [count, setCount] = useState(0);
    return (
      <div>
        <h1>Slow counter?!?</h1>
        <button onClick={() => setCount((c) => c + 1)}>
          Increase: {count}
        </button>
        <SlowComponent />
      </div>
    );
  }
}
