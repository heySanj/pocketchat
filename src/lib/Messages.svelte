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
    <div
      class="chat py-4 {message.expand.user.id === $currentUser?.id
        ? 'chat-end'
        : 'chat-start'}"
    >
      <div class="chat-image avatar">
        <div class="w-24 rounded-full border-2 border-neutral">
          <img
            src="https://api.dicebear.com/7.x/notionists/svg?seed={message
              .expand.user.username}"
            alt="avatar"
          />
        </div>
      </div>
      <div class="chat-header self-end pb-2 font-black">
        @{message.expand?.user?.username}
        <time class="text-xs opacity-40 font-normal"> - {message.created}</time>
      </div>
      <div
        class="chat-bubble {message.expand.user.id === $currentUser?.id
          ? 'chat-bubble-secondary'
          : ''}"
      >
        {message.text}
      </div>
    </div>
  {/each}
</div>

<form on:submit|preventDefault={sendMessage}>
  <input placeholder="Message" type="text" bind:value={newMessage} />
  <button type="submit" class="btn btn-neutral">Send</button>
</form>
