// HTML
const resultDisplay = document.getElementById("result");
const resultText = document.getElementById("resultText");
const alcoolUnitsContainer = document.getElementById("alcool-units");
const selectedUnitLabel = document.getElementById("selectedUnitLabel");
const selectedUnitAmount = document.getElementById("selectedUnitAmount");
const bodyWeightInput = document.getElementById("body-weight");
const sexSelection = document.getElementById("gender");
const stomachSelection = document.getElementById("stomach");
const timePassedInput = document.getElementById("time");

// VARS
const alcoolUnits = {
    "Birra Analcolica": [0.5, 330],
    "Birra Leggera": [3.5, 330],
    "Birra Normale": [5, 330],
    "Birra Speciale": [8, 330],
    "Birra Doppio Malto": [10, 330],
    "Vino": [12, 125],
    "Vini Liquorosi-Aperitivi": [18, 80],
    "Digestivi": [25, 40],
    "Superalcolici": [35, 40],
    "Bollicine": [11, 100],
    "Ready to Drink": [2.8, 150],
}

let consumedUnits = {
    "Birra Analcolica": 0,
    "Birra Leggera": 0,
    "Birra Normale": 0,
    "Birra Speciale": 0,
    "Birra Doppio Malto": 0,
    "Vino": 0,
    "Vini Liquorosi-Aperitivi": 0,
    "Digestivi": 0,
    "Superalcolici": 0,
    "Bollicine": 0,
    "Ready to Drink": 0,
}

let absorptionRates = {
    "male": 0.68,
    "female": 0.55,
}

// Starting Unit
let selectedUnit = "Birra Analcolica";
let sex = "male";
let stomach = "full"; 

let bodyWeight = 0; // Kg
let timePassed = 0; // Minuti
let alcoolConsumeRate = 0.15 // g/L (tasso di consumo alcolico del corpo umano)

Object.entries(alcoolUnits).forEach(([name, [graduation, ml]]) => {
    const button = document.createElement("button");
    button.classList.add("unit");
    button.innerText = `${name} (${graduation} % - ${ml} ml)`;
    
    button.dataset.name = name;

    if (name === selectedUnit){
        button.id = "select";   
    }

    button.onclick = function () {
        selectUnit(button);
    };

    alcoolUnitsContainer.appendChild(button);
});

function calculateAlcool(){
    let totalAlcool = 0;
    for (const consumedUnitName in consumedUnits){
        let consumedUnit = consumedUnits[consumedUnitName];
        
        if (consumedUnit <= 0) {
            continue
        }

        console.log(`UNITA CONSUMATE: ${consumedUnit}`);

        if (alcoolUnits.hasOwnProperty(consumedUnitName)){
            let alcoolUnit = alcoolUnits[consumedUnitName];

            let consumedQuantity = (alcoolUnit[1] * consumedUnit);
            let alcoolGraduation = alcoolUnit[0];
            let pureAlcool = consumedQuantity * (alcoolGraduation / 100);

            let unitTotalAlcool = (pureAlcool / (bodyWeight * absorptionRates[sex])) * (stomach === "full" ? 1 : 1.3);
            let timeReduction = (timePassed > 0 ? alcoolConsumeRate * (timePassed / 60) : 0);
            let effectiveTotalAlcool = unitTotalAlcool - timeReduction;

            totalAlcool += effectiveTotalAlcool;
            console.log(`TOTAL ALCOOL: ${effectiveTotalAlcool}`);
        }
    };

    if (totalAlcool < 0){
        totalAlcool = 0;
    }

    if (totalAlcool > 0.5){ 
        resultDisplay.className = "result-negative";
        resultText.innerHTML = "Sei oltre il limite di legge, non mettere in pericolo la tua vita e quella degli altri!";
    } else {
        resultDisplay.className = "result-positive";
        resultText.innerHTML = "Puoi metterti alla guida se non sei neopatentato.";
    }

    return totalAlcool
}

function selectUnit(unit){
    document.querySelectorAll(".unit").forEach(el => el.id = "");
    unit.id = "select";

    selectedUnit = unit.dataset.name;
    selectedUnitLabel.innerHTML = `${selectedUnit} consumate:`;
    selectedUnitAmount.value = consumedUnits[selectedUnit];
}

selectedUnitAmount.onchange = function(){
    consumedUnits[selectedUnit] = selectedUnitAmount.value;
    resultDisplay.innerHTML = `${calculateAlcool()} g/L`
}

bodyWeightInput.onchange = function(){
    bodyWeight = bodyWeightInput.value;
    console.log(`WEIGHT: ${bodyWeight}`);
    resultDisplay.innerHTML = `${calculateAlcool()} g/L`
}

sexSelection.addEventListener("change", function() {
    sex = this.value; 
    console.log(`SEX: ${sex}`)
    resultDisplay.innerHTML = `${calculateAlcool()} g/L`
});

stomachSelection.addEventListener("change", function() {
    stomach = this.value; 
    console.log(`STOMACH: ${stomach}`)
    resultDisplay.innerHTML = `${calculateAlcool()} g/L`
});

timePassedInput.onchange = function(){
    timePassed = timePassedInput.value;
    console.log(`TIME PASSED: ${timePassed}`);
    resultDisplay.innerHTML = `${calculateAlcool()} g/L`
}
