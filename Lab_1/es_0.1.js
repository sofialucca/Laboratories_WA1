'use strict';

const function_es = (array) => {
    return array.map((s)=>{
        let length = s.length;
        let new_s;
        if(length < 2){
            new_s = '';
        }else{
            switch(length){
                case 2:
                    new_s = s+s;
                    break;
                case 3:
                    new_s = s[0] + s[1] + s[1] + s[2];
                    break;
                default:
                    new_s = s[0] + s[1] + s[length-2] + s[length-1];
            }           
        }

        console.log(new_s);
        return new_s;       
    })
}

let array_esempio = ['spring', 'cat', 'a', 'it', 'longer', 'meeting', 'love'];

console.log(function_es(array_esempio));