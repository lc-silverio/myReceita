-- --------------------------------------------------------
-- Anfitrião:                    127.0.0.1
-- Versão do servidor:           10.6.2-MariaDB - mariadb.org binary distribution
-- SO do servidor:               Win64
-- HeidiSQL Versão:              11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- A despejar estrutura da base de dados para myreceita
CREATE DATABASE IF NOT EXISTS `myreceita` /*!40100 DEFAULT CHARACTER SET utf8mb3 */;
USE `myreceita`;

-- A despejar estrutura para tabela myreceita.funcionario
CREATE TABLE IF NOT EXISTS `funcionario` (
  `idFuncionario` int(11) NOT NULL,
  `nome` varchar(50) NOT NULL,
  `pass` varchar(50) NOT NULL,
  `nif` int(9) NOT NULL,
  `email` varchar(50) NOT NULL,
  `estabelecimento` varchar(50) NOT NULL,
  `funcao` varchar(1) NOT NULL,
  `cedulaProfissional` int(11) NOT NULL,
  `telefone` int(9) NOT NULL,
  PRIMARY KEY (`idFuncionario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- A despejar dados para tabela myreceita.funcionario: ~4 rows (aproximadamente)
/*!40000 ALTER TABLE `funcionario` DISABLE KEYS */;
REPLACE INTO `funcionario` (`idFuncionario`, `nome`, `pass`, `nif`, `email`, `estabelecimento`, `funcao`, `cedulaProfissional`, `telefone`) VALUES
	(1, 'medico1', 'medico1', 123456788, 'medico1@myreceita.pt', 'hospitalA', 'M', 1234567, 949999999),
	(2, 'medico2', 'medico2', 123456777, 'medico2@myreceita.pt', 'hospital B', 'M', 2345678, 659999999),
	(3, 'farmaceutico1', 'farmaceutico1', 123456666, 'farmaceutico1@myreceita.pt', 'farmacia A', 'F', 3456789, 969999999),
	(4, 'farmaceutico2', 'farmaceutico2', 123455555, 'farmaceutico2@myreceita.pt', 'farmacia B', 'F', 4567891, 979999999);
/*!40000 ALTER TABLE `funcionario` ENABLE KEYS */;

-- A despejar estrutura para tabela myreceita.levantamentos
CREATE TABLE IF NOT EXISTS `levantamentos` (
  `idLevantamentos` int(11) NOT NULL AUTO_INCREMENT,
  `idFarmaceutico` int(11) NOT NULL,
  `idReceita` int(11) DEFAULT NULL,
  `horaLevantamento` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`idLevantamentos`),
  KEY `FK_levantamentos_funcionario` (`idFarmaceutico`),
  CONSTRAINT `FK_levantamentos_funcionario` FOREIGN KEY (`idFarmaceutico`) REFERENCES `funcionario` (`idFuncionario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- A despejar dados para tabela myreceita.levantamentos: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `levantamentos` DISABLE KEYS */;
/*!40000 ALTER TABLE `levantamentos` ENABLE KEYS */;

-- A despejar estrutura para tabela myreceita.medicamento
CREATE TABLE IF NOT EXISTS `medicamento` (
  `idMedicamento` int(11) NOT NULL,
  `nome` varchar(50) NOT NULL,
  `precoMaximo` int(11) NOT NULL,
  `formaFarmaceutica` varchar(50) NOT NULL,
  `dosagem` int(50) NOT NULL,
  `embalagem` int(11) NOT NULL,
  PRIMARY KEY (`idMedicamento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- A despejar dados para tabela myreceita.medicamento: ~5 rows (aproximadamente)
/*!40000 ALTER TABLE `medicamento` DISABLE KEYS */;
REPLACE INTO `medicamento` (`idMedicamento`, `nome`, `precoMaximo`, `formaFarmaceutica`, `dosagem`, `embalagem`) VALUES
	(1, 'Medicamento A', 3, 'Comprimido', 1000, 30),
	(2, 'Medicamento B', 5, 'Comprimido', 300, 25),
	(3, 'Medicamento C', 7, 'Xarope', 1000, 1),
	(4, 'Medicamento D', 2, 'Comprimido', 150, 20),
	(5, 'Medicamento E', 4, 'Comprimido', 500, 30);
/*!40000 ALTER TABLE `medicamento` ENABLE KEYS */;

-- A despejar estrutura para tabela myreceita.paciente
CREATE TABLE IF NOT EXISTS `paciente` (
  `cartaoUtente` int(11) NOT NULL,
  `nome` varchar(50) NOT NULL,
  `pass` varchar(50) NOT NULL,
  `nif` int(9) NOT NULL,
  `email` varchar(50) NOT NULL,
  `telefone` int(11) NOT NULL,
  PRIMARY KEY (`cartaoUtente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- A despejar dados para tabela myreceita.paciente: ~4 rows (aproximadamente)
/*!40000 ALTER TABLE `paciente` DISABLE KEYS */;
REPLACE INTO `paciente` (`cartaoUtente`, `nome`, `pass`, `nif`, `email`, `telefone`) VALUES
	(1, 'admin', 'adnin', 123456789, 'admin@myreceita.pt', 919999999),
	(2, 'Luis', 'teste1', 987654321, 'teste1@myreceita.pt', 929999999),
	(3, 'Joao', 'teste2', 987654321, 'teste2@myreceita.pt', 939999999),
	(12345, 'Ines', 'admin', 123, 'nada', 123123);
/*!40000 ALTER TABLE `paciente` ENABLE KEYS */;

-- A despejar estrutura para tabela myreceita.receita
CREATE TABLE IF NOT EXISTS `receita` (
  `idReceita` int(11) NOT NULL AUTO_INCREMENT,
  `nReceita` bigint(20) NOT NULL,
  `cartaoUtente` int(11) NOT NULL,
  `idFuncionario` int(11) NOT NULL,
  `idMedicamento` int(11) NOT NULL,
  `posologia` varchar(50) NOT NULL,
  `dataEmissao` bigint(9) NOT NULL,
  `duracaoMedicamento` bigint(20) NOT NULL,
  `validadeReceita` bigint(20) DEFAULT NULL,
  `ultimoLevantamento` bigint(20) DEFAULT NULL,
  `primeiroLevantamento` char(1) DEFAULT NULL,
  `renova` char(1) NOT NULL,
  `quantidade` int(11) NOT NULL,
  PRIMARY KEY (`idReceita`),
  KEY `cartaoUtente` (`cartaoUtente`),
  KEY `idFuncionario` (`idFuncionario`),
  KEY `idMedicamento` (`idMedicamento`),
  CONSTRAINT `cartaoUtente` FOREIGN KEY (`cartaoUtente`) REFERENCES `paciente` (`cartaoUtente`),
  CONSTRAINT `idFuncionario` FOREIGN KEY (`idFuncionario`) REFERENCES `funcionario` (`idFuncionario`),
  CONSTRAINT `idMedicamento` FOREIGN KEY (`idMedicamento`) REFERENCES `medicamento` (`idMedicamento`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3;

-- A despejar dados para tabela myreceita.receita: ~10 rows (aproximadamente)
/*!40000 ALTER TABLE `receita` DISABLE KEYS */;
REPLACE INTO `receita` (`idReceita`, `nReceita`, `cartaoUtente`, `idFuncionario`, `idMedicamento`, `posologia`, `dataEmissao`, `duracaoMedicamento`, `validadeReceita`, `ultimoLevantamento`, `primeiroLevantamento`, `renova`, `quantidade`) VALUES
	(1, 1, 1, 1, 1, '1x dia ao jantar', 1625867613, 2592000, 1628459613, 0, 't', 't', 1),
	(2, 2, 2, 1, 2, '1x dia ao almoço', 1625867613, 2592000, 1628459613, 0, 'f', 't', 1),
	(3, 3, 3, 1, 3, '1x dia ao lanche', 1625867613, 2592000, 1628459613, 0, 't', 'f', 1),
	(4, 4, 12345, 1, 4, '1x dia ao peq almoço', 1625867613, 2592000, 1628459613, 0, 'f', 'f', 1),
	(5, 5, 12345, 1, 5, '1x dia à ceia', 1625867613, 3600, 1625867613, 0, 'f', 'f', 1),
	(6, 6, 12345, 1, 1, '1x dia ao lanche da manhã', 1625867613, 2592000, 2625867613, 0, 't', 'f', 1),
	(7, 7, 12345, 1, 2, '2x ao almoço', 1626008421, 2592000, 2625867613, 1626214880, 't', 'f', 2),
	(8, 7, 12345, 1, 1, '1x ao almoço', 1626008421, 2592000, 2625867613, 1626214880, 'f', 'f', 1),
	(9, 8, 1, 1, 1, '1x ao almoço', 1626386496, 2592000, 1628978496, 0, 'f', 'f', 1),
	(10, 9, 1, 1, 1, '1x por semana', 1626390474, 2592000, 1628982474, 0, 'f', 'f', 1);
/*!40000 ALTER TABLE `receita` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
