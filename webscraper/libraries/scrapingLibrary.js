/*const $ = (selector) =>  {
  const nodeList = Array.from(document.querySelectorAll(selector));
  return nodeList.length === 1 ? nodeList[0] : nodeList;
};*/

Array.prototype.text = function () { return this.map(el=> el.innerText).join(' ')};
//Object.prototype.text = function () { return this.innerText || null};


/*const convertQuantities = {
  "½" : 0.5,
  '¾' : 0.75,
  "¾ " : 0.25
}*/
const replaceFractions = el => el.replace(/½/gi, ".5").replace(/¾/gi, ".75").replace(/¼ /gi, ".25");

