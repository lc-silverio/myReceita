create table paciente(
    cartaoUtente number(9,0) not null,
    nome varchar2(50) not null,
    password varchar2(16) not null,
    nif number(9,0) not null,
    email varchar2(100) not null,

    primary key (cartaoUtente)
);

create table funcao(
    idFuncao number(2,0) not null,
    funcao varchar2(30) not null,

    primary key (idFuncao)
);

create table categoria(
    idCategoria number(2,0) not null,
    categoria varchar2(30) not null,

    primary key (idCategoria)
);

create table estado(
    idEstado number(2,0) not null,
    estado varchar2(30) not null,

    primary key (idEstado)
);

create table medicamento(
    idMedicamento number(9,0) not null,
    nome varchar2(50) not null,
    precoMaximo number(5,3) not null,
    formaFarmaceutica varchar2(50) not null,
    dosagem varchar2(50) not null,
    embalagem varchar2(50) not null,
    primary key (idMedicamento)
);

create table estabelecimento(
    idEstabelecimento number(9,0) not null,
    nome varchar2(50) not null,
    telefone number(9,0) not null,
    email varchar2(100) not null,
    idCategoria number(2,0) not null,

    primary key (idEstabelecimento),
    foreign key (idCategoria) references categoria(idCategoria)
);

create table funcionario(
    idFuncionario number(9,0) not null,
    nome varchar2(50) not null,
    password varchar2(16) not null,
    nif number(9,0) not null,
    cedulaProfissional number(9,0) not null,
    telefone number(9,0) not null,
    email varchar2(100) not null,
    idEstabelecimento number(9,0) not null,
    idFuncao number(2,0) not null,

    primary key (idFuncionario),
    foreign key (idEstabelecimento) references estabelecimento(idEstabelecimento),
    foreign key (idFuncao) references funcao(idFuncao)
);


create table receita(
    idReceita number(10,0) not null,
    cartaoUtente number(9,0) not null,
    idFuncionario number(9,0) not null,
    idEstabelecimento number(9,0) not null,
    idMedicamento number(9,0) not null,
    idEstado number(2,0) not null,
    posologia varchar2(200) not null,
    validadeReceita date not null,
    dataEmissao date not null,
    renova varchar2(3) not null,
    quantidade number(6,0) not null,
    codAcesso number (9,0) not null,
    codOpcao number (9,0) not null,

    primary key (idReceita),
    foreign key (idFuncionario) references funcionario(idFuncionario),
    foreign key (idEstabelecimento) references estabelecimento(idEstabelecimento),
    foreign key (idMedicamento) references medicamento(idMedicamento),
    foreign key (idEstado) references estado(idEstado)
);