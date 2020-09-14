import { printFirstThreeDiffs, printType, printPlayer } from './printers';
import { getDiff } from './getDiff';
import { getFilter } from './getFilter';

// returns middleware and a function to change the filters
// This is an opinionated logger for my use for this game
const logger = () => {
  let filters = {};
  let oldCount = -1;

  return {
    changeFilters: _filters => {
      filters = _filters;
      oldCount = -1;  // This gaurentees we'll re-render the logs next action.
    },
    middleware: store => {
      const logs = [];
      let oldResult = store.getState();
      return next => action => {
        const result = next(action);
        const diff = getDiff(store.getState(), oldResult);
        oldResult = store.getState();
        logs.unshift({ action, diff, time: Date.now() });
        const filteredLogs = logs.filter(getFilter(filters));
        // we check lazily if the filtered logs has changed.
        if (oldCount !== filteredLogs.length) {
          printType(filteredLogs);
        }
        oldCount = filteredLogs.length;
        return result;
      };
    },
  };
};

export default logger;
