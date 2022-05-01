import { Color } from "../Primitives/Color.jsx";
import { Txt } from "../Primitives/Txt.jsx";
import * as Feather from "react-feather";
import {
  cloneElement,
  MouseEventHandler,
  ReactElement,
  ReactNode,
} from "react";
import { Button } from "../Primitives/Button.jsx";
import { useNavigate } from "react-router-dom";

export function StorefrontPage() {
  const navigate = useNavigate();

  function goToBoxes() {
    navigate("/boxes");
  }

  return (
    <>
      <Section background={Color.Blue[200]}>
        <div css={{ maxWidth: 400, gap: "max(20px, 2vw)" }}>
          <Txt.H6>ICFS</Txt.H6>

          <h1>
            <Txt.H1 color={Color.Blue[600]}>
              Internet Computer File System
            </Txt.H1>
          </h1>

          <Txt.Preamble paragraph>
            An infrastructure and dApp eco-system for managing files on the
            Internet Computer.
          </Txt.Preamble>

          <div css={{ alignSelf: "start" }}>
            <CTAButton onClick={goToBoxes}>Open File Manager</CTAButton>
          </div>
        </div>
      </Section>

      <Section>
        <div css={{ gap: 20, maxWidth: 400, alignSelf: "end" }}>
          <Feather.Shield size={32} color={Color.Blue[600]} />

          <Txt.H6>Data ownership on the Internet Computer</Txt.H6>

          <h2>
            <Txt.H3>How does it work?</Txt.H3>
          </h2>

          <Txt.Body paragraph>
            The ICFS is a canister protocol specification, establishing patterns
            for applications accessing user-owned canisters containing file
            assets. We call these "Boxes".
          </Txt.Body>
        </div>
      </Section>

      <Section background={Color.Blue[700]} foreground={Color.White}>
        <div css={{ gap: 20, maxWidth: 400 }}>
          <Feather.Play />

          <Txt.H6>Get Started</Txt.H6>

          <h2>
            <Txt.H3>Get Started</Txt.H3>
          </h2>

          <Txt.Body paragraph>
            Use the ICFS File Manager to create your first Box.
          </Txt.Body>

          <div css={{ alignSelf: "start" }}>
            <CTAButton onClick={goToBoxes}>Let's Go</CTAButton>
          </div>
        </div>
      </Section>
    </>
  );
}

function CTAButton({
  children,
  icon,
  onClick,
}: {
  children?: ReactNode;
  icon?: ReactElement<Feather.IconProps>;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <Button
      onClick={onClick}
      focusStyle={{
        ":not(:hover) > div": {
          transform: "scale(1.03)",
          background: Color.White,
          boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
        },
      }}
    >
      <div
        css={{
          paddingInline: 20,
          paddingBlock: 15,
          color: Color.Blue[600],
          borderRadius: 8,
          transitionDuration: "60ms",
          transitionProperty: "transform, background, box-shadow",
          background: Color.Blue[100],
          boxShadow: "0 1px 2px rgba(0,0,0,0.2)",

          ":hover": {
            transform: "scale(1.04)",
            boxShadow: "0 3px 8px rgba(0,0,0,0.4)",
            background: Color.White,
          },

          ":active": {
            transform: "scale(0.99)",
            boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
          },
        }}
      >
        {icon && cloneElement(icon, { size: 30 })}
        <Txt.Body bold>{children}</Txt.Body>
      </div>
    </Button>
  );
}

function Section({
  children,
  background,
  foreground,
}: {
  children?: ReactNode;
  background?: Color;
  foreground?: Color;
}) {
  return (
    <section
      css={{
        background,
        color: foreground,
      }}
    >
      <div
        css={{
          paddingInline: "max(10px, 3vw)",
          paddingBlock: "max(20px, 3vw)",

          marginInline: "auto",
          maxWidth: 1000,
          width: "100%",
        }}
      >
        {children}
      </div>
    </section>
  );
}
