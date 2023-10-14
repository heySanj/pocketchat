<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { currentUser, pb } from "./pocketbase";

  let newMessage: string;
  let messages: any[] = [];
  let unsubscribe: () => void;

  onMount(async () => {
    // get messages from 1 - 50
    const resultList = await pb.collection("messages").getList(1, 50, {
      sort: "created",
      expand: "user", // Join the user table to get user data for each message
    });

    messages = resultList.items;

    // Subscribe to realtime messages
    unsubscribe = await pb
      .collection("messages")
      .subscribe("*", async ({ action, record }) => {
        if (action === "create") {
          // Fetch associated user and then push their new message
          const user = await pb.collection("users").getOne(record.user);
          record.expand = { user };
          messages = [...messages, record];
        }
        if (action === "delete") {
          messages = messages.filter((m) => m.id !== record.id);
        }
      });
  });

  onDestroy(() => {
    unsubscribe();
  });

  const sendMessage = async () => {
    const data = {
      text: newMessage,
      user: $currentUser?.id,
    };
    const createdMessage = await pb.collection("messages").create(data);
    newMessage = "";
  };
</script>

<div class="messages">
  {#each messages as message (message.id)}
    <div class="message">
      <div>
        <small>
          Sent by @{message.expand?.user?.username}
        </small>
        <p class="msg-text">{message.text}</p>
      </div>
    </div>
  {/each}
</div>

<form on:submit|preventDefault={sendMessage}>
  <input placeholder="Message" type="text" bind:value={newMessage} />
  <button type="submit">Send</button>
</form>
