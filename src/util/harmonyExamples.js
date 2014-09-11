function scoping(){
   {
      let scoped = "yeah";
      let fucl = "you";
      const soemthing = 'c';
   }
}

function arrow(){
   let a = x => { x * 2 };
}

class Something {
   //also using rest parameter
   constructor(prop, ...theRest){
      this.atProp = prop;
      this.anArray = theRest;
   }
   render(){
      console.log("something");
   }
}

function destruct(){
   var [a,b,c] = [1,2,3,4];
   var o = {
      f: 1, s: 2, t: 3
   }

   //destructuring can be seen when expecting assignment
      //after var, let, and const probably
      //during binding for a funcion args
   var {f: newF, t: newT} = o;
}

function propertyNameShorthand(){
   var a = 1; b = 2;

   var o = {a, b};
}
function destructingShorthand(){
   var o = {a: 1, b: 2};
   var {a, b} = o;
}


class tooManyCombined {
   member(...theRest){
      //theRest operator
      //arrow function
      //destructuring
      //propertyShorthand
      //splat
      theRest.forEach(({a,b}, ...more) => { console.log(...more) } );
   }
}
function restDestructuring(...theRest){
   var [a,v,c] = theRest;
}
function spread(){
   var a = [2,3,4];

   console.log(1, ...a)
}

function defaultParam(a = 'fuck', b = 'something', ...theRest){
   console.log(a);
   return {a, b};
   //could not do destructuring here
}

//objects as keys
function maps(){

   const gods = [
      {name: 'Douglas Crockford'},
      {name: 'Guido van Rossum'},
      {name: 'Raffaele Esposito'}
   ];

   let miracles = new Map();

   miracles.set(gods[0], 'JavaScript');
   miracles.set(gods[1], 'Python');
   miracles.set(gods[2], 'Pizza Margherita');

   // Prints "JavaScript"
   console.log(miracles.get(gods[0]));
}

function sets(){
   let surveyAnswers = ['sex', 'sleep', 'sex', 'sun', 'sex', 'cinema'];

   let pleasures = new Set();
   surveyAnswers.forEach(function (pleasure) {
     pleasures.add(pleasure);
   });

   // Prints the number of pleasures in the survey, not counting duplicates
   console.log(pleasures.size);
}
