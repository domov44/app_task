import React from "react";
import styled from "styled-components";

const TextComponent = styled.p`
  color: ${(props) =>
    props.$variant === "default"
      ? "var(--paragraph)"
      : props.$variant === "colored"
        ? "var(--main-color)"
        : props.$variant === "white"
          ? "#ADADB0"
          : "var(--paragraph)"};
  font-size: ${(props) => {
    switch (props["size"]) {
      case "sm":
        return "16px";
      case "md":
        return "18px";
      case "lg":
        return "20px";
      default:
        return "18px";
    }
  }};
`;

const Text = ({ variant, size, className, id, onClick, children, ...restProps }) => {
  return (
    <TextComponent $variant={variant} $size={size} {...restProps}>
      {children}
    </TextComponent>
  );
};

export default Text;
