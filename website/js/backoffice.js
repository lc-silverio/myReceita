var cedula;

function showCalendar() {
  var checkBox = document.getElementById("auto-renov");
  var calendar = document.getElementById("validade");

  if (checkBox.checked == true) {
    calendar.style.display = "none";
    clearData();
  } else {
    calendar.style.display = "inline";
  }
}

function resetDropdown() {
  var medicamentoDropdown = document.getElementById("medicamento-dropdown");
  var dosagemDropdown = document.getElementById("dosagem-dropdown");
  var formaDropdown = document.getElementById("forma-dropdown");

  medicamentoDropdown.selectedIndex = 0;
  dosagemDropdown.selectedIndex = 0;
  formaDropdown.selectedIndex = 0;
}

function clearInput() {
  var elements = document.getElementsByTagName("input");/*Limpa inputs texto, numero e data*/
  for (var ii = 0; ii < elements.length; ii++) {
    if (elements[ii].type == "text" || "number" || "date") {
      elements[ii].value = "";
    }
  }

  var uncheck = document.getElementsByTagName('input');/*Limpa checkboxes*/
  for (var i = 0; i < uncheck.length; i++) {
    if (uncheck[i].type == 'checkbox') {
      uncheck[i].checked = false;
    }
  }

  var table = document.getElementById("table");

  while (table.rows.length >= 4) {
    table.deleteRow(2);
  }

  resetDropdown();
  showCalendar();
}

function addNewLine() {
  var table = document.getElementById("table");
  var row = table.insertRow(2);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  var cell4 = row.insertCell(3);
  var cell5 = row.insertCell(4);
  var cell6 = row.insertCell(5);

  cell1.innerHTML = `<select class="data" name="medicamento-dropdown" id="medicamento-dropdown">
        <option value=""></option>
        <option value="Paracetamol">Paracetamol</option>
        <option value="Mebocaina">Mebocaina</option>
        </select>`;/*Medicamento*/

  cell2.innerHTML = `<select class="data" name="dosagem-dropdown" id="dosagem-dropdown">
        <option value=""></option>
        <option value="500mg">500mg</option>
        <option value="1000mg">1000mg</option>
        </select>`;/*Dosagem*/

  cell3.innerHTML = `<select class="data" name="forma-dropdown" id="forma-dropdown">
        <option value=""></option>
        <option value="Capsula">Capsula</option>
        <option value="Comprimido">Comprimido</option>
        </select>`;/*Forma*/

  cell4.innerHTML = `<input class="data" type="number" name="quantidade-value" id="quantidade-value">`;/*Qtd*/

  cell5.innerHTML = `<input class="data" type="text" name="posologia-text" id="posologia-text">`;/*Posologia*/

  cell6.innerHTML = `<img id="clear" onclick="limparLinha(this)" src="/img/delete.svg" alt="Apagar linha">`;/*Limpar*/

}

function limparLinha(r) {
  var i = r.parentNode.parentNode.rowIndex;

  if (table.rows.length >= 4) {
    document.getElementById("table").deleteRow(i);
  } else {
    clearInput();
    resetDropdown();
  }
}

function clearData() {
  var elements = document.getElementsByTagName("input");/*Limpa inputs texto, numero e data*/
  for (var ii = 0; ii < elements.length; ii++) {
    if (elements[ii].type == "date") {
      elements[ii].value = "";
    }
  }
}


function login() {
  cedula = document.getElementById("cedulaProfissional").value;

  fetch('/loginFuncionario', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      cedulaProfissional: document.getElementById("cedulaProfissional").value,
      password: document.getElementById("password").value
    })
  }).then(async (resposta) => {
    const X = await resposta.json();
    if (X.mensagem == "medic") {
      window.location = "backoffice-medic.html"
    } else if (X.mensagem == "farm") {
      window.location = "backoffice-farm.html"
    } else if (X.mensagem == "erro") {
      window.alert("Cédula Profissional ou palavra-passe incorreta. Por favor tente novamente.")
    }
  });
}



function verificarLogin() {
  var identificacao = document.getElementById("cedulaProfissional").value;
  var pass = document.getElementById("password").value;

  if (identificacao == "" || pass == "") {
    window.alert("Cédula Profissional ou palavra-passe incorreta. Por favor tente novamente.")
  } else {
    login()
  }
}




function verificarUser() {
  var identificacao = document.getElementById("id-paciente").value;

  if (identificacao == "") {
    window.alert("Cartão de Utente não reconhecido. Por favor tente novamente.")
  } else {
    userFetch()
  }
}


function userFetch() {

  fetch('/verificarPaciente', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      paciente: document.getElementById("id-paciente").value,
    })
  }).then(async (resposta) => {
    const X = await resposta.json();

    if (X.mensagem == "erro") {
      window.alert("Cartão de Utente não reconhecido. Por favor tente novamente.")
    } else{
      document.getElementById("nome-paciente").value = X.nomeUtente;
    }

  });
}