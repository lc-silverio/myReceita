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
INSERT INTO `funcionario` (`idFuncionario`, `nome`, `pass`, `nif`, `email`, `estabelecimento`, `funcao`, `cedulaProfissional`, `telefone`) VALUES
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
INSERT INTO `medicamento` (`idMedicamento`, `nome`, `precoMaximo`, `formaFarmaceutica`, `dosagem`, `embalagem`) VALUES
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
INSERT INTO `paciente` (`cartaoUtente`, `nome`, `pass`, `nif`, `email`, `telefone`) VALUES
	(1, 'admin', 'adnin', 123456789, 'admin@myreceita.pt', 919999999),
	(2, 'teste1', 'teste1', 987654321, 'teste1@myreceita.pt', 929999999),
	(3, 'teste2', 'teste2', 987654321, 'teste2@myreceita.pt', 939999999),
	(12345, 'ines', 'admin', 123, 'nada', 123123);
/*!40000 ALTER TABLE `paciente` ENABLE KEYS */;

-- A despejar estrutura para tabela myreceita.receita
CREATE TABLE IF NOT EXISTS `receita` (
  `idReceita` int(11) NOT NULL AUTO_INCREMENT,
  `nReceita` bigint(20) NOT NULL,
  `cartaoUtente` int(11) NOT NULL,
  `idFuncionario` int(11) NOT NULL,
  `idMedicamento` int(11) NOT NULL,
  `posologia` varchar(50) NOT NULL,
  `nif` int(11) NOT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;

-- A despejar dados para tabela myreceita.receita: ~4 rows (aproximadamente)
/*!40000 ALTER TABLE `receita` DISABLE KEYS */;
INSERT INTO `receita` (`idReceita`, `nReceita`, `cartaoUtente`, `idFuncionario`, `idMedicamento`, `posologia`, `nif`, `dataEmissao`, `duracaoMedicamento`, `validadeReceita`, `ultimoLevantamento`, `primeiroLevantamento`, `renova`, `quantidade`) VALUES
	(1, 1, 1, 1, 1, '1x dia durante 1 mês', 123456789, 1612871962, 2666000, 0, 0, 'f', 't', 2),
	(2, 3, 1, 1, 2, '1x dia durante 1 mês', 123456789, 1623871962, 2666000, 0, 0, 'f', 't', 2),
	(3, 2, 2, 1, 3, '2x dia durante 6 dias', 123456789, 1624871962, 516000, 1621872480, 0, 't', 'f', 1),
	(4, 1, 1, 1, 3, '1x dia durante 1 mês', 123456789, 1620871962, 2666000, 0, 1623871962, 't', 't', 2);
/*!40000 ALTER TABLE `receita` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
