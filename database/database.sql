create table paciente(
    cartaoUtente number(9,0) not null,
    nome varchar2(50) not null,
    password varchar2(50) not null,
    nif number(9,0) not null,
    email varchar2(100) not null,
    telefone number(9,0) not null,

    primary key (cartaoUtente)
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


create table funcionario(
    idFuncionario number(9,0) not null,
    nome varchar2(50) not null,
    password varchar2(50) not null,
    nif number(9,0) not null,
    cedulaProfissional number(9,0) not null,
    telefone number(9,0) not null,
    email varchar2(50) not null,
    estabelecimento varchar2(50) not null,
    funcao char not null,

    primary key (idFuncionario)
);


create table receita(
    idReceita number(19,0) not null,
    cartaoUtente number(9,0) not null,
    idFuncionario number(9,0) not null,
    idMedicamento number(9,0) not null,

    posologia varchar2(200) not null,
    validadeReceita date not null,
    dataEmissao date not null,
    renova char,
    quantidade number(6,0) not null,
    estado char,

    primary key (idReceita),
    foreign key (idFuncionario) references funcionario(idFuncionario),
    foreign key (idMedicamento) references medicamento(idMedicamento),
    foreign key (cartaoUtente) references paciente(cartaoUtente)
);