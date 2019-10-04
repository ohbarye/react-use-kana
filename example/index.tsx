import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useKana } from 'react-use-kana';

const App = () => {
  const {
    kana: lastNameKana,
    setKanaSource: setLastNameKanaSource,
  } = useKana();
  const {
    kana: firstNameKana,
    setKanaSource: setFirstNameKanaSource,
  } = useKana();
  return (
    <form>
      <div>
        <span>Japanese Traditional Form</span>
      </div>
      <div>
        <div>
          <span>Name</span>
        </div>
        <NameField
          fieldName="last_name"
          setKanaSource={setLastNameKanaSource}
        />
        <NameField
          fieldName="first_name"
          setKanaSource={setFirstNameKanaSource}
        />
      </div>
      <div>
        <div>
          <span>Name Kana</span>
        </div>
        <NameKanaField fieldName="last_name_kana" kana={lastNameKana} />
        <NameKanaField fieldName="first_name_kana" kana={firstNameKana} />
      </div>
    </form>
  );
};

const NameField = ({
  fieldName,
  setKanaSource,
}: {
  fieldName: string;
  setKanaSource: (arg: { value: string }) => void;
}) => {
  const [value, setValue] = React.useState('');

  return (
    <input
      type="text"
      value={value}
      onChange={e => {
        setValue(e.target.value);
        setKanaSource({ value: e.target.value });
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
