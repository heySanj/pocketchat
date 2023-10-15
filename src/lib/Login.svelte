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
  <p class="mb-4">
    Signed in as <b>{$currentUser.username}</b>
  </p>
{:else}
  <form on:submit|preventDefault>
    <input placeholder="Username" type="text" bind:value={username} />
    <input placeholder="Password" type="password" bind:value={password} />
    <button on:click={signUp}>Sign Up</button>
    <button on:click={login}>Login</button>
  </form>
{/if}
