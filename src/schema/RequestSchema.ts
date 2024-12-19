import Joi = require('joi');


export const personaSchema = Joi.object({
    nombre: Joi.string().required(),
    genero: Joi.string().valid('masculino', 'femenino', 'otro').required(),
    fechaNacimiento: Joi.string().required(),
    planeta: Joi.object({
        nombre: Joi.string().required(),
        gravedad: Joi.string().required(),
        periodoRotacion: Joi.number().integer().positive().required(),
        periodoTraslacion: Joi.number().integer().positive().required()
    }).required()
});