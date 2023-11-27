<script lang="ts">
  import type { ClientResponseError } from "pocketbase";
  import { currentUser, pb } from "./pocketbase";
  import toast, { Toaster, type ToastOptions } from "svelte-french-toast";
  import { capitalCase } from "change-case";

  interface ValidationErrors {
    username: string;
    password: string;
  }

  let username: string;
  let password: string;
  let errors: ValidationErrors = {
    username: "",
    password: "",
  };

  const login = async () => {
    clearErrors();
    await pb
      .collection("users")
      .authWithPassword(username, password)
      .catch((error: ClientResponseError) => {
        generateLoginToasts(error);
      });
  };

  const signUp = async () => {
    clearErrors();
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
        .then(async () => {
          await login();
        })
        .catch((error: ClientResponseError) => {
          generateLoginToasts(error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const signOut = () => {
    pb.authStore.clear();
  };

  const clearErrors = () => {
    Object.keys(errors).forEach(
      (k) => (errors[k as keyof ValidationErrors] = "")
    );
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
          if (k in errors) {
            errors[k as keyof ValidationErrors] = errorFields[k].message;
          }
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
      id="username"
      placeholder="Username"
      type="text"
      bind:value={username}
      class={`textarea textarea-bordered flex-grow ${
        errors.username && "textarea-error"
      }`}
    />
    {#if errors.username}
      <label class="label pt-0" for="username">
        <span class="label-text-alt text-xs text-error">{errors.username}</span>
      </label>
    {/if}

    <input
      placeholder="Password"
      type="password"
      bind:value={password}
      class={`textarea textarea-bordered flex-grow ${
        errors.password && "textarea-error"
      }`}
    />
    {#if errors.password}
      <label class="label pt-0" for="username">
        <span class="label-text-alt text-xs text-error">{errors.password}</span>
      </label>
    {/if}
    <button on:click={signUp} class="btn btn-secondary text-md">Sign Up</button>
    <button on:click={login} class="btn btn-neutral text-md">Login</button>
  </form>
{/if}
