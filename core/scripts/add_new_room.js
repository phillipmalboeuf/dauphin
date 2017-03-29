
import { Room } from './models/room.js';
import { Button } from './button.js';


export class AddNewRoom extends React.Component {


	constructor(props) {
		super(props)
	}

	addNewRoom(event) {
		if (Turbolinks) {
			Turbolinks.controller.adapter.progressBar.setValue(0)
			Turbolinks.controller.adapter.progressBar.show()
		}

		let room = new Room()
		room.endpoint = `${room.parent_endpoint}/${this.props.hotel}${room.endpoint}`
		room.save({ name: "Nouvelle Chambre", description: "La description de la chambre.", route: "new" }).then((response)=> {
			// console.log(response)

			if (Turbolinks) {
				Turbolinks.controller.adapter.progressBar.setValue(100)
				Turbolinks.controller.adapter.progressBar.hide()
				Turbolinks.visit(`/hotels/${this.props.hotel}/rooms/${response.id}`)
			}
		})
	}

	render() {

		return <div>
			<Button className="button--transparent"
				label="+ Add new room" onClick={this.addNewRoom.bind(this)} />
		</div>
	}
}

