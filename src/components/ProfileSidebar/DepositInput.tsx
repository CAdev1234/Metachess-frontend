import React from "react";

interface IProps {
    value: string,
    enableMaxBtn?: boolean,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onMaxClick?: (event: any) => void;
}
const DepositInput = ({
    value,
    enableMaxBtn = false, 
    onChange, 
    onMaxClick
}: IProps): JSX.Element => {
  return (
    <div className="depositInput">
      <input
        type="text"
        placeholder="Please amount..."
        autoFocus
        value={value}
        onChange={onChange}
      />
      {enableMaxBtn && <div className="max-button">
        <button onClick={onMaxClick}>max</button>
      </div>}
      
    </div>
  );
};

export default DepositInput;
