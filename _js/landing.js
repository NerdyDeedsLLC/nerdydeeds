const   d    = document
       ,w    = window
       // cl   = function(){ console.log.apply(console, arguments); }
       ,qs   = (searchQS) => d.querySelector(searchQS)
       qsa   = (searchQS, resSet=d.querySelectorAll(searchQS)) => (resSet==null) ? null : [...resSet]
       // rnd  = (max) => (isNaN(max)) ? -1 : ~~(Math.random()*max)
       ,onWinLoad = (eventFn, attachObj=w, eventCollection={'addEventListener':'load', 'attachEvent': 'onload'}, listenerMethods=Object.keys(eventCollection), listenerEvents=Object.values(eventCollection)) => {
                                                              if(attachObj[listenerMethods[0]]){ attachObj[listenerMethods[0]](listenerEvents[0], eventFn); }
                                                              else if(attachObj[listenerMethods[1]]){ attachObj[listenerMethods[1]](listenerEvents[1], eventFn); }
                                                              else{ attachObj[listenerEvents[1]] = () => { attachObj[listenerEvents[1]](); eventFn(); }; }
                                                          }
       // ,onDomLoad = (eventFn) =>                           { onWinLoad(eventFn, d, {'addEventListener':'DOMContentLoaded', 'attachEvent': 'onreadystatechange'}); }
       ;

var path2Assets = '/assets/images/gsa_';
var assetSuffix = '.svg';
var devicesList = ['mac-mini', 'mbp', 'ps4', 'xperia', 'mac-pro-tower', 'htc-supersonic'];
var defaultText = 'Yup. We fix those.';
var cockyPhrase = [null, 'Yup. Those too.', 'Those? We get a LOT of those.', 'No prob, Bob!', 'Those are some of our favorites.', 'Piece o\' cake.', 'We train NEW-HIRES on those.', 'No big deal!', 'Easy-peasy!', 'Roll for initiative!', 'Bring. It. ON.', 'Gotcha covered.', '*YAWN!*', 'Have YOU come to the right place!', 'For fun: see what the Squad of Geeks charges for those'];
var phraseCount = 0;
var deviceCount = 0;



// GSDevTools.create();

const shufflePhrases = () => {
    cockyPhrase.shift();
    cockyPhrase.sort(()=>cockyPhrase.length/10-Math.random());
    cockyPhrase.unshift(defaultText);
    return 0;
};

const shuffleDevices = () => {
    devicesList = devicesList.sort(()=>devicesList.length/10-Math.random());
    return 0;
};


const cycleContent = () => {
    if(phraseCount === cockyPhrase.length || phraseCount === 0) { phraseCount = shufflePhrases(); }
    if(deviceCount === devicesList.length || deviceCount === 0) { deviceCount = shuffleDevices(); }

      let imgTarget = qs('#fallingDevices > img'),
          msgTarget = qs('#signpost'),
          txtOutput = qs('#signpost > div'),
          rndmAngle = (`${Date.now()}`.slice(-1) % 10) - 5;

    imgTarget.src       = path2Assets + devicesList[deviceCount] + assetSuffix;
    imgTarget.alt       = devicesList[deviceCount];
    txtOutput.innerHTML = cockyPhrase[phraseCount];
    msgTarget.style     = `transform: translate(-50%, 10%) rotate(${rndmAngle + 180}deg) scale(1.5);`;

    deviceCount++;
    phraseCount++;
    landingAnimation();
};



const landingAnimation =() => {
    let flObj = '#fallingDevices',
        shdws = '#shadows',
        scene = [flObj, shdws],
        signs = '#signpost';

    tl_master = new TimelineMax({id:'master'});
    tl_landingSequence = new TimelineMax({id:'landingSequence'});
    tl_signRotator = new TimelineMax({id:'signage'});
    tl_master
        .add([
          tl_landingSequence
          .add([
                TweenMax.to(flObj,  1.5,    {delay:0,       bottom:"13vh", rotation:0, ease:Bounce.easeOut})
              , TweenMax.to(shdws,  1.5,    {delay:0,       bottom:'11vh', borderRadius:'40%', width:1024, maxWidth:'60vw', filter:'blur(10vw)', autoAlpha:0.45, ease:Bounce.easeOut})
          ])
          .add([
                TweenMax.set(flObj,         {delay:.5,      filter:'blur(2.5px)'})
              , TweenMax.to(scene,  1,      {delay:1.5,     scaleX:0.7, scaleY:1.0, marginLeft:'-25%', ease: Back.easeOut.config(3)})
              , TweenMax.to(flObj,  0.01,   {delay:1.5,    rotationY:'35deg', transformPerspective:5000, ease:Power0.easeNone})
          ])
          .add([
                TweenMax.to(shdws,  1,      {delay:1.0,    bottom:'2.5vh', opacity:0.75, borderRadius:'10%', ease:Power0.easeNone})
              , TweenMax.to(flObj,  0.05,   {delay:0,       rotationY:'-8deg', transformPerspective:400, ease:Back.easeIn})
              , TweenMax.to(shdws,  0.15,   {delay:0,       bottom:'1vh', opacity:0.3, borderRadius:'30%', width: 3096, ease:Back.easeIn})
              , TweenMax.to(scene,  0.35,   {delay:0,       scaleX:5, scaleY:.33, left:'250vw', marginLeft:0, ease:Back.easeIn})
              , TweenMax.to(scene,  0.01,   {delay:1.5,     clearProps:'all'})
          ]),
          tl_signRotator
              .add([
                TweenMax.to(signs,  0.5,    {delay:1.75,    rotation:'-=180', ease:Bounce.easeOut})
              ])
              .add([
                TweenMax.to(signs, 2.5,     {delay:2,       rotationY:'540deg', transformPerspective:7000, ease:Elastic.easeOut})
               ,TweenMax.to(signs, 0.5,     {delay:2.25,    rotation:'-=180', ease:Bounce.easeOut})
              ])
              .add([
                TweenMax.to([signs], 0.01, {delay:1.5, clearProps:'all'})
              ])
        ])
        .kill()
        .addCallback(cycleContent, "+=1")
};

const stripActiveClassFromObj = (obj) => {
  if(null == obj) return false;
  if(typeof(obj) === 'string') obj=[obj];
  obj.forEach(o=>{if(null != o){ o.className = o.className.replace(/(\s*)?active(\s*)?/gi,'');}});
  return true;
}

const deriveRelatedFootnoteElements = (eId) => {
    eId = eId.replace(/\D/gi, '');
    let triggerObj = d.qs('#footnoteTrigger' + elementId),
        contentObj = d.qs('#landingFootnote' + elementId);
    if(null == triggerObj || null == contentObj) throw 'Invalid footnote declaration! Object missing!';
    return [triggerObj, contentObj];
}

const onFootnoteTrigger = (triggerObj, closeTier=0) => {
    // If we've been called recursively, kill the active footnote
    if(closeTier === -1)
      return stripActiveClassFromObj(deriveRelatedFootnoteElements(triggerObj.id));
    
    // If the user clicked one that's already open, trigger the function recursively, targeting that single ID alone.
    if(triggerObj.className.indexOf('active') !== -1)
      return onFootnoteTrigger(triggerObj, -1);

    // Find (all) active footnotes, iterate 'em, and strip their active flags if set.
    let activeFootnotes = d.qsa('.footnote.active');
    activeFootnotes.forEach(f=>{
      if(null == f) throw 'Invalid footnote declaration! Object missing id parameter!';
      if(f.dataset.tier <= closeTier){
        stripActiveClassFromObj(deriveRelatedFootnoteElements(f.id));
      }
    });
    // Finally, grab both elements related to the clicked trigger and slap an active flag on each.
    deriveRelatedFootnoteElements(triggerObj.id).forEach(f=>f.className += ' active');
}

const footnoteInit = () => {
  d.qsa('.footnoteTrigger').forEach(f=>f.addEventListener('click', function (){ onFootnoteTrigger(f, f.dataset.tier); }));
}


onWinLoad(cycleContent);

