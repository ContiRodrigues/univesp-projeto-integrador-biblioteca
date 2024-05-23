// Importar módulos
const express = require('express');
const mysql = require('mysql2');
const { engine } = require('express-handlebars');
const fileupload = require('express-fileupload');
const fs = require('fs');

// Criar o app
const app = express();

// Config Express-Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Config Bootstrap
app.use('/bootstrap', express.static('./node_modules/bootstrap/dist'));

// Config CSS e JavaScript
app.use('/css', express.static('./css'));
app.use('/scripts/js', express.static('./node_modules/bootstrap/dist/js'));

// Referenciar a pasta de imagens
app.use('/imagens', express.static('./imagens'));

// Config Upload de arquivos
app.use(fileupload());

// Config Tipo de dados via rota (JSON)
app.use(express.json());
app.use(express.urlencoded({extended:false}));

// Config Conexão BD
const conexao = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'NandoDev1955',
  database: 'bdbiblioteca'
});

// Rota Principal - Página Inicial
app.get('/', function(req, res) {
  res.render('home', { title: 'Biblioteca' });
});

// Rota Sobre nós
app.get('/sobre', function(req, res) {
  res.render('sobre', { title: 'Sobre nós' });
});

// Rota Pesquisar
app.get('/pesquisar', function(req, res) {
  res.render('pesquisar-lista', { title: 'Pesquisar' });
});

app.post('/pesquisar-lista', function(req, res) {
  let titulo = req.body.searchbar;
  let sql = `SELECT titulo, codexemplar, status, imagem FROM exemplar WHERE titulo LIKE ?`;

  conexao.query(sql, ['%' + titulo + '%'], function(erro, retorno) {
    res.render('pesquisar-lista', { title: 'Pesquisar', 'exemplar':retorno });
  });
})

// Rota Login
app.get('/login', function(req, res) {
  res.render('login', { title: 'Login' });
});

// Rota Inicial de Cadastros
app.get('/cadastro', function(req, res) {
  res.render('cadastro', { title: 'Cadastros' });
});

// Rota Cadastro Administradores
app.get('/cadastro-adm', function(req, res) {
  res.render('cadastro-adm', { title: 'Cadastro de Administrador' });
});

app.post('/cad-adm', function(req, res) {
  let data = req.body.data;
  let codfunc = req.body.codfunc;
  let nomefunc = req.body.nomefunc;
  let cargo = req.body.cargo;
  let status = req.body.status;
  let senha = req.body.senha;
  let obs = req.body.obs;

  let sql = `INSERT INTO administradores (data, codfunc, nomefunc, cargo, status, senha, observacao) VALUES ('${data}', ${codfunc}, '${nomefunc}', '${cargo}', '${status}', '${senha}', '${obs}')`;

  conexao.query(sql, function(erro, retorno) {
    if(erro) throw erro;
    console.log(retorno);
  });

  res.redirect('/cadastro-adm');
});

// Rota Cadastro Leitores
app.get('/cadastro-leitor', function(req, res) {
  res.render('cadastro-leitor', { title: 'Cadastro de Leitor' });
});

app.post('/cad-leitor', function(req, res) {
  let data = req.body.data;
  let codleitor = req.body.codleitor;
  let nomeleitor = req.body.nomeleitor;
  let serie = req.body.serie;
  let cargo = req.body.cargo;
  let status = req.body.status;
  let obs = req.body.obs;

  let sql = `INSERT INTO leitor (data, codleitor, nomeleitor, serie, cargo, status, observacao) VALUES ('${data}', ${codleitor}, '${nomeleitor}', '${serie}', '${cargo}', '${status}', '${obs}')`;

  conexao.query(sql, function(erro, retorno) {
    if(erro) throw erro;
    console.log(retorno);
  });

  res.redirect('/cadastro-leitor');
});

// Rota Cadastro Exemplar
app.get('/cadastro-exemplar', function(req, res) {
  res.render('cadastro-exemplar', { title: 'Cadastro de Exemplar' });
});

app.post('/cad-exemplar', function(req, res) {
  let data = req.body.data;
  let codexemplar = req.body.codexemplar;
  let prateleira = req.body.prateleira;
  let titulo = req.body.titulo;
  let autor1 = req.body.autor1;
  let autor2 = req.body.autor2;
  let autor3 = req.body.autor3;
  let editora = req.body.editora;
  let edicao = req.body.edicao;
  let publicacao = req.body.publicacao;
  let genero = req.body.genero;
  let isbn =  req.body.isbn;
  let status = req.body.status;
  let obs = req.body.obs;
  let imagem = req.files.imagem.name;

  let sql = `INSERT INTO exemplar (data, codexemplar, prateleira, titulo, autor1, autor2, autor3, editora, edicao, publicacao, genero, isbn, status, observacao, imagem) VALUES ('${data}', '${codexemplar}', '${prateleira}', '${titulo}', '${autor1}', '${autor2}','${autor3}','${editora}','${edicao}','${publicacao}','${genero}','${isbn}','${status}','${obs}','${imagem}' )`;

  conexao.query(sql, function(erro, retorno) {
    if(erro) throw erro;
    req.files.imagem.mv('C:/Users/User/Desktop/UNIVESP/4 Período/3. Projeto Integrador I/projeto-integrador-controle-biblioteca/imagens/'+req.files.imagem.name);
    console.log(retorno);
  });

  res.redirect('/cadastro-exemplar');
});

// Rota Cadastro Prateleiras
app.get('/cadastro-prateleira', function(req, res) {
  res.render('cadastro-prateleira', { title: 'Cadastro de Prateleira' });
});

app.post('/cad-prateleira', function(req, res) {
  let data = req.body.data;
  let codprat = req.body.codprat;
  let nomeprat = req.body.nomeprat;
  let obs = req.body.obs;

  let sql = `INSERT INTO prateleiras (data, codprat, nomeprat, observacao) VALUES ('${data}', '${codprat}', '${nomeprat}', '${obs}' )`;

  conexao.query(sql, function(erro, retorno) {
    if(erro) throw erro;
    console.log(retorno);
  });

  res.redirect('/cadastro-prateleira');
});

// Rota Cadastro Empréstimos
app.get('/cadastro-emprestimo', function(req, res) {
  res.render('cadastro-emprestimo', { title: 'Cadastro de Empréstimo' });
});

app.post('/cad-emprestimo', function(req, res) {
  let data = req.body.data;
  let codleitor = req.body.codleitor;
  let nomeleitor = req.body.nomeleitor;
  let codexemplar = req.body.codexemplar;
  let titulo = req.body.titulo;
  let devolprevdata = req.body.devolprevdata;
  let status = req.body.status;
  let obs = req.body.obs;

  let sql = `INSERT INTO emprestimos (data, codleitor, nomeleitor, codexemplar, titulo, devolprevdata, status, observacao) VALUES ('${data}', '${codleitor}', '${nomeleitor}', '${codexemplar}', '${titulo}', '${devolprevdata}', '${status}', '${obs}' )`;

  conexao.query(sql, function(erro, retorno) {
    if(erro) throw erro;
    console.log(retorno);
  });

  res.redirect('/cadastro-emprestimo');
});

// Rota Cadastro Devoluções
app.get('/cadastro-devolucao', function(req, res) {
  res.render('cadastro-devolucao', { title: 'Cadastro de Devolução' });
});

app.post('/cad-devolucao', function(req, res) {
  let data = req.body.data;
  let codleitor = req.body.codleitor;
  let nomeleitor = req.body.nomeleitor;
  let codexemplar = req.body.codexemplar;
  let titulo = req.body.titulo;
  let devolprevdata = req.body.devolprevdata;
  let status = req.body.status;
  let obs = req.body.obs;

  let sql = `INSERT INTO devolucoes (data, codleitor, nomeleitor, codexemplar, titulo, devolprevdata, status, observacao) VALUES ('${data}', '${codleitor}', '${nomeleitor}', '${codexemplar}', '${titulo}', '${devolprevdata}', '${status}', '${obs}' )`;

  conexao.query(sql, function(erro, retorno) {
    if(erro) throw erro;
    console.log(retorno);
  });

  res.redirect('/cadastro-devolucao');
});

// Rota Inicial de Alterar ou Remover Cadastros
app.get('/alterar', function(req, res) {
  res.render('alterar', { title: 'Alterar/Remover' });
});

// Rotas para Alterar/Remover Prateleira
// Rota Direciona para página inicial
app.get('/alterar-prateleira', function(req, res) {
  res.render('alterar-prat', { title: 'Alterar Prateleira' });
});

//Buscar Dados no BD
app.post('/alterar-prat', function(req, res) {
  let codprat = req.body.codprat;
  let sql = `SELECT codprat, nomeprat, observacao FROM prateleiras WHERE codprat = ?`;

  conexao.query(sql, [codprat], function(erro, retorno) {
    res.render('alterar-prat', { title: 'Busca Alterar', 'prateleiras':retorno });
  });
});

// Rota para redirecionar para o formulário alterar
app.get('/altremov-prat/:codprat', function(req, res) {
  let codprat = req.params.codprat;
  let sql = `SELECT * FROM prateleiras WHERE codprat = ?`;

  conexao.query(sql, [codprat], function(erro, retorno) {
    if(erro) throw erro;
    res.render('altremov-prat', { prateleiras:retorno[0] });
  });
});

// Rota para Editar Dados da Prateleira
app.post('/editar-prat', function(req, res) {
  let codprat = req.body.codprat;
  let nomeprat = req.body.nomeprat;
  let obs = req.body.obs;
  
  let sql = `UPDATE prateleiras SET nomeprat='${nomeprat}', observacao='${obs}' WHERE codprat= ?`;
        
  conexao.query(sql, [codprat], function(erro, retorno) {
    if(erro) throw erro;
  });
  
  res.redirect('/alterar-prateleira');
});

// Rota Alterar/Remover Administrador
// Rota Direciona para página inicial
app.get('/alterar-administrador', function(req, res) {
  res.render('alterar-adm', { title: 'Alterar Administrador' });
});

// Buscar Dados no BD
app.post('/alterar-adm', function(req, res) {
  let codfunc = req.body.codfunc;
  let sql = `SELECT codfunc, nomefunc, cargo, status, senha, observacao FROM administradores WHERE codfunc = ?`;

  conexao.query(sql, [codfunc], function(erro, retorno) {
    res.render('alterar-adm', { title: 'Busca Alterar', 'administradores':retorno });
  });
});

// Rota para redirecionar para o formulário alterar
app.get('/altremov-adm/:codfunc', function(req, res) {
  let codfunc = req.params.codfunc;
  let sql = `SELECT * FROM administradores WHERE codfunc = ?`;

  conexao.query(sql, [codfunc], function(erro, retorno) {
    if(erro) throw erro;
    res.render('altremov-adm', { administradores:retorno[0] });
  });
});

// Rota para Editar Dados do Administrador
app.post('/editar-adm', function(req, res) {
  let codfunc = req.body.codfunc;
  let nomefunc = req.body.nomefunc;
  let cargo = req.body.cargo;
  let status = req.body.status;
  let senha = req.body.senha;
  let obs = req.body.obs;
  
  let sql = `UPDATE administradores SET nomefunc='${nomefunc}', cargo='${cargo}', status='${status}', senha='${senha}', observacao='${obs}' WHERE codfunc= ?`;
        
  conexao.query(sql, [codfunc], function(erro, retorno) {
    if(erro) throw erro;
  });
  
  res.redirect('/alterar-administrador');
});

// Rota Alterar/Remover Leitor
// Rota Direciona para página inicial
app.get('/alterar-leitor', function(req, res) {
  res.render('alterar-leit', { title: 'Alterar Leitor' });
});

// Buscar Dados no BD
app.post('/alterar-leit', function(req, res) {
  let codleitor = req.body.codleitor;
  let sql = `SELECT codleitor, nomeleitor, serie, cargo, status, observacao FROM leitor WHERE codleitor = ? `;

  conexao.query(sql, [codleitor], function(erro, retorno) {
    res.render('alterar-leit', { title: 'Busca Alterar', 'leitor':retorno });
  });
});

// Rota para redirecionar para o formulário alterar
app.get('/altremov-leit/:codleitor', function(req, res) {
  let codleitor = req.params.codleitor;
  let sql = `SELECT * FROM leitor WHERE codleitor = ?`;

  conexao.query(sql, [codleitor], function(erro, retorno) {
    if(erro) throw erro;
    res.render('altremov-leit', { leitor:retorno[0] });
  });
});

// Rota para Editar Dados do Leitor
app.post('/editar-leit', function(req, res) {
  let codleitor = req.body.codleitor;
  let nomeleitor = req.body.nomeleitor;
  let serie = req.body.serie;
  let cargo = req.body.cargo;
  let status = req.body.status;
  let obs = req.body.obs;
  
  let sql = `UPDATE leitor SET nomeleitor='${nomeleitor}', serie='${serie}', cargo='${cargo}', status='${status}', observacao='${obs}' WHERE codleitor= ?`;
        
  conexao.query(sql, [codleitor], function(erro, retorno) {
    if(erro) throw erro;
  });
  
  res.redirect('/alterar-leitor');
});

// Rota Alterar/Remover Livro
// Rota Direciona para página inicial
app.get('/alterar-exemplar', function(req, res) {
  res.render('alterar-exem', { title: 'Alterar Livro' });
});

// Buscar Dados no BD
app.post('/alterar-exem', function(req, res) {
  let codexemplar = req.body.codexemplar;
  let sql = `SELECT codexemplar, prateleira, titulo, autor1, autor2, autor3, editora, edicao, publicacao, genero, isbn, status, observacao, imagem FROM exemplar WHERE codexemplar = ?`;

  conexao.query(sql, [codexemplar], function(erro, retorno) {
    res.render('alterar-exem', { title: 'Busca Alterar', 'exemplar':retorno });
  });
});

// Rota para redirecionar para o formulário alterar
app.get('/altremov-exem/:codexemplar', function(req, res) {
  let codexemplar = req.params.codexemplar;
  let sql = `SELECT * FROM exemplar WHERE codexemplar = ?`;

  conexao.query(sql, [codexemplar], function(erro, retorno) {
    if(erro) throw erro;
    res.render('altremov-exem', { exemplar:retorno[0] });
  });
});

// Rota para Editar Dados do Exemplar
app.post('/editar-exem', function(req, res) {
  let codexemplar = req.body.codexemplar;
  let prateleira = req.body.prateleira;
  let titulo = req.body.titulo;
  let autor1 = req.body.autor1;
  let autor2 = req.body.autor2;
  let autor3 = req.body.autor3;
  let editora = req.body.editora;
  let edicao = req.body.edicao;
  let publicacao = req.body.publicacao;
  let genero = req.body.genero;
  let isbn = req.body.isbn;
  let status = req.body.status;
  let obs = req.body.obs;
  let imagem = req.body.imagem;
  
  let sql = `UPDATE exemplar SET prateleira='${prateleira}', titulo='${titulo}', autor1='${autor1}', autor2='${autor2}', autor3='${autor3}', editora='${editora}', edicao='${edicao}', publicacao='${publicacao}', genero='${genero}', isbn='${isbn}', status='${status}', observacao='${obs}', imagem='${imagem}' WHERE codexemplar= ?`;
        
  conexao.query(sql, [codexemplar], function(erro, retorno) {
    if(erro) throw erro;
  });
  
  res.redirect('/alterar-exemplar');
});




// Rota Alterar/Remover Empréstimo
app.get('/alterar-emprestimo', function(req, res) {
  res.render('alterar-empr', { title: 'Alterar Empréstimo' });
});
  // Buscar Dados no BD
app.post('/alterar-empr', function(req, res) {
  let codleitor = req.body.codleitor;
  let sql = `SELECT data, codleitor, nomeleitor, codexemplar, titulo, devolprevdata, status, observacao, DATE_FORMAT(data, '%d/%m/%Y') AS data, DATE_FORMAT(devolprevdata, '%d/%m/%Y') AS devolprevdata FROM emprestimos WHERE codleitor = ?`;

  conexao.query(sql, [codleitor], function(erro, retorno) {
    res.render('alterar-empr', { title: 'Busca Alterar', 'emprestimos':retorno });
  });
});

// Rota Alterar/Remover Devolução
app.get('/alterar-devolucao', function(req, res) {
  res.render('alterar-devo', { title: 'Alterar Devolução' });
});
  // Buscar Dados no BD
app.post('/alterar-devo', function(req, res) {
  let codleitor = req.body.codleitor;
  let sql = `SELECT data, codleitor, nomeleitor, codexemplar, titulo, devolprevdata, status, observacao, DATE_FORMAT(data, '%d/%m/%Y') AS data, DATE_FORMAT(devolprevdata, '%d/%m/%Y') AS devolprevdata FROM devolucoes WHERE codleitor = ?`;

  conexao.query(sql, [codleitor], function(erro, retorno) {
    res.render('alterar-devo', { title: 'Busca Alterar', 'devolucoes':retorno });
  });
});


// Teste de conexão
conexao.connect(function(erro) {
  if(erro) throw erro;
  console.log('Conexão efetuada com sucesso!!!');
});

// Servidor
app.listen(8081);