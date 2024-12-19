import Joi = require('joi');
import { SchemaError } from '../common/SchemaError';

export class RequestValidator {
    static validate<T>(schema: Joi.ObjectSchema, data: T): void {
        const { error } = schema.validate(data, { abortEarly: false });

        if (error) {
            const errorMessage = error.details.map(detail => detail.message).join(', ');
            throw new SchemaError(`Validation failed: ${errorMessage}`);
        }
    }
}