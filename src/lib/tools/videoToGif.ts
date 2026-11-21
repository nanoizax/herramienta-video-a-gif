import { loadFfmpeg } from "./ffmpegClient";

export interface GifOptions {
  startSeconds: number;
  durationSeconds: number;
  width: number; // ancho de salida en px, alto se calcula manteniendo proporcion
  fps: number;
}

export interface GifProgress {
  stage: "loading" | "palette" | "encoding";
  ratio?: number; // 0-1, cuando ffmpeg lo reporta
}

export async function videoToGif(
  file: File,
  { startSeconds, durationSeconds, width, fps }: GifOptions,
  onProgress?: (p: GifProgress) => void
): Promise<Blob> {
  const ffmpeg = await loadFfmpeg(onProgress);

  ffmpeg.on("progress", ({ progress }) => {
    onProgress?.({ stage: "encoding", ratio: progress });
  });

  const { fetchFile } = await import("@ffmpeg/util");
  const inputName = "input" + (file.name.match(/\.[^.]+$/)?.[0] || ".mp4");
  await ffmpeg.writeFile(inputName, await fetchFile(file));

  const scaleFilter = `fps=${fps},scale=${width}:-1:flags=lanczos`;

  onProgress?.({ stage: "palette" });
  await ffmpeg.exec([
    "-ss", String(startSeconds),
    "-t", String(durationSeconds),
    "-i", inputName,
    "-vf", `${scaleFilter},palettegen`,
    "palette.png",
  ]);

  onProgress?.({ stage: "encoding", ratio: 0 });
  await ffmpeg.exec([
    "-ss", String(startSeconds),
    "-t", String(durationSeconds),
    "-i", inputName,
    "-i", "palette.png",
    "-filter_complex", `${scaleFilter}[x];[x][1:v]paletteuse`,
    "output.gif",
  ]);

  const data = await ffmpeg.readFile("output.gif");
  return new Blob([data as Uint8Array], { type: "image/gif" });
}
