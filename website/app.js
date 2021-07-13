const express = require("express"); //Serve a pagina web
const mariadb = require('mariadb'); //Serve a Base de Dados
const bodyParser = require('body-parser'); //Leitura de dados do corpo do html
var jsonParser = bodyParser.json(); //Leitura de dados do corpo do html
//
//
const app = express(); //Invoca o Express JS
const PORTA = 3000; //Porta default


//Informa o express qual é a pasta a servir quando o script do servidor for executado
app.use(express.static('../website'))
app.use(express.urlencoded());

// Leitura de JSON bodies enviados pelos clientes
app.use(express.json());

//
//
//Configuração da ligação à BD para as comunicações rest
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
          if (seconds < rows[i].validadeReceita) {
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
      console.log("verificarPaciente: Erro não definido\n");//Erro
      console.log(err)
      res.send({ mensagem: "erro" })
    }
  }

  autenticar();

});

//----------------------------------------------------------------------------------------------------------------------------------------------------->
//Lista de medicamentos (dropdown)  - OK
//Devolve nome, dosagem e forma farmaceutica de todos os medicamentos (delimitados por !!).

app.post('/medicamentos', jsonParser, (req, res) => {

  async function autenticar() {
    try {
      let conn = await pool.getConnection();// Liga à base de dados
      const selecionar = "SELECT nome, dosagem, formaFarmaceutica FROM medicamento;"; //Formula da query
      let rows = await conn.query(selecionar); // Executa a query

      console.log("Medicamentos-dropdown: Listagem inicial dos medicamentos executada.\n");

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
      console.log("Medicamentos - Erro não especificado / BD timeout - Demasiadas queries\n"); //Erro
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

      //Inicio - Obter segundos desde 1970
      var d = new Date();
      var dataEmissao = Math.round(d.getTime() / 1000);

      //Se nao renovar é necessário ver a validade da receita
      var validadeReceitaArray = [];
      for (let i = 0; i < medicamentosArray.length - 1; i++) {
        if (newReceita.renova === "t") {
          validadeReceitaArray.push(0);
          console.log("Renova = t");
        } else {
          validadeReceitaArray.push(dataEmissao + (duracaoMedicamentoArray[i] * quantidadeArray[i]));
        }
      }

      //Registar uma receita na base de dados
      for (let i = 0; i < medicamentosArray.length - 1; i++) {
        const selecionar1 = "SELECT idMedicamento FROM medicamento WHERE nome = '" + medicamentosArray[i] + "';";
        const rows1 = await conn.query(selecionar1);

        let x = "INSERT INTO receita values ( NULL, " + nReceita + ", " + newReceita.numeroDeUtente + ", " + medico + ", " + rows1[0].idMedicamento + ", '" + posologiaArray[i] + "', " + dataEmissao + ", " + duracaoMedicamentoArray[i] + ", " + validadeReceitaArray[i] + ", " + 0 + ", 'f', '" + newReceita.renova + "', " + quantidadeArray[i] + ");";
        let respo = await conn.query(x);
      }
      res.send({ mensagem: "adicionado" });
    }
    catch (err) {
      console.log(err)
      res.status(400).send();
    }
  }

  registoMedicamento();

});

//----------------------------------------------------------------------------------------------------------------------------------------------------->


//                                                      ⬇️Farmácia


//----------------------------------------------------------------------------------------------------------------------------------------------------->
//Leitura de uma receita - OK

app.post('/verificarReceita', jsonParser, (req, res) => { //Recebe o id da receita e devolve o conteudo da mesma e o nome do proprietário
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
      let conn = await pool.getConnection();//Ligação à BD
      const sel = "SELECT cartaoUtente, idMedicamento FROM receita WHERE nReceita = " + newReceita.numeroReceita + ";";
      let row = await conn.query(sel); //Vai buscar à BD o cartão de utente e a lista dos medicamentos na receita

      var idMedicamentoArray = []
      var cartaoUtenteNovo = row[0].cartaoUtente

      for (let i = 0; i < row.length; i++) {
        idMedicamentoArray.push(row[i].idMedicamento)
      }
      console.log(`Receitas - Consultar receita ${newReceita.numeroReceita} \n`)


      //Vai buscar o nome do dono da receita com base no id da receita e no cartão de utente
      let nomeUtente;
      const sel3 = "SELECT nome FROM paciente WHERE cartaoUtente = " + cartaoUtenteNovo + ";";
      let row3 = await conn.query(sel3);
      nomeUtente = row3[0].nome;
      //


      //Para Enviar
      let idString = ""; // ID da receita
      let nomeString = ""; //Nome dos Medicamentos
      let precoString = ""; //Preço Máximo
      let formaFarmaceuticaString = ""; //Forma Farmaceutica
      let dosagemString = ""; //Dosagem
      let posologiaString = ""; //Posologia
      let embalagemString = ""; //Quantidade de Embalagens
      let levantamentoString = ""; //Estado de Levantamento


      for (let i = 0; i < idMedicamentoArray.length; i++) {//Vai buscar todos os dados à BD por cada linha
        const sel1 = `
          SELECT validadeReceita, 
            nReceita,  
            dataEmissao, 
            duracaoMedicamento, 
            primeiroLevantamento, 
            renova, 
            ultimoLevantamento, 
            posologia, 
            quantidade 
          FROM receita 
          WHERE nReceita = ${newReceita.numeroReceita} AND idMedicamento = ${idMedicamentoArray[i]};`;
          let row1 = await conn.query(sel1);

        
        const sel2 = `
        SELECT 
          dosagem, 
          nome, 
          formaFarmaceutica, 
          precoMaximo 
        FROM medicamento 
        WHERE idMedicamento = ${idMedicamentoArray[i]};`;
        let row2 = await conn.query(sel2);


        if (row1[0].renova === "t") {
          if (row1[0].primeiroLevantamento === "t") {
            if ((row1[0].ultimoLevantamento + row1[0].duracaoMedicamento) < (seconds - 432000)) {
              idString += row1[0].nReceita + "!!"; //ID da receita
              nomeString += row2[0].nome + "!!"; //Nome dos medicamentos
              precoString += row2[0].precoMaximo + "!!"; // Preço máximo do medicamento
              formaFarmaceuticaString += row2[0].formaFarmaceutica + "!!"; //Forma Farmaceutica
              dosagemString += row2[0].dosagem + "!!"; //Dosagem
              posologiaString += row1[0].posologia + "!!"; //Posologia
              embalagemString += row1[0].quantidade + "!!"; //Quantidade de embalagens
              levantamentoString += row1[0].primeiroLevantamento + "!!"; //Estado de levantamento
            }
          } else {
            //verificamos se dataEmissao + duracao do medicamento é superior ao dia atual - 5 dias
            if ((row1[0].dataEmissao + row1[0].duracaoMedicamento) > (seconds - 432000)) {
              idString += row1[0].nReceita + "!!"; // ID da receita
              nomeString += row2[0].nome + "!!"; //Nome dos medicamentos
              precoString += row2[0].precoMaximo + "!!"; //Preço Máximo
              formaFarmaceuticaString += row2[0].formaFarmaceutica + "!!"; //Forma Farmaceutica
              dosagemString += row2[0].dosagem + "!!"; //Dosagem
              posologiaString += row1[0].posologia + "!!"; //Posologia
              embalagemString += row1[0].quantidade + "!!"; //Quantidade de embalagens
              levantamentoString += row1[0].primeiroLevantamento + "!!"; //Estado de Levantamento
            }
          }
        } else {
          //Verifica se o dia atual é superior à validade da receita
          if (seconds < row1[0].validadeReceita) {
            //Verifica se nunca foi levantada
            if (row1[0].primeiroLevantamento == "f") {
              idString += row1[0].nReceita + "!!"; //ID da receita
              nomeString += row2[0].nome + "!!"; //Nome dos medicamentos
              precoString += row2[0].precoMaximo + "!!"; //Preço máximo
              formaFarmaceuticaString += row2[0].formaFarmaceutica + "!!"; //Forma Farmaceutica
              dosagemString += row2[0].dosagem + "!!"; //Dosagem
              posologiaString += row1[0].posologia + "!!"; //Posologia
              embalagemString += row1[0].quantidade + "!!"; //Quantidade de embalagens
              levantamentoString += row1[0].primeiroLevantamento + "!!"; //Estado de Levantamento
            }
          }
        }
      }

      res.json({
        'status': '200',
        id: idString, //ID da receita
        nomeUtente: nomeUtente,// Nome do Utente
        nomeMedicamento: nomeString, //Nome do medicamento
        dosagem: dosagemString, // Dosagem
        formaFarmaceutica: formaFarmaceuticaString, //Forma Farmaceutica - Xarope, Comprimido, etc
        quantidade: embalagemString, //Quantidadede de caixas
        posologia: posologiaString, //Guia de toma
        levantado: levantamentoString, // Estado de levantamento
      });

      pool.end;
    }
    catch (err) {//Erro
      console.log("\n" + err);
      res.send({ mensagem: "erro" })
    }
  }

  autenticar();

});

//----------------------------------------------------------------------------------------------------------------------------------------------------->
//Actualizar estado de levantamento - OK

app.post('/levantamentoUpdate', jsonParser, (req, res) => {

  const newLevantamento = {//Recebe o json com os dados do pedido
    numeroReceita: req.body.numeroReceita, //Numero da receita
    nomeMedicamento: req.body.nomeMedicamento, //Nome do medicamento
    levantamento: req.body.levantamento //Estado de levantamento
  }


  //Inicio - Obter segundos desde 1970
  var d = new Date();
  var ultimoLevantamento = Math.round(d.getTime() / 1000);
  //Fim

  var medicamentosArray = [];
  medicamentosArray = newLevantamento.nomeMedicamento.split("!!")//Separa a string recebida no json em vários elementos que são colocados no array

  const index = medicamentosArray.indexOf('');//Procura elementos vazios no array
  if (index > -1) {
    medicamentosArray.splice(index, 1);//Manda fora os elementos vazios derivados de eliminar os !! que usamos como delimitador
  }

  var levantamentosArray = [];
  levantamentosArray = newLevantamento.levantamento.split("!!");//Separa a string recebida no json em vários elementos que são colocados no array

  const index2 = levantamentosArray.indexOf('');//Procura elementos vazios no array
  if (index2 > -1) {
    levantamentosArray.splice(index, 1);//Manda fora os elementos vazios derivados de eliminar os !! que usamos como delimitador
  }


  async function autenticar() {
    try {
      let conn = await pool.getConnection(); //Liga à base de dados

      var idsMedicamentosArray = [];

      for (let i = 0; i < medicamentosArray.length; i++) {
        const query = `SELECT idMedicamento FROM medicamento WHERE nome = '${medicamentosArray[i]}';` //Vai buscar o id dos medicamentos com base no nome dos medicamentos na receita
        let check = await conn.query(query);
        //console.log(check)
        idsMedicamentosArray.push(check[0].idMedicamento) //adiciona os ids encontrados ao fim do array
      }


      for (let i = 0; i < idsMedicamentosArray.length; i++) {
        const query = `SELECT primeiroLevantamento FROM receita WHERE nReceita = '${newLevantamento.numeroReceita}' AND idMedicamento = '${idsMedicamentosArray[i]}';` //Vai buscar uma lista com o estado de levatamento de cada medicamento na receita
        let check = await conn.query(query);

        let x = ` 
            UPDATE receita 
            SET primeiroLevantamento = '${levantamentosArray[i]}', ultimoLevantamento = '${ultimoLevantamento}'
            WHERE nReceita = '${newLevantamento.numeroReceita}' AND idMedicamento = '${idsMedicamentosArray[i]}';
          `//Procura o medicamento a actualizar com base no id da receita e no id do medicamento depois actualiza o estado de cada um dos elementos da receita com base na informação recebida do backoffice.

        let respo = await conn.query(x);
        //
        console.log(`updateReceita - Receita ${newLevantamento.numeroReceita} actualizada\n`)//Server side info
      }
      res.send({ mensagem: "actualizado" });//Envia a notificação ao backoffice a informar que a actualização foi executada com sucesso

    } catch (err) {//Erro
      console.log("updateReceita: Erro não definido\n");//Server side
      console.log(err)
      res.send({ mensagem: "erro" })//Client
    }
  }

  autenticar();

});

//----------------------------------------------------------------------------------------------------------------------------------------------------->


//                                                      ⬇Fim de Funções para Farmácia


//----------------------------------------------------------------------------------------------------------------------------------------------------->


//Mantem o servidor a funcionar através da porta 3000 usando express js
app.listen(PORTA);
console.log("\nServer Ligado");
