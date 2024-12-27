import { createAvator } from '@dicebear/core';
import { adventurerNeutral } from '@dicebear/collection'; 


export const avatar = (seed) => {
  const avatar = createAvator(adventurerNeutral, {
    seed: seed,
  }).toString;
  return avatar;
}

// export const avatarSvg = avatar.toString();