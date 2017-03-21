import { Session } from './models/session.js';
import { User } from './models/user.js';

import { Piece } from './models/piece.js';
import { Hotel } from './models/hotel.js';
import { Room } from './models/room.js';

import { Button } from './button.js';


export class Save extends React.Component {

	constructor(props) {
		super(props)

		this.state = {
			pieces: {},
			hotels: {},
			rooms: {}
		}
	}

	componentDidMount() {
		this.editables = document.querySelectorAll("[contenteditable]")
		for (var i = 0; i < this.editables.length; i++) {
			this.editables[i].addEventListener("input", this.updateChanges.bind(this))
			this.editables[i].addEventListener("click", this.preventClick.bind(this))
		}

		key("command+s,ctrl+s", this.save.bind(this))
	}

	componentWillUnmount() {
		for (var i = 0; i < this.editables.length; i++) {
			this.editables[i].removeEventListener("input", this.updateChanges)
			this.editables[i].removeEventListener("click", this.preventClick)
		}

		key.unbind("command+s,ctrl+s")
	}

	updateChanges(event) {
		let key = event.currentTarget.getAttribute("data-key")
		let piece = event.currentTarget.getAttribute("data-piece-id")
		let hotel = event.currentTarget.getAttribute("data-hotel-id")
		let room = event.currentTarget.getAttribute("data-room-id")
		
		if (piece) {
			if (!this.state.pieces[piece]) { this.state.pieces[piece] = {} }
			this.state.pieces[piece][key] = event.currentTarget.innerHTML
		
			this.setState({
				pieces: this.state.pieces
			})
		} else if (hotel) {
			if (!this.state.hotels[hotel]) { this.state.hotels[hotel] = {} }
			this.state.hotels[hotel][key] = event.currentTarget.innerHTML
		
			this.setState({
				hotels: this.state.hotels
			})
		} else if (room) {
			room = `${event.currentTarget.getAttribute("data-parent-id")}.${room}`
			if (!this.state.rooms[room]) { this.state.rooms[room] = {} }
			this.state.rooms[room][key] = event.currentTarget.innerHTML
		
			this.setState({
				rooms: this.state.rooms
			})
		}

	}

	preventClick(event) {
		event.preventDefault()
	}

	save(event) {
		if (Object.keys(this.state.pieces).length + Object.keys(this.state.hotels).length + Object.keys(this.state.rooms).length !== 0) {
			if (event) {
				event.preventDefault()
			}

			if (Turbolinks) {
				Turbolinks.controller.adapter.progressBar.setValue(0)
				Turbolinks.controller.adapter.progressBar.show()
			}

			let saves = []

			for (let [_id, content] of Object.entries(this.state.pieces)) {
				for (let [key, value] of Object.entries(content)) {
					content[key] = {value: value}
				}

				let piece = new Piece()
				piece.id = _id
				saves.push(piece.save({ content: content }))
			}

			for (let [_id, attributes] of Object.entries(this.state.hotels)) {
				let hotel = new Hotel()
				hotel.id = _id
				saves.push(hotel.save(attributes))
			}

			for (let [_id, attributes] of Object.entries(this.state.rooms)) {
				let room = new Room()
				let id_split = _id.split(".")
				room.id = id_split[1]
				room.endpoint = `${room.parent_endpoint}/${id_split[0]}${room.endpoint}`
				saves.push(room.save(attributes))
			}

			Promise.all(saves).then((models)=> {
				if (Turbolinks) {
					Turbolinks.controller.adapter.progressBar.setValue(100)
					Turbolinks.controller.adapter.progressBar.hide()
				}

				this.setState({
					pieces: {},
					hotels: {},
					rooms: {}
				})
			})
		}
	}


	render() {

		return <div className="save">
			<Button className="button--small"
				disabled={Object.keys(this.state.pieces).length + Object.keys(this.state.hotels).length + Object.keys(this.state.rooms).length === 0}
				label="Save" onClick={this.save.bind(this)} />
		</div>
	}
}