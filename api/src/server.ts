import express, { request, response } from 'express';

const app = express();

app.listen(3333, ()=> console.log("Server is Running"!));

/**
 * GET => Buscas
 * POST => Salvar
 * PUT => Alterar 
 * DELETE => Deletar
 * PATCH => Alteração especifica
 */



 //Aqui vai ser o caminho do Site mais o / ali em abaixo , assim que nego tentar fizer uma requisição para esse caminho eu vou devolver o que ta meio da função.
//Método get
app.get("/", (request, response) => {
    //Retorno normal com texto normal de resposta
    // return response.send("Hello World - NLW");

    //Retorno como Json
    return response.json({message:"Hello World - NLW"});
});

app.post("/",(request, response) =>{
    return response.json({message:"Os dados foram salvos com sucesso."});
});