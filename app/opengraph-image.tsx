import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "AGENZ - Creative Hub";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#050505",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "80px 96px",
          position: "relative",
          overflow: "hidden",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-120px",
            right: "-80px",
            width: "600px",
            height: "600px",
            background:
              "radial-gradient(circle, rgba(0,233,44,0.08) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            left: "200px",
            width: "500px",
            height: "500px",
            background:
              "radial-gradient(circle, rgba(0,255,255,0.05) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: "0",
            top: "0",
            bottom: "0",
            width: "6px",
            background: "linear-gradient(180deg, #00e92c 0%, #00ffff 100%)",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: "0px" }}>
          <div
            style={{
              fontSize: "108px",
              fontWeight: "900",
              letterSpacing: "-4px",
              lineHeight: "1",
              background: "linear-gradient(90deg, #00e92c 0%, #00ffff 100%)",
              backgroundClip: "text",
              color: "transparent",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            AGENZ
          </div>

          <div
            style={{
              fontSize: "26px",
              fontWeight: "400",
              letterSpacing: "14px",
              color: "rgba(255,255,255,0.5)",
              marginTop: "4px",
              textTransform: "uppercase",
            }}
          >
            CREATIVE HUB
          </div>

          <div
            style={{
              width: "80px",
              height: "2px",
              background: "linear-gradient(90deg, #00e92c, #00ffff)",
              marginTop: "36px",
              marginBottom: "36px",
            }}
          />

          <div
            style={{
              fontSize: "22px",
              fontWeight: "300",
              color: "rgba(255,255,255,0.65)",
              letterSpacing: "2px",
            }}
          >
            Advertising · Video · Design · Strategy
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              height: "2px",
              background:
                "linear-gradient(90deg, transparent 0%, #00e92c 30%, #00ffff 70%, transparent 100%)",
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              padding: "16px 96px",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <span
              style={{
                fontSize: "16px",
                color: "rgba(255,255,255,0.35)",
                letterSpacing: "2px",
              }}
            >
              agenz-iq.com
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
