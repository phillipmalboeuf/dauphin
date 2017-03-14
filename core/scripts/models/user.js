
import { Model } from './model.js';
import { Cookies } from '../utilities/cookies.js';


export class User extends Model {

	constructor() {
		super()
		this.endpoint = '/users'

		this.id = Cookies.get('User-Id')
	}
}