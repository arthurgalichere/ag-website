window.AGSite = {
  restartReveal(element) {
    if (!element) return;

    element.classList.remove('reveal');
    void element.offsetWidth;
    element.classList.add('reveal');
  }
};