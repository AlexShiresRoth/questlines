import { createContext, ReactNode, useState } from 'react';

type SearchContext = {
  updatedQuest: string | null;
  updateQuest: (quest: string | null) => void;
};

export const SearchContext = createContext<SearchContext>({
  updatedQuest: null,
  updateQuest: (_quest: string | null) => null,
});

type Props = {
  children: ReactNode;
};

export const SearchContextProvider = ({ children }: Props) => {
  const [updatedQuest, updateQuest] = useState<string | null>(null);

  return (
    <SearchContext.Provider value={{ updatedQuest, updateQuest }}>
      {children}
    </SearchContext.Provider>
  );
};
