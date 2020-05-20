import { updateProps } from '../entities';
import { updateLastFrame, updateCurrentFrame } from '../time';

export const getFilter = filters => ({ action }) =>
  // TODO: use type insteadof toString??
  (filters.includeUpdate || action.type !== updateProps.toString())
  && (filters.includeLastUpdated || action.type !== updateLastFrame.toString())
  && (filters.includeLastUpdated || action.type !== updateCurrentFrame.toString());
