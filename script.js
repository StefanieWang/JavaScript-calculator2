function Calculation(){
	this.inputArr = []; // store the current input nums or operator for calculation
	this.pendingOpsArr = [];// array to store previous input numbers and operators
	this.result = undefined;
	this.lastEntry = "";
	this.error = false;
	this.inputScrn = $(".inputScrn");// screen to show current inputs
	this.pendingOpScrn = $(".pendingOpScrn"); //screen to show previous inputs	
}

Calculation.prototype = {
	constructor: Calculation,
	
	parseCalculation: function(calcArr){ //Parse calculation arr into an arr of numbers and operators
		var calculation = [];
		var current = [];
		for(var i = 0; i < calcArr.length; i++){
           if(calcArr[i].match(/[\d\.]/)){ // If is a number or dot
           	current.push(calcArr[i])
           }else{    // ELse is an operator +,-,*,/
            var num = parseFloat(current.join(""));
            var operator = calcArr[i];
            calculation.push(num,operator);
            current = [];
           }

           if(i === calcArr.length-1){
           	calculation.push(parseFloat(current.join("")))
           }
		}
		return calculation;
	},

	calculate: function(calculation){ // Perform a calculation expressed as an array of operators and numbers
		var a = calculation[0], b, operator, op;
		
		var operations = {
			"+": function(a, b){ return a + b},
			"-": function(a, b){ return a - b},
			"×": function(a, b){ return a * b},
			"÷": function(a, b){ return a / b}
		}
        

		for(var i = 1; i < calculation.length; i++){
			if(typeof calculation[i] === "string"){
				operator = calculation[i]
			}else{
				b = calculation[i];
				op = operations[operator]; 
				a = op(a, b);
			}
		} 
        a = parseFloat(a.toFixed(6))
		return a;
	},

	showInputs: function(){
		$(".inputScrn .screenList").remove();

		if(this.inputArr.length === 0){
			this.inputScrn.append($("<li class=\"screenList\"></li>").html(0))
		} else {
			var calculation = this;
			this.inputArr.forEach(function(item){
		  	calculation.inputScrn.append($("<li class=\"screenList\"></li>").html(item));
		})
		}
	  
	},

	showPendingOperations: function(){
		$(".pendingOpScrn .screenList").remove(); 

		if (this.pendingOpsArr.length === 0){
			this.pendingOpScrn.append($("<li class=\"screenList\"></li>").html(0));
		} else {
			var calculation = this;
			this.pendingOpsArr.forEach(function(item){
			  calculation.pendingOpScrn.append($("<li class=\"screenList\"></li>").html(item));
			})     
		};
	},
	  
	showFinalResult: function(){
		$(".inputScrn .screenList").remove();
		this.inputScrn.append($("<li class=\"screenList\"></li>").html(this.result));
	},

    showErrorMessage: function(message){
    	$(".inputScrn .screenList").remove();
        this.inputScrn.append($("<li class=\"screenList\"></li>").html(message));
    },
    
    clearAll: function(){
    	this.inputArr = []; 
		this.pendingOpsArr = [];
		this.lastEntry = "";
		this.result = undefined;
		this.error = false;
    },

	handleDigitInput: function(input){
        if(this.lastEntry === "="){ // start a new round of calculation
        	this.clearAll();
        }else if(this.lastEntry && this.lastEntry.match(/[^\d\.]/)){
			this.inputArr = [];
		}

		if(input === "."){
			if(!this.inputArr.length){
				input = "0.";
			}else if (this.inputArr.indexOf(".") > -1 ||
				      this.inputArr.indexOf("0.") > -1){
				return; //if already input a dot before, do nothing
			}
		}
        
        this.lastEntry = input;
		this.inputArr.push(input);
		this.pendingOpsArr.push(input);
		this.showInputs();
		this.showPendingOperations();
        
        var inputDigits = this.inputArr.slice().join("");
		if(inputDigits.length > 10){
			this.clearAll();
			this.showErrorMessage("Digit Limit Met");
		}     
	},

	handleOperatorInput: function(input){
		switch(input){
			case "AC": 
				this.clearAll();
				this.showInputs();
				this.showPendingOperations();
				break;
			case "CE":
			    if (this.lastEntry === "="){
			    	this.clearAll();
			    }else if(this.inputArr.length){
					this.inputArr.pop();
			   	    this.pendingOpsArr.pop();
			   	    this.lastEntry = this.pendingOpsArr[this.pendingOpsArr.length-1];
				}
			    this.showInputs();
			    this.showPendingOperations();
			    break;
			case "=":
				var length = this.pendingOpsArr.length;
				if(this.lastEntry.match(/\d+/)){
					var calculation = this.parseCalculation(this.pendingOpsArr);
				    this.result = this.calculate(calculation);
				    if(this.result.toString().length > 10){
				    	this.clearAll();
				    	this.showErrorMessage("Digit Limit Met");
				    }else if(this.result === "Infinity") {
                        this.clearAll();
                        this.showErrorMessage("Error: Infinity");
				    }else{
				    	this.showFinalResult();
				    	this.inputArr = [];
				    	this.lastEntry = input;
				    	this.pendingOpsArr = [this.result.toString()];
				    }
				}				
				break;
			default: //input is +,-,*,/
				if(this.lastEntry.match(/[\d+\=]/)){
					this.inputArr = [input];
				    this.pendingOpsArr.push(input);
				    this.lastEntry = input;
				    this.showInputs();
				    this.showPendingOperations();
				}
				
		}
	},
    
	handleInput: function(input, inputObj){
		if(inputObj.hasClass("number")){
			this.handleDigitInput(input);
		}else if (inputObj.hasClass("operator")){
			this.handleOperatorInput(input);
		}
	},

	showStartStatus: function(){
		this.showInputs();
		this.showPendingOperations();
	}
	
}

$(document).ready(function(){
	var calc = new Calculation();
    calc.showStartStatus();

	$(".keys-panel").click(function(event) {
		var inputObj = $(event.target);
		var input = $(event.target).html();    
		calc.handleInput(input, inputObj);
    });
  
})