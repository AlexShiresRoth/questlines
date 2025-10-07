"use client";
import { Quest } from "@/app/schemas";
import clsx from "clsx";
import { debounce } from "lodash";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { searchQuest } from "../quest.action";
import { SearchContext, SearchContextProvider } from "./search-context";
import { SearchModal } from "./search-modal";

type Props = {
  questLine: string;
};

const SearchQuestContent = ({ questLine }: Props) => {
  const { updatedQuest } = useContext(SearchContext);
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const [showModal, toggleModal] = useState(false);
  const [foundQuests, setFoundQuests] = useState<Quest[]>([]);
  const [search, setSearch] = useState("");
  const [wait, setWait] = useState(true);

  const handleContainerClick = useCallback(
    (e: MouseEvent) => {
      if (wait) return;

      if ((e.target as HTMLElement)?.id) {
        toggleModal(false);
      }
    },
    [wait]
  );

  const reset = () => {
    setFoundQuests([]);
    setSearch("");
  };

  const handleSearch = async (searchTerm: string) => {
    try {
      if (searchTerm.length <= 3) return;

      const questsCache = await searchQuest(searchTerm, questLine);

      const quests = questsCache;

      setFoundQuests(quests);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (searchTerm: string) => {
    setSearch(searchTerm);
  };

  const debouncedSearch = useCallback(debounce(handleSearch, 300), []);

  useEffect(() => {
    if (search) {
      debouncedSearch(search);
    }
  }, [search, debouncedSearch, updatedQuest]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.addEventListener("click", (e) => handleContainerClick(e));
    }

    return () =>
      document.body.removeEventListener("click", (e) =>
        handleContainerClick(e)
      );
  }, [handleContainerClick]);

  return (
    <div
      className={clsx({
        "fixed w-screen h-screen z-50 bg-black/30 flex flex-col items-center top-0 left-0 px-4 py-16 md:px-16 opacity-100 overflow-y-auto":
          showModal,
        "w-full md:w-1/2": !showModal,
      })}
      id="container"
    >
      <SearchModal
        search={search}
        handleChange={handleChange}
        toggleModal={toggleModal}
        showModal={showModal}
        reset={reset}
        foundQuests={foundQuests}
        timerRef={timerRef}
        setWait={setWait}
        questlineId={questLine}
      />
    </div>
  );
};

export const SearchQuest = ({ questLine }: Props) => {
  return (
    <SearchContextProvider>
      <SearchQuestContent questLine={questLine} />
    </SearchContextProvider>
  );
};
