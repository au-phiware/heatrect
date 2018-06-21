let samples = [];
let sum = 0, max = 0, mean = 0;
let fps = document.getElementById('fps') || createElement();
document.addEventListener('fps', e => {
  if (e.fps > 120) return;
  if (samples.length >= 60) {
    sum -= samples.pop();
  }
  samples.unshift(e.fps)
  sum += samples[0];
  if (samples[0] > max) {
    max = samples[0];
  }
  let s = (sum/samples.length).toFixed(1)
  fps.innerText = `${samples[0]}; ${s}; ${max} fps`;
}, false);
FPSMeter.run();

function createElement() {
  let fps = document.createElement('div');
  fps.id = 'fps';
  document.body.appendChild(fps);
  return fps;
}
