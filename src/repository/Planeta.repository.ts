import axios from 'axios';
import { RepositoryAbstract } from '../interfaces/Repository.interface';

export class PlanetaRepository extends RepositoryAbstract {
    async get(id: number) {
        try {
            const response = await axios.get(`https://www.swapi.tech/api/planets/${id}`);
            const planeta = response.data;
            
            if (planeta.message !== 'ok') {
                throw new Error('Response Planeta Error');
            }
            
            return planeta.result;
        } catch (error: any) {
            console.error('Error fetching planet:', error.message || error);
            throw new Error('Failed to fetch planet data');
        }
    }
}