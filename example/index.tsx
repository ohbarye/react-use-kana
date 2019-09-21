import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useKana } from 'react-use-kana';

const App = () => {
  const { kana, setKanaSource } = useKana(['first_name', 'last_name']);
  return (
    <form>
      <div>
        <span>Japanese Traditional Form</span>
      </div>
      <div>
        <div>
          <span>Name</span>
        </div>
        <NameField fieldName="last_name" setKanaSource={setKanaSource} />
        <NameField fieldName="first_name" setKanaSource={setKanaSource} />
      </div>
      <div>
        <div>
          <span>Name Kana</span>
        </div>
        <NameKanaField fieldName="last_name_kana" kana={kana['last_name']} />
        <NameKanaField fieldName="first_name_kana" kana={kana['first_name']} />
      </div>
    </form>
  );
};

const NameField = ({
  fieldName,
  setKanaSource,
}: {
  fieldName: string;
  setKanaSource: (arg: { fieldName: string; inputtedValue: string }) => void;
}) => {
  const [value, setValue] = React.useState('');

  return (
    <input
      type="text"
      value={value}
      onChange={e => {
        setValue(e.target.value);
        setKanaSource({ fieldName, inputtedValue: e.target.value });
      }}
      placeholder={fieldName}
    />
  );
};

const NameKanaField = ({
  fieldName,
  kana,
}: {
  fieldName: string;
  kana: string;
}) => {
  const [value, setValue] = React.useState('');
  const [touched, setTouched] = React.useState(false);

  return (
    <input
      type="text"
      value={touched ? value : kana}
      placeholder={fieldName}
      onChange={e => {
        setTouched(true);
        setValue(e.target.value);
      }}
    />
  );
};
ReactDOM.render(<App />, document.getElementById('root'));

// for Parcel HMR
if (module.hot) {
  module.hot.accept();
}
