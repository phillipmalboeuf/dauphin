
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
		room.save({
			name: "Nouvelle Chambre",
			description: "La description de la chambre.",
			route: "new",
			photos: [{image: "https://d3hy1swj29dtr7.cloudfront.net/uploads/58e25476970ad62c4d7668bc/hotel_2.jpg"}],
			in_the_room: [{icon: "none", body: "Une description"}],
			in_the_room_on_demand: [{icon: "none", body: "Une description"}],
			services: [{icon: "none", body: "Une description"}],
			paid_services: [{icon: "none", body: "Une description"}] }).then((response)=> {
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


export class RemoveRoom extends React.Component {


	constructor(props) {
		super(props)
	}

	removeRoom(event) {
		if (confirm("Are you sure?")) {
			if (Turbolinks) {
				Turbolinks.controller.adapter.progressBar.setValue(0)
				Turbolinks.controller.adapter.progressBar.show()
			}

			let room = new Room()
			room.id = this.props.room
			room.endpoint = `${room.parent_endpoint}/${this.props.hotel}${room.endpoint}`
			room.destroy().then((response)=> {
				// console.log(response)

				if (Turbolinks) {
					Turbolinks.controller.adapter.progressBar.setValue(100)
					Turbolinks.controller.adapter.progressBar.hide()
					Turbolinks.visit(`/hotels/${this.props.hotel}/rooms`)
				}
			})
		}
	}

	render() {

		return <div>
			<Button className="button--transparent"
				label="– Remove room" onClick={this.removeRoom.bind(this)} />
		</div>
	}
}

