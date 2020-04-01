import { createStore, applyMiddleware } from 'redux';
import { createYieldEffectMiddleware } from 'redux-yield-effect';
import { put, fork, join } from 'redux-yield-effect/lib/effects';
import { tickMiddleware, resumeTicks, pauseTicks } from 'effect-tick';
import { createEntity } from './entities/index.js';
import reducer from './reducer.js';
import metaSelector from 'redux-meta-selector';
import graphics from './graphics.js';
import 'end-polyFills';

document.addEventListener('DOMContentLoaded', start);

if(module.hot) {
    module.hot.accept(() => {
        window.store.replaceReducer(reducer)
        window.cancelAnimationFrame(window.raf);
        window.raf = window.requestAnimationFrame(step)
    });
}

function step(dt) {
    graphics(window.ctx, window.store.getState(), dt);
    window.requestAnimationFrame(step);
};

function start() {
    window.store = createStore(
        reducer,
        applyMiddleware(
            createYieldEffectMiddleware(),
            tickMiddleware,
            metaSelector
        ),
    );
    store.dispatch(resumeTicks());

    window.ctx = document.querySelector('canvas').getContext('2d');
    window.raf = window.requestAnimationFrame(step);

    store.dispatch(createEntity({ x: 100 }));
};
