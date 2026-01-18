export const useSound = (url: string) => {
  const play = () => {
    const audio = new Audio(url);
    audio.volume = 0.5; // Biar nggak kagetin user
    audio.play().catch((e) => console.log('Audio play blocked by browser'));
  };
  return play;
};
