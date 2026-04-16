import { makeAutoObservable } from 'mobx';

import { formatClockTime } from '../utils/format';

export class FeedUiStore {
  isPullRefreshing = false;
  lastSuccessfulSyncAt: number | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  beginPullRefresh() {
    this.isPullRefreshing = true;
  }

  endPullRefresh() {
    this.isPullRefreshing = false;
  }

  markSuccessfulSync(timestamp = Date.now()) {
    this.lastSuccessfulSyncAt = timestamp;
  }

  get syncLabel() {
    if (!this.lastSuccessfulSyncAt) {
      return 'Свежие публикации загружаются';
    }

    return `Обновлено в ${formatClockTime(this.lastSuccessfulSyncAt)}`;
  }
}
