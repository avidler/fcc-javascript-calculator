import React, {Component} from 'react';
import './App.css';
import CreateButtons from './CreateButtons';

const buttons = [
  { content: "+", id: 'add'},
  { content: "-", id: 'subtract'},
  { content: "*", id: 'multiply'},
  { content: "/", id: 'divide'},
  { content: "1", id: 'one'},
  { content: "2", id: 'two'},
  { content: "3", id: 'three'},
  { content: "4", id: 'four'},
  { content: "5", id: 'five'},
  { content: "6", id: 'six'},
  { content: "7", id: 'seven'},
  { content: "8", id: 'eight'},
  { content: "9", id: 'nine'},
  { content: "0", id: 'zero'},
  { content: ".", id: 'decimal'}
]

const symbols = ["+", "-", "*", "/"] // All operators including minus
const symbolsNotNeg = ["+", "*", "/"] // All operators not including minus
const posDigits = ["1","2","3","4","5","6","7","8","9"] // All positive digits, used for checking for multiple zeros
let firstSymbolPos = 0 // The position in the string of the first operator
let consecSymbols = 0 // The number of consecutive operators detected

class App extends Component {
  constructor(){
    super()
    this.state= {
      fullDisplay: 0, // The full calculation is it is being constructed
      currentDisplay: 0, // The current string of digits or operator
      decimalCount: 0 // The number of decimal places in the calculation. Cannot be greater than one.

    }
    this.handleClick = this.handleClick.bind(this)
    this.handleClearClick = this.handleClearClick.bind(this)
    this.handleEqualsClick = this.handleEqualsClick.bind(this)
  }

  handleClick(e){
    var newCurrent = e // Stores which button has been clicked
    var newFull = this.state.fullDisplay // A local copy of the full display
    var newDecimalCount = this.state.decimalCount // A local copy of the number of decimals in the calculation
    var isnum = /^\d|\d*\.\d*\+$/.test(this.state.currentDisplay+e); //Test whether the new display will be a number
    var isDecimal = (e === ".") // Test whether the button clicked was decimal
    if (isDecimal) {newDecimalCount++} // Increments newDecimalCount if it was
    var isPosDigit = posDigits.includes(e) // Test whether the button clicked was a positive digit
    var isSymbol = symbols.includes(e) // Test whether the button clicked was an operator
    if (isnum || isPosDigit || isDecimal || isSymbol){ // Is not a minus??
      if (newDecimalCount === 2){ // If user is trying to add a second decimal place
        newCurrent = this.state.currentDisplay // Current display is set to what it was before, so won't add it.
        newDecimalCount-- // The decimal count is reduced back to 1.
      }
      else{ // The input wasn't a decimal point (decimalCount can only be 2 if it was), so what was it?
        
        if (isSymbol){ // Was it an operator? If so...
          newCurrent = e // The current output is wiped and replaced with the operator
          newDecimalCount = 0 // The previous number if wiped, so reset the count of decimals in it
          
          if(symbolsNotNeg.includes(e)){ // Was the operator anything other than minus? If so...
            consecSymbols++ // The number of consecutive operators has gone up to either 1 or 2...
           
            if (consecSymbols === 1){ // If it is 1...
              firstSymbolPos = newFull.length // The position of the operator will be at the end of the full output
              newFull = newFull + e // Adding the operator to the end of the full display
            }
            
            else if (consecSymbols === 2){ // But if we have 2 operators in a row, trouble ahead...
              let leftSide = newFull.slice(0, firstSymbolPos) // Slicing our full output up to the first operator
              let rightSide = newFull.slice(firstSymbolPos+1,newFull.length) // Slicing our full output after the first operator
              if (rightSide ==="-") {rightSide = ""} // If the equation consists of an operator followed by a minus and we are appending another operator, remove the minus
              newFull = leftSide+rightSide+e; // Stick it all together, with the new operator on the end
              consecSymbols-- // The number of consecutive operators is now 1 again
            }
          }
          else{ // The minus key was entered
            newFull = newFull + e // Append it
          }
        }
        else{ // The character entered was something other than an operator (digit or decimal point)
          newCurrent = this.state.currentDisplay+e // Append it to the current number being entered
          consecSymbols = 0 // It wasn't an operator, so we have no consecutive operators
          newFull = newFull + e // Update the full display 
        }
        
      }
    } // By this stage, our proposed new current output will be at least two characters
    if (newCurrent[0] === '0'){ // So if the first character is a zero...
       newCurrent = newCurrent.substr(1) // Get rid of it
    }
    if (newFull[0] === '0'){ // Same with the full equation
      newFull = newFull.substr(1)
    }
    this.setState({ // All logic checks have been performed. Ready to render our new outputs.
      currentDisplay: newCurrent,
      fullDisplay: newFull,
      decimalCount: newDecimalCount
    })
  }


  handleClearClick(e){
    this.setState({fullDisplay: 0, currentDisplay: 0, decimalCount: 0}) // If AC is clicked, reset everything
  }

  handleEqualsClick(e){ // If equals is clicked, evalute the output and display it
    var allDisplays = eval(this.state.fullDisplay)
    this.setState({
      fullDisplay: allDisplays,
      currentDisplay: allDisplays,
      decimalCount: 0
    })
  }

  render(){
    return( 
      <div id="wrapper">
        <h1>React Calculator</h1>
        <div id="calculator">
          <div id="displayContainer" class="calculator-screen">
            <div id="fullDisplayWrap">
              
              <div id="fullDisplay">
          
                {this.state.fullDisplay}
              </div>
            </div>
          
            <div id="currentDisplayWrap">
            
              <div id="display">
                
                {this.state.currentDisplay}
              </div>
            </div>
          </div>
          <div id="buttonContainer" class="calculator-keys">
            <button className="equal-sign" onClick={(e) => this.handleEqualsClick("=")} id="equals">=</button>
            {buttons.map((info, index) =>
                <CreateButtons info={info} handleClick={this.handleClick} key={index} />
              )}
            <button className="all-clear" onClick={(e) => this.handleClearClick("AC")} id="clear">AC</button>
            </div>
          </div>
        </div>
        
      
    )
  }
  
}

export default App;
