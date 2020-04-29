export const createState = (state, extraProps = {}) => ({ [state]: { createdAt: Date.now(), ...extraProps } });
