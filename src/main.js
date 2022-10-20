import "./css/index.css";
import IMask from 'imask';

let ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path");
let ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path");
let ccLogo = document.querySelector(".cc-logo span:nth-child(2) img");


function setCardType(type) {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    default: ["black", "gray"],
  }

  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

globalThis.setCardType = setCardType


let securityCode = document.querySelector("#security-code");
let securityCodePattern = {
  mask: "0000"
};
let securityCodeMasked = IMask(securityCode, securityCodePattern);

let expirationDate = document.querySelector("#expiration-date");
let experationDatePattern = {
  mask: "MM{/}YY", 
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2)
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12
    },
  },
};
let expirationDateMasked = IMask(expirationDate, experationDatePattern);

let cardNumber = document.querySelector("#card-number");
let cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex:/^4\d{0,15}/,
      cardtype: "visa"
    },
    {
      mask: "0000 0000 0000 0000",  
      regex:/(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard"
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default"
    },
  ],
  dispatch: function (appended, dynamicMasked){
    let number = (dynamicMasked.value + appended).replace(/\D/g, "")
    let foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    });

    return foundMask
  },
}

let cardNumberMasked = IMask(cardNumber, cardNumberPattern)

let addButton = document.querySelector("#btn-card");
addButton.addEventListener("click", () => {
  console.log("click!")
})

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()
})

let cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
  let ccHolder = document.querySelector(".cc-holder .value")
  ccHolder.innerText = cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value
})

securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value)
})

function updateSecurityCode (code) {
  let ccSecurity = document.querySelector(".cc-security .value")
  ccSecurity.innerText = code.length === 0 ? "123" : code
}

cardNumberMasked.on("accept", () => {
  let cardType = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardType)
  updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber (number) {
  let ccNumber = document.querySelector(".cc-number")
  ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}

expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate (date) {
  let ccExpiration = document.querySelector(".cc-extra .value")
  ccExpiration.innerText = date.length === 0 ? "02/32" : date
}




