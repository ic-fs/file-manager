import { MutableRefObject, useEffect } from "react";
import { css } from "@emotion/react";
import { Color } from "./Primitives/Color.jsx";

const acceptedStyle = css({
  opacity: 0.4,
  cursor: "copy !important",
  outlineColor: Color.Blue[300],
  outlineStyle: "dashed",
  outlineWidth: 2,
  outlineOffset: -2,
});

const rejectedStyle = css({
  cursor: "no-drop !important",
  opacity: 0.4,
});

const acceptedClassName = `useDropZone-${acceptedStyle.name}`;
const rejectedClassName = `useDropZone-${rejectedStyle.name}`;

document.head.appendChild(
  document.createElement("style")
).innerHTML = `.${acceptedClassName}{${acceptedStyle.styles}} .${rejectedClassName}{${rejectedStyle.styles}}`;

export function useDropZone<E extends HTMLElement>(
  ref: MutableRefObject<E | null>,
  onAccepted: undefined | ((dataTransfer: DataTransfer) => void),
  onAccept: (dataTransfer: DataTransfer) => boolean = () => true
) {
  function onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    const e = event.currentTarget as E;
    e.classList.remove(acceptedClassName, rejectedClassName);
    if (event.dataTransfer == null) {
      return;
    }
    if (onAccept(event.dataTransfer)) {
      onAccepted!(event.dataTransfer);
    }
  }

  function onDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer == null) {
      return;
    }
    const e = event.currentTarget as E;
    if (onAccept(event.dataTransfer)) {
      e.classList.add(acceptedClassName);
      event.dataTransfer.dropEffect = "copy";
    } else {
      e.classList.add(rejectedClassName);
      event.dataTransfer.dropEffect = "none";
    }
  }

  function onDragLeave(event: DragEvent) {
    const e = event.currentTarget as E;
    if (!e.contains(event.relatedTarget! as Node)) {
      e.classList.remove(acceptedClassName, rejectedClassName);
    }
  }

  useEffect(() => {
    if (!onAccepted) {
      return;
    }
    ref.current?.addEventListener("dragover", onDragOver);
    ref.current?.addEventListener("dragleave", onDragLeave);
    ref.current?.addEventListener("drop", onDrop);
    return () => {
      ref.current?.removeEventListener("dragover", onDragOver);
      ref.current?.removeEventListener("dragleave", onDragLeave);
      ref.current?.removeEventListener("drop", onDrop);
    };
  }, []);
}
