import { NextRequest, NextResponse } from "next/server";
import { Blob } from "buffer";

export async function POST(request: NextRequest) {
  try {
    const { name, surname, role, region, interests, avatarUrl } = await request.json();

    // Generate a simple HTML brand identity that can be downloaded
    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Feorm Brand Identity</title>
<style>
  @page { size: A4; margin: 0; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #FAF7F2; }
  .page { width: 210mm; min-height: 297mm; padding: 40mm 30mm; }
  .brand { font-size: 48px; font-style: italic; color: #1E1A14; margin-bottom: 4px; }
  .brand span { color: #E8C96A; }
  .sub { font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #787774; font-family: monospace; margin-bottom: 60px; }
  .label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.1em; color: #787774; font-family: monospace; margin-bottom: 6px; }
  .value { font-size: 24px; color: #1E1A14; margin-bottom: 32px; font-weight: 300; }
  .role-badge { display: inline-block; padding: 6px 16px; border-radius: 9999px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; margin-bottom: 32px; ${role === "provider" ? "background: var(--color-verified-bg, #EDF3EC); color: var(--color-verified, #346538);" : "background: #FBF3DB; color: #956400;"} }
  .divider { border: none; border-top: 1px solid rgba(60,47,26,0.1); margin: 32px 0; }
  .interests { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 32px; }
  .interest { padding: 4px 12px; border-radius: 9999px; border: 1px solid rgba(60,47,26,0.1); font-size: 10px; color: #787774; text-transform: uppercase; letter-spacing: 0.05em; }
  .palette { display: flex; gap: 4px; margin-bottom: 60px; }
  .swatch { height: 6px; flex: 1; border-radius: 9999px; }
  .footer { font-size: 9px; color: #787774; text-transform: uppercase; letter-spacing: 0.1em; font-family: monospace; }
</style>
</head>
<body>
<div class="page">
  <div class="brand">feorm<span>.</span></div>
  <div class="sub">Brand Identity Document</div>
  
  <div class="label">Identity</div>
  <div class="value">${name || "Guest"} ${surname || "User"}</div>
  
  <div class="label">Persona</div>
  <div class="role-badge">${role === "provider" ? "Provider / Host" : "Voyager / Guest"}</div>
  
  <hr class="divider">
  
  <div class="label">Region</div>
  <div class="value">${region || "Namibia"}</div>
  
  ${interests && interests.length > 0 ? `
  <div class="label">Interests</div>
  <div class="interests">
    ${interests.map((i: string) => `<span class="interest">${i}</span>`).join("\n    ")}
  </div>
  ` : ""}
  
  <div class="label">The Namibian Palette</div>
  <div class="palette">
    <div class="swatch" style="background:#1E1A14"></div>
    <div class="swatch" style="background:#3C2F1A"></div>
    <div class="swatch" style="background:#5C4A2A"></div>
    <div class="swatch" style="background:#E8C96A"></div>
    <div class="swatch" style="background:#D4C4A0"></div>
    <div class="swatch" style="background:#F2EDE2"></div>
    <div class="swatch" style="background:#FAF7F2"></div>
    <div class="swatch" style="background:#FEFDFB"></div>
  </div>
  
  <div class="footer">Feorm Network 0.1 — ${new Date().getFullYear()}</div>
</div>
</body>
</html>`;

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": 'attachment; filename="feorm-brand-identity.html"',
      },
    });
  } catch (error) {
    console.error("Brand identity error:", error);
    return NextResponse.json(
      { error: "Failed to generate brand identity" },
      { status: 500 }
    );
  }
}
