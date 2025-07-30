import React from 'react';
import { ExcludeFullscreen, InputStyle, InputType, Size } from '../helpers/compInterface';
import './Inputs.css';

export interface IInput {
  style?: InputStyle;
  size?: ExcludeFullscreen<Size>;
  type?: InputType;
  placeholder?: string;
  value?: string;
  defValue?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  required?: boolean;
  id?: string;
  name?: string;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLInputElement>;
  titleCustom?: string;
}

const Input: React.FC<IInput> = ({
  style = InputStyle.BUBBLE,
  size = Size.MAX,
  type = "text",
  placeholder,
  value,
  onChange,
  onKeyDown,
  onBlur,
  required,
  id,
  name,
  defValue,
  titleCustom,
  ref,
}) => {
  const classNames = `${style}-input ${type} ${size}`;

  return (
    (style === InputStyle.MIN || style === InputStyle.ERROR) ? (
      <label className={`floating-label ${size}`}
        title-custom={titleCustom}>
        <input
          className={`${style}-input ${type} max`}
          type={type}
          value={type === InputType.READONLY ? value : undefined}
          placeholder={" "}
          defaultValue={defValue ? defValue : (type !== InputType.READONLY ? value : undefined)}
          onChange={onChange}
          readOnly={type === InputType.READONLY}
          pattern={type === InputType.TEL ? "[+][0-9]{3}-[0-9]{2}-[0-9]{7}" : undefined}
          ref={ref}
          autoComplete="on"
          id={id}
          name={name}
          required={required}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
        />
        <span>{placeholder}</span>
      </label>
    ) : (
      <input
        className={classNames}
        type={type}
        placeholder={placeholder}
        value={type === InputType.READONLY ? value : undefined}
        defaultValue={defValue ? defValue : (type !== InputType.READONLY ? value : undefined)}
        onChange={onChange}
        readOnly={type === InputType.READONLY}
        pattern={type === InputType.TEL ? "[0-9]{3}-[0-9]{2}-[0-9]{3}" : undefined}
        ref={ref}
        id={id}
        name={name}
        required={required}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        title-custom={titleCustom}
      />
    )
  );
};

export default Input;