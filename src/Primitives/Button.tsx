import { CSSObject } from "@emotion/react";
import { MouseEventHandler, ReactNode } from "react";
import { Color } from "./Color";

export function Button({
  children,
  onClick,
  focusStyle = {
    outlineColor: Color.Blue[400],
    outlineWidth: 2,
    outlineOffset: 2,
    outlineStyle: "solid",
  },
}: {
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  focusStyle?: CSSObject;
}) {
  return (
    <button
      onClick={onClick}
      css={{
        appearance: "none",
        margin: 0,
        padding: 0,
        border: 0,
        borderRadius: 0,
        background: "inherit",
        font: "inherit",
        textAlign: "inherit",
        color: "inherit",
        cursor: "pointer",

        outline: 0,
        ":focus": focusStyle,
      }}
    >
      {children}
    </button>
  );
}
