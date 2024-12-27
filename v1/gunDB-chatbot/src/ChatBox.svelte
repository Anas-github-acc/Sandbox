<script>
  export let message;
  export let sender;

  const messageClass = message.who == sender ? 'sent' : 'recieved';

  const avatar = `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${message.who}`;

  const time = new Date(message.when);

  // $effect(() => {
  //   console.log(message);
  // });

  console.log(message);

</script>

<div class={`message ${messageClass}`}>
  <img src={avatar} alt="avatar" /> 
  <div class="message-text">
    <p>{message.what}</p>

    <time>{time.toLocaleTimeString}</time>
  </div>
</div>