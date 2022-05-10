import React from "react";

class TextField extends React.Component {
  constructor(props) {
    super(props);
    const initialValue = this.props.value;
    this.state = {
      isOnFocus: false,
      isValueEmpty: !initialValue && initialValue !== 0,
    };
  }

  render() {
    const {
      className,
      label,
      id,
      onChange,
      value,
      name,
      type,
      required,
      autoComplete,
      disabled
    } = this.props;
    const { isOnFocus, isValueEmpty } = this.state;

    return (
      <div className={`input text-field ${isOnFocus ? "focused" : ""}`}>
        <input
          required={required}
          type={type}
          defaultValue={value}
          name={name}
          className={`text-field__input ${className || ""}`}
          onFocus={() => this.setState({ isOnFocus: true })}
          onBlur={() => this.setState({ isOnFocus: false })}
          onChange={(e) => {
            const isValueEmpty = e.target.value.length === 0;
            this.setState({ isValueEmpty });
            if (onChange) onChange(e);
          }}
          autoComplete={autoComplete}
          disabled={disabled}
        />

        <label
          className={`text-field__label ${isOnFocus || !isValueEmpty ? "active" : ""
            }`}
          htmlFor={id}
        >
          {label}
        </label>
      </div>
    );
  }
}

export default TextField;
