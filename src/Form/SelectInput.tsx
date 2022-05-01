import { createContext, ReactNode, useContext, useId } from "react";
import { Color } from "../Primitives/Color";
import { Txt } from "../Primitives/Txt";

export function createSelect<T>() {
  interface SelectContext {
    value: T;
    onChange: (value: T) => void;
    id: string;
  }

  const SelectContext = createContext<SelectContext | null>(null);

  function Input({
    value,
    onChange,
    children,
  }: {
    value: T;
    onChange: (value: T) => void;
    children?: ReactNode;
  }) {
    const id = useId();
    return (
      <SelectContext.Provider
        value={{
          value,
          onChange,
          id,
        }}
      >
        <div
          css={{
            background: Color.Gray[400],
            flexDirection: "row",
            gap: 1,
            borderRadius: 4,
            border: `1px solid ${Color.Gray[400]}`,
            overflow: "hidden",

            ":focus-within": {
              outlineOffset: 2,
              outlineWidth: 2,
              outlineColor: Color.Blue[600],
              outlineStyle: "solid",
            },
          }}
        >
          {children}
        </div>
      </SelectContext.Provider>
    );
  }

  function Option({ children, value }: { children?: ReactNode; value: T }) {
    const ctx = useContext(SelectContext);
    if (ctx == null) {
      throw new Error("<Select.Option> used outside <Select.Input>");
    }

    const selected = value === ctx.value;

    return (
      <label
        css={{
          background: selected ? Color.Gray[200] : Color.White,
          color: selected ? Color.Black : Color.Gray[800],
          padding: 4,
        }}
      >
        <input
          css={{ width: 0, height: 0, margin: 0, float: "right" }}
          type="radio"
          name={ctx.id}
          checked={selected}
          onChange={(e) => {
            if (e.target.checked) {
              ctx.onChange(value);
            }
          }}
        />

        {children}
      </label>
    );
  }

  return { Input, Option };
}
