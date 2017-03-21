
import { Model } from './model.js';
import { Cookies } from '../utilities/cookies.js';


export class Piece extends Model {

	constructor() {
		super()
		this.endpoint = '/pieces'
	}
}


