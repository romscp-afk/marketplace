import sharp from "sharp";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const outPath = join(root, "public/brand/og-share.png");
const logoPath = join(root, "public/brand/aromza-logo.png");

const width = 1200;
const height = 630;
const background = "#FFFCF5";
const tagline = "Discover More, From A to Z";

const logoMeta = await sharp(logoPath).metadata();
const logoMaxWidth = 520;
const logoScale = logoMaxWidth / (logoMeta.width ?? logoMaxWidth);
const logoHeight = Math.round((logoMeta.height ?? 200) * logoScale);

const logoBuffer = await sharp(logoPath)
  .resize(logoMaxWidth, logoHeight, { fit: "inside" })
  .png()
  .toBuffer();

const taglineSvg = Buffer.from(`
<svg width="${width}" height="120" xmlns="http://www.w3.org/2000/svg">
  <text
    x="50%"
    y="50%"
    dominant-baseline="middle"
    text-anchor="middle"
    font-family="Arial, Helvetica, sans-serif"
    font-size="42"
    font-weight="600"
    fill="#1F2937"
  >${tagline}</text>
</svg>
`);

const logoTop = Math.round((height - logoHeight - 120 - 40) / 2);
const taglineTop = logoTop + logoHeight + 40;

await sharp({
  create: {
    width,
    height,
    channels: 4,
    background,
  },
})
  .composite([
    { input: logoBuffer, top: logoTop, left: Math.round((width - logoMaxWidth) / 2) },
    { input: taglineSvg, top: taglineTop, left: 0 },
  ])
  .png()
  .toFile(outPath);

console.log(`Wrote ${outPath}`);
