import { Txt } from "./Txt.js";

export type Color = Color.Palette[Color.Shade] | Color.White | Color.Black;

export namespace Color {
  export type Shade = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800;
  export const Shades = [100, 200, 300, 400, 500, 600, 700, 800] as const;

  export type White = typeof White;
  export const White = "#FFFFFF";

  export type Black = typeof Black;
  export const Black = "#000000";

  export type Gray = typeof Gray;
  export const Gray = {
    100: "#fafafa",
    200: "#f2f2f2",
    300: "#dbdbdb",
    400: "#c2c2c2",
    500: "#878787",
    600: "#565656",
    700: "#2e2e2e",
    800: "#0e0e0e",
  } as const;

  export type Blue = typeof Blue;
  export const Blue = {
    100: "#f3f1ff",
    200: "#dcd7ff",
    300: "#8b7dff",
    400: "#6350ff",
    500: "#1c00ff",
    600: "#1700cf",
    700: "#0f008c",
    800: "#05002d",
  } as const;

  export type Palette = Gray | Blue;
  export const Palettes = { Gray, Blue };
}

export function ColorDemo() {
  return (
    <div css={{ padding: 30, flexDirection: "row", gap: 20 }}>
      <div css={{ gap: 20 }}>
        <Txt.H6>Shades</Txt.H6>
        {Color.Shades.map((shade) => (
          <div
            css={{
              height: 60,
              justifyContent: "center",
            }}
          >
            <Txt.H6>{shade}</Txt.H6>
          </div>
        ))}
      </div>

      {Object.entries(Color.Palettes).map(([name, palette]) => (
        <div key={name} css={{ gap: 20 }}>
          <Txt.H6>{name}</Txt.H6>

          {Object.entries(palette).map(([name, shade]) => (
            <div
              key={name}
              css={{ background: shade, height: 60, width: 60 }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
