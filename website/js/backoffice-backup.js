var cedula;
var counter = 0;
var bolacha;
var bolachinha;


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
  //var dosagemDropdown = document.getElementById("dosagem-dropdown0");
  //var formaDropdown = document.getElementById("forma-dropdown0");

  medicamentoDropdown.selectedIndex = 0;
  //dosagemDropdown.selectedIndex = 0;
  //formaDropdown.selectedIndex = 0;
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
  counter++;
  //console.log(counter);
  var table = document.getElementById("table");
  var row = table.insertRow(2);
  var cell1 = row.insertCell(0);
  //var cell2 = row.insertCell(1);
  //var cell3 = row.insertCell(2);
  var cell4 = row.insertCell(1);
  var cell5 = row.insertCell(2);
  var cell6 = row.insertCell(3);
  var cell7 = row.insertCell(4);

  cell1.innerHTML = `<select class="data, medicamento-dropdown" name="medicamento-dropdown" id="medicamento-dropdown${counter}">
        <option value=""></option>
        </select>`;/*Medicamento*/

  /*cell2.innerHTML = `<select class="data, dosagem-dropdown" name="dosagem-dropdown" id="dosagem-dropdown${counter}">
        <option value=""></option>
        </select>`;/*Dosagem*/

  /*cell3.innerHTML = `<select class="data, forma-dropdown" name="forma-dropdown" id="forma-dropdown${counter}">
        <option value=""></option>
        </select>`;/*Forma*/

  cell4.innerHTML = `<input class="data, quantidade-value" type="number" name="quantidade-value" id="quantidade-value${counter}">`;/*Qtd*/

  cell5.innerHTML = `<input class="data, quantidade-diaria" type="number" name="quantidade-diaria" id="quantidade-diaria${counter}">`;/*Quantidade Diária*/

  cell6.innerHTML = `<input class="data, posologia-text" type="text" name="posologia-text" id="posologia-text${counter}">`;/*Posologia*/

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
    document.cookie = document.getElementById("cedulaProfissional").value
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
      //dosagem: document.getElementById("dosagem-dropdown0").value,
      //forma: document.getElementById("forma-dropdown0").value,
    })
  }).then(async (resposta) => {
    const X = await resposta.json();

    //MEDICAMENTOS
    var nomeString = X.nome.split("!!")
    nomeString.splice(nomeString.length - 1)

    var nomeStringClean = nomeString.filter((c, index) => {
      return nomeString.indexOf(c) === index;
    })
    //console.log(nomeStringClean)

    var sel = document.getElementById(`medicamento-dropdown${counter}`);
    for (var i = 0; i < nomeStringClean.length; i++) {
      var opt = document.createElement('option');
      opt.innerHTML = nomeStringClean[i];
      opt.value = nomeStringClean[i];
      sel.appendChild(opt);
    }

    //DOSAGEM/*
    /*var dosagemString = X.dosagem.split("!!")
    dosagemString.splice(dosagemString.length - 1)

    var dosagemStringClean = dosagemString.filter((c, index) => {
      return dosagemString.indexOf(c) === index;
    })
    //console.log(dosagemStringClean)

    var sel = document.getElementById(`dosagem-dropdown${counter}`);
    for (var i = 0; i < dosagemStringClean.length; i++) {
      var opt = document.createElement('option');
      opt.innerHTML = dosagemStringClean[i] + "mg";
      opt.value = dosagemStringClean[i];
      sel.appendChild(opt);
    }*/

    /*//FORMA FARMACEUTICA
    var formaFarmaceuticaString = X.formaFarmaceutica.split("!!")
    formaFarmaceuticaString.splice(formaFarmaceuticaString.length - 1)

    var formaFarmaceuticaStringClean = formaFarmaceuticaString.filter((c, index) => {
      return formaFarmaceuticaString.indexOf(c) === index;
    })
    //console.log(formaFarmaceuticaStringClean)

    var sel = document.getElementById(`forma-dropdown${counter}`);
    for (var i = 0; i < formaFarmaceuticaStringClean.length; i++) {
      var opt = document.createElement('option');
      opt.innerHTML = formaFarmaceuticaStringClean[i];
      opt.value = formaFarmaceuticaStringClean[i];
      sel.appendChild(opt);
    }*/
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
      //dosagem: document.getElementById("dosagem-dropdown0").value,
      //forma: document.getElementById("forma-dropdown0").value,
    })
  }).then(async (resposta) => {
    const X = await resposta.json();
    //console.log(X.nome.length);


    //MEDICAMENTOS
    var nomeString = X.nome.split("!!")
    //console.log(nomeString)
    nomeString.splice(nomeString.length - 1)

    var nomeStringClean = nomeString.filter((c, index) => {
      return nomeString.indexOf(c) === index;
    })
    //console.log(nomeStringClean)

    var sel = document.getElementById('medicamento-dropdown0');
    for (var i = 0; i < nomeStringClean.length; i++) {
      var opt = document.createElement('option');
      opt.innerHTML = nomeStringClean[i];
      opt.value = nomeStringClean[i];
      sel.appendChild(opt);
    }

    /*//DOSAGEM
    //var dosagemString = X.dosagem.split("!!")
    //console.log(dosagemString)
    //dosagemString.splice(dosagemString.length - 1)

    //var dosagemStringClean = dosagemString.filter((c, index) => {
      //return dosagemString.indexOf(c) === index;
    //})
    //console.log(dosagemStringClean)

    var sel = document.getElementById('dosagem-dropdown0');
    for (var i = 0; i < dosagemStringClean.length; i++) {
      var opt = document.createElement('option');
      opt.innerHTML = dosagemStringClean[i] + "mg";
      opt.value = dosagemStringClean[i];
      sel.appendChild(opt);
    }

    //FORMA FARMACEUTICA
    var formaFarmaceuticaString = X.formaFarmaceutica.split("!!")
    //console.log(formaFarmaceuticaString)
    formaFarmaceuticaString.splice(formaFarmaceuticaString.length - 1)

    var formaFarmaceuticaStringClean = formaFarmaceuticaString.filter((c, index) => {
      return formaFarmaceuticaString.indexOf(c) === index;
    })
    //console.log(formaFarmaceuticaStringClean)

    var sel = document.getElementById('forma-dropdown0');
    for (var i = 0; i < formaFarmaceuticaStringClean.length; i++) {
      var opt = document.createElement('option');
      opt.innerHTML = formaFarmaceuticaStringClean[i];
      opt.value = formaFarmaceuticaStringClean[i];
      sel.appendChild(opt);
    }*/
  })

  bolacha = document.cookie.split(" ");
  bolachinha = bolacha[1];
  //console.log(bolachinha)
}

function logout() {
  window.location = "index.html";
}



function registarReceita() {
  var medicamentoString = "";
  var dosagemString = "";
  //var formaString = "";
  var quantidadeString = "";
  var quantidadeDiariaString = "";
  var posologiaString = "";

  if((document.getElementById("auto-renov").checked)=== true){
    renova = "t"
  }else{
    renova = "f"
  }
  

  //idMedicamento = "" E agora ???????? 
  console.log(counter)
  //for (var r = -1; r <= counter; r++) {//um ciclo para cada uma das linhas adicionadas 0 = linha original
  do{
    medicamentoString = medicamentoString.concat(document.getElementById(`medicamento-dropdown${counter}`).value + "!!");
    //dosagemString = dosagemString.concat(document.getElementById(`dosagem-dropdown${counter}`).value + "!!");
    //formaString = formaString.concat(document.getElementById(`forma-dropdown${counter}`).value + "!!");
    quantidadeString = quantidadeString.concat(document.getElementById(`quantidade-value${counter}`).value + "!!");
    quantidadeDiariaString = quantidadeDiariaString.concat(document.getElementById(`quantidade-diaria${counter}`).value + "!!");
    posologiaString = posologiaString.concat(document.getElementById(`posologia-text${counter}`).value + "!!");

    counter--
  }while(counter != -1)

  counter = 0;
  clearInput();



  fetch('/registarReceita', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      medicamentoString : medicamentoString,
      //dosagemString : dosagemString,
      //formaString : formaString,
      quantidadeString : quantidadeString,
      quantidadeDiariaString : quantidadeDiariaString,
      posologiaString : posologiaString,
      idMedico : bolachinha.value,
      numeroDeUtente : document.getElementById("id-paciente").value,
      renova : renova
    })
  }).then(async (resposta) => {

  });
}
