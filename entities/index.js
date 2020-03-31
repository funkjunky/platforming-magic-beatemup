import { metaEntitiesSelector } from './metaEntitySelector';

const magnitude = (x, y) => Math.sqrt(x*x + y*y);

let _id = 0;
export const createEntity = props => ({
    type: 'CREATE_ENTITY',
    entity: {
        id: ++_id,
        ...props
    },
    meta: metaEntitiesSelector
});

export const removeEntity = entity => ({
    type: 'REMOVE_ENTITY',
    entity: entity()
});

export default (state={}, { type, entity, percent, attack, distance, target, dt }) => {
    switch(type) {
        case 'CREATE_ENTITY':
            return {
                ...state,
                [entity.id]: {
                    x: 0,
                    y: 0,
                    ...entity
                }
            };

        case 'REMOVE_ENTITY':
            const newState = { ...state };
            delete newState[entity.id];
            return newState;

        case 'SEEK_STEP':
            const vx = target.x - entity.x;
            const vy = target.y - entity.y;
            const distanceFromTarget = magnitude(vx, vy);
            const normalX = vx / distanceFromTarget;
            const normalY = vy / distanceFromTarget;
            //console.log('distance, normals: ', distance, normalX, normalY);

            return {
                ...state,
                [entity.id]: {
                    ...state[entity.id],
                    x: state[entity.id].x + normalX * distance,
                    y: state[entity.id].y + normalY * distance
                }
            };

        default:
            return state;
    }
};
