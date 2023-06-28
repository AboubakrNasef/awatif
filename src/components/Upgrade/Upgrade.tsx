import { Session, createClient } from "@supabase/supabase-js";
import { Show, createSignal } from "solid-js";

export const supabase = createClient(
  "https://cayyihbcbshvvffjtbky.supabase.co",
  import.meta.env.VITE_API_KEY || "dummy-key"
);

export function Upgrade() {
  const [session, setSession] = createSignal<Session | null>();

  async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://app.awatif.co/?app=123",
      },
    });
  }

  async function signInWithAzure() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "azure",
      options: {
        scopes: "email",
      },
    });
  }

  supabase.auth.onAuthStateChange((_event, session) => {
    setSession(session);
  });

  return (
    <>
      {/* @ts-ignore */}
      <button class="btn btn-xs btn-primary" onclick="my_modal_2.showModal()">
        Upgrade to Pro
      </button>

      <dialog id="my_modal_2" class="modal">
        <form method="dialog" class="modal-box w-11/12 max-w-2xl">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>

          <Show
            when={session()}
            fallback={
              <Login
                onGoogleClick={signInWithGoogle}
                onAzureClick={signInWithAzure}
              />
            }
          >
            <Plans />
          </Show>
        </form>
        <form method="dialog" class="modal-backdrop">
          <button />
        </form>
      </dialog>
    </>
  );
}

function Plans() {
  return (
    <>
      <h3 class="font-bold text-lg mb-5">Your plan!</h3>
      <div class="grid grid-cols-1 gap-6 mx-auto text-center mb-16 md:grid-cols-2">
        <div class="overflow-hidden border-2 border-gray-100 rounded-md p-5">
          <p class="mb-4 text-lg font-medium text-gray-500">BASIC</p>
          <p class="text-4xl font-bold mb-5">Free</p>
          <ul class="space-y-1">
            <li>For learning and evaluation</li>
            <li>All Pro features, but limited to 20 elements</li>
          </ul>
        </div>

        <div class="overflow-hidden border-2 border-gray-100 rounded-md p-5">
          <p class="mb-4 text-lg font-medium text-gray-500">PRO</p>
          <p class="text-4xl font-bold mb-5">$25/m</p>
          <ul class="space-y-1">
            <li>For day-to-day structural design</li>
            <li>Bar and frame elements</li>
          </ul>
        </div>
      </div>
    </>
  );
}

type LoginProps = {
  onGoogleClick: () => void;
  onAzureClick: () => void;
};

function Login(props: LoginProps) {
  return (
    <>
      <h3 class="font-bold text-lg mb-5">Please Login First</h3>
      <div class="flex flex-col space-y-3 w-2/3 mx-auto">
        <a class="btn btn-neutral" onclick={props.onGoogleClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            class="h-4 w-4"
            viewBox="0 0 256 256"
          >
            <path d="M128,228A100,100,0,1,1,198.71069,57.28906,12.0001,12.0001,0,1,1,181.74,74.25977,75.99547,75.99547,0,1,0,203.05371,140H128a12,12,0,0,1,0-24h88a12,12,0,0,1,12,12A100.11332,100.11332,0,0,1,128,228Z" />
          </svg>
          Continue with Google
        </a>
        <a class="btn btn-neutral" onclick={props.onAzureClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            class="h-4 w-4"
            viewBox="0 0 512 512"
          >
            <path d="M31.87,30.58H244.7V243.39H31.87Z" />
            <path d="M266.89,30.58H479.7V243.39H266.89Z" />
            <path d="M31.87,265.61H244.7v212.8H31.87Z" />
            <path d="M266.89,265.61H479.7v212.8H266.89Z" />
          </svg>
          Continue with Microsoft
        </a>
      </div>
    </>
  );
}