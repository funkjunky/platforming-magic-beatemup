import { updateProps } from '../entities';
import { update } from '../lastUpdated';
import { printType } from './printers';
import { getDiff } from './getDiff';

// returns middleware and a function to change the filters
// This is an opinionated logger for my use for this game
const logger = () => {
  let filters = {};
  const filter = ({ action }) =>
    // TODO: use type insteadof toString??
    (filters.includeUpdate || action.type !== updateProps.toString())
    && (filters.includeLastUpdated || action.type !== update.toString());

  return {
    middleware: store => {
      const logs = [];
      let oldCount = logs.length;
      let oldResult = store.getState();
      return next => action => {
        const result = next(action);
        // TODO: maybe clone the result andold result before putting it in getDiff or maybe just copy and freeze?? I dunno...
        const diff = getDiff(store.getState(), oldResult);
        oldResult = store.getState();
        logs.unshift({ action, diff, time: Date.now() });
        const filteredLogs = logs.filter(filter);
        // TODO: also do this hen filters change. Consider my above restriction on updating logger
        if (oldCount !== filteredLogs.length) {
          printType(filteredLogs);
        }
        oldCount = filteredLogs.length;
        return result;
      };
    },
    changeFilters: _filters => filters = _filters,
  };
};

export default logger;
