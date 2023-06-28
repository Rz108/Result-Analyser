let rangeInput = document.querySelectorAll(".range input"),
range = document.querySelector(".slider .progress");
priceInput = document.querySelectorAll(".price-input input");

let priceGap = 0;

priceInput.forEach(input =>{
    input.addEventListener("input", e =>{
        let minPrice = parseFloat(priceInput[0].value),
        maxPrice = parseFloat(priceInput[1].value);
        
        if((maxPrice - minPrice >= priceGap) && maxPrice <= rangeInput[1].max){
            if(e.target.className === "input-min"){
                rangeInput[0].value = minPrice;
                range.style.left = ((minPrice / rangeInput[0].max) * 100) + "%";
            }else{
                rangeInput[1].value = maxPrice;
                range.style.right = 100 - (maxPrice / rangeInput[1].max) * 100 + "%";
            }
        }
    });
});

rangeInput.forEach(input =>{
    input.addEventListener("input", e =>{
        let min = parseFloat(rangeInput[0].value),
        max = parseFloat(rangeInput[1].value);

        if((max - min) < priceGap){
            if(e.target.className === "range-min"){
                rangeInput[0].value = max - priceGap
            }else{
                rangeInput[1].value = min + priceGap;
            }
        }else{
            priceInput[0].value = min;
            priceInput[1].value = max;
            range.style.left = ((min / rangeInput[0].max) * 100) + "%";
            range.style.right = 100 - (max / rangeInput[1].max) * 100 + "%";
        }
    });
});