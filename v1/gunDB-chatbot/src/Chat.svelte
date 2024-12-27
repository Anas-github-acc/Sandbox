<script>
  import Login from './Login.svelte';
  import ChatBox from './ChatBox.svelte';
  import { username, loggedIn, user } from './user';
  import { onMount } from 'svelte';
  import debounce from 'lodash.debounce';

  import GUN from 'gun';

  // const db = new GUN('https://gunjs-chat.herokuapp.com/gun');
  const db = new GUN();

  let newMsg = $state('');
  let messages = $state([]);


  let scrollBottom = $state(null);
  let lastScrollTop ;
  let canAutoScroll = $state(true);
  let unreadMessages = $state(false);

  function autoScroll() {
    setTimeout(() => scrollBottom?.scrollIntoView({ behavior: 'auto' }), 50);
    unreadMessages = false;
  }

  function watchScroll(e) {
    canAutoScroll = (e.target.scrollTop || Infinity) > lastScrollTop;
    lastScrollTop = e.target.scrollTop;
  }

  let debouncedWatchScroll = $state(null);

  $effect(() => {
    debouncedWatchScroll = debounce(watchScroll, 1000);
  });

  onMount(() => {
    var match = {
      // lexical queries are kind of like a limited RegEx or Glob.
      '.': {
        // property selector
        '>': new Date(+new Date() - 1 * 1000 * 60 * 60 * 3).toISOString(), // find any indexed property larger ~3 hours ago
      },
      '-': 1, // filter in reverse
    };

    db.get('chat').map(match)
      .once(async (msg, id) => {
        if(msg) {
          const key = '$123';

          var message = {
            who: await db.get(msg).get('alias').then(),
            what: await SEA.decrypt(msg.what, key) + '', // force decryption to string
            when: GUN.state.is(msg, 'what'), // get the internal timestamp
          }

          console.log(message);
          if(message.what) {
            messages = [...messages.slice(-100), message].sort((a, b) => a.when - b.when);
            if (canAutoScroll) {
              autoScroll();
            } else {
              unreadMessages = true;
            }
          }
        }
      }
    );
  });

  async function sendMessage(event) {
    event.preventDefault()
    const encrypted = await SEA.encrypt(newMsg, '$123');

    const message = user.get('all').set({ what: encrypted});

    const index = new Date().toISOString();
    db.get('chat').get(index).put(message);
    newMsg = '';
    canAutoScroll = true;
    autoScroll();
  }

</script>

<div class="container">
  {#if $loggedIn}
    <main >
      {#each messages as message (message.when)}
        <ChatBox {message} sender={$username} />
      {/each}

      <div class="dummy" bind:this={scrollBottom}></div>
    </main>

    <form onsubmit={sendMessage}>
      <input type="text" placeholder="Type a message..." bind:value={newMsg} maxlength="100" />

      <button type="submit" disabled={!newMsg}>Send</button>
    </form>


    {#if !canAutoScroll}
    <div class="scroll-button">
      <button onclick={autoScroll} class:red={unreadMessages}>
        {#if unreadMessages}
          💬
        {/if}
        👇
      </button>
    </div>
   {/if}
  {:else}
    <main>
      <Login />
    </main>
  {/if}
</div>
