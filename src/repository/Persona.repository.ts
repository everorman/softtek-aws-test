import axios from 'axios';
import { RepositoryAbstract } from '../interfaces/Repository.interface';
import { DynamoAbstract } from '../interfaces/Dynamo.interface';
import { CACHE_PERSONA_TABLE_NAME } from '../common/constants';

export class PersonaRepository extends RepositoryAbstract {
    private dynamoRepository: DynamoAbstract;
    constructor(dynamoRepository: DynamoAbstract) {
        super();
        this.dynamoRepository = dynamoRepository;
    }
    async get(id: number) {
        try {
            const cachedPersona = await this.dynamoRepository.getCache(CACHE_PERSONA_TABLE_NAME, id);
            console.log('cachedPersona', cachedPersona)
            if (cachedPersona && !this.isExpired(cachedPersona.lastUpdated)) {
                console.log('Returning cached data');
                return cachedPersona.data;
            }
            const response = await axios.get(`https://www.swapi.tech/api/people/${id}`);
            const persona = response.data;
            
            if (persona.message !== 'ok') {
                throw new Error('Response Persona Error');
            }
            await this.dynamoRepository.saveToCache(CACHE_PERSONA_TABLE_NAME, id, persona.result);
            return persona.result;
        } catch (error: any) {
            console.error('Error fetching person:', error.message || error);
            throw new Error('Failed to fetch person data');
        }
    }

    private isExpired(timestamp: number): boolean {
        const THIRTY_MINUTES = 30 * 60 * 1000;
        return Date.now() - timestamp > THIRTY_MINUTES;
    }
}