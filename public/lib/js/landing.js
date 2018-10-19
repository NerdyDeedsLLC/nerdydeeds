// jshint esversion: 6
const d = document,
      w = window,
      cl = function () {
  console.log.apply(console, arguments);
},
      qs = searchQS => d.querySelector(searchQS),
      qsa = (searchQS, resSet = d.querySelectorAll(searchQS)) => resSet == null ? null : [...resSet],
      rnd = max => isNaN(max) ? -1 : ~~(Math.random() * max),
      onWinLoad = (eventFn, attachObj = w, eventCollection = {
  'addEventListener': 'load',
  'attachEvent': 'onload'
}, listenerMethods = Object.keys(eventCollection), listenerEvents = Object.values(eventCollection)) => {
  if (attachObj[listenerMethods[0]]) attachObj[listenerMethods[0]](listenerEvents[0], eventFn);else if (attachObj[listenerMethods[1]]) attachObj[listenerMethods[1]](listenerEvents[1], eventFn);else attachObj[listenerEvents[1]] = () => {
    attachObj[listenerEvents[1]]();
    eventFn();
  };
},
      onDomLoad = eventFn => {
  onLoaded(eventFn, d, {
    'addEventListener': 'DOMContentLoaded',
    'attachEvent': 'onreadystatechange'
  });
};

var path2Assets = '/assets/images/gsa_';
var assetSuffix = '.svg';
var devicesList = ['mac-mini', 'mbp', 'ps4', 'xperia', 'mac-pro-tower', 'htc-supersonic'];
var defaultText = "Yup. We fix those.";
var cockyPhrase = [null, "Yup. Those too.", "Those? We get a LOT of those.", "No prob, Bob!", "Those are some of our favorites.", "Piece o' cake.", "We train NEW-HIRES on those.", "No big deal!", "Easy-peasy!", "Roll for initiative!", "Bring. It. ON.", "Gotcha covered.", "*YAWN!*", "Have YOU come to the right place!", "For fun: see what the Squad of Geeks charges for those"];
var phraseCount = 0;
var deviceCount = 0;
var tl_landingSequence = null; // GSDevTools.create();

const shufflePhrases = () => {
  console.log('shufflePhrases');
  cockyPhrase.shift();
  console.log('cockyPhrase.shift', cockyPhrase);
  cockyPhrase.sort(() => cockyPhrase.length / 10 - Math.random());
  cockyPhrase.unshift(defaultText);
  return 0;
};

const shuffleDevices = () => {
  console.log('shuffleDevices');
  devicesList = devicesList.sort(() => devicesList.length / 10 - Math.random());
  return 0;
};

const coinToss = () => !!rnd(2);

const cycleContent = () => {
  console.log('cycleContent');
  if (phraseCount === cockyPhrase.length || phraseCount === 0) phraseCount = shufflePhrases();
  console.log('phraseCount', phraseCount, cockyPhrase[phraseCount]);
  if (deviceCount === devicesList.length || deviceCount === 0) deviceCount = shuffleDevices();
  console.log('deviceCount', deviceCount, devicesList[deviceCount]);
  let imgTarget = qs('#falling1 > img'),
      msgTarget = qs('#signpost'),
      txtOutput = qs('#signpost > div'),
      rndmAngle = `${Date.now()}`.slice(-1) % 10 - 5;
  imgTarget.src = path2Assets + devicesList[deviceCount] + assetSuffix;
  imgTarget.alt = devicesList[deviceCount];
  txtOutput.innerHTML = cockyPhrase[phraseCount];
  msgTarget.style = `transform: translate(-50%, 10%) rotate(${rndmAngle + 180}deg) scale(1.5);`;
  deviceCount++;
  phraseCount++;
  landingAnimation();
};

const landingAnimation = () => {
  let flObj = '#falling1',
      shdws = '#shadows',
      signs = '#signpost';
  tl_landingSequence = new TimelineMax({
    id: 'landingSequence'
  });
  tl_landingSequence.add([TweenMax.to(flObj, 1.5, {
    bottom: "13vh",
    rotation: 0,
    ease: Bounce.easeOut
  }), TweenMax.to(shdws, 1.5, {
    bottom: '11vh',
    borderRadius: '40%',
    width: 1024,
    maxWidth: '60vw',
    filter: 'blur(10vw)',
    autoAlpha: 0.45,
    ease: Bounce.easeOut
  }), TweenMax.to(signs, .5, {
    rotation: '-=180',
    delay: 1.75,
    ease: Bounce.easeOut
  })]).add([TweenMax.to([flObj, shdws], 1, {
    scaleX: 0.7,
    scaleY: 1.0,
    marginLeft: '-25%',
    delay: .5,
    ease: CustomEase.create("custom", "M0,0 C0,0 0,-0.006 0.076,0.004 0.67,0.084 0.671,1.089 0.672,1.106 0.687,1.106 0.677,0.932 0.692,0.932 0.692,0.949 0.699,1.083 0.7,1.1 0.715,1.1 0.71,0.934 0.726,0.934 0.726,0.951 0.734,1.075 0.734,1.092 0.749,1.092 0.739,0.936 0.754,0.936 0.755,0.952 0.759,1.059 0.76,1.076 0.775,1.076 0.769,0.936 0.784,0.936 0.784,0.953 0.795,1.055 0.796,1.072 0.811,1.072 0.8,0.948 0.816,0.948 0.816,0.965 0.826,1.043 0.826,1.06 0.842,1.06 0.842,0.95 0.858,0.95 0.858,0.966 0.863,1.037 0.864,1.054 0.879,1.054 0.873,0.956 0.888,0.956 0.889,0.973 0.904,1.054 0.904,1.054 0.904,1.054 0.912,0.943 0.912,0.96 0.927,0.96 0.922,0.983 0.923,1 0.938,1 1,1 1,1")
  }), TweenMax.to(flObj, .01, {
    rotationY: '35deg',
    transformPerspective: 5000,
    delay: 1.20,
    ease: Power0.easeNone
  })]).add([TweenMax.to(shdws, 1, {
    bottom: '2.5vh',
    opacity: 0.75,
    borderRadius: '10%',
    ease: Power0.easeNone,
    delay: 1.25
  }), TweenMax.to(flObj, 0.05, {
    rotationY: '-8deg',
    transformPerspective: 400,
    delay: 0,
    ease: Back.easeIn
  }), TweenMax.to(signs, 2.5, {
    rotationY: '540deg',
    transformPerspective: 2000,
    ease: Elastic.easeOut
  }), TweenMax.to(shdws, 0.15, {
    bottom: '1vh',
    opacity: 0.3,
    borderRadius: '30%',
    width: 3096,
    ease: Back.easeIn
  }), TweenMax.to([flObj, shdws], .35, {
    scaleX: 5,
    scaleY: .33,
    left: '250vw',
    marginLeft: 0,
    ease: Back.easeIn
  }), TweenMax.to(signs, .5, {
    rotation: '+=180',
    ease: Back.easeIn
  }), TweenMax.to([flObj, shdws, signs], .01, {
    delay: 1.5,
    clearProps: 'all'
  })]).kill().addCallback(cycleContent, "+=1");
};

onWinLoad(cycleContent);