const UNITS = {
  celsius: { name: "Celsius", symbol: "°C", toKelvin: value => value + 273.15, fromKelvin: value => value - 273.15 },
  fahrenheit: { name: "Fahrenheit", symbol: "°F", toKelvin: value => (value - 32) * 5 / 9 + 273.15, fromKelvin: value => (value - 273.15) * 9 / 5 + 32 },
  kelvin: { name: "Kelvin", symbol: "K", toKelvin: value => value, fromKelvin: value => value },
  rankine: { name: "Rankine", symbol: "°R", toKelvin: value => value * 5 / 9, fromKelvin: value => value * 9 / 5 },
  romer: { name: "Rømer", symbol: "°Rø", toKelvin: value => (value - 7.5) * 40 / 21 + 273.15, fromKelvin: value => (value - 273.15) * 21 / 40 + 7.5 },
  reaumur: { name: "Réaumur", symbol: "°Ré", toKelvin: value => value * 5 / 4 + 273.15, fromKelvin: value => (value - 273.15) * 4 / 5 },
  newton: { name: "Newton", symbol: "°N", toKelvin: value => value * 100 / 33 + 273.15, fromKelvin: value => (value - 273.15) * 33 / 100 },
  delisle: { name: "Delisle", symbol: "°De", toKelvin: value => 373.15 - value * 2 / 3, fromKelvin: value => (373.15 - value) * 3 / 2 }
};

const form = document.querySelector("#converter");
const input = document.querySelector("#temperature");
const fromSelect = document.querySelector("#fromUnit");
const toSelect = document.querySelector("#toUnit");
const result = document.querySelector("#result");
const formula = document.querySelector("#formula");
const swapButton = document.querySelector("#swap");

const options = Object.entries(UNITS).map(([value, unit]) =>
  `<option value="${value}">${unit.name} (${unit.symbol})</option>`
).join("");
fromSelect.innerHTML = options;
toSelect.innerHTML = options;
fromSelect.value = "celsius";
toSelect.value = "fahrenheit";

function formatNumber(value) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 4 }).format(Number(value.toFixed(8)));
}

function convert() {
  const value = input.valueAsNumber;
  if (!Number.isFinite(value)) {
    result.textContent = "Enter a number";
    formula.textContent = "A valid temperature is needed before we can work our magic.";
    input.setAttribute("aria-invalid", "true");
    return;
  }

  input.removeAttribute("aria-invalid");
  const from = UNITS[fromSelect.value];
  const to = UNITS[toSelect.value];
  const converted = to.fromKelvin(from.toKelvin(value));
  result.textContent = `${formatNumber(converted)} ${to.symbol}`;
  formula.textContent = `${formatNumber(value)} ${from.symbol} equals ${formatNumber(converted)} ${to.symbol}`;
}

form.addEventListener("submit", event => {
  event.preventDefault();
  convert();
});

input.addEventListener("input", convert);
fromSelect.addEventListener("change", convert);
toSelect.addEventListener("change", convert);
swapButton.addEventListener("click", () => {
  [fromSelect.value, toSelect.value] = [toSelect.value, fromSelect.value];
  convert();
  swapButton.animate([{ transform: "rotate(0deg)" }, { transform: "rotate(180deg)" }], { duration: 250 });
});

convert();
