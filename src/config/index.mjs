const config = (() => {
  const _breakpoints = {
    sp : 767,
    tab: 768,
    pc : 768,
  }

  return {
    meta: {
      title      : ['WebGL School Report 4.'],
      description: ['WebGL School Report'],
      siteName   : 'サイト名',
      ogUrl      : 'https://d-futenma.github.io/webgl-school-report5/',
      ogImg      : 'https://d-futenma.github.io/webgl-school-report5/img/og/og-img.jpg',
      ogType     : 'website',
    },
    sp: {
      breakpoint  : _breakpoints.sp,
      canvasWidth : 750,
      contentWidth: 650,
    },
    tab: {
      breakpoint  : _breakpoints.tab,
    },
    pc: {
      breakpoint  : _breakpoints.pc,
      canvasWidth : 1280, 
      contentWidth: 960,
    },
    path: {
      img: {
        dir: '/img/',
        sp : '/sp/',
        pc : '/pc/',
      }
    },
    mediaQueries: {
      sp       : `only screen and (max-width: ${_breakpoints.sp}px)`,
      tab      : `only screen and (min-width: ${_breakpoints.tab}px)`,
      pc       : `only screen and (min-width: ${_breakpoints.pc}px)`,
      retina   : `only screen and (min-width: ${_breakpoints.pc}px) and (-webkit-min-device-pixel-ratio: 2)`,
      landscape: `only screen and (max-width: ${_breakpoints.sp}px) and (orientation: landscape)`,
    },
  };
})();

export default config;