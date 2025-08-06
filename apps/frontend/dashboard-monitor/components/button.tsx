import React, { FC } from "react";

interface ButtonProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  label?: string;
  type?: "button" | "submit" | "reset";
}

const Button: FC<ButtonProps> = ({ onClick, className, label, type }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition cursor-pointer ${className}`}
    >
      {label}
    </button>
  );
};

export default Button;
