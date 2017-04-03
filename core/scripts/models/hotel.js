
import { Model } from './model.js';
import { Cookies } from '../utilities/cookies.js';


export class Hotel extends Model {

	constructor() {
		super()
		this.endpoint = 'hotels'
	}
}


