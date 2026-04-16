import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from 'react';

import { createRootStore, type RootStore } from './root-store';

const RootStoreContext = createContext<RootStore | null>(null);

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        refetchOnReconnect: true,
      },
    },
  });

export const AppProviders = ({ children }: PropsWithChildren) => {
  const [rootStore] = useState(createRootStore);
  const [queryClient] = useState(createQueryClient);

  return (
    <RootStoreContext.Provider value={rootStore}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </RootStoreContext.Provider>
  );
};

export const useRootStore = () => {
  const value = useContext(RootStoreContext);

  if (!value) {
    throw new Error('RootStoreProvider is missing');
  }

  return value;
};
