import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Download } from "lucide-react";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import FileDropZone from "@/components/tools/FileDropZone";
import { Button } from "@/components/ui/button";
import { videoToGif, type GifProgress } from "@/lib/tools/videoToGif";

const WIDTH_OPTIONS = [320, 480, 640];
const FPS_OPTIONS = [8, 12, 15];

const VideoAGifPage = () => {
  const { t } = useTranslation("tools");

  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [start, setStart] = useState(0);
  const [clipLength, setClipLength] = useState(3);
  const [width, setWidth] = useState(480);
  const [fps, setFps] = useState(12);

  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState<GifProgress | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (selected: File) => {
    setFile(selected);
    setVideoUrl(URL.createObjectURL(selected));
    setGifUrl(null);
    setError(null);
  };

  const reset = () => {
    setFile(null);
    setVideoUrl(null);
    setGifUrl(null);
    setError(null);
    setProgress(null);
  };

  const handleConvert = async () => {
    if (!file) return;
    setProcessing(true);
    setError(null);
    try {
      const blob = await videoToGif(
        file,
        { startSeconds: start, durationSeconds: clipLength, width, fps },
        setProgress
      );
      setGifUrl(URL.createObjectURL(blob));
    } catch {
      setError(t("ui.error_generic"));
    } finally {
      setProcessing(false);
      setProgress(null);
    }
  };

  const optionButtonClass = (active: boolean) =>
    `rounded-full px-4 py-1.5 text-sm ${
      active
        ? "bg-white text-black"
        : "bg-transparent text-white border border-neutral-700 hover:bg-white/10"
    }`;

  const progressLabel = () => {
    if (!progress) return t("ui.processing");
    if (progress.stage === "loading") return t("ui.gif_loading_ffmpeg");
    if (progress.stage === "palette") return t("ui.gif_stage_palette");
    return t("ui.gif_stage_encoding");
  };

  return (
    <ToolPageLayout toolId="video-a-gif">
      <div className="border border-neutral-800 rounded-xl p-6 md:p-8">
        {!file || !videoUrl ? (
          <FileDropZone
            accept="video/mp4,video/webm,video/quicktime"
            label={t("ui.upload_label_video")}
            hint={t("ui.upload_hint_video")}
            onFile={handleFile}
            toolId="video-a-gif"
          />
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-400 truncate max-w-[60%]">{file.name}</span>
              <Button
                variant="outline"
                onClick={reset}
                className="rounded-full px-6 border-neutral-700 text-white bg-transparent hover:bg-white/10"
              >
                {t("ui.reset_button_file")}
              </Button>
            </div>

            <video
              src={videoUrl}
              controls
              className="w-full max-h-72 rounded-lg bg-black"
              onLoadedMetadata={(e) => {
                const d = e.currentTarget.duration || 0;
                setDuration(d);
                setClipLength(Math.min(3, d || 3));
              }}
            />

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-neutral-400 text-sm mb-2">{t("ui.gif_start_label")}</p>
                <input
                  type="number"
                  min={0}
                  max={Math.max(duration - 0.5, 0)}
                  step={0.5}
                  value={start}
                  onChange={(e) => setStart(Math.max(Number(e.target.value) || 0, 0))}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neutral-600"
                />
              </div>
              <div>
                <p className="text-neutral-400 text-sm mb-2">{t("ui.gif_duration_label")}</p>
                <input
                  type="number"
                  min={0.5}
                  max={10}
                  step={0.5}
                  value={clipLength}
                  onChange={(e) => setClipLength(Math.min(Math.max(Number(e.target.value) || 1, 0.5), 10))}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-neutral-600"
                />
              </div>
            </div>

            <div>
              <p className="text-neutral-400 text-sm mb-2">{t("ui.gif_width_label")}</p>
              <div className="flex gap-2">
                {WIDTH_OPTIONS.map((w) => (
                  <button key={w} onClick={() => setWidth(w)} className={optionButtonClass(width === w)}>
                    {w}px
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-neutral-400 text-sm mb-2">{t("ui.gif_fps_label")}</p>
              <div className="flex gap-2">
                {FPS_OPTIONS.map((f) => (
                  <button key={f} onClick={() => setFps(f)} className={optionButtonClass(fps === f)}>
                    {f} fps
                  </button>
                ))}
              </div>
            </div>

            <p className="text-neutral-500 text-xs">{t("ui.gif_first_time_notice")}</p>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <div className="flex flex-wrap gap-3">
              {!gifUrl ? (
                <Button
                  onClick={handleConvert}
                  isLoading={processing}
                  loadingText={progressLabel()}
                  className="bg-white text-black hover:bg-white/80 rounded-full px-8"
                >
                  {t("ui.gif_convert_button")}
                </Button>
              ) : (
                <a href={gifUrl} download={`${file.name.replace(/\.[^.]+$/, "")}.gif`}>
                  <Button className="bg-white text-black hover:bg-white/80 rounded-full px-8">
                    <Download className="w-4 h-4" />
                    {t("ui.download_button")}
                  </Button>
                </a>
              )}
            </div>

            {gifUrl && (
              <div>
                <p className="text-neutral-400 text-sm mb-2">{t("ui.after_label")}</p>
                <img src={gifUrl} alt="GIF" className="max-w-full rounded-lg border border-neutral-800" />
              </div>
            )}
          </div>
        )}
      </div>
    </ToolPageLayout>
  );
};

export default VideoAGifPage;
