import { updateProps } from '../entities';
import { update } from '../lastUpdated';

export const filter = filters => ({ action }) =>
  // TODO: use type insteadof toString??
  (filters.includeUpdate || action.type !== updateProps.toString())
  && (filters.includeLastUpdated || action.type !== update.toString());
