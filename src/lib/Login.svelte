<script lang="ts">
  import type { ClientResponseError } from "pocketbase";
  import { currentUser, pb } from "./pocketbase";
  import toast, { Toaster, type ToastOptions } from "svelte-french-toast";
  import { capitalCase } from "change-case";

  let username: string;
  let password: string;

  const login = async () => {
    await pb
      .collection("users")
      .authWithPassword(username, password)
      .catch((error: ClientResponseError) => {
        generateLoginToasts(error);
      });
  };

  const signUp = async () => {
    try {
      const data = {
        username,
        password,
        passwordConfirm: password,
        name: username,
      };
      await pb
        .collection("users")
        .create(data)
        .catch((error: ClientResponseError) => {
          generateLoginToasts(error);
        });
      await login();
    } catch (error) {
      console.error(error);
    }
  };

  const signOut = () => {
    pb.authStore.clear();
  };

  const generateLoginToasts = (error: ClientResponseError) => {
    const errorFields = error.response.data;

    const toastOptions: ToastOptions = {
      position: "bottom-center",
      className: "!bg-error !text-base-100",
      icon: "⚠️",
    };
    Object.keys(errorFields).length > 0
      ? Object.keys(errorFields).map((k) => {
          const errorKey = k !== "passwordConfirm" ? capitalCase(k) : "";
          errorKey &&
            toast.error(`${errorKey}: ${errorFields[k].message}`, toastOptions);
        })
      : toast.error(`${error.message}`, toastOptions);
  };
</script>

<Toaster />
{#if $currentUser}
  <p class="my-4">
    Signed in as <b>{$currentUser.username}</b>
    <button on:click={signOut} class="italic opacity-40">(Log Out?)</button>
  </p>
{:else}
  <form on:submit|preventDefault class="mt-4 flex flex-col gap-y-2">
    <input
      placeholder="Username"
      required
      type="text"
      bind:value={username}
      class="textarea textarea-bordered flex-grow"
    />
    <input
      placeholder="Password"
      required
      type="password"
      bind:value={password}
      class="textarea textarea-bordered flex-grow"
    />
    <button on:click={signUp} class="btn btn-secondary text-md">Sign Up</button>
    <button on:click={login} class="btn btn-neutral text-md">Login</button>
  </form>
{/if}
