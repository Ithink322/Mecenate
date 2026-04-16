import { makeAutoObservable } from 'mobx';

import { env } from '../config/env';

export class SessionStore {
  apiBaseUrl = env.apiBaseUrl;
  userId = env.userId;
  simulateError = env.simulateError;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }
}
