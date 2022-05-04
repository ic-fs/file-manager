import {
  cloneElement,
  ReactElement,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import { Color } from "./Primitives/Color";

interface ContextMenuProps {
  children?: ReactNode;
  onClose?: () => void;
}

export type ContextMenu = ReactElement<ContextMenuProps, typeof ContextMenu>;

export function ContextMenu({ children, onClose }: ContextMenuProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const menu = ref.current;
    if (menu == null) {
      return;
    }

    x: {
      for (const child of menu.children) {
        (child as HTMLElement).focus();
        if (menu.contains(document.activeElement)) {
          break x;
        }
      }
      menu.focus();
    }

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
}
