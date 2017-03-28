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

		for (var i = 0; i < this.props.editables.length; i++) {
			this.props.editables[i].updateChanges = this.updateChanges.bind(this)
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
		let piece = event.currentTarget.getAttribute("data-piece")
		let hotel = event.currentTarget.getAttribute("data-hotel")
		let room = event.currentTarget.getAttribute("data-room")
		let list = event.currentTarget.getAttribute("data-list")
		
		if (piece) {
			if (!this.state.pieces[piece]) { this.state.pieces[piece] = {} }
			this.state.pieces[piece][key] = event.currentTarget.innerHTML
		
			this.setState({
				pieces: this.state.pieces
			})
		} else if (room) {
			room = `${hotel}.${room}`
			if (!this.state.rooms[room]) { this.state.rooms[room] = {} }
			if (list) {
				this.state.rooms[room][list] = {}
				let items = document.querySelectorAll(`[data-list="${list}"]`)
				for (var i = 0; i < items.length; i++) {
					if (!this.state.rooms[room][list][items[i].getAttribute("data-index")]) { this.state.rooms[room][list][items[i].getAttribute("data-index")] = {} }
					this.state.rooms[room][list][items[i].getAttribute("data-index")][items[i].getAttribute("data-key")] = items[i].innerHTML
				}
				this.state.rooms[room][list] = Object.keys(this.state.rooms[room][list]).map((index)=> {
					return this.state.rooms[room][list][index]
				})
			} else {
				this.state.rooms[room][key] = event.currentTarget.innerHTML
			}
		
			this.setState({
				rooms: this.state.rooms
			})
		} else if (hotel) {
			if (!this.state.hotels[hotel]) { this.state.hotels[hotel] = {} }
			if (list) {
				this.state.hotels[hotel][list] = {}
				let items = document.querySelectorAll(`[data-list="${list}"]`)
				for (var i = 0; i < items.length; i++) {
					if (!this.state.hotels[hotel][list][items[i].getAttribute("data-index")]) { this.state.hotels[hotel][list][items[i].getAttribute("data-index")] = {} }
					this.state.hotels[hotel][list][items[i].getAttribute("data-index")][items[i].getAttribute("data-key")] = items[i].innerHTML
				}
				this.state.hotels[hotel][list] = Object.keys(this.state.hotels[hotel][list]).map((index)=> {
					return this.state.hotels[hotel][list][index]
				})
			} else {
				this.state.hotels[hotel][key] = event.currentTarget.innerHTML
			}
		
			this.setState({
				hotels: this.state.hotels
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
		// console.log(this.state.rooms)

		return <div className="save">
			<Button className="button--small" label="Save" onClick={this.save.bind(this)} />
		</div>
	}
}