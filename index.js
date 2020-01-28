const express = require('express');

//iniciando o express na constante server
const server = express();

//setando no express que será usado Json como estrutura de dados
server.use(express.json());

//constante que deterá os projetos cadastrados, neste caso será uma lista de projetos
const projects = [];

//midlewares

//verifica se existe um projeto antes de prosseguir para edição, deleção ou adição de uma task
function ckeckProjectsExists(req, res, next){
    const {id} = req.params;
    const project = projects.find(projec => projec.id == id);

    if(!project){
        return res.status(400).json({"error": "Project Not exists"});
    }
    return next();
}

//conta quantas requisições foram feitas
server.use((req, res, next) => {
    console.count("Requisições");
    return next();
});

//rota que executa o cadastro de um projeto
server.post('/projects', (req, res) =>{
    //resgtando os dados que vieram no corpo da requisição
    const {id, title} = req.body;
    //setando os valores em um objeto 'project', neste caso com as tasks vazias
    projetct = {
        id,
        title,
        tasks : [],
    };
    //adicionando este objeto à lista de projetos
    projects.push(projetct);
    //retorna sucesso com o projeto cadastrado
    return res.json(projetct);
});

//rota que traz todos os projetos cadastrados
server.get('/projects', (req, res) => {
    return res.json(projects);
});

/*rota que executa a edição de um projeto já cadastrado
  passando como parâmetro o chechProjectExists para verificar se o projeto
  existe antes de fazer a edição 
*/  
server.put('/projects/:id', ckeckProjectsExists, (req, res) => {
    const {id} = req.params;
    const {title} = req.body;
    //buscando o projeto no array
    const project = projects.find(projec => projec.id == id);
    //setando o novo titulo que veio no corpo da requisição
    project.title = title;

    return res.json(project);
});

// rota que fará a deleção de um projeto, assim como o editar, busca se o projeto existe primeiro
server.delete('/projects/:id', ckeckProjectsExists, (req, res) => {
    const {id} = req.params;
    //buscando o index do projeto no array
    const project = projects.findIndex(projec => projec.id == id);
    //removendo este index do array de projetos
    projects.splice(project, 1);

    return res.json(projects);
});

/* 
    rota que cadastra uma nova task em um projeto específico
    também verifica se o projeto existe antes de tentar cadastrar
*/
server.post('/projects/:id/tasks', ckeckProjectsExists, (req, res) => {
    const {id} = req.params;
    const {title} = req.body;
    //buscando o projeto em questão
    const project = projects.find(projec => projec.id == id);
    //adicionando uma nova tasks ao array de tasks
    project.tasks.push(title);

    return res.json(project);
});

//configuração de qual porta o projeto estará rodando
server.listen(3333);