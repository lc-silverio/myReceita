var cedula;
var counter = 0;
var bolacha;
var bolachinha;



function resetDropdown() {//Faz reset aos dropdowns na tabela da receita
  var medicamentoDropdown = document.getElementById("medicamento-dropdown0");
  medicamentoDropdown.selectedIndex = 0;
}

//----------------------------------------------------------------------------------------------------------------------------------------------------->

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

  resetDropdown();// Chama a função que faz reset à dropdown box
}
//----------------------------------------------------------------------------------------------------------------------------------------------------->

function addNewLine() { //Adiciona nova linha à tabela da receita do médico - Associada ao botão "Adicionar Linha"
  counter++;
  var table = document.getElementById("table");
  var row = table.insertRow(2);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  var cell4 = row.insertCell(3);
  var cell5 = row.insertCell(4);

  cell1.innerHTML = `<select class="data, medicamento-dropdown" name="medicamento-dropdown" id="medicamento-dropdown${counter}">/*Medicamento*/
        <option value=""></option>
        </select>`;

  cell2.innerHTML = `<input class="data, quantidade-value" type="number" name="quantidade-value" id="quantidade-value${counter}">`;/*Qtd caixas*/

  cell3.innerHTML = `<input class="data, quantidade-diaria" type="number" name="quantidade-diaria" id="quantidade-diaria${counter}">`;/*Quantidade Diária a tomar*/

  cell4.innerHTML = `<input class="data, posologia-text" type="text" name="posologia-text" id="posologia-text${counter}">`;/*Posologia*/

  cell5.innerHTML = `<img id="clear" onclick="limparLinha(this)" src="/img/delete.svg" alt="Apagar linha">`;/*Limpar*/

  medFetch();//Chama a função para popular os dropdowns na view do médico
}

//----------------------------------------------------------------------------------------------------------------------------------------------------->

function limparLinha(r) {//Função para eliminar uma linha da tabela da receita do médico - Associada ao X em cada linha
  var i = r.parentNode.parentNode.rowIndex;

  if (table.rows.length >= 4) {
    document.getElementById("table").deleteRow(i);
  } else {
    clearInput();
    resetDropdown();
  }
}

//----------------------------------------------------------------------------------------------------------------------------------------------------->

function logout() { //Auto explicativa
  window.location = "index.html";
}

//----------------------------------------------------------------------------------------------------------------------------------------------------->


//                                      FIM DE FUNÇÕES GENÉRICAS DE FRONT-END


//----------------------------------------------------------------------------------------------------------------------------------------------------->

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

//----------------------------------------------------------------------------------------------------------------------------------------------------->

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

//----------------------------------------------------------------------------------------------------------------------------------------------------->


function verificarUser() {
  var identificacao = document.getElementById("id-paciente").value;

  if (identificacao == "") {
    window.alert("Cartão de Utente não reconhecido. Por favor tente novamente.")
  } else {
    userFetch()
  }
}

//----------------------------------------------------------------------------------------------------------------------------------------------------->

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

//----------------------------------------------------------------------------------------------------------------------------------------------------->

function medFetch() {
  fetch('/medicamentos', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      medicamento: document.getElementById(`medicamento-dropdown0`).value,
    })
  }).then(async (resposta) => {
    const X = await resposta.json();

    //MEDICAMENTOS
    var nomeString = X.nome.split("!!")
    nomeString.splice(nomeString.length - 1)

    var nomeStringClean = nomeString.filter((c, index) => {
      return nomeString.indexOf(c) === index;
    })

    var sel = document.getElementById(`medicamento-dropdown${counter}`);
    for (var i = 0; i < nomeStringClean.length; i++) {
      var opt = document.createElement('option');
      opt.innerHTML = nomeStringClean[i];
      opt.value = nomeStringClean[i];
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
    })
  }).then(async (resposta) => {
    const X = await resposta.json();

    //MEDICAMENTOS
    var nomeString = X.nome.split("!!")
    nomeString.splice(nomeString.length - 1)

    var nomeStringClean = nomeString.filter((c, index) => {
      return nomeString.indexOf(c) === index;
    })

    var sel = document.getElementById('medicamento-dropdown0');
    for (var i = 0; i < nomeStringClean.length; i++) {
      var opt = document.createElement('option');
      opt.innerHTML = nomeStringClean[i];
      opt.value = nomeStringClean[i];
      sel.appendChild(opt);
    }
  })

  bolacha = document.cookie.split(" ");
  bolachinha = bolacha[1];
}


//----------------------------------------------------------------------------------------------------------------------------------------------------->

function registarReceita() {
  var medicamentoString = "";
  var quantidadeString = "";
  var quantidadeDiariaString = "";
  var posologiaString = "";

  if ((document.getElementById("auto-renov").checked) === true) {
    renova = "t"
  } else {
    renova = "f"
  }


  //idMedicamento = "" E agora ???????? 
  console.log(counter)

  do {
    medicamentoString = medicamentoString.concat(document.getElementById(`medicamento-dropdown${counter}`).value + "!!");
    quantidadeString = quantidadeString.concat(document.getElementById(`quantidade-value${counter}`).value + "!!");
    quantidadeDiariaString = quantidadeDiariaString.concat(document.getElementById(`quantidade-diaria${counter}`).value + "!!");
    posologiaString = posologiaString.concat(document.getElementById(`posologia-text${counter}`).value + "!!");

    counter--
  } while (counter != -1)

  counter = 0;
  clearInput();



  fetch('/registarReceita', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      medicamentoString: medicamentoString,
      quantidadeString: quantidadeString,
      quantidadeDiariaString: quantidadeDiariaString,
      posologiaString: posologiaString,
      idMedico: bolachinha.value,
      numeroDeUtente: document.getElementById("id-paciente").value,
      renova: renova
    })
  }).then(async (resposta) => {

  });
}

