document.getElementById("descargarPDF")
.addEventListener("click", () => {

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let y = 20;

  doc.setFontSize(20);
  doc.text("Confirmaciones de Asistencia", 20, y);

  y += 15;

  todasLasConfirmaciones.forEach((bloque, index) => {

    const texto = bloque.innerText;

    const lineas = doc.splitTextToSize(texto, 170);

    doc.setFontSize(11);
    doc.text(lineas, 20, y);

    y += lineas.length * 7 + 10;

    if (y > 260) {
      doc.addPage();
      y = 20;
    }

  });

  doc.save("confirmaciones.pdf");

});

const SHEET_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vTY1iDTK3NBpfmUuSIy3tRf9f-EHvqFBqbiFjhUyOtZbrTbU83RDxsdZhvqwA1mPGcwNWEgOujQJ2Hs/pub?gid=671117691&single=true&output=csv&nocache=" + Date.now();

const lista = document.querySelector(".panel-lista");
let todasLasConfirmaciones = [];

Papa.parse(SHEET_URL, {
  download: true,
  header: true,
  complete: function (results) {

    lista.innerHTML = "";
    todasLasConfirmaciones = [];

    results.data.forEach(row => {

      if (!row["Vas a asistir?"]) return;

      const estado = row["Vas a asistir?"];
      const cantidad = row["Cantidad de personas"];
      const textoPersonas = row["Nombre"] || "";
      const mensaje = row["Mensaje"] || "";

      const personas = textoPersonas
        .split(/\r?\n/)
        .map(l =>
          l.replace(/^Invitado\s*\d+:\s*/i, "").trim()
        )
        .filter(Boolean);

      const bloque = document.createElement("div");
      bloque.className = "confirmacion";

      bloque.dataset.estado = estado.toLowerCase();
      bloque.dataset.cantidad = cantidad;

      bloque.innerHTML = `
        <div class="confirmacion-header">
          <div class="estado">${estado}</div>
          <div class="cantidad">${cantidad} personas</div>
        </div>

        <div class="personas">
          ${personas.map(p => {
            const partes = p.split("–");
            const nombre = partes[0]?.trim() || p.trim();
            const dieta = partes[1]?.trim() || "";
            return `
              <div class="persona">
                <div class="persona-nombre">${nombre}</div>
                <div class="persona-dieta">${dieta}</div>
              </div>
            `;
          }).join("")}
        </div>

        ${
          mensaje
            ? `
              <div class="mensaje">
                <strong>Mensaje</strong>
                ${mensaje}
              </div>
            `
            : ""
        }
      `;

      lista.appendChild(bloque);
      todasLasConfirmaciones.push(bloque);

    });

    activarFiltros();

/* CONTADORES */

const data = results.data.filter(r => r["Vas a asistir?"]);

let totalRespuestas = 0;
let confirmados = 0;
let noConfirmados = 0;

let vegetariana = 0;
let vegana = 0;
let sintacc = 0;
let sibo = 0;
let otros = 0;

data.forEach(r => {

  const estado = r["Vas a asistir?"];
  const invitados = (r["Nombre"] || "").toLowerCase();
  const cantidad = parseInt(r["Cantidad de personas"], 10) || 0;
  totalRespuestas += cantidad;

  if (estado.includes("Confirmo")) {
    confirmados += cantidad;
  } else {
    noConfirmados += cantidad;
  }

  if(invitados.includes("vegetariana")) vegetariana++;
  if(invitados.includes("vegana")) vegana++;
  if(invitados.includes("sin tacc")) sintacc++;
  if(invitados.includes("sibo")) sibo++;
  if(invitados.includes("otro")) otros++;

});

});

document.getElementById("stat-respuestas").textContent = totalRespuestas;
document.getElementById("stat-confirmados").textContent = confirmados;
document.getElementById("stat-noconfirmados").textContent = noConfirmados;

document.getElementById("stat-vegetariana").textContent = vegetariana;
document.getElementById("stat-vegana").textContent = vegana;
document.getElementById("stat-sintacc").textContent = sintacc;
document.getElementById("stat-sibo").textContent = sibo;
document.getElementById("stat-otros").textContent = otros;
  
  const buscador = document.getElementById("busqueda");

buscador.addEventListener("input", () => {

  const texto = buscador.value.toLowerCase();

  todasLasConfirmaciones.forEach(bloque => {

    const contenido = bloque.innerText.toLowerCase();

    if (contenido.includes(texto)) {
      bloque.style.display = "";
    } else {
      bloque.style.display = "none";
    }

  });
  
});


  const botones = document.querySelectorAll(".filtro");

  botones.forEach(boton => {
    boton.addEventListener("click", () => {

      botones.forEach(b => b.classList.remove("activo"));
      boton.classList.add("activo");

      const texto = boton.textContent.trim().toLowerCase();

      todasLasConfirmaciones.forEach(bloque => {

        let mostrar = true;

        const estado = bloque.dataset.estado;
        const cantidad = parseInt(bloque.dataset.cantidad, 10);

        if (texto === "confirmados") {
          mostrar = estado.includes("confirmo");
        }

        if (texto === "no confirmados") {
          mostrar = !estado.includes("confirmo");
        }

        if (texto === "1–2 personas") {
          mostrar = cantidad <= 2;
        }

        if (texto === "3+ personas") {
          mostrar = cantidad >= 3;
        }

        if (texto === "todos") {
          mostrar = true;
        }

        bloque.style.display = mostrar ? "" : "none";
      });

    });
  });

function activarFiltros(){

  const botones = document.querySelectorAll(".filtro");

  botones.forEach(boton => {

    boton.addEventListener("click", () => {

      botones.forEach(b => b.classList.remove("activo"));
      boton.classList.add("activo");

      const texto = boton.textContent.trim().toLowerCase();

      todasLasConfirmaciones.forEach(bloque => {

        let mostrar = true;

        const estado = bloque.dataset.estado;
        const cantidad = parseInt(bloque.dataset.cantidad, 10);

        if (texto === "confirmados") {
          mostrar = estado.includes("confirmo");
        }

        if (texto === "no confirmados") {
          mostrar = !estado.includes("confirmo");
        }

        if (texto === "1–2 personas") {
          mostrar = cantidad <= 2;
        }

        if (texto === "3+ personas") {
          mostrar = cantidad >= 3;
        }

        if (texto === "todos") {
          mostrar = true;
        }

        bloque.style.display = mostrar ? "" : "none";

      });

    });

  });

}

}

});
