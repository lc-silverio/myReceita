//VARIAVEIS GLOBAIS
var counter = 0; //Para as linhas da receita
var bolacha; //Cookies
var identificacao; //numeroDeUtente

//----------------------------------------------------------------------------------------------------------------------------------------------------->

function resetDropdown() {//Faz reset aos dropdowns na tabela da receita
  var medicamentoDropdown = document.getElementById("medicamento-dropdown0");
  medicamentoDropdown.selectedIndex = 0; //Faz reset para o campo vazio do dropdown
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

  while (table.rows.length >= 4) {//Limpa linhas extra adicionadas à receita, ignora as primeira 4 que são de cabeçalho, botões e a linha original
    table.deleteRow(2);
  }

  resetDropdown();// Chama a função que faz reset à dropdown box
}

//----------------------------------------------------------------------------------------------------------------------------------------------------->

function clearInputFarm() {
  location.reload();
}

//----------------------------------------------------------------------------------------------------------------------------------------------------->

function addNewLine() { //Adiciona nova linha à tabela da receita do médico - Associada ao botão "Adicionar Linha"
  counter++;

  var table = document.getElementById("table");
  var row = table.insertRow(2); // nova linha

  var cell1 = row.insertCell(0); //medicamento
  var cell2 = row.insertCell(1); // quantidade embalagem
  var cell3 = row.insertCell(2); // quantidade diaria
  var cell4 = row.insertCell(3); // posologia
  var cell5 = row.insertCell(4); // apagar

  cell1.innerHTML = `<select class="data, medicamento-dropdown" name="medicamento-dropdown" id="medicamento-dropdown${counter}">
        <option value=""></option>
        </select>`;/*Medicamento*/

  cell2.innerHTML = `<input class="data, quantidade-value" type="number" name="quantidade-value" id="quantidade-value${counter}">`;/*Quantidade de embalagens*/

  cell3.innerHTML = `<input class="data, quantidade-diaria" type="number" name="quantidade-diaria" id="quantidade-diaria${counter}">`;/*Quantidade Diária a tomar - usado no calculo de validades*/

  cell4.innerHTML = `<input class="data, posologia-text" type="text" name="posologia-text" id="posologia-text${counter}">`;/*Posologia*/

  cell5.innerHTML = `<img id="clear" onclick="limparLinha(this)" src="/img/delete.svg" alt="Apagar linha">`;/*Limpar*/

  medFetch();//Chama a função para popular os dropdowns na view do médico
}

//----------------------------------------------------------------------------------------------------------------------------------------------------->

function limparLinha(r) {//Função para eliminar uma linha da tabela da receita do médico - Associada ao X em cada linha
  var i = r.parentNode.parentNode.rowIndex; //vai buscar o indice das linhas para iterar no for

  if (table.rows.length >= 4) {//Verifica o numero de linhas na tabela
    document.getElementById("table").deleteRow(i);//Apaga a linha selecionada
  } else {
    clearInput();//Apaga os inputs da primeira linha ... e do cartao de utente ... ups
    resetDropdown();//Faz reset ao dropdown da primeira linha
  }
}

//----------------------------------------------------------------------------------------------------------------------------------------------------->

function logout() {
  window.location = "index.html";

  //limpa as variáveis globais
  counter = 0;
  bolacha = 0;
}

//----------------------------------------------------------------------------------------------------------------------------------------------------->

//Vai buscar os cookies disponiveis e limpa a palha desnecessária para ficar com o id do funcionário
function getCookieValue(name) {
  let result = document.cookie.match("(^|[^;]+)\\s*" + name + "\\s*=\\s*([^;]+)")
  return result ? result.pop() : ""
}

//----------------------------------------------------------------------------------------------------------------------------------------------------->


//                                                      FIM DE FUNÇÕES DE FRONT-END
//                                                        INICIO DE BACKEND CALLS


//----------------------------------------------------------------------------------------------------------------------------------------------------->

//Login de funcionários
function login() {

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
    const incoming = await resposta.json();

    if (incoming.mensagem == "medic") {//Verifica o tipo de função e envia para o backoffice respectivo ou apresenta erro
      window.location = "backoffice-medic.html" //Backoffice medico
    } else if (incoming.mensagem == "farm") {
      window.location = "backoffice-farm.html" //Backoffice farmamácia
    } else if (incoming.mensagem == "erro") {
      window.alert("Cédula Profissional ou palavra-passe incorreta. Por favor tente novamente.")
    }
  });
}

//----------------------------------------------------------------------------------------------------------------------------------------------------->

//Verifica se não há campos vazios no form de login
function verificarLogin() {
  identificacao = document.getElementById("cedulaProfissional").value; //passa a cédula profissional à variàvel global
  var pass = document.getElementById("password").value;

  if (identificacao == "" || pass == "") {
    window.alert("Cédula Profissional ou palavra-passe incorreta. Por favor tente novamente.")
  } else {
    document.cookie = `id = ${document.getElementById("cedulaProfissional").value}` //Cria um cookie com a cédula do médico
    login()
  }
}

//----------------------------------------------------------------------------------------------------------------------------------------------------->

//Verifica o cartao de utente fornecido para comfirmar se o campo está vazio
function verificarUser() {
  identificacao = document.getElementById("id-paciente").value;

  if (identificacao == "") {
    window.alert("Cartão de Utente não reconhecido. Por favor tente novamente.")
  } else {
    userFetch()
  }
}

//----------------------------------------------------------------------------------------------------------------------------------------------------->

//Verifica o cartão de utente fornecido, vai à BD confirmar se ele existe e devolve o nome do utente para criar a nova receita
function userFetch() {

  fetch('/verificarPaciente', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      paciente: document.getElementById("id-paciente").value,//Envia o cartão de utente fornecido ao servidor
    })
  }).then(async (resposta) => {
    const incoming = await resposta.json();//Recebe a resposta

    if (incoming.mensagem == "erro") {
      window.alert("Cartão de Utente não reconhecido. Por favor tente novamente.")//Erro
    } else {
      document.getElementById("nome-paciente").value = incoming.nomeUtente;//Preenche o nome do utente na receita
    }

  });
}

//----------------------------------------------------------------------------------------------------------------------------------------------------->

//Executa onLoad e vai buscar a lista dos remédios à BD para colocar na primeira linha do dropdown
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
    const incoming = await resposta.json(); //Recebe a lista dos documentos numa string delimitada por !!

    //MEDICAMENTOS
    var nomeString = incoming.nome.split("!!")//Separa os dados recebidos para um array usando os !! como delimitadores
    nomeString.splice(nomeString.length - 1)

    var nomeStringClean = nomeString.filter((c, index) => {
      return nomeString.indexOf(c) === index;
    })

    var sel = document.getElementById(`medicamento-dropdown${counter}`);//Usa a variavel global counter como referencia para criar uma nova linha, dá a volta ao problema dos ids unicos e permite iterar sobre a lista da receita dinamicamente

    for (var i = 0; i < nomeStringClean.length; i++) {//Itera pelo array
      var opt = document.createElement('option');//Cria um novo elemento option na lista de dropdown
      opt.innerHTML = nomeStringClean[i];//Preenche os dados
      opt.value = nomeStringClean[i];
      sel.appendChild(opt);//Adiciona os dados à dropdown da receita
    }
  });
}

//----------------------------------------------------------------------------------------------------------------------------------------------------->

//Executa ao clicar no "Adicionar Linha" e vai buscar a lista dos remédios à BD para colocar na dropdown
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
    const incoming = await resposta.json(); //Recebe a lista dos documentos numa string delimitada por !!

    //MEDICAMENTOS
    var nomeString = incoming.nome.split("!!") //Separa os dados recebidos para um array usando os !! como delimitadores
    nomeString.splice(nomeString.length - 1)

    var nomeStringClean = nomeString.filter((c, index) => {
      return nomeString.indexOf(c) === index;
    })

    var sel = document.getElementById('medicamento-dropdown0');//Usa a variavel global counter como referencia para criar uma nova linha, dá a volta ao problema dos ids unicos e permite iterar sobre a lista da receita dinamicamente

    for (var i = 0; i < nomeStringClean.length; i++) {//Itera pelo array
      var opt = document.createElement('option');//Cria um novo elemento option na lista de dropdown
      opt.innerHTML = nomeStringClean[i];//Preenche os dados
      opt.value = nomeStringClean[i];
      sel.appendChild(opt);//Adiciona os dados à dropdown da receita
    }
  })

  bolacha = getCookieValue("id")//Guarda o id do médico numa cookie para utilizar na altura de submeter a receita
}

//----------------------------------------------------------------------------------------------------------------------------------------------------->

//Recebe todo o formulário dá pagina do médico para enviar para o servidor para ser adicionado à base de dados
function registarReceita() {

  //Declaração de strings que vão ser preenchidas com o conteudo da receita, cada item em cada string é separado por !!
  var medicamentoString = ""; //Nome dos medicamentos
  var quantidadeString = ""; //Quantidade de embalagens
  var quantidadeDiariaString = ""; //Quandos comprimidos/ ml's de xarope toma por dia - Usado para calcular a validade da receita com base na quantidade de liquidos/comprimidos numa caixa
  var posologiaString = ""; //Indicações de toma



  //Verifica o estado da checkbox e atribui um valor consoante o estado checked = t / unchecked = f
  if ((document.getElementById("auto-renov").checked) === true) {
    renova = "t" //Renova a receita automaticamente
  } else {
    renova = "f" //Não renova - Validade com base na quantidade de remédios a tomar
  }


  // Loop pelo array de itens na receita para criar uma string que é enviada no body do json
  do {
    medicamentoString = medicamentoString.concat(document.getElementById(`medicamento-dropdown${counter}`).value + "!!");
    quantidadeString = quantidadeString.concat(document.getElementById(`quantidade-value${counter}`).value + "!!");
    quantidadeDiariaString = quantidadeDiariaString.concat(document.getElementById(`quantidade-diaria${counter}`).value + "!!");
    posologiaString = posologiaString.concat(document.getElementById(`posologia-text${counter}`).value + "!!");

    counter-- // Retira uma unidade por cada volta ao ciclo das linhas da receita
  } while (counter != -1)//Executa pelo menos uma vez, assim garantimos que apanha sempre a linha original

  counter = 0; //Limpa o contador de linhas


  //Verifica se existem dados em todas as caixas antes de submeter
  if ((posologiaString.length <= 2) || (quantidadeDiariaString.length < 1) || (medicamentoString.length < 3) || (quantidadeString.length < 1)) {
    window.alert("Erro no preenchimento de receita. Por favor tente novamente.")
  } else {
    fetch('/registarReceita', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        medicamentoString: medicamentoString, //Nome dos medicamentos
        quantidadeString: quantidadeString, //Quantidade de embalagens
        quantidadeDiariaString: quantidadeDiariaString, //Quandos comprimidos/ ml's de xarope toma por dia - Usado para calcular a validade da receita com base na quantidade de liquidos/comprimidos numa caixa
        posologiaString: posologiaString, //Indicações de toma
        idMedico: bolacha, //Cookie com a cédula profissional do médico que emitiu a receita
        numeroDeUtente: identificacao, //Numero do cartão de cidadão do utente a quem pertence a receita
        renova: renova //Token para renovação automática da receita
      })
    }).then(async (resposta) => {

      const incoming = await resposta.json();

      //Confirma que recebeu um ok do servidor antes de informar que a receita foi submetida na BD.
      if (incoming.mensagem == "adicionado") {
        window.alert("Receita emitida com sucesso") //Woop Woop
      }

    });
    clearInput(); //Limpa as linhas
  }
}

//----------------------------------------------------------------------------------------------------------------------------------------------------->

function receitaFetch() {
  console.log(idReceita.value)

  fetch('/verificarReceita', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      numeroReceita: document.getElementById('idReceita').value,
    })
  }).then(async (resposta) => {
    const incoming = await resposta.json();//Recebe a resposta

    if (incoming.mensagem == "erro") {
      window.alert("Receita não encontrada. Por favor tente novamente.")//Erro
    } else {

      //Nome utente
      var nomeUtenteArray = incoming.nomeUtente.split("!!")
      var nomeUtente = nomeUtenteArray[0]
      document.getElementById("cartaoutente").value = nomeUtente;//Preenche o nome do utente na receita


      //Medicamento
      var nomeMedicamentoArray = incoming.nomeMedicamento.split("!!")
      var nomeMedicamento = nomeMedicamentoArray[0]
      document.getElementById("medicamento-dropdown").innerHTML = nomeMedicamento;

      //Dosagem
      var dosagemArray = incoming.dosagem.split("!!")
      var dosagem = dosagemArray[0]
      document.getElementById("dosagem-dropdown").innerHTML = dosagem;

      //Forma Farmaceutica
      var formaArray = incoming.formaFarmaceutica.split("!!")
      var formaFarmaceutica = formaArray[0]
      document.getElementById("forma-dropdown").innerHTML = formaFarmaceutica;

      //Quantidade de embalagens
      var quantidadeArray = incoming.quantidade.split("!!")
      var quantidade = quantidadeArray[0]
      document.getElementById("quantidade-value").innerHTML = quantidade;

      //Posologia - Indicações de toma
      var posologiaArray = incoming.posologia.split("!!")
      var posologia = posologiaArray[0]
      document.getElementById("posologia-text").innerHTML = posologia;

      //Levantado/Levantamento
      var levantadoArray = incoming.levantado.split("!!")
      var levantado = levantadoArray[0]

      if (levantado == "t") {
        document.getElementById("levantado").checked = true;
      } else if (levantado == "f") {
        document.getElementById("levantado").checked = false;
      }
    }

  });
}
