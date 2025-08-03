window.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("player");
  const pulse = document.getElementById("pulse-circle");

  if (!audio || !pulse) return;

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioCtx.createMediaElementSource(audio);
  const analyser = audioCtx.createAnalyser();

  source.connect(analyser);
  analyser.connect(audioCtx.destination);

  analyser.fftSize = 32;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  function animatePulse() {
    requestAnimationFrame(animatePulse);
    analyser.getByteFrequencyData(dataArray);
    const avg = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
    const scale = 1 + avg / 256;
    pulse.style.transform = `scale(${scale.toFixed(2)})`;
  }

  window.addEventListener("click", () => {
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    animatePulse();
  }, { once: true });
});