


// arr = alle the units listed in the google sheet
exports.checkIngredient = ( obj, unitsArr )=> {

  if (!unitsArr.includes(obj.unit) && obj.unit) obj.name = obj.unit + obj.name;

    obj.unit = unitsArr.includes(obj.unit) ? obj.unit :
      obj.name.includes('hvidløg') ? 'fed' :
        !obj.quantity ? '' :
          'stk';
    if(obj.unit) obj.unit = obj.unit +'*'; // for recegnizing the unit in the gui
  return obj;
};


/*function addScript( src ) {
  let s = document.createElement( 'script' );
  s.setAttribute( 'src', src );
  s.setAttribute('type', 'module')
  document.body.appendChild( s );
}*/



