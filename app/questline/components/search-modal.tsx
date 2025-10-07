"use client";
import { Quest } from "@/app/schemas";
import clsx from "clsx";
import { CornerUpLeft, Search, X } from "lucide-react";
import { Dispatch, RefObject, SetStateAction, useEffect } from "react";
import QuestItem from "./quest";

type Props = {
  showModal: boolean;
  toggleModal: Dispatch<SetStateAction<boolean>>;
  search: string;
  handleChange: (val: string) => void;
  reset: () => void;
  foundQuests: Quest[];
  timerRef: RefObject<NodeJS.Timeout | undefined>;
  setWait: Dispatch<SetStateAction<boolean>>;
  questlineId: string;
};

// TODO fix caching issue for search results on complete
export const SearchModal = ({
  search,
  showModal,
  toggleModal,
  handleChange,
  reset,
  foundQuests,
  timerRef,
  setWait,
  questlineId,
}: Props) => {
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setWait(false);
    }, 1500);

    if (!showModal) {
      clearTimeout(timerRef.current);
    }

    return () => {
      clearTimeout(timerRef.current);
      timerRef.current = undefined;
    };
  }, [showModal, setWait, timerRef]);

  return (
    <div
      className={clsx("text-orange-50", {
        "px-4 w-full md:w-1/2 bg-orange-400 dark:bg-emerald-900 rounded md:px-4 p-2 pt-4":
          showModal,
        "w-full bg-white/20 rounded": !showModal,
      })}
    >
      <div
        className={clsx("w-full p-2 flex items-center gap-2", {
          "bg-white/20 text-orange-50 rounded mb-4": showModal,
        })}
      >
        <Search size={20} className="text-orange-500" />
        <input
          type="text"
          placeholder="Search Quests by Whole Word"
          className="w-full outline-none bg-transparent placeholder:text-orange-50/40"
          name="search"
          value={search}
          onMouseUp={() => toggleModal(true)}
          onChange={(e) => handleChange(e.currentTarget.value)}
        />
        {showModal && (
          <div className="flex items-center gap-4 text-orange-50">
            <button type="button" onClick={() => reset()} className="block">
              <CornerUpLeft size={16} />
            </button>
            <span className="text-lg">|</span>
            <button type="button" onClick={() => toggleModal(false)}>
              <X size={16} />
            </button>
          </div>
        )}
      </div>
      {showModal && (
        <div className="flex flex-col gap-2 w-full">
          {foundQuests.map((quest, index) => (
            <QuestItem
              quest={{ ...quest, _id: quest._id }}
              key={quest._id}
              index={index}
              questlineId={questlineId}
            />
          ))}
          {foundQuests.length === 0 && (
            <div className="py-8 flex flex-col items-center">
              <p className="font-semibold text-lg">No Search Results</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
