import { Request, Response } from "express";
import { resolve } from "path";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import SendMailService from "../services/SendMailService";
import { AppError } from "../errors/AppError";

class SendMailController {

    async execute(request: Request, response: Response) {
        const { email, survey_id } = request.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const user = await usersRepository.findOne({email})

        if(!user) {
            throw new AppError("User does not exists");
        }
        const survey = surveysRepository.findOne({id: survey_id})

        if(!survey) {
            throw new AppError("Survey does not exists");
        }

        const surveyUserAlredyExists = await surveysUsersRepository.findOne({
            where:{user_id : user.id,value : null},
            relations:["user", "surveys"],
        })

        

        const npsPath = resolve(__dirname,"..","views","emails","npsMail.hbs") 

        const variables = {
            name:user.name,
            title: (await survey).title,
            description:(await survey).description,
            id:"",
            link:process.env.URL_MAIL,
        }

        if(surveyUserAlredyExists){
            variables.id = surveyUserAlredyExists.id;
            await SendMailService.execute(email, (await survey).title, variables, npsPath);
            return response.json(surveyUserAlredyExists);
        }

        
        //Salvar as informações na tabela SurveyUser
        const surveyUser = surveysUsersRepository.create({
            user_id: user.id,
            survey_id
        })
        await surveysUsersRepository.save(surveyUser);

        //Enviar email pro usuario
        variables.id = surveyUser.id;      


        await SendMailService.execute(email, (await survey).title, variables, npsPath);
        return response.json(surveyUser)
    } 
}


export { SendMailController };
