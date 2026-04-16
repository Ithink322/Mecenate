import { StatusBar } from 'expo-status-bar';

import { FeedScreen } from './src/features/feed/feed-screen';
import { AppProviders } from './src/store/store-provider';

export default function App() {
  return (
    <AppProviders>
      <StatusBar style="dark" />
      <FeedScreen />
    </AppProviders>
  );
}
