# React Use Kana [![npm version](https://badge.fury.io/js/react-use-kana.svg)](https://badge.fury.io/js/react-use-kana) [![CircleCI](https://circleci.com/gh/ohbarye/react-use-kana/tree/master.svg?style=svg)](https://circleci.com/gh/ohbarye/react-use-kana/tree/master)

A tiny React hook to build a better Japanese form. With this library, you can implement a feature to automatically fill in kana in your form.

![basic](https://user-images.githubusercontent.com/1811616/52522034-6d916200-2cc3-11e9-873f-99ac38a58de6.gif)

## Usage

### Installation

```shell
npm install react-use-kana
# or
yarn add react-use-kana
```

### API

#### `useKana`

This is the only one hook that `react-use-kana` provides.

- `kana: string`
  - A hiragana string that derived from inputs. You set this value to a text input for a kana field.
- `setKanaSource: (value: string) => void`
  - A function to let `useKana` hook know a new input value so that it can derive `kana`. In general, you call this function as `onClick` callback of a text input for a name field which probably has kanjis or non-hiragana characters.

### Example

Let's see the following simple example.

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { useKana } from 'react-use-kana';

const App = () => {
  const { kana, setKanaSource } = useKana();

  return (
    <form>
      <div>
        <span>Japanese Traditional Form</span>
      </div>
      <div>
        <div>
          <span>Name</span>
        </div>
        <input type="text" onChange={e => setKanaSource(e.target.value)} />
      </div>
      <div>
        <div>
          <span>Name Kana</span>
        </div>
        <input type="text" value={kana} />
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

## Requirement

- `react >= 16.8`
