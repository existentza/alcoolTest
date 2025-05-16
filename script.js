    // HTML
    const resultDisplay = document.getElementById("result");
    const alcoolUnitsContainer = [...document.getElementById("alcool-units").children];
    const selectedUnitLabel = document.getElementById("selectedUnitLabel");
    const selectedUnitAmount = document.getElementById("selectedUnitAmount");
    const bodyWeightInput = document.getElementById("body-weight");
    const sexSelection = document.getElementById("gender");
    const stomachSelection = document.getElementById("stomach");
    const consumeTimeAdvice = document.getElementById("consumeTime");

    // VARS
    const alcoolUnits = {
        "birra analcolica": [0.5, 330],
        "birra leggera": [3.5, 330],
        "birra normale": [5, 330],
        "birra speciale": [8, 330],
        "birra doppio malto": [10, 330],
        "vino": [12, 125],
        "vini liquorosi-aperitivi": [18, 80],
        "digestivi": [25, 40],
        "superalcolici": [35, 40],
        "bollicine": [11, 100],
        "ready to drink": [2.8, 150],
    }

    let consumedUnits = {
        "birra analcolica": 0,
        "birra leggera": 0,
        "birra normale": 0,
        "birra speciale": 0,
        "birra doppio malto": 0,
        "vino": 0,
        "vini liquorosi-aperitivi": 0,
        "digestivi": 0,
        "superalcolici": 0,
        "bollicine": 0,
        "ready to drink": 0,
    }

    let absorptionRates = {
        "male": 0.68,
        "female": 0.55,
    }

    // Starting Unit
    let selectedUnit = "birra analcolica";
    let sex = "male";
    let stomach = "full"; 

    let bodyWeight = 0; // Kg
    let timePassed = 100; // Minuti
    let alcoolConsumeRate = 0.15 // g/L (tasso di consumo alcolico del corpo umano)

    consumeTimeAdvice.innerHTML = `Il calcolo tiene in considerazione che l'alcool sia stato consumato ${timePassed} minuti fà.`

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

                let unitTotalAlcool = pureAlcool / (bodyWeight * absorptionRates[sex]);
                let timeReduction = alcoolConsumeRate * (timePassed / 60);
                let effectiveTotalAlcool = unitTotalAlcool - timeReduction;

                totalAlcool += effectiveTotalAlcool;
                console.log(`TOTAL ALCOOL: ${effectiveTotalAlcool}`);
            }
        };

        if (totalAlcool < 0){
            totalAlcool = 0;
        }

        return totalAlcool
    }

    function selectUnit(unit){
        alcoolUnitsContainer.forEach(element => {
            element.id = "";
        }); 
        unit.id = "select";
        selectedUnit = unit.innerHTML;
        selectedUnitLabel.innerHTML = selectedUnit + " consumate: ";
        selectedUnitAmount.value = consumedUnits[selectedUnit];
    }

    alcoolUnitsContainer.forEach(element => {
        element.onclick = function(){
            selectUnit(element);
        }
    });

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