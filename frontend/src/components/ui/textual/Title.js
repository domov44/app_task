import React from "react";
import styled from "styled-components";

const TitleComponent = styled.h1`
  margin: 0;
  line-height: 1;
  color: ${(props) =>
    props.$variant === "default"
      ? "var(--color-title)"
      : props.$variant === "colored"
        ? "var(--main-color)"
        : props.$variant === "white"
          ? "#fff"
          : props.$variant === "black"
            ? "#151b49"
            : "var(--color-title)"};
  font-size: ${(props) => {
    switch (props.$level) {
      case 1:
        return "30px";
      case 2:
        return "25px";
      case 3:
        return "23px";
      case 4:
        return "20px";
      case 5:
        return "19px";
      case 6:
        return "18px";
      default:
        return "16px";
    }
  }};
`;

const Title = ({ variant, level, className, id, onClick, children, ...restProps }) => {
  const HeadingTag = `h${level || 1}`;

  return (
    <TitleComponent as={HeadingTag} $variant={variant} $level={level} {...restProps} className="title">
      {children}
    </TitleComponent>
  );
};

export default Title;
