import { makeAutoObservable } from 'mobx';

import type { PostTier } from '../api/types';
import { formatClockTime } from '../utils/format';

export type FeedTierFilter = 'all' | PostTier;

export class FeedUiStore {
  isPullRefreshing = false;
  lastSuccessfulSyncAt: number | null = null;
  selectedTier: FeedTierFilter = 'all';

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

  setSelectedTier(tier: FeedTierFilter) {
    this.selectedTier = tier;
  }

  get apiTier() {
    return this.selectedTier === 'all' ? undefined : this.selectedTier;
  }

  get syncLabel() {
    if (!this.lastSuccessfulSyncAt) {
      return 'Свежие публикации загружаются';
    }

    return `Обновлено в ${formatClockTime(this.lastSuccessfulSyncAt)}`;
  }
}
