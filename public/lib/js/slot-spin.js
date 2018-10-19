// jshint esversion: 6
const d = document,
      w = window,
      cl = function () {
  console.log.apply(console, arguments);
},
      qs = searchQS => d.querySelector(searchQS),
      qsa = (searchQS, resSet = d.querySelectorAll(searchQS)) => resSet == null ? null : [...resSet],
      rnd = max => isNaN(max) ? -1 : ~~(Math.random() * max) + 1;

class CONTENTSPINNER {
  constructor(htmlContainerObject = {}, contentHeight = 1, maxSerial = 1, currentContent = '', contentPrefix = '', contentSuffix = '', internalTimer = 30, internalTimerPaused = false) {
    this.htmlContainerObject = htmlContainerObject;
    this.contentHeight = contentHeight;
    this.maxSerial = maxSerial;
    this.currentContent = currentContent;
    this.contentPrefix = contentPrefix;
    this.contentSuffix = contentSuffix;
    this.internalTimer = internalTimer;
    this.internalTimerPaused = internalTimerPaused;

    this.updateInternalTimer = function (newObjectNode, newTimerValue) {
      newObjectNode.dataset.chron = newTimerValue;
      newObjectNode.style = `--chron:${newTimerValue / 1000}s;`;
    };

    this.createNode = () => {
      let newSrc = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/678043/icn_rotator_asset_${rnd(25)}.svg`;

      if (newSrc == this.currentContent) {
        return this.createNode();
      }

      this.currentContent = newSrc;
      let newDiv = d.createElement('div');
      if (this.internalTimer <= 1000) this.internalTimer *= 1.5;else this.internalTimerPaused = true;
      newDiv.dataset.chron = this.internalTimer;
      newDiv.style = `--chron:${this.internalTimer / 1000}s;`;
      this.updateInternalTimer(newDiv, this.internalTimer);
      newDiv.innerHTML = `<img src="${newSrc}" alt="">`;
      newDiv.className = 'new-child';
      return newDiv;
    };

    this.updateNodeStack = () => {
      let allNodes = [...this.htmlContainerObject.childNodes].filter(o => o.tagName),
          newNode = this.createNode(),
          oldFC = allNodes[0],
          oldLC = allNodes[allNodes.length - 1];
      this.internalTimer = oldFC.dataset.chron;
      newNode.dataset.chron = this.internalTimer;
      oldFC.className = '';
      oldLC.remove();
      this.htmlContainerObject.insertBefore(newNode, oldFC);
      setTimeout(this.cycleElements, 20);
    };

    this.cycleElements = () => {
      var fc = qs('.icon-spinner>div:first-child');
      fc.className = 'fc';

      if (!this.internalTimerPaused) {
        setTimeout(this.updateNodeStack, this.internalTimer);
      } else {
        this.internalTimerPaused = false;
        this.internalTimer = 30;
        setTimeout(() => {
          this.updateInternalTimer(fc, 30);
          this.restartSequence();
        }, 3000);
      }
    };

    this.restartSequence = () => {
      this.htmlContainerObject.childNodes[1].className = "reiter-rate";
      setTimeout(function () {
        this.htmlContainerObject.childNodes[1].className = "fc";
        this.updateNodeStack();
      }, 440);
    };

    this.init = () => {
      this.cycleElements();
    };
  }

}

window.addEventListener('load', () => {
  let iconSpinner = new CONTENTSPINNER(qs('.icon-spinner'), 64, 25, '1', 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/678043/icn_rotator_asset_', '.svg');
  cl(iconSpinner);
  iconSpinner.init();
});