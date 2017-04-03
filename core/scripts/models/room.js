
import { Model } from './model.js';
import { Cookies } from '../utilities/cookies.js';


export class Room extends Model {

	constructor() {
		super()
		this.endpoint = '/rooms'
		this.parent_endpoint = 'hotels'
	}
}


