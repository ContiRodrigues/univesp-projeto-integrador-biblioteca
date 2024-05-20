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

// Rota Cadastro
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
  let obs = req.body.obs;

  let sql = `INSERT INTO prateleiras (data, codprat, observacao) VALUES ('${data}', '${codprat}', '${obs}' )`;

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

// Rota Alterar ou Remover Cadastros
app.get('/alterar', function(req, res) {
  res.render('alterar', { title: 'Alterar/Remover' });
});

// Rota Alterar/Remover Prateleira
app.get('/alterar-prateleira', function(req, res) {
  res.render('alterar-prat', { title: 'Alterar Prateleira' });
});

app.post('/alterar-prat', function(req, res) {
  let codprat = req.body.codprat;
  let sql = `SELECT codprat, observacao FROM prateleiras WHERE codprat LIKE ?`;

  conexao.query(sql, ['%' + codprat + '%'], function(erro, retorno) {
    res.render('alterar-prat', { title: 'Busca Alterar', 'prateleiras':retorno });
  });
});

// Rota Alterar/Remover Admnistrador
app.get('/alterar-adm', function(req, res) {
  res.render('alterar-adm', { title: 'Alterar Admnistrador' });
});

// Rota Alterar/Remover Leitor
app.get('/alterar-leitor', function(req, res) {
  res.render('alterar-leitor', { title: 'Alterar Leitor' });
});

// Rota Alterar/Remover Livro
app.get('/alterar-exemplar', function(req, res) {
  res.render('alterar-exemplar', { title: 'Alterar Livro' });
});

// Rota Alterar/Remover Empréstimo
app.get('/alterar-emprestimo', function(req, res) {
  res.render('alterar-emprestimo', { title: 'Alterar Empréstimo' });
});

// Rota Alterar/Remover Deevolução
app.get('/alterar-devolucao', function(req, res) {
  res.render('alterar-devolucao', { title: 'Alterar Devolução' });
});

// Teste de conexão
conexao.connect(function(erro) {
  if(erro) throw erro;
  console.log('Conexão efetuada com sucesso!!!');
});

// Servidor
app.listen(8081);