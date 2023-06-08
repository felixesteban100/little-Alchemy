import { signIn, signOut, useSession } from "next-auth/react";
// import { api } from "~/utils/api";

export default function AuthShowCase(){
    const { data: sessionData } = useSession();

    /* const getElementsByUser = api.user.getAllElementsByUser.useMutation({
      onSuccess: (elements) => {
        console.log("elements", elements)
      }
    }) */

    /* function afterSignIn(){
        getElementsByUser.mutate()
    } */
  
    return (
      <div className="flex flex-row items-center justify-center gap-4 py-2">
        <p className="text-center text-md md:text-2xl">
          {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        </p>
        {sessionData?.user.image && <img className="h-8" src={sessionData.user?.image} alt="" />}
        <button
          className="rounded-full bg-secondary/10 px-10 py-3 font-semibold no-underline transition hover:bg-primary/20"
          onClick={sessionData ? () => {
            void signOut()
          } : () => {
            void signIn()
            // afterSignIn()
          }}
        >
          {sessionData ? "Sign out" : "Sign in"}
        </button>
      </div>
    );
}