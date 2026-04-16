import { FeedUiStore } from './feed-ui-store';
import { SessionStore } from './session-store';

export class RootStore {
  readonly sessionStore = new SessionStore();
  readonly feedUiStore = new FeedUiStore();
}

export const createRootStore = () => new RootStore();
