var cedula;
window.counter = 0;

/*function showCalendar() {
  var checkBox = document.getElementById("auto-renov");
  var calendar = document.getElementById("validade");

  if (checkBox.checked == true) {
    calendar.style.display = "none";
    clearData();
  } else {
    calendar.style.display = "inline";
  }
}*/

function resetDropdown() {
  var medicamentoDropdown = document.getElementById("medicamento-dropdown0");
  var dosagemDropdown = document.getElementById("dosagem-dropdown0");
  var formaDropdown = document.getElementById("forma-dropdown0");

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
  //showCalendar();
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
  var cell7 = row.insertCell(6);

  cell1.innerHTML = `<select class="data, medicamento-dropdown" name="medicamento-dropdown" id="medicamento-dropdown{counter}">
        <option value=""></option>
        </select>`;/*Medicamento*/

  cell2.innerHTML = `<select class="data, dosagem-dropdown" name="dosagem-dropdown" id="dosagem-dropdown{counter}">
        <option value=""></option>
        </select>`;/*Dosagem*/

  cell3.innerHTML = `<select class="data, forma-dropdown" name="forma-dropdown" id="forma-dropdown{counter}">
        <option value=""></option>
        </select>`;/*Forma*/

  cell4.innerHTML = `<input class="data, quantidade-value" type="number" name="quantidade-value" id="quantidade-value{counter}">`;/*Qtd*/

  cell5.innerHTML = `<input class="data, posologia-text" type="text" name="posologia-text" id="posologia-text{counter}">`;/*Posologia*/

  cell6.innerHTML = `<input class="data, quantidade-diaria" type="number" name="quantidade-diaria" id="quantidade-diaria{counter}">`;/*Quantidade Diária*/

  cell7.innerHTML = `<img id="clear" onclick="limparLinha(this)" src="/img/delete.svg" alt="Apagar linha">`;/*Limpar*/

  medFetch();
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
    } else {
      document.getElementById("nome-paciente").value = X.nomeUtente;
    }

  });
}


function medFetch() {
  fetch('/medicamentos', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      medicamento: document.getElementById(`medicamento-dropdown0`).value,
      dosagem: document.getElementById("dosagem-dropdown0").value,
      forma: document.getElementById("forma-dropdown0").value,
    })
  }).then(async (resposta) => {
    const X = await resposta.json();

    //MEDICAMENTOS
    var nomeString = X.nome.split("!!")
    nomeString.splice(nomeString.length - 1)


    var sel = document.getElementById(`medicamento-dropdown{counter}`);
     for (var i = 0; i < nomeString.length; i++) {
      var opt = document.createElement('option');
      opt.innerHTML = nomeString[i];
      opt.value = nomeString[i];
      sel.appendChild(opt);
    }

    //DOSAGEM
    var dosagemString = X.dosagem.split("!!")
    dosagemString.splice(dosagemString.length - 1)

    var sel = document.getElementById(`dosagem-dropdown{counter}`);
    for (var i = 0; i < dosagemString.length; i++) {
      var opt = document.createElement('option');
      opt.innerHTML = dosagemString[i] + "mg";
      opt.value = dosagemString[i];
      sel.appendChild(opt);
    }

    //FORMA FARMACEUTICA
    var formaFarmaceuticaString = X.formaFarmaceutica.split("!!")
    formaFarmaceuticaString.splice(formaFarmaceuticaString.length - 1)

    var sel = document.getElementById(`forma-dropdown{counter}`);
    for (var i = 0; i < formaFarmaceuticaString.length; i++) {
      var opt = document.createElement('option');
      opt.innerHTML = formaFarmaceuticaString[i];
      opt.value = formaFarmaceuticaString[i];
      sel.appendChild(opt);
    }
  });
}

function medFetchMain() {
  fetch('/medicamentos', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      medicamento: document.getElementById("medicamento-dropdown0").value,
      dosagem: document.getElementById("dosagem-dropdown0").value,
      forma: document.getElementById("forma-dropdown0").value,
    })
  }).then(async (resposta) => {
    const X = await resposta.json();
    //console.log(X.nome.length);


    //MEDICAMENTOS
    var nomeString = X.nome.split("!!")
    //console.log(nomeString)
    nomeString.splice(nomeString.length - 1)

    var sel = document.getElementById('medicamento-dropdown0');
    for (var i = 0; i < nomeString.length; i++) {
      var opt = document.createElement('option');
      opt.innerHTML = nomeString[i];
      opt.value = nomeString[i];
      sel.appendChild(opt);
    }

    //DOSAGEM
    var dosagemString = X.dosagem.split("!!")
    //console.log(dosagemString)
    dosagemString.splice(dosagemString.length - 1)

    var sel = document.getElementById('dosagem-dropdown0');
    for (var i = 0; i < dosagemString.length; i++) {
      var opt = document.createElement('option');
      opt.innerHTML = dosagemString[i] + "mg";
      opt.value = dosagemString[i];
      sel.appendChild(opt);
    }

    //DOSAGEM
    var formaFarmaceuticaString = X.formaFarmaceutica.split("!!")
    //console.log(formaFarmaceuticaString)
    formaFarmaceuticaString.splice(formaFarmaceuticaString.length - 1)

    var sel = document.getElementById('forma-dropdown0');
    for (var i = 0; i < formaFarmaceuticaString.length; i++) {
      var opt = document.createElement('option');
      opt.innerHTML = formaFarmaceuticaString[i];
      opt.value = formaFarmaceuticaString[i];
      sel.appendChild(opt);
    }
  });
}

function logout(){
  window.location = "index.html";

}