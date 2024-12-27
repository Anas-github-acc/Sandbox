import { mount } from 'svelte';
import App from './App.svelte';

const app = mount(App,{
  target: document.body,
  hydrate: true
})

export default app;