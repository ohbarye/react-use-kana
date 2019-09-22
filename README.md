# React Use Kana

A tiny React hook to build a better Japanese form. With this library, you can implement a feature to automatically fill in kana in your form.

![basic](https://user-images.githubusercontent.com/1811616/52522034-6d916200-2cc3-11e9-873f-99ac38a58de6.gif)

## Usage

### Installation

```shell
npm install react-use-kana
# or
yarn add react-use-kana
```

### Example

Let's see the following simple example.

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { useKana } from 'react-use-kana';

const App = () => {
  const {
    kana: { lastNameKana },
    setKanaSource,
  } = useKana(['lastNameKana']);

  return (
    <form>
      <div>
        <span>Japanese Traditional Form</span>
      </div>
      <div>
        <div>
          <span>Name</span>
        </div>
        <input
          type="text"
          onChange={e =>
            setKanaSource({
              fieldName: 'lastNameKana',
              inputtedValue: e.target.value,
            })
          }
        />
      </div>
      <div>
        <div>
          <span>Name Kana</span>
        </div>
        <input type="text" value={lastNameKana} />
      </div>
    </form>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
```

`react-use-kana` doesn't provide features to handle your form's behavior (e.g. to set value to a component's state, to check if a field has been touched or not) because it's supposed to be agnostic about form library.

📝 You can check more authentic example code in https://github.com/ohbarye/react-use-kana/tree/master/example.

## Feature

This library uses:

- [React Hooks](https://reactjs.org/docs/hooks-intro.html)
- [historykana](https://github.com/terrierscript/historykana) (Many thanks to @terrierscript)

## Requirement

- `react >= 16.8`
