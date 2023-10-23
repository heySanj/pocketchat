<script lang="ts">
  import { currentUser, pb } from "./pocketbase";

  let username: string;
  let password: string;

  const login = async () => {
    await pb.collection("users").authWithPassword(username, password);
  };

  const signUp = async () => {
    try {
      const data = {
        username,
        password,
        passwordConfirm: password,
        name: username,
      };
      const createdUser = await pb.collection("users").create(data);
      await login();
    } catch (error) {
      // handle error
      console.error(error);
    }
  };

  const signOut = () => {
    pb.authStore.clear();
  };
</script>

{#if $currentUser}
  <p class="my-4">
    Signed in as <b>{$currentUser.username}</b>
    <button on:click={signOut} class="italic opacity-40">(Log Out?)</button>
  </p>
{:else}
  <form on:submit|preventDefault class="mt-4 flex">
    <input
      placeholder="Username"
      type="text"
      bind:value={username}
      class="textarea textarea-bordered flex-grow mr-2"
    />
    <input
      placeholder="Password"
      type="password"
      bind:value={password}
      class="textarea textarea-bordered flex-grow mr-2"
    />
    <button on:click={signUp} class="btn btn-secondary text-md mr-2"
      >Sign Up</button
    >
    <button on:click={login} class="btn btn-neutral text-md">Login</button>
  </form>
{/if}
