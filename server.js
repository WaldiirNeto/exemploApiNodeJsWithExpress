// Nas três primeiras linhas estamos incluindo as dependências que já foram baixadas para o nosso projeto.

var express = require('express'); // Express é um framework Node.JS que fornece vários recursos para o desenvolvimento de aplicações web com o Node.JS
var bodyParser = require('body-parser'); // Body Parser é um Middleware para trabalharmos facilmente com o corpo das requisições
var fs = require('fs'); //File System é um módulo para trabalharmos com arquivos. Com ele é possível criar, ler, atualizar, renomear e deletar arquivos em nosso computador.

//Em seguida iniciamos o Express e o atribuímos à variável app e configuramos o middleware Body Parser para ser utilizado com o Express, para ele poder tratar o corpo JSON das requisições que serão realizadas ao servidor.
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Depois temos uma função para setar o cabeçalho HTTP padrão para as respostas que o nosso servidor retornará.
app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
});

app.listen(9090, function() { console.log('Servidor Web rodando na porta 9090') });


app.get('/api', function(req, res) {
    fs.readFile('usuarios.json', 'utf8', function(err, data) {
        if (err) {
            var response = { status: 'falha', resultado: err };
            res.json(response);
        } else {
            var obj = JSON.parse(data);
            var result = 'Nenhum usuário foi encontrado';

            obj.usuarios.forEach(function(usuario) {
                if (usuario != null) {
                    if (usuario.usuario_id == req.query.usuario_id) {
                        result = usuario;
                    }
                }
            });

            var response = { status: 'sucesso', resultado: result };
            res.json(response);
        }
    });
});
/*
No código acima estamos utilizando a função get do Express para criarmos uma rota
 e disponibilizar através da URL: http://localhost:9090/api
 o acesso via GET à nossa função de buscar usuário.

Depois utilizamos o módulo File System para abrir o arquivo usuarios.json
 e procurar nele os dados do usuário através do ID que foi informado na requisição GET.
 Depois da busca retornamos o resultado com os dados do usuário ou informando que o usuário não foi encontrado.
*/

app.post('/api', function(req, res) {
    fs.readFile('usuarios.json', 'utf8', function(err, data) {
        if (err) {
            var response = { status: 'falha', resultado: err };
            res.json(response);
        } else {
            var obj = JSON.parse(data);
            req.body.usuario_id = obj.usuarios.length + 1;

            obj.usuarios.push(req.body);

            fs.writeFile('usuarios.json', JSON.stringify(obj), function(err) {
                if (err) {
                    var response = { status: 'falha', resultado: err };
                    res.json(response);
                } else {
                    var response = { status: 'sucesso', resultado: 'Registro incluso com sucesso' };
                    res.json(response);
                }
            });
        }
    });
});

/* No código acima estamos utilizando a função post do Express para criarmos uma rota
 e disponibilizar através da URL: http://localhost:9090/api
 o acesso via POST à nossa função de criar usuário. */

app.put('/api', function(req, res) {
    fs.readFile('usuarios.json', 'utf8', function(err, data) {
        if (err) {
            var response = { status: 'falha', resultado: err };
            res.json(response);
        } else {
            var obj = JSON.parse(data);

            obj.usuarios[(req.body.usuario_id - 1)].nome = req.body.nome;
            obj.usuarios[(req.body.usuario_id - 1)].site = req.body.site;

            fs.writeFile('usuarios.json', JSON.stringify(obj), function(err) {
                if (err) {
                    var response = { status: 'falha', resultado: err };
                    res.json(response);
                } else {
                    var response = { status: 'sucesso', resultado: 'Registro editado com sucesso' };
                    res.json(response);
                }
            });
        }
    });
});
/*
No código acima estamos utilizando a função put do Express para criarmos uma rota
e disponibilizar através da URL http://localhost:9090/api
o acesso via PUT à nossa função de editar usuário. */

app.delete('/api', function(req, res) {
    fs.readFile('usuarios.json', 'utf8', function(err, data) {
        if (err) {
            var response = { status: 'falha', resultado: err };
            res.json(response);
        } else {
            var obj = JSON.parse(data);

            delete obj.usuarios[(req.body.usuario_id - 1)];

            fs.writeFile('usuarios.json', JSON.stringify(obj), function(err) {
                if (err) {
                    var response = { status: 'falha', resultado: err };
                    res.json(response);
                } else {
                    var response = { status: 'sucesso', resultado: 'Registro excluído com sucesso' };
                    res.json(response);
                }
            });
        }
    });
});
/*
No código acima estamos utilizando a função delete do Express para criarmos uma rota
 e disponibilizar através da URL: http://localhost:9090/api
  o acesso via DELETE à nossa função de deletar usuário.
*/