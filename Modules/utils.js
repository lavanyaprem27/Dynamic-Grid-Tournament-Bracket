export class utils {
    static randomInt(min, max){
        
    }
    static shuffleArray(array){
        for (var i = array.length - 1 ; i > 0; i--) { 
            var j = Math.floor(Math.random() * array.length); 
            [array[i], array[j]] = [array[j], array[i]];
        } 
        return array;
    }
    
    static cloneObj(object){
        const clonedObject = Object.assign(Object.create(Object.getPrototypeOf(object)), object);
        return clonedObject;
    }
}