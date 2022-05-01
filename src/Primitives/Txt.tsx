import { css } from "@emotion/react";
import { CSSObject } from "@emotion/serialize";
import { ReactElement, ReactNode } from "react";
import { Color } from "./Color.jsx";

export type Txt = typeof Txt.STYLES[number];

export function Txt({ style: Style, ...props }: Txt.Props & { style: Txt }) {
  return <Style {...props} />;
}

export namespace Txt {
  export enum FontFamily {
    Sans = `-apple-system, BlinkMacSystemFont, "Segoe UI",
      Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji",
      "Segoe UI Emoji", "Segoe UI Symbol"`,
  }

  export interface StyleOptions<N> {
    styleName: N;
    fontFamily: FontFamily;
    weight: number;
    boldWeight: number;
    fontSize: number;
    lineHeight: number;
    cutTop: number;
    cutBottom: number;
    letterSpacing?: number;
    uppercase?: boolean;
  }

  function styleOptions(options: Partial<StyleOptions<any>>): CSSObject {
    return {
      fontFamily: options.fontFamily,
      fontSize: options.fontSize,
      lineHeight: options.lineHeight ? `${options.lineHeight}px` : undefined,
      margin: 0,
      marginTop: options.cutTop && -options.cutTop,
      marginBottom: options.cutBottom && -options.cutBottom,
      letterSpacing: options.letterSpacing
        ? `${options.letterSpacing}em`
        : undefined,
      textTransform: options.uppercase ? "uppercase" : undefined,
    };
  }

  export interface Props {
    children?: ReactNode;
    bold?: boolean;
    inline?: boolean;
    color?: Color;
    paragraph?: boolean;
  }

  type Style<N> = ((props: Props) => ReactElement<Props>) & StyleOptions<N>;

  function createStyle<N>(
    options: StyleOptions<N> & { onSmallScreen?: Partial<StyleOptions<N>> }
  ): Style<N> {
    const baseStyle = css({
      ...styleOptions(options),
      "@media (max-width: 500px)":
        options.onSmallScreen && styleOptions(options.onSmallScreen),
    });

    return Object.assign(
      ({
        children,
        bold = false,
        inline = false,
        paragraph = false,
        color,
      }: Props) => {
        const Element = paragraph ? "p" : "div";
        return (
          <Element
            css={[
              baseStyle,
              {
                fontWeight: bold ? options.boldWeight : options.weight,
              },
              inline
                ? {
                    display: "contents",
                  }
                : {
                    display: "flex",
                    flexWrap: "wrap",
                  },
              color ? { color } : undefined,
            ]}
          >
            {children}
          </Element>
        );
      },
      options
    );
  }

  export type H1 = Style<"H1">;
  export const H1: H1 = createStyle({
    styleName: "H1",
    fontFamily: FontFamily.Sans,
    fontSize: 42,
    lineHeight: 38,
    weight: 500,
    boldWeight: 500,
    cutTop: 4,
    cutBottom: 3,

    onSmallScreen: {
      fontSize: 32,
      lineHeight: 33,
      cutTop: 5,
      cutBottom: 4,
    },
  });

  export type H2 = Style<"H2">;
  export const H2: H2 = createStyle({
    styleName: "H2",
    fontFamily: FontFamily.Sans,
    fontSize: 32,
    lineHeight: 33,
    weight: 600,
    boldWeight: 600,
    cutTop: 5,
    cutBottom: 4,

    onSmallScreen: {
      fontSize: 26,
      lineHeight: 30,
      cutTop: 5,
      cutBottom: 5,
    },
  });

  export type H3 = Style<"H3">;
  export const H3: H3 = createStyle({
    styleName: "H3",
    fontFamily: FontFamily.Sans,
    fontSize: 24,
    lineHeight: 28,
    weight: 600,
    boldWeight: 600,
    cutTop: 5,
    cutBottom: 4,

    onSmallScreen: {
      fontSize: 22,
      lineHeight: 26,
      cutTop: 5,
      cutBottom: 4,
    },
  });

  export type H4 = Style<"H4">;
  export const H4: H4 = createStyle({
    styleName: "H4",
    fontFamily: FontFamily.Sans,
    fontSize: 18,
    lineHeight: 24,
    weight: 600,
    boldWeight: 600,
    cutTop: 5,
    cutBottom: 5,
  });

  export type H5 = Style<"H5">;
  export const H5: H5 = createStyle({
    styleName: "H5",
    fontFamily: FontFamily.Sans,
    fontSize: 13,
    lineHeight: 18,
    weight: 600,
    boldWeight: 600,
    cutTop: 4,
    cutBottom: 4,
  });

  export type H6 = Style<"H6">;
  export const H6: H6 = createStyle({
    styleName: "H6",
    fontFamily: FontFamily.Sans,
    fontSize: 10,
    lineHeight: 15,
    weight: 600,
    boldWeight: 600,
    cutTop: 3,
    cutBottom: 4,
    letterSpacing: 0.02,
    uppercase: true,
  });

  export type Preamble = Style<"Preamble">;
  export const Preamble: Preamble = createStyle({
    styleName: "Preamble",
    fontFamily: FontFamily.Sans,
    fontSize: 18,
    lineHeight: 24,
    weight: 400,
    boldWeight: 600,
    cutTop: 5,
    cutBottom: 5,

    onSmallScreen: {
      fontSize: 15,
      lineHeight: 20,
      cutTop: 4,
      cutBottom: 4,
    },
  });

  export type Body = Style<"Body">;
  export const Body: Body = createStyle({
    styleName: "Body",
    fontFamily: FontFamily.Sans,
    fontSize: 13,
    lineHeight: 18,
    weight: 400,
    boldWeight: 600,
    cutTop: 4,
    cutBottom: 4,
  });

  export type Small = Style<"Small">;
  export const Small: Small = createStyle({
    styleName: "Small",
    fontFamily: FontFamily.Sans,
    fontSize: 10,
    lineHeight: 15,
    weight: 400,
    boldWeight: 800,
    cutTop: 3,
    cutBottom: 3,
  });

  export const STYLES = [
    H1,
    H2,
    H3,
    H4,
    H5,
    H6,
    Preamble,
    Body,
    Small,
  ] as const;
}

export function TxtDemo() {
  const FOX_AND_DOG = "The quick brown fox jumps over the lazy dog";
  const LOREM_IPSUM =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

  return (
    <div
      css={{
        maxWidth: 300,
        padding: 90,
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <div css={{ background: Color.Gray[200] }}>
        <Txt.H1>{FOX_AND_DOG}</Txt.H1>
      </div>

      <div css={{ background: Color.Gray[200] }}>
        <Txt.Preamble>{LOREM_IPSUM}</Txt.Preamble>
      </div>

      <div css={{ background: Color.Gray[200] }}>
        <Txt.H2>{FOX_AND_DOG}</Txt.H2>
      </div>

      <div css={{ background: Color.Gray[200] }}>
        <Txt.Body>
          {LOREM_IPSUM} And here is{" "}
          <Txt.Small inline>some inline small text</Txt.Small>.
        </Txt.Body>
      </div>

      <div css={{ background: Color.Gray[200] }}>
        <Txt.H3>{FOX_AND_DOG}</Txt.H3>
      </div>

      <div css={{ background: Color.Gray[200] }}>
        <Txt.Body>
          {LOREM_IPSUM} And here is{" "}
          <Txt.Body inline bold>
            some inline bold text
          </Txt.Body>
          .
        </Txt.Body>
      </div>

      <div css={{ background: Color.Gray[200] }}>
        <Txt.H4>{FOX_AND_DOG}</Txt.H4>
      </div>

      <div css={{ background: Color.Gray[200] }}>
        <Txt.Body>
          {LOREM_IPSUM} And here is{" "}
          <Txt.Body inline bold>
            some inline bold text
          </Txt.Body>
          .
        </Txt.Body>
      </div>

      <div css={{ background: Color.Gray[200] }}>
        <Txt.H5>{FOX_AND_DOG}</Txt.H5>
      </div>

      <div css={{ background: Color.Gray[200] }}>
        <Txt.Body>
          {LOREM_IPSUM} And here is{" "}
          <Txt.Body inline bold>
            some inline bold text
          </Txt.Body>
          .
        </Txt.Body>
      </div>

      <div css={{ background: Color.Gray[200] }}>
        <Txt.H6>{FOX_AND_DOG}</Txt.H6>
      </div>

      <div css={{ background: Color.Gray[200] }}>
        <Txt.Small>{LOREM_IPSUM}</Txt.Small>
      </div>
    </div>
  );
}
