import React from "react";
import styled from "styled-components";

const ToggleComponent = styled.button`
    background: var(--bg-color);
    display: inline-block;
    padding: 25px;
    border-radius: 5px;
    border: 1px solid var(--color-title);
    box-shadow: 5px 5px 0 0 var(--main-color);
    vertical-align: middle;
    transition: 0.3s;
    cursor: pointer;
    height: fit-content;

&:hover {
    box-shadow: 2.5px 2.5px 0 0 var(--main-color);
}

&:active {
    box-shadow: 0px 0px 0 0 var(--main-color)F !important;
    border-color: var(--main-color);
}

&::before {
    content: '';
    position: absolute;
    background: var(--color-title);
    width: 30px;
    height: 4px;
    border-radius: 50px;
    left: 10px;
    top: 14px;
    transition: 0.3s;
    transition-delay: 0.2s;
}

&::after {
    content: '';
    position: absolute;
    background: var(--color-title);
    width: 30px;
    height: 4px;
    border-radius: 50px;
    left: 10px;
    top: 32px;
    transition: 0.3s;

}


&:hover::before {
    width: 1.5rem;
}

&:hover::after {
    width: 1rem;
}

&:active::before {
    width: 0.5rem;
}

&:active::after {
    width: 0.25rem;
}
`;


function Toggle({onClick}) {
    return (
        <ToggleComponent className="toggle" onClick={onClick}></ToggleComponent>
    );
}

export default Toggle;