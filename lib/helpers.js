export const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export const formatAudio = (audio) => {
  const arrayBuff = new Uint8Array(
    atob(audio)
      .split("")
      .map((char) => char.charCodeAt(0))
  ).buffer;
  const blob = new Blob([arrayBuff], { type: "audio/webm" });
  const url = URL.createObjectURL(blob);

  return url;
};
