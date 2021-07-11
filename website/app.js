const express = require("express");
const mariadb = require('mariadb');
const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
//
//
const app = express();
const PORTA = 3000;


//Informa o express qual é a pasta a servir quando o script do servidor for executado
app.use(express.static('../website'))
app.use(express.urlencoded());

// Leitura de JSON bodies enviados pelos clientes
app.use(express.json());

//
//
//Usamos para realizar a ligação à BD cada vez que existe uma comunicação rest
const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'myreceita'
});
//
//
//------------------------- JOAO -------------------------------------------------------------------------------------------------------------------------------------
//
//
//------------------------------------------------------------->   UTENTES
//Signup de utentes
app.post('/signup', (req, res) => {

  const newUser = {
    numeroUtente: req.query.numeroDeUtente,
    nome: req.query.nome,
    palavraPasse: req.query.palavraPasse,
    nif: req.query.nif,
    mail: req.query.mail,
    telemovel: req.query.telemovel
  }



  async function registo() {
    try {
      let conn = await pool.getConnection();
      const selecionar = "SELECT cartaoUtente FROM paciente WHERE cartaoUtente = " + newUser.numeroUtente + ";";
      let rows = await conn.query(selecionar);
      console.log("Select Executado.");
      if (rows[0] == null) {
        const string = "INSERT INTO paciente values (" + newUser.numeroUtente + ", '" + newUser.nome + "', '" + newUser.palavraPasse + "', " + newUser.nif + ", '" + newUser.mail + "', " + newUser.telemovel + ")";
        console.log("Insert inicio.");
        let respo = await conn.query(string);
        console.log("Insert fim.");
        res.status(200).send();
      } else {
        console.log("Insert Não Executado.");
        res.status(400).send();
      }
    } catch (err) {

    }
  }

  registo();

});
//
//
//-------------------------
//
//
//Login de utentes
app.post('/login', (req, res) => {

  const newUser = {
    numeroUtente: req.query.numeroUtente,
    password: req.query.password,
  }



  async function autenticar() {
    try {
      let conn = await pool.getConnection();
      const selecionar = "SELECT cartaoUtente FROM paciente WHERE cartaoUtente = " + newUser.numeroUtente + " AND pass = '" + newUser.password + "';";
      let rows = await conn.query(selecionar);
      console.log("Select Executado.");
      if (rows[0] != null) {
        console.log("Conta autenticada.");
        res.status(200).send();
      } else {
        console.log("Numero de Utente ou Palavra Passe incorreta.");
        console.log("ERRO X");
        res.status(400).send();
      }
    } catch (err) {
      console.log("Numero de Utente ou Palavra Passe incorreta.");
      console.log("ERRO Y");
      res.status(400).send();
    }
  }

  autenticar();

});
//
//
//-------------------------
//
//
//-------------------------
//
//
app.post('/receita', jsonParser, (req, res) => {

  //Inicio - Obter segundos desde 1970
  var d = new Date();
  var seconds = Math.round(d.getTime() / 1000);
  console.log(seconds);
  //Fim

  const newUser = {
    numeroUtente: req.body.nome
  }

  async function verReceitas() {
    try {
      let conn = await pool.getConnection();
      const selecionar = "SELECT receita.idMedicamento, receita.nReceita, receita.dataEmissao, receita.duracaoMedicamento, receita.primeiroLevantamento, receita.renova, receita.ultimoLevantamento, medicamento.nome, medicamento.formaFarmaceutica, receita.posologia, receita.quantidade, medicamento.precoMaximo FROM medicamento join receita ON receita.idMedicamento = medicamento.idMedicamento WHERE receita.cartaoUtente = " + newUser.numeroUtente + ";";
      let rows = await conn.query(selecionar);
      console.log("Select Executado. (1) \n");

      let idString = "";
      let nomeString = "";
      let precoString = "";
      let formaFarmaceuticaString = "";
      let dosagemString = "";
      let embalagemString = "";
      let validadeReceita = "";
      let dataEmissaoString = "";
      let duracaoMedicamentoString = "";
      let primeiroLevantamentoString = "";
      let ultimoLevantamentoString = "";
      let renovaString = "";

      for (let i = 0; i < rows.length; i++) {

        if (rows[i].renova === "t") {
          //verificamos se ja foi efetuado o primeiro levantamento da receita
          if (rows[i].primeiroLevantamento === "t") {
            //seconds - 432000 para disponibilizar a receita 5 dias antes de acabar
            if (rows[i].ultimoLevantamento + rows[i].duracaoMedicamento > (seconds - 432000)) {
              idString += rows[i].nReceita + "!!";
              nomeString += rows[i].nome + "!!";
              precoString += rows[i].precoMaximo + "!!";
              formaFarmaceuticaString += rows[i].formaFarmaceutica + "!!";
              dosagemString += rows[i].posologia + "!!";
              embalagemString += rows[i].quantidade + "!!";
            }
          } else {
            //seconds - 432000 para disponibilizar a receita 5 dias antes de acabar
            if (rows[i].dataEmissao + rows[i].duracaoMedicamento > (seconds - 432000)) {
              idString += rows[i].nReceita + "!!";
              nomeString += rows[i].nome + "!!";
              precoString += rows[i].precoMaximo + "!!";
              formaFarmaceuticaString += rows[i].formaFarmaceutica + "!!";
              dosagemString += rows[i].posologia + "!!";
              embalagemString += rows[i].quantidade + "!!";
            }
          }
        } else {
          //Verifica se o dia atual é superior à validade da receita
          if (seconds > rows[i].validadeReceita) {
            //Verifica se nunca foi levantada
            if (rows[i].primeiroLevantamento === "f") {
              idString += rows[i].nReceita + "!!";
              nomeString += rows[i].nome + "!!";
              precoString += rows[i].precoMaximo + "!!";
              formaFarmaceuticaString += rows[i].formaFarmaceutica + "!!";
              dosagemString += rows[i].posologia + "!!";
              embalagemString += rows[i].quantidade + "!!";
            }
          }
        }

      }


      //console.log(idString + "\n" +nomeString + "\n" + precoString + "\n" + formaFarmaceuticaString + "\n" + dosagemString + "\n" + embalagemString);

      res.json({ 'status': '200', id: idString, nome: nomeString, precoMaximo: precoString, formaFarmaceutica: formaFarmaceuticaString, dosagem: dosagemString, embalagem: embalagemString });
      pool.end;
    }
    catch (err) {
      console.log("Numero de Utente ou Palavra Passe incorreta.");
      console.log("ERRO CATCH (1)");
      console.log(err);
      res.status(400).send();
    }
  }


  verReceitas();

});
//------------------------------------------------------------->   FIM DE UTENTES


//----------------------------------------------------------------------------------------------------------------------------------------------------->


//                                                      ⬆️João - Android

//                                                      ⬇️Luís - Web


//----------------------------------------------------------------------------------------------------------------------------------------------------->
// Login Medicos & Farmaceuticos - OK

app.post('/loginFuncionario', (req, res) => {

  const newFuncionario = {//Recebe o json com os dados do pedido
    cedulaProfissional: req.body.cedulaProfissional, //Cedula profissional do médico/enfermeiro
    password: req.body.password, //password
  }



  async function autenticar() {
    try {
      let conn = await pool.getConnection();//Liga à BD
      const selecionar = "SELECT cedulaProfissional FROM funcionario WHERE cedulaProfissional = " + newFuncionario.cedulaProfissional + " AND pass = '" + newFuncionario.password + "';"; //Query a enviar
      let rows = await conn.query(selecionar);//Executa a query e espera pela resposta

      console.log("Login funcionário: Select Executado.\n");

      if (rows[0] != null) {
        console.log("Login funcionário: Conta autenticada.\n");

        const funcao = "SELECT funcao FROM funcionario WHERE cedulaProfissional =" + newFuncionario.cedulaProfissional + ";";//Verifica o tipo de funcionário
        let rows1 = await conn.query(funcao);

        if (rows1[0].funcao == "M") { //Devolve o tipo numa mensagem json conforme o resultado da BD
          res.send({ mensagem: "medic" })//Médico 
        } else {
          res.send({ mensagem: "farm" })//Farmaceutico
        }

        res.status(200).send();
      } else {
        console.log("Login funcionário: Cedula Profissional ou Palavra Passe incorreta.\n");//Erro
        res.send({ mensagem: "erro" })
      }
    } catch (err) {
      console.log("Login funcionário: Cedula Profissional ou Palavra Passe incorreta.\n");//Erro
      res.send({ mensagem: "erro" })
    }
  }

  autenticar();

});

//----------------------------------------------------------------------------------------------------------------------------------------------------->


//                                                      ⬇️Médicos


//----------------------------------------------------------------------------------------------------------------------------------------------------->

// Nome do paciente - OK

app.post('/verificarPaciente', jsonParser, (req, res) => {

  const newPaciente = {//Recebe o json com os dados do pedido
    numeroUtente: req.body.paciente //Numero do cartão de utente
  }

  async function autenticar() {
    try {
      let conn = await pool.getConnection();//Liga à base de dados
      const selecionar = "SELECT nome FROM paciente WHERE cartaoUtente = " + newPaciente.numeroUtente + ";"; //Formula da query
      let rows = await conn.query(selecionar); //Executa a query

      console.log("verificarPaciente: Procura executada.\n");

      if (rows[0] != null) {// Se encontrar o cartão de utente recebido, envia de volta o nome do utente
        console.log("verificarPaciente: Cartão de utente encontrado.\n");
        res.json({ 'status': '200', nomeUtente: rows[0].nome });
      } else {
        console.log("verificarPaciente: Erro SQL - Cartão de utente não encontrado\n");//Erro
        res.send({ mensagem: "erro" })
      }
    } catch (err) {
      console.log("verificarPaciente: Erro não definido\n");
      console.log(err)
      res.send({ mensagem: "erro" })
    }
  }

  autenticar();

});

//----------------------------------------------------------------------------------------------------------------------------------------------------->
//Lista medicamentos (dropdown)  - OK
//Devolver nome, dosagem e forma farmaceutica de todos os medicamentos. No html separar cada id do json por '!!' e colocar numa lista.


app.post('/medicamentos', jsonParser, (req, res) => {

  async function autenticar() {
    try {
      let conn = await pool.getConnection();// Liga à base de dados
      const selecionar = "SELECT nome, dosagem, formaFarmaceutica FROM medicamento;"; //Formula da query
      let rows = await conn.query(selecionar); // Executa a query

      console.log("Medicamentos-dropdown: Listagem dos medicamentos executada.\n");

      //Inicializar as strings a enviar
      let nomeString = ""; //Nome do medicamento
      let dosagemString = ""; //Dosagem do medicamento
      let formaFarmaceuticaString = ""; //Forma farmaceutica do medicamento

      //Itera por cada elemento da BD, adiciona o mesmo à string e passa ao próximo elemento
      for (let i = 0; i < rows.length; i++) {
        nomeString += rows[i].nome + "!!"; //Nome do medicamento
        dosagemString += rows[i].dosagem + "!!"; //Dosagem do medicamento
        formaFarmaceuticaString += rows[i].formaFarmaceutica + "!!"; //Forma farmaceutica do medicamento
      }

      res.json({ 'status': '200', nome: nomeString, dosagem: dosagemString, formaFarmaceutica: formaFarmaceuticaString });//Envia os dados

    } catch (err) {
      console.log("Medicamentos - Erro não especificado / BD timeout - Demasiadas queries\n"); //
      res.status(400).send();
    }
  }

  autenticar();

});

//----------------------------------------------------------------------------------------------------------------------------------------------------->
//REGISTO DE UMA RECEITA - OK

app.post('/registarReceita', jsonParser, (req, res) => {

  const newReceita = {
    numeroDeUtente: req.body.numeroDeUtente, //Cartão de utente
    idMedico: req.body.idMedico, //Cédula profissional
    nomeMedicamento: req.body.medicamentoString, // Nome do medicamento
    posologia: req.body.posologiaString, //Posologia - Indicações de toma
    renova: req.body.renova, //Token de renovação da receita
    forma: req.body.formaString, //Forma Farmaceutica
    quantidade: req.body.quantidadeString, //Quantidade de embalagens
    diariamente: req.body.quantidadeDiariaString //Quantida de comprimidos/ xarope a tomar por dia
  }



  async function registoMedicamento() {
    try {
      let conn = await pool.getConnection(); //Liga à base de dados

      //Verificar o numero da ultima receita inserida
      const selecionar = "SELECT MAX(nReceita) AS MaxValues FROM receita;"; //Formula da query
      let rows = await conn.query(selecionar);// Executa a query para ir buscar o numero da ultima receita emitida

      console.log("Registar receita - nova receita adicionada à lista\n");

      const nReceita = rows[0].MaxValues + 1; //Usa o resultado obtido a adiciona +1 ao resultado

      const selecionar1 = "SELECT idFuncionario FROM funcionario WHERE cedulaProfissional = " + newReceita.idMedico + ";"; //Formula da query
      let rows1 = await conn.query(selecionar1); //Executa a query para ir buscar o id do funcionário a quem pertence a cédula profissional
      var medico = rows1[0].idFuncionario;

      //Guardar toma diaria em array
      var diariamenteArray = [];
      diariamenteArray = newReceita.diariamente.split("!!");

      //Para verificar a forma farmaceutica, dosagem e embalagem do medicamento da receita --> (Necessario para contas duracaoMedicamento)
      //Guardar todos os medicamentos recebidos num array

      var medicamentosArray = [];
      medicamentosArray = newReceita.nomeMedicamento.split("!!");
      //Guardar todos os renova recebidos num array
      var renovaArray = [];
      renovaArray = newReceita.renova.split("!!");
      //Guardar todas as posologias recebidas num array
      var posologiaArray = [];
      posologiaArray = newReceita.posologia.split("!!");
      //Guardar todas as quantidades recebidos num array
      var quantidadeArray = [];
      quantidadeArray = newReceita.quantidade.split("!!");


      let duracaoMedicamentoArray = [];

      for (let i = 0; i < medicamentosArray.length - 1; i++) { //Itera por cada linha recebida da receita
        const selecionar1 = "SELECT formaFarmaceutica, dosagem, embalagem FROM medicamento WHERE nome ='" + medicamentosArray[i] + "';";
        const rows1 = await conn.query(selecionar1);

        if (rows1[0].formaFarmaceutica === "Comprimido") {
          let dias = rows1[0].embalagem / diariamenteArray[i];
          var duracaoMedicamento = dias * 86400;
          duracaoMedicamentoArray.push(duracaoMedicamento);
        } else {
          //Assumimos 15ml como toma de uma colher de sopa --> (calculado em excesso para os que têm toma inferior)
          let tomaDiaria = 15 * diariamenteArray[i];
          let dias = rows1[0].dosagem / tomaDiaria;
          var duracaoMedicamento = dias * 86400;
          duracaoMedicamentoArray.push(duracaoMedicamento);
        }
      }
      //Fim

      //Inicio - Obter segundos desde 1970
      var d = new Date();
      var dataEmissao = Math.round(d.getTime() / 1000);
      //Fim

      //Se nao renovar é necessário ver a validade da receita
      var validadeReceitaArray = [];
      for (let i = 0; i < medicamentosArray.length - 1; i++) {
        if (renovaArray[i] === "t") {
          validadeReceitaArray.push(0);
          console.log("Renova = t");
        } else {
          validadeReceitaArray.push(dataEmissao + (duracaoMedicamentoArray[i] * quantidadeArray[i]));
        }
      }

      //Fim


      //Registar uma receita na base de dados
      for (let i = 0; i < medicamentosArray.length - 1; i++) {
        const selecionar1 = "SELECT idMedicamento FROM medicamento WHERE nome = '" + medicamentosArray[i] + "';";
        const rows1 = await conn.query(selecionar1);

        let x = "INSERT INTO receita values ( NULL, " + nReceita + ", " + newReceita.numeroDeUtente + ", " + medico + ", " + rows1[0].idMedicamento + ", '" + posologiaArray[i] + "', " + dataEmissao + ", " + duracaoMedicamentoArray[i] + ", " + validadeReceitaArray[i] + ", " + 0 + ", 'f', '" + renovaArray[0] + "', " + quantidadeArray[i] + ");";


        let respo = await conn.query(x);
      }
      res.send({ mensagem: "adicionado" });
    }
    catch (err) {
      res.status(400).send();
    }
  }

  registoMedicamento();

});

//----------------------------------------------------------------------------------------------------------------------------------------------------->


//                                                      ⬇️Farmácia


//----------------------------------------------------------------------------------------------------------------------------------------------------->
//Leitura de uma receita 

app.post('/verificarReceita', jsonParser, (req, res) => {//Recebe o id da receita e devolve o conteudo da mesma e o nome do proprietário
  console.log("Receitas - Pedido recebido\n")

  const newReceita = {
    numeroReceita: req.body.numeroReceita, //Recebe o numero da receita do backoffice
  }

  //Obter segundos desde 1970
  var d = new Date();
  var seconds = Math.round(d.getTime() / 1000);
  //console.log("segundos: " + seconds);

  async function autenticar() {
    try {
      let conn = await pool.getConnection();
      const sel = "SELECT cartaoUtente, idMedicamento FROM receita WHERE nReceita = " + newReceita.numeroReceita + ";";
      let row = await conn.query(sel);

      console.log(`Receitas - Consultar receita ${newReceita.numeroReceita} \n`)

      const selecionar = "SELECT receita.idMedicamento, receita.validadeReceita, receita.nReceita, receita.dataEmissao, receita.duracaoMedicamento, receita.primeiroLevantamento, receita.renova, receita.ultimoLevantamento, medicamento.dosagem, medicamento.nome, medicamento.formaFarmaceutica, receita.posologia, receita.quantidade, medicamento.precoMaximo FROM medicamento join receita WHERE receita.idMedicamento = " + row[0].idMedicamento + " AND receita.nReceita = " + newReceita.numeroReceita + " AND medicamento.idMedicamento = " + row[0].idMedicamento + ";";
      let rows = await conn.query(selecionar);

      //Vai buscar o nome do dono da receita com base no id da receita e no cartão de utente
      const query = "SELECT paciente.nome FROM paciente JOIN receita ON receita.cartaoUtente = paciente.cartaoUtente WHERE receita.idReceita = " + newReceita.numeroReceita + ";";
      let nomeReceita = await conn.query(query);
      let nomeUtente = nomeReceita[0].nome

      //Para Enviar
      let idString = "";
      let nomeString = "";
      let precoString = "";
      let formaFarmaceuticaString = "";
      let dosagemString = "";
      let posologiaString = "";
      let embalagemString = "";
      let levantamentoString = "";

      for (let i = 0; i < rows.length; i++) {

        if (rows[0].primeiroLevantamento == "t") { //Verifica se a receita já foi levantada
          console.log("Receita - Receita pedida já foi levantada\n");
          res.send({ mensagem: "levantada" })

        } else if (rows[0].primeiroLevantamento == "f") {//Caso ainda não tenha sido levantada
          if (rows[0].renova == "f") { //Caso não seja uma receita de renovação automática
            //Caso  seja uma receita de renovação automática
            let teste = rows[0].dataEmissao + rows[0].duracaoMedicamento

            if (rows[0].validadeReceita <= teste) {
              console.log("Receita - Receita pedida já expirou\n");
              res.send({ mensagem: "validade" })

            } else {//Receita já expirou
              idString += rows[i].nReceita + "!!";
              nomeString += rows[i].nome + "!!";
              precoString += rows[i].precoMaximo + "!!";
              formaFarmaceuticaString += rows[i].formaFarmaceutica + "!!";
              dosagemString += rows[i].dosagem + "!!";
              posologiaString += rows[i].posologia + "!!";
              embalagemString += rows[i].quantidade + "!!";
              levantamentoString += rows[i].primeiroLevantamento + "!!";

              res.json({
                'status': '200',
                id: idString,
                nomeUtente: nomeUtente,
                nomeMedicamento: nomeString,
                dosagem: dosagemString,
                formaFarmaceutica: formaFarmaceuticaString,
                quantidade: embalagemString,
                posologia: posologiaString,
                levantado: levantamentoString,
              });
            }
          } else {//Caso  seja uma receita de renovação automática
            idString += rows[i].nReceita + "!!";
            nomeString += rows[i].nome + "!!";
            precoString += rows[i].precoMaximo + "!!";
            formaFarmaceuticaString += rows[i].formaFarmaceutica + "!!";
            dosagemString += rows[i].dosagem + "!!";
            posologiaString += rows[i].posologia + "!!";
            embalagemString += rows[i].quantidade + "!!";
            levantamentoString += rows[i].primeiroLevantamento + "!!";

            res.json({
              'status': '200',
              id: idString,
              nomeUtente: nomeUtente,
              nomeMedicamento: nomeString,
              dosagem: dosagemString,
              formaFarmaceutica: formaFarmaceuticaString,
              quantidade: embalagemString,
              posologia: posologiaString,
              levantado: levantamentoString,
            });
          }

        }

      }

      pool.end;
    }
    catch (err) {
      //console.log(err);
      console.log("Receita - Receita não encontrada/Erro\n");
      res.send({ mensagem: "erro" })
    }
  }

  autenticar();

});
//----------------------------------------------------------------------------------------------------------------------------------------------------->


//                                                      ⬇Fim de Funções para Farmácia


//----------------------------------------------------------------------------------------------------------------------------------------------------->


//Mantem o servidor a funcionar através da porta 3000 usando express js
app.listen(PORTA);
console.log("Server Ligado");
