import { createNode, append } from "./utils/domBuilder.js";
const div = document.getElementById("root");

/* Componentes */
const title = createNode("h1");
const description = createNode("p");
const formComponent = createNode("form");
const resultComponent = createNode("form");
const table = createNode("table");
const divComponent = createNode("div");
const alertComponent = createNode("div");
divComponent.setAttribute("class", "d-flex flex-row justify-content-between");

title.innerHTML = "Amortización Sistema Francés";
description.innerHTML = "Ingrese los datos solicitados";
alertComponent.innerHTML = `
<div id="alert-msg" class="alert alert-warning" role="alert">
  El valor mínimo de la inicial del vehiculo es 20% del valor del vehiculo.
  <br/>
  El valor máximo de la inicial del vehiculo es 80% del valor del vehiculo.
</div>
`;
formComponent.innerHTML = `
    <div class="input-group mb-3 d-flex flex-column">
    <div class="d-block my-3"> 
    <label>Precio del Vehículo: </label>
    <input type="number" name="principal" id="principal" class="form-control" placeholder="Monto">
    </div>
    <div class="d-block my-3">
    <label>Plazo en meses: </label>
    <input type="number" name="plazo" id="plazo" class="form-control" placeholder="Plazo">
    </div>
    <div class="d-block my-3">
    <label>Tasa de interés mensual: </label>
    <input type="number" name="tasa" id="tasa" class="form-control" placeholder="Tasa">
    </div>
    <div class="d-block my-3">
    <label>Inicial del vehiculo: </label>
    <input type="number" name="inicial" id="inicial" class="form-control" placeholder="Inicial">
    </div>
    </div>
    <div class="d-block d-flex my-5">
    <button type="submit" class="btn btn-secondary btn-lg" disabled>Calcular</button>
    <button type="reset" class="btn btn-secondary btn-lg mx-2">Reset</button>
    </div>
`;
// loading.innerHTML = 'Loading results...';
resultComponent.innerHTML = `
    <div class="input-group mb-5 d-flex flex-column">
    <div class="d-block my-3">
    <label>Pago Mensual: </label>
    <input type="number" name="cuota" id="cuota" placeholder="Cuota" class= form-control " readonly>
    </div>
    <div class="d-block my-3">
    <label>Total interés: </label>
    <input type="number" name="interes" id="interes" placeholder="Interes" class="form-control" readonly>
    </div>
    <div class="d-block my-3">
    <label>Total a pagar: </label>
    <input type="number" name="total" id="total" placeholder="Total" class="form-control" readonly>
    </div>
    </div>
`;
table.innerHTML = `
    <thead>
        <tr>
            <th>Parc</th>
            <th>Amort</th>
            <th>Interes</th>
            <th>Desgravamen</th>
            <th>Pago</th>
            <th>Saldo</th>
        </tr>
    </thead>
`;

append(div, title);
append(div, alertComponent);
append(div, divComponent);
append(divComponent, formComponent);
append(divComponent, resultComponent);
append(divComponent, table);
/* Fin Componentes */

/* Atributos */
div.setAttribute("class", "container")
title.setAttribute("class", "display-1 text-center my-5");
table.setAttribute("class", "w-50 table table-dark table-hover");
/* Fin Atributos */

/* DOM manipulation */
const alertMsg = document.getElementById("alert-msg");
alertMsg.classList.add("d-none");
const principal = document.querySelector('input[name="principal"]');
const plazo = document.querySelector('input[name="plazo"]');
const tasa = document.querySelector('input[name="tasa"]');
const inicial = document.querySelector('input[name="inicial"]');
const btnCalcular = document.querySelector('button[type="submit"]');

const pagoMensual = document.querySelector('input[name="cuota"]');
const intereses = document.querySelector('input[name="interes"]');
const total = document.querySelector('input[name="total"]');

inicial.addEventListener("change", (e) => {
  e.target.value >= principal.value * (20 / 100) &&
  e.target.value <= principal.value * (80 / 100)
    ? (btnCalcular.disabled = false)
    : (btnCalcular.disabled = true);

  e.target.value >= principal.value * (20 / 100) &&
  e.target.value <= principal.value * (80 / 100)
    ? alertMsg.classList.add("d-none")
    : alertMsg.classList.remove("d-none");
});

btnCalcular.addEventListener("click", (e) => {
  e.preventDefault();
  calcularCuota(principal.value, plazo.value, tasa.value);
});

function calcularCuota(principal, plazo, tasa) {
  let cuota = 0;
  let pagoIntereses = 0;
  let pagoCapital = 0;
  let totalIntereses = 0;
  let interesArr = [];
  let seguroDesgravamen = 0;

  cuota =
    (principal * ((Math.pow(1 + tasa / 100, plazo) * tasa) / 100)) /
    (Math.pow(1 + tasa / 100, plazo) - 1);

  const totalPagar = cuota * plazo;

  const cuotaMensual = cuota.toFixed(2);
  const pagoTotal = totalPagar.toFixed(2);

  pagoMensual.value = cuotaMensual;
  total.value = pagoTotal;
  seguroDesgravamen = parseFloat(principal * (0.05 / 100));

  for (let i = 1; i <= plazo; i++) {
    pagoIntereses = parseFloat(principal * (tasa / 100));
    pagoCapital = cuota - pagoIntereses;
    principal = parseFloat(principal - pagoCapital);
    interesArr.push(parseFloat(pagoIntereses.toFixed(2)));

    const tr = createNode("tr");
    const tBody = createNode("tbody");
    const tdParc = createNode("td");
    const tdAmort = createNode("td");
    const tdInteres = createNode("td");
    const tdDesgravamen = createNode("td");
    const tdPago = createNode("td");
    const tdSaldo = createNode("td");

    tdParc.innerHTML = i;
    tdAmort.innerHTML = pagoCapital.toFixed(2);
    tdInteres.innerHTML = pagoIntereses.toFixed(2);
    tdDesgravamen.innerHTML = seguroDesgravamen.toFixed(2);
    tdPago.innerHTML = cuotaMensual;
    tdSaldo.innerHTML = principal.toFixed(2);

    append(tr, tdParc);
    append(tr, tdAmort);
    append(tr, tdInteres);
    append(tr, tdDesgravamen);
    append(tr, tdPago);
    append(tr, tdSaldo);
    append(tBody, tr);
    append(table, tBody);
  }

  for (let i = 0; i < interesArr.length; i++) {
    totalIntereses += interesArr[i];
  }
  intereses.value = totalIntereses.toFixed(2);
}
/* Fin DOM manipulation */
