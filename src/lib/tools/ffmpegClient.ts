export interface FfmpegProgress {
  stage: "loading" | "encoding" | "palette";
  ratio?: number;
}

/**
 * ffmpeg.wasm se carga on-demand (nunca en el bundle inicial: pesa ~30MB).
 * Compartido entre video-a-gif y comprimir-video para no duplicar la carga
 * ni el manejo de progreso.
 */
export async function loadFfmpeg(onProgress?: (p: FfmpegProgress) => void) {
  onProgress?.({ stage: "loading" });
  const [{ FFmpeg }, { toBlobURL }] = await Promise.all([
    import("@ffmpeg/ffmpeg"),
    import("@ffmpeg/util"),
  ]);
  const coreUrl = (await import("@ffmpeg/core?url")).default;
  const wasmUrl = (await import("@ffmpeg/core/wasm?url")).default;

  const ffmpeg = new FFmpeg();
  const [coreURL, wasmURL] = await Promise.all([
    toBlobURL(coreUrl, "text/javascript"),
    toBlobURL(wasmUrl, "application/wasm"),
  ]);
  await ffmpeg.load({ coreURL, wasmURL });
  return ffmpeg;
}
