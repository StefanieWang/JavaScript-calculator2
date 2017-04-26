function Calculation(){
  this.inputArr = [];
  this.inputFloat = undefined;
  this.lastEntry = undefined;
  this.lastOperator = "";
  this.result = undefined;
  this.inputScrn = $(".inputScrn");
  this.pendingOpScrn = $(".pendingOpScrn"); 
  this.pendingOps = [];
  this.error = false;
};


Calculation.prototype.add = function(){
  this.result += this.inputFloat;
};

Calculation.prototype.substract = function(){
  this.result -= this.inputFloat;
};

Calculation.prototype.multiply = function(){
  this.result *= this.inputFloat;
  if(this.result % 1 !== 0){
    this.result = this.result.toFixed(2);
  };
  
};

Calculation.prototype.divide = function(){
  this.result /= this.inputFloat;
  if(this.result % 1 !== 0){
    this.result = this.result.toFixed(2);
  };
};

Calculation.prototype.calculate = function(){
  switch(this.lastOperator){
    case "×":      
      this.multiply();
      break;
    case "÷":
      this.divide();
      break;
    case "+":
      this.add();
      break;
    case "-":
      this.substract();
      break;
  }
};

Calculation.prototype.clearInputScrn = function(){
  $(".inputScrn .screenList").remove(); 
};

Calculation.prototype.showInputs = function(){
  $(".inputScrn .screenList").remove();

  if(this.inputArr.length === 0){
    this.inputScrn.append($("<li class=\"screenList\"></li>").html(0))
  } else {
    var calculation = this;
    this.inputArr.forEach(function(item){
      calculation.inputScrn.append($("<li class=\"screenList\"></li>").html(item));
    })
  }
  
};

Calculation.prototype.showPendingOperations = function(){
  $(".pendingOpScrn .screenList").remove(); 
  
  if (this.pendingOps.length === 0){
    this.pendingOpScrn.append($("<li class=\"screenList\"></li>").html(0));
  } else {
    var calculation = this;
    this.pendingOps.forEach(function(item){
      calculation.pendingOpScrn.append($("<li class=\"screenList\"></li>").html(item));
    })     
  };
};
  
Calculation.prototype.showFinalResult = function(){
  $(".inputScrn .screenList").remove();
  this.inputScrn.append($("<li class=\"screenList\"></li>").html(this.result));
};

Calculation.prototype.showErrorMessage = function(message){
  $(".inputScrn .screenList").remove();
  this.inputScrn.append($("<li class=\"screenList\"></li>").html(message));
}

Calculation.prototype.showInputsAndPendingOPs = function() {
  this.showInputs();
  this.showPendingOperations();
};

Calculation.prototype.checkDigitLimit = function(arr){
  this.error = false;

  if(arr.length >= 8){
    this.error = true;
    this.showErrorMessage("Digit Limit Met");
  }
};

Calculation.prototype.checkOperatorError = function(){
  this.error = false;

  if(this.inputFloat === undefined){
    this.error = true;
  }
  else if(this.lastEntry &&
          this.lastEntry.hasClass("calculate")){
    this.error = true;
  }
};

$(document).ready(function(){

  var calc = new Calculation(); 
  calc.showInputsAndPendingOPs();

  var handleNumberInput = function(inputObj, input){
    //if pending operation has finished,
    //start a new calculation
    if(calc.lastEntry &&
      calc.lastEntry.html() === "="){
      calc = new Calculation;
    }; 
    //else if pending operation not finished
    if(calc.lastEntry &&
      calc.lastEntry.hasClass("operator")){
      calc.inputArr = [];
      calc.pendingOps.push(calc.lastEntry.html());
      calc.lastOperator = calc.lastEntry.html();
    };
    calc.inputArr.push(input);
    calc.lastEntry = inputObj;   
    calc.showInputsAndPendingOPs();
  };
  
 var handleOperatorInput = function(inputObj, input){    
    switch(input){
      case "AC"://All Clear 
        calc = new Calculation();
        calc.showInputsAndPendingOPs();
        break;
      case "CE"://Clear last entered operation or float number
        if(calc.lastOperator === "="){
          calc = new Calculation();
        } else {
          calc.pendingOps.pop();
          calc.lastEntry = undefined;
        };
        calc.showInputsAndPendingOPs();
        break;  
      case "=":
        if(calc.inputFloat){
          calc.calculate(); 
        };
        calc.lastOperator = input;
        calc.lastEntry = inputObj;
        calc.showPendingOperations();
        var resultArr = calc.result.toString().split("");
        resultArr.pop();
        calc.checkDigitLimit(resultArr);      
        if(calc.error){
          calc = new Calculation();
        }else{
          calc.showFinalResult();
        };       
        break;
      default:// input is "+","-","*","/"      
        if(calc.result === undefined){
          calc.result = calc.inputFloat;          
        } else {
          calc.calculate();  ;
        };
        calc.lastEntry = inputObj;
        calc.inputArr.push(input);
        calc.showInputsAndPendingOPs();       
    }
  };

  $(".keys-panel").on({
    mousedown: function(event){
      var key = $(event.target);
      if(key.attr("id")==="plus"){
        key.height("109px");
      } else if(key.hasClass("number")||key.hasClass("operator")){
        key.height("43px");
      };
    },
    mouseup: function(event){
      var key = $(event.target);
      if(key.attr("id")==="plus"){
        key.height("111px");
      } else if(key.hasClass("number")||key.hasClass("operator")){
        key.height("46px");
      };
    },
    click: function(event) {
      var inputObj = $(event.target);
      var input = inputObj.html();
            
      if(inputObj.hasClass("number")){
        calc.checkDigitLimit(calc.inputArr);
        if(calc.error){
          calc = new Calculation();
        }
        else {
          handleNumberInput(inputObj, input);
        }
      }
      else if(inputObj.hasClass("operator")){
        if(calc.inputArr.length){
          calc.inputFloat = parseFloat(calc.inputArr.join(""));
          calc.inputArr = [];
          calc.pendingOps.push(calc.inputFloat);
        };
        if(input !== "AC"&&
           input !== "CE"){
          calc.checkOperatorError();
        };
        if(!calc.error){
          handleOperatorInput(inputObj, input);
        };
      };
    }
  });
  
  
})

