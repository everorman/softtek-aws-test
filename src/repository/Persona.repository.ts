import axios from 'axios';
import { RepositoryAbstract } from '../interfaces/Repository.interface';

export class PersonaRepository extends RepositoryAbstract {
    async get(id: number) {
        try {
            const response = await axios.get(`https://www.swapi.tech/api/people/${id}`);
            const planeta = response.data;
            
            if (planeta.message !== 'ok') {
                throw new Error('Response Persona Error');
            }
            
            return planeta.result;
        } catch (error: any) {
            console.error('Error fetching person:', error.message || error);
            throw new Error('Failed to fetch person data');
        }
    }
}