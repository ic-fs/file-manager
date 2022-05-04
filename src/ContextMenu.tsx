import {
  cloneElement,
  MouseEventHandler,
  ReactElement,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
} from "react";
import { Button } from "./Primitives/Button";
import { Color } from "./Primitives/Color";

interface ContextMenuProps {
  children?: ReactNode;
  onClose?: () => void;
}

export type ContextMenu = ReactElement<ContextMenuProps, typeof ContextMenu>;

export function ContextMenu({ children, onClose }: ContextMenuProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const returnRef = useRef<HTMLElement | null>(
    document.activeElement as HTMLElement | null
  );

  useLayoutEffect(() => {
    const menu = ref.current;
    if (menu == null) {
      return;
    }

    const { right, bottom } = menu.getBoundingClientRect();
    let translateX = "0";
    let translateY = "0";
    if (right > window.innerWidth) {
      translateX = "-100%";
    }
    if (bottom > window.innerHeight) {
      translateY = "-100%";
    }
    menu.style.transform = `translate(${translateX}, ${translateY})`;
  }, []);

  useEffect(() => {
    const menu = ref.current;
    if (menu == null) {
      return;
    }
    menu.focus();

    function onFocusOut(e: FocusEvent) {
      if (!menu!.contains(e.relatedTarget as HTMLElement)) {
        onClose?.();
      }
    }

    menu.addEventListener("focusout", onFocusOut);
    return () => menu.removeEventListener("focusout", onFocusOut);
  }, [onClose]);

  return (
    <div
      ref={ref}
      tabIndex={onClose && 0}
      css={{
        width: "max-content",
        background: Color.White,
        boxShadow: "0 2px 4px rgba(0,0,0,0.4)",
        borderRadius: 4,
        overflow: "hidden",
        outline: 0,
      }}
      onKeyDown={(e) => {
        switch (e.key) {
          case "Escape":
            returnRef.current?.focus();
            break;

          case "ArrowUp": {
            if (document.activeElement === ref.current) {
              (
                ref.current?.lastElementChild as HTMLElement | null | undefined
              )?.focus();
              break;
            }
            let target = document.activeElement?.previousElementSibling as
              | HTMLElement
              | null
              | undefined;
            while (target?.tagName === "HR") {
              target = target.previousElementSibling as
                | HTMLElement
                | null
                | undefined;
            }
            target?.focus?.();
            break;
          }

          case "ArrowDown": {
            if (document.activeElement === ref.current) {
              (
                ref.current?.firstElementChild as HTMLElement | null | undefined
              )?.focus();
              break;
            }
            let target = document.activeElement?.nextElementSibling as
              | HTMLElement
              | null
              | undefined;
            while (target?.tagName === "HR") {
              target = target.nextElementSibling as
                | HTMLElement
                | null
                | undefined;
            }
            target?.focus?.();
            break;
          }

          default:
            return;
        }
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {children}
    </div>
  );
}

export namespace ContextMenu {
  export function at(
    menu: ContextMenu,
    { clientX: left, clientY: top }: { clientX: number; clientY: number },
    onClose: () => void
  ) {
    return (
      <div
        css={{
          position: "fixed",
          left,
          top,
        }}
      >
        {cloneElement(menu, { onClose })}
      </div>
    );
  }

  export function Item({
    children,
    onClick,
  }: {
    children?: ReactNode;
    onClick?: MouseEventHandler<HTMLButtonElement>;
  }) {
    return (
      <Button
        onClick={onClick}
        focusStyle={{
          background: Color.Blue[500],
          color: Color.White,
        }}
      >
        <div
          css={{
            paddingBlock: 8,
            paddingInline: 12,
          }}
          onMouseEnter={(e) => e.currentTarget.parentElement?.focus()}
        >
          {children}
        </div>
      </Button>
    );
  }

  export function Separator() {
    return (
      <hr
        css={{
          border: 0,
          width: "100%",
          borderTopWidth: 1,
          borderTopStyle: "solid",
          borderTopColor: Color.Gray[300],
          margin: 0,
        }}
      />
    );
  }
}
