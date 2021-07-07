const express = require("express");
const mariadb = require('mariadb');
const bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
//
//
const app = express();
const PORTA = 3000;


//Luis
app.use(express.static('../website'))
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

//
//
//Usamos para realizar a connexao à BD cada vez que existe uma comunicação rest
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
//
//
//------------------------- LUIS  -------------------------------------------------------------------------------------------------------------------------------------
//
//
//                                                      ---------------> NOTAS <---------------
// 1- todas as comunicações rest estão em Querys, se as quiseres alterar para bodys eu consigo faze-lo facilmente, 
//        se for para outra coisa qualquer vou ter de aprender mas n vai ser nenhuma dor de cabeça.
//
// 2- o response vai variando entre apenas um status e um status e um json
//
// 3- a leitura dos dados quando é enviar em json no lado do backofice do site pode-te parecer confuso mas é bastante simples, 
//         eu consigo explicar como funciona em 5 min. 
//
// 4- basicamente quando vai json envio todos os nomes dos medicamentos (p.e.) no mesmo id, o que os separa é dois char '!!' entre os nomes, 
//         e o mesmo acontece com os restantes ids. Isto não é a maneira mais correta de o fazer mas devido a conflitos decidi fazer assim.
//            Caso nao gostes podemos alterar a comunicação no lado da web, mas antes de alterar deixa-me explicar-te como se lê pq esta mt simples mesmo.
//
//
//



// Login Medicos & Farmaceuticos - OK
app.post('/loginFuncionario', (req, res) => {

  const newFuncionario = {
    cedulaProfissional: req.body.cedulaProfissional,
    password: req.body.password,
  }



  async function autenticar() {
    try {
      let conn = await pool.getConnection();
      const selecionar = "SELECT cedulaProfissional FROM funcionario WHERE cedulaProfissional = " + newFuncionario.cedulaProfissional + " AND pass = '" + newFuncionario.password + "';";
      let rows = await conn.query(selecionar);
      console.log("Login funcionário: Select Executado.");
      if (rows[0] != null) {
        console.log("Login funcionário: Conta autenticada.");

        const funcao = "SELECT funcao FROM funcionario WHERE cedulaProfissional =" + newFuncionario.cedulaProfissional + ";";
        let rows1 = await conn.query(funcao);
        //console.log(rows1[0].funcao)

        if (rows1[0].funcao == "M") {
          res.send({ mensagem: "medic" })
        } else {
          res.send({ mensagem: "farm" })
        }

        res.status(200).send();
      } else {
        console.log("Login funcionário: Cedula Profissional ou Palavra Passe incorreta.");
        res.send({ mensagem: "erro" })
      }
    } catch (err) {
      console.log("Login funcionário: Cedula Profissional ou Palavra Passe incorreta.");
      res.send({ mensagem: "erro" })
    }
  }

  autenticar();

});



// Devolver nome do paciente - OK
app.post('/verificarPaciente', jsonParser, (req, res) => {

  const newPaciente = {
    numeroUtente: req.body.paciente
  }

  async function autenticar() {
    try {
      let conn = await pool.getConnection();
      const selecionar = "SELECT nome FROM paciente WHERE cartaoUtente = " + newPaciente.numeroUtente + ";";
      let rows = await conn.query(selecionar);
      console.log("verificarPaciente: Select Executado.");
      if (rows[0] != null) {
        console.log("verificarPaciente: Conta encontrada.");
        res.json({ 'status': '200', nomeUtente: rows[0].nome });
      } else {
        console.log("verificarPaciente: Erro SQL - Não encontrado");
        res.send({ mensagem: "erro" })
      }
    } catch (err) {
      console.log("verificarPaciente: Erro");
      console.log(err)
      res.send({ mensagem: "erro" })
    }
  }

  autenticar();

});



//Lista medicamentos (dropdown)  - OK
//Devolver nome, dosagem e forma farmaceutica de todos os medicamentos. No html separar cada id do json por '!!' e colocar numa lista.
app.post('/medicamentos', jsonParser, (req, res) => {

  async function autenticar() {
    try {
      let conn = await pool.getConnection();
      const selecionar = "SELECT nome, dosagem, formaFarmaceutica FROM medicamento;";
      let rows = await conn.query(selecionar);
      console.log("Medicamentos-dropdown: Select all executado.");

      let nomeString = "";
      let dosagemString = "";
      let formaFarmaceuticaString = "";
      for (let i = 0; i < rows.length; i++) {
        nomeString += rows[i].nome + "!!";
        dosagemString += rows[i].dosagem + "!!";
        formaFarmaceuticaString += rows[i].formaFarmaceutica + "!!";
      }
      /*console.log(nomeString)
      console.log(dosagemString)
      console.log(formaFarmaceuticaString)*/
      res.json({ 'status': '200', nome: nomeString, dosagem: dosagemString, formaFarmaceutica: formaFarmaceuticaString });

    } catch (err) {
      console.log("ERRO Medicamentos");
      res.status(400).send();
    }
  }

  autenticar();

});














//------------------------------------------------------------->   MEDICOS
//REGISTO DE UMA RECEITA
app.post('/registarReceita', jsonParser, (req, res) => {

  const newReceita = {
    numeroDeUtente: req.body.numeroDeUtente,
    idMedico: req.body.idMedico,
    nomeMedicamento: req.body.medicamentoString, //ALTERAR NOME MEDICAMENTO
    posologia: req.body.posologiaString,
    renova: req.body.renova,
    forma: req.body.formaString,
    quantidade: req.body.quantidadeString,
    diariamente: req.body.tomaDiariaString
  }



  async function registoMedicamento() {
    try {
      let conn = await pool.getConnection();

      //Para verificar ultimo numero de receita inserido
      const selecionar = "SELECT MAX(nReceita)FROM receita;";
      let rows = await conn.query(selecionar);
      console.log("Select Executado.");
      console.log(idMedico)
      var nReceita = rows[0].nReceita + 1;
      //Fim
      console.log("aqui");
      //Para verificar a forma farmaceutica, dosagem e embalagem do medicamento da receita --> (Necessario para contas duracaoMedicamento)
      //Guardar todos os medicamentos recebidos num array

      var medicamentosArray = [];
      console.log("ola!");
      medicamentosArray = newReceita.nomeMedicamento.split("!!");
      console.log("1.");
      //Guardar todos os renova recebidos num array
      var renovaArray = [];
      renovaArray = newReceita.renova.split("!!");
      //Guardar todas as posologias recebidas num array
      console.log("2");
      var posologiaArray = [];
      posologiaArray = newReceita.posologia.split("!!");
      //Guardar todas as quantidades recebidos num array
      console.log("3");
      var quantidadeArray = [];
      quantidadeArray = newReceita.quantidade.split("!!");
      console.log("4");


      let duracaoMedicamentoArray = [];
      console.log(medicamentosArray.length)

      for (let i = 0; i < medicamentosArray.length - 1; i++) {
        const selecionar1 = "SELECT formaFarmaceutica, dosagem, embalagem FROM medicamento WHERE nome ='" + medicamentosArray[i] + "';";
        const rows1 = await conn.query(selecionar1);
        console.log("Select " + i + " Executado. Inicio Loop " + i + ".");

        //apagar quando testado
        console.log("Embalagem: " + rows1[0].embalagem);
        console.log("Dosagem: " + rows1[0].dosagem);
        console.log("Forma: " + rows1[0].formaFarmaceutica);

        if (rows1[i].formaFarmaceutica === "Comprimido") {
          let dias = rows1[0].embalagem / newReceita.diariamente;
          var duracaoMedicamento = dias * 86400;
          duracaoMedicamentoArray.push(duracaoMedicamento);
          console.log("Duracao do Medicamento (comprimido): " + duracaoMedicamento);
        } else {
          //Assumimos 15ml como toma de uma colher de sopa --> (calculado em excesso para os que têm toma inferior)
          let tomaDiaria = 15 * newReceita.diariamente;
          let dias = rows1[0].dosagem / tomaDiaria;
          var duracaoMedicamento = dias * 86400;
          duracaoMedicamentoArray.push(duracaoMedicamento);
          console.log("Duracao do Medicamento (xarope): " + duracaoMedicamento);
        }
        console.log("Fim do loop " + i + ".");
      }
      //Fim

      //Inicio - Obter segundos desde 1970
      var d = new Date();
      var dataEmissao = Math.round(d.getTime() / 1000);
      console.log("Data Emissão:" + dataEmissao);
      //Fim

      //Se nao renovar é necessário ver a validade da receita
      var validadeReceitaArray = [];
      for (let i = 0; i < medicamentosArray.length; i++) {
        console.log("Inicio Loop " + i + ".");
        if (renovaArray[i] === "t") {
          validadeReceitaArray.push(0);
          console.log("Renova = t");
        } else {
          validadeReceitaArray.push(dataEmissao + (duracaoMedicamentoArray[i] * quantidadeArray[i]));
          console.log("Validade da Receita: " + validadeReceitaArray[i]);
        }
        console.log("Fim do loop " + i + ".");
      }

      //Fim


      //Registar uma receita na base de dados
      for (let i = 0; i < medicamentosArray.length; i++) { //FAZER SELECT DO NOME COM O ARRAY MEDICAMENTOS
        const selecionar1 = "SELECT idMedicamento FROM medicamento WHERE nome = " + medicamentosArray[i] + ";";
        const rows1 = await conn.query(selecionar1);
        console.log("Inicio Loop Inserir " + i + ".");
        const string = "INSERT INTO receita values (" + NULL + ", " + nReceita + ", " + newReceita.numeroDeUtente + ", " + newReceita.idMedico + ", " + rows1[0].nome + ", '" + posologiaArray[i] + "', " + dataEmissao + ", " + duracaoMedicamentoArray[i] + ", " + validadeReceitaArray[i] + ", " + 0 + ", 'f', '" + renovaArray[i] + "', " + quantidadeArray[i] + ")";
        console.log("Insert inicio.");
        let respo = await conn.query(string);
        console.log("Insert fim. Fim do loop " + i + ".");
      }
      res.status(200).send();
    }
    catch (err) {
      res.status(400).send();
    }
  }

  registoMedicamento();

});
//
//
//
//------------------------------------------------------------->   FIM DE MEDICOS
//
//
//------------------------------------------------------------->   FARMACEUTICOS
//
//
// Devolver numero do cartao de utente e receitas!!!!!!!!!!!!!! e estado de levantamento
app.post('/verificarReceita', jsonParser, (req, res) => {

  const newPaciente = {
    numeroReceita: req.query.numeroReceita
  }



  async function autenticar() {
    try {
      let conn = await pool.getConnection();
      const selecionar = "SELECT cartaoUtente FROM paciente WHERE cartaoUtente = " + newPaciente.numeroUtente + ";";
      let rows = await conn.query(selecionar);
      console.log("Select Executado.");
      if (rows[0] != null) {
        console.log("Conta autenticada.");
        res.json({ 'status': '200', numeroUtente: rows[0].numeroDeUtente });
      } else {
        console.log("ERRO X");
        res.status(400).send();
      }
    } catch (err) {
      console.log("ERRO Y");
      res.status(400).send();
    }
  }

  autenticar();

});
//
//
// Das-me id e Recebes v
// Select -> medicamento: nome, dosagem, forma; receita: quantidade e psologia
// Select -> renova e validade


//------------------------------------------------------------->   FIM DE FARMACEUTICOS
//
//
//-------------------------
//
//
//-------------------------
//
//
//Mantem o rest a funcionar através da porta 3000 usando express
app.listen(PORTA);
console.log("Server Ligado");
//
//
//
//