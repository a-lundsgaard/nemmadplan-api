const filter = [1, 2, 3, 4, 5, 6, 7, 8].filter(num => num % 2);


const reviews = ['jeg er tilfreds med produktet', 'jeg blev meget skuffet da jeg fik produktet i hænderne', 'jeg er glad for mine sko'];

const positiveDictionary = ['tilfreds', 'godt', 'glad'];
const negativeDictionary = ['utilfreds', 'dårlig', 'skuffet'];


const findReviewCount = dictionary => reviews.filter(r => r.split(' ').find(w => dictionary.includes(w) )).length

console.log(findReviewCount(positiveDictionary));


class Shoes {
    constructor(type, brand, name ) {
        this.type = type,
        this.brand = brand,
        this.name = name
    }
}

class Adrian extends Shoes {
    constructor(type, brand, name, ) {
        super(type, brand, name);

    }
}


const obj = {
    hej: 17849378438,
    hek: 2898,
    t: function() {
        console.log(this.hej)
    }
}


obj.t

const obj2 = Object.create(obj)
obj2.t