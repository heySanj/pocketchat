<script lang="ts">
  import dayjs from "dayjs";
  import relativeTime from "dayjs/plugin/relativeTime";
  import { currentUser } from "./pocketbase";
  export let message: any;

  dayjs.extend(relativeTime);
</script>

<div
  class="chat py-4 {message.expand?.user.id === $currentUser?.id
    ? 'chat-end'
    : 'chat-start'}"
>
  <div class="chat-image avatar">
    <div class="w-16 rounded-full border-2 border-neutral">
      <img
        src="https://api.dicebear.com/7.x/notionists/svg?seed={message.expand
          .user.username}&scale=150{message.expand.user.id === $currentUser?.id
          ? '&flip=true'
          : ''}"
        alt="avatar"
        class="mt-1"
      />
    </div>
  </div>
  <div class="chat-header self-end pb-2 font-black">
    @{message.expand?.user?.username}
    <time class="text-xs opacity-70 font-normal">
      - {dayjs(message.created).fromNow()}</time
    >
  </div>
  <div
    class="chat-bubble {message.expand.user.id === $currentUser?.id
      ? 'chat-bubble-secondary'
      : ''}"
  >
    {message.text}
  </div>
</div>
