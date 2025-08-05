import React from "react";

interface InputProps {
  type: "text" | "password" | "email" | "number" | "search" | "tel" | "url";
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
  name?: string;
}

const Input = ({
  type,
  placeholder,
  value,
  onChange,
  required = false,
  className = "",
  name,
}: InputProps) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      name={name}
      className={`border p-2 rounded ${className}`}
    />
  );
};

export default Input;
