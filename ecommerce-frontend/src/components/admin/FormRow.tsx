import React from "react";

interface FormType {
  type: string;
  name: string;
  labelText: string;
  value?: string | number;
  placeholder?: string;
  defaultValue?: string | number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormRow: React.FC<FormType> = ({
  type,
  name,
  value,
  labelText,
  defaultValue = "",
  onChange,
  placeholder,
}) => {
  return (
    <div className="form-row">
      <label htmlFor={name} className="form-label">
        {labelText || name}
      </label>

      <input
        type={type}
        id={name}
        name={name}
        value={value}
        placeholder={placeholder}
        className="form-input"
        defaultValue={defaultValue}
        onChange={onChange}
        required
      />
    </div>
  );
};

export default FormRow;
