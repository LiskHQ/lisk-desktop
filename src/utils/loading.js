import { loadingStarted as loadingStartedAction, loadingFinished as loadingFinishedAction } from '../actions/loading';
import store from '../store';


export const loadingStarted = data => store.dispatch(loadingStartedAction(data));

export const loadingFinished = data => store.dispatch(loadingFinishedAction(data));
