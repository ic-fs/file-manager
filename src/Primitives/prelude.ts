/// <reference types="@emotion/react/types/css-prop.js" />

import { Color } from "./Color.jsx";
import { Txt } from "./Txt.jsx";

const sheet = document.head.appendChild(document.createElement("style")).sheet!;

sheet.insertRule(`
  body {
    margin: 0;
    font-family: ${Txt.Body.fontFamily};
    font-weight: ${Txt.Body.weight};
    font-size: ${Txt.Body.fontSize}px;
    line-height: ${Txt.Body.lineHeight}px;

    background-color: ${Color.White};
    color: ${Color.Black};
  }
`);

sheet.insertRule(`
  div, h1, h2, h3, h4, h5, h6, p, strong, em {
    display: flex;
    flex-direction: column;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`);
