import React from "react";

interface IProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const AddFriendSearchInput = ({ value, onChange }: IProps): JSX.Element => {
  return (
    <div className="addFriendSearchInput">
      <input
        type="text"
        placeholder="Search friend here..."
        autoFocus
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default AddFriendSearchInput;
