import graphics from './index';

const step = (ctx, resources, getState) => dt => {
  graphics(ctx, getState(), resources, dt);
  // hmmmmm this one window reference is tricky to remove
  window.raf = window.requestAnimationFrame(step(ctx, resources, getState));
};

export const loadRaf = (resources, getState) => {
  const ctx = document.querySelector('canvas').getContext('2d');
  window.raf = window.requestAnimationFrame(step(ctx, resources, getState));
};
