function Calculation(){
  this.inputNumArr = [];
  this.inputFloat = undefined;
  this.lastEntry = undefined;
  this.lastOperator = "";
  this.result = undefined;
  this.inputScrn = $(".inputScrn");
  this.pendingOpScrn = $(".pendingOpScrn"); 
};

Calculation.prototype.init = function(){
  $(".screenList").remove();
  $(".initialShow").show();
};

Calculation.prototype.add = function(){
  this.result += this.inputFloat;
};

Calculation.prototype.substract = function(){
  this.result -= this.inputFloat;
};

Calculation.prototype.multiply = function(){
  this.result *= this.inputFloat;
  this.result = this.result.toFixed(6);
};

Calculation.prototype.divide = function(){
  this.result /= this.inputFloat;
  this.result = this.result.toFixed(6);
};

Calculation.prototype.clearInputScrn = function(){
  $(".inputScrn .screenList").remove(); 
};

Calculation.prototype.showInputs = function(input){
  this.inputScrn.append($("<li class=\"screenList\"></li>").html(input));
};

Calculation.prototype.showPendingOperations = function(input){
  this.pendingOpScrn.append($("<li class=\"screenList\"></li>").html(input));
};

Calculation.prototype.showFinalResult = function(){
  this.clearInputScrn();
  this.inputScrn.append($("<li class=\"screenList\"></li>").html(this.result));
};

Calculation.prototype.calculate = function(){
  console.log(this.lastOperator);
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

$(document).ready(function(){

  var calc = new Calculation(); 

  //generate the key pressed down/up effect
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
    }
  });
  
  $(".number").click(function(event){
    var input = $(this).html();
    //if pending operation has finished,
    //start a new calculation
    if(calc.lastEntry &&
      calc.lastEntry.html() === "="){
      calc = new Calculation;
      calc.init();
    } 
    //else if pending operation not finished
    //show last input operator on the pending operation screen
    else if(calc.lastEntry &&
          calc.lastEntry.hasClass("operator")){
      calc.clearInputScrn();
      calc.showPendingOperations(calc.lastOperator);
    };
    
    //store the input number for further operation
    //and show the input number on the input screen
    $(".initialShow").hide();
    calc.inputNumArr.push(input);
    calc.showInputs(input);
    calc.lastEntry = $(this);   
  });
  
  $(".operator").click(function(event){
    var input = $(this).html();
    $(".initialShow").hide();
    calc.clearInputScrn();
    
    //convert input number-array into a float number and store for further calculation
    if(calc.inputNumArr.length !== 0){
      calc.inputFloat = parseFloat(calc.inputNumArr.join(""));
      calc.inputNumArr = [];
    }
    
    if(input !== "CE"||"AC"){
      calc.lastEntry = $(this);
    };
    
    switch(input){
      case "AC"://All Clear 
        calc = new Calculation();
        calc.init();
        break;
      case "CE"://Clear last entered operation or float number
        //calc.clearInputScrn();
        if(calc.lastEntry.hasClass("operator")){
          if(calc.lastOperator === "="){
            calc = new Calculation();
            calc.init();
          };
          calc.lastOperator = "";
        }
        calc.lastEntry = undefined;
        break;  
      case "=":
        if(calc.inputFloat !== undefined){
          calc.showPendingOperations(calc.inputFloat);
        };
        calc.calculate();
        calc.showFinalResult();
        calc.inputFloat = undefined;
        calc.lastOperator = input;
        break;
      default:
        if(calc.result === undefined){
          calc.result = calc.inputFloat;
          calc.showPendingOperations(calc.inputFloat);
        }
        else if(calc.lastOperator&&
                calc.lastOperator!== "="){
          calc.calculate();  
          calc.showPendingOperations(calc.inputFloat);
        };
        calc.lastOperator = input;
        calc.showInputs(input);       
    }
  })
})

