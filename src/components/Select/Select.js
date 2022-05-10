import React from "react";
import ReactSelect from "react-select";

class Select extends React.Component {
  render() {
    const {
      placeholder,
      options,
      value,
      onInputChange,
      onChange,
    } = this.props;

    return (
      <ReactSelect
        className="input input-select"
        classNamePrefix="input-select"
        options={options}
        placeholder={placeholder}
        value={value}
        onInputChange={onInputChange}
        onChange={onChange}
      />
    );
  }
}

export default Select;
