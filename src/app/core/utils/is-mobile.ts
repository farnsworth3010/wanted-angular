export const isMobileWidth = (): boolean => {
  if (window.innerWidth < 769) {
    return true;
  }
  return false;
};
