<script>
  import { username, loggedIn, logout } from './user';
</script>


<header>
    <img src="logo.jpg" alt="">
    {#if $loggedIn}
      <div class="user-bio">
        <span>Hello <strong>{$username}</strong></span>
        <img src={`https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${$username}`} alt="avatar" /> 
      </div>
  
      <button class="signout-button" onclick={logout}>Sign out</button>
      {:else}

        <h3>ChatME</h3>
    {/if}
  </header>