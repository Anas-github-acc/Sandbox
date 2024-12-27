import GUN from 'gun';
import 'gun/sea';
import 'gun/axe';
import { writable } from 'svelte/store';

export const db = new GUN()
export const user = db.user().recall({ sessionStorage: true });

export const loggedIn = writable(false);
export const username = writable(''); // Store to keep track of the current user's alias

// Update the loggedIn store when the user logs in or out
user.get('alias').on((alias) => {
  loggedIn.set(!!alias);
  username.set(alias);
});

db.on('auth', async(e) => {
  const alias = await user.get('alias');
  username.set(alias);
  loggedIn.set(!!alias);
  console.log('auth: user signed-in as ', alias);
})

export const login = async (alias, pass) => {
  await user.auth(
    alias,
    pass,
    ({ err }) => {
      err && console.error(err)
    }
  );
};

export const logout = async () => {
  try {
    await user.leave();
  } catch (err) {
    console.error(err);
  }
  loggedIn.set(false);
  username.set('');
};

export const signup = async (alias, pass) => {
  user.create(
    alias,
    pass,
    ({ err }) => {
      err && console.error(err)
    }
  );
};