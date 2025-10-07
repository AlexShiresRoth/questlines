import { Hills, Sword, Tree } from "./art";
import { FacebookSignIn, GoogleSignIn } from "./sign-in-form";

export default async function SignIn() {
  return (
    <main className="flex flex-col md:flex-row gap-4 p-0 md:p-8 w-full min-h-screen md:max-h-screen md:h-screen relative">
      <div className="rounded-b-full md:rounded-xl h-[450px] md:h-full w-full md:w-1/2 flex flex-col items-center justify-center relative overflow-hidden -mt-[20%] md:-mt-0">
        <div className="-z-0 h-full w-full absolute bottom-0 left-0 bg-gradient-to-t from-red-500 from- via-orange-400 via- to-orange-400 to-" />
        <Hills />
        <Tree
          scale="scale-[2.5]"
          right="right-[16%]"
          bottom="bottom-44"
          leafColor="bg-amber-200"
        />
        <Tree
          scale="scale-0 md:scale-[2]"
          right="right-[44%]"
          bottom="bottom-48"
          leafColor="bg-red-300"
        />
        <Tree
          scale="scale-[3]"
          right="right-3/4"
          bottom="bottom-44"
          leafColor="bg-rose-200"
        />
        <Sword />
      </div>
      <div className="flex flex-col justify-center gap-2 rounded p-8 mx-4 md:mx-0 md:-mt-0 z-50 shadow-lg md:shadow-none md:w-1/2">
        <div className="w-full pb-4 flex flex-col gap-4">
          <h1 className="text-4xl md:text-8xl dark:text-orange-50 text-center md:text-left">
            Welcome <br /> to Questlines
          </h1>
          <p className="text-gray-400 text-lg md:text-2xl dark:text-orange-100 text-center md:text-left">
            Sign in via social providers
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between my-4 gap-4">
          <GoogleSignIn />
          <FacebookSignIn />
        </div>
      </div>
    </main>
  );
}
