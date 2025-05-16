window.addEventListener('load', () => {
  const sound = document.getElementById('engine-sound');
  sound.play().catch(e => {
    console.log("El sonido no se pudo reproducir automáticamente:", e);
  });
});
