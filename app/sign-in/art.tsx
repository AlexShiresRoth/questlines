import clsx from "clsx";

export const Hills = () => (
  <>
    <div
      id="hill-1"
      className="w-[35rem] h-[35rem] bg-green-600 rounded-full absolute -bottom-[25rem] md:-bottom-[23rem] -left-1/2 md:-left-[10%] z-50"
    ></div>
    <div
      id="hill-1"
      className="w-[35rem] h-[35rem] bg-green-700 rounded-full absolute -bottom-[23rem] md:-bottom-[21rem] -left-1/3 md:-left-[5%] z-10"
    ></div>
    <div
      id="hill-2"
      className="w-[35rem] h-[35rem] bg-green-800 rounded-full absolute -bottom-[27rem] md:-bottom-[20rem] left-1/3 md:left-1/4 z-20"
    ></div>
    <div
      id="hill-3"
      className="w-[35rem] h-[35rem] bg-green-900 rounded-full absolute -bottom-[23rem] left-1/4 md:-bottom-[20rem] md:left-1/2 z-0"
    ></div>
    <div
      id="hill-4"
      className="w-[35rem] h-[35rem] bg-green-700 rounded-full absolute -bottom-[26rem] -right-3/4 md:-bottom-[23rem] md:-right-[8rem] z-30"
    ></div>
  </>
);

type Props = {
  scale: string;
  bottom: string;
  right: string;
  leafColor: string;
};

export const Tree = ({ scale, bottom, right, leafColor }: Props) => (
  <div
    id="tree"
    className={clsx("absolute z-0", {
      [right]: right,
      [bottom]: bottom,
      [scale]: scale,
    })}
  >
    <div className="relative">
      <div className="rounded h-[140px] w-2.5 bg-amber-700 z-0" />
      <div className="rounded h-11 w-1.5 bg-amber-700 z-0 absolute -translate-y-[146px] translate-x-4 rotate-45" />
      <div className="rounded h-4 w-1.5 bg-amber-700 z-0 absolute -translate-y-[144px] translate-x-5 -rotate-45" />
      <div className="rounded h-10 w-2 bg-amber-700 z-0 absolute -translate-y-32 -translate-x-3 -rotate-[60deg]" />
      <div className="rounded h-4 w-1.5 bg-amber-700 z-0 absolute -translate-y-[127px] -translate-x-4 -rotate-6" />
      <div
        className={clsx(
          "rounded-full rounded-tr-none w-20 h-20 -top-7 -left-8 absolute -z-1 animate-shake",
          {
            [leafColor]: leafColor,
          }
        )}
      />
      <div
        className={clsx(
          "rounded-full rounded-bl-none w-20 h-20 -top-7 -left-10 absolute -z-1 animate-shake",
          {
            [leafColor]: leafColor,
          }
        )}
      />
      <div
        id="falling-leaf"
        className={clsx(
          "absolute rounded-full h-2 w-2 rounded-tr-none rounded-bl-none top-10 -left-[70%] md:-left-5 animate-fall-1",
          {
            [leafColor]: leafColor,
          }
        )}
      />
      <div
        id="falling-leaf"
        className={clsx(
          "absolute rounded-full h-2 w-2 rounded-tr-none rounded-bl-none top-4 -left-[102%] md:left-5 animate-fall-2",
          {
            [leafColor]: leafColor,
          }
        )}
      />
      <div
        id="falling-leaf"
        className={clsx(
          "absolute rounded-full h-2 w-2 rounded-tr-none rounded-bl-none top-4 -right-4 md:-right-8 animate-fall-3",
          {
            [leafColor]: leafColor,
          }
        )}
      />
    </div>
  </div>
);

export const Sword = () => (
  <div
    className="flex flex-col items-center scale-75 rotate-[196deg] absolute bottom-[30%] md:bottom-[10rem] left-1/3"
    id="sword"
  >
    <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-[9px] border-b-slate-300" />
    <div className="h-20 w-4 bg-slate-300 border-slate-300/90 border-2" />
    <div className="relative">
      <div className="w-10 h-2 bg-amber-500" />
      <div className="w-2 h-6 bg-amber-500 -rotate-12 absolute -left-2 bottom-0 rounded-tr-md" />
      <div className="w-2 h-6 bg-amber-500 rotate-12 absolute -right-2 bottom-0 rounded-tl-md" />
    </div>
    <div className="w-3 h-7 bg-amber-600" />
    <div className="w-4 h-4 rounded-full bg-amber-500 -translate-y-2" />
  </div>
);

export const Logo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    {/* <!-- Circular background --> */}
    <circle cx="32" cy="32" r="30" fill="#fb923c" />

    {/* <!-- Q shape --> */}
    <path
      d="M32,10 C19.85,10 10,19.85 10,32 C10,44.15 19.85,54 32,54 C44.15,54 54,44.15 54,32 C54,19.85 44.15,10 32,10 Z M32,50 C22.07,50 14,41.93 14,32 C14,22.07 22.07,14 32,14 C41.93,14 50,22.07 50,32 C50,41.93 41.93,50 32,50 Z"
      fill="#ffa94d"
    />

    {/* <!-- Q tail --> */}
    <path
      d="M40,40 L48,48"
      stroke="#ffa94d"
      stroke-width="5"
      stroke-linecap="round"
    />

    {/* <!-- Narrower blade but same length --> */}
    <path d="M29,32 L35,32 L35,8 L32,2 L29,8 Z" fill="#f1f5f9" />
    <path d="M32,2 L33.5,8 L33.5,32 L32,32 Z" fill="#ffffff" />
    <path d="M32,2 L30.5,8 L30.5,32 L32,32 Z" fill="#e2e8f0" />

    {/* <!-- Sword handle --> */}
    <rect x="30" y="32" width="4" height="10" fill="#7c2d12" />
    {/* <!-- Crossguard (kept wide) --> */}
    <rect x="23" y="32" width="18" height="3" rx="1" fill="#9a3412" />
    {/* <!-- Sword pommel --> */}
    <circle cx="32" cy="44" r="3" fill="#9a3412" />
  </svg>
);
