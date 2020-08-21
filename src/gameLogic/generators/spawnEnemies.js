import { put, call } from 'rye-middleware/lib/effects';
import { createEntity } from 'gameLogic/entities';
import { characterWidth } from '../../loadResources';
import { sleep } from './tick';

const spawnLocations = [
  { x: 30, y: 300 },
  //{ x: 60, y: 100 },
  //{ x: canvasWidth - 130, y: 300 },
  //{ x: canvasWidth - 160, y: 100 },
];

export default function* spawnEnemies() {
  for(const { x, y } of spawnLocations) {
    yield call(sleep, 2000);
    yield put(createDoppleganger({ x, y, width: characterWidth, height: characterWidth, maxHp: 12, hp: 12 }));
  }
}

// TODO: replace doppleganger with the entity `type` property
const createDoppleganger = props => createEntity({ type: 'doppleganger', props });
