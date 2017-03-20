import { Session } from './models/session.js';
import { User } from './models/user.js';

import { Button } from './button.js';


export class Save extends React.Component {

	constructor(props) {
		super(props)

		this.state = {
			pieces: {}
		}
	}

	componentDidMount() {
		this.editables = document.querySelectorAll("[contenteditable]")
		for (var i = 0; i < this.editables.length; i++) {
			this.editables[i].addEventListener("input", this.updateChanges.bind(this))
			this.editables[i].addEventListener("click", this.preventClick.bind(this))
		}

		key("cmd + s", this.save.bind(this))
	}

	componentWillUnmount() {
		for (var i = 0; i < this.editables.length; i++) {
			this.editables[i].removeEventListener("input", this.updateChanges)
			this.editables[i].removeEventListener("click", this.preventClick)
		}

		key.unbind("cmd + s", this.save)
	}

	updateChanges(event) {
		let key = event.currentTarget.getAttribute("key")
		let piece = event.currentTarget.getAttribute("data-pieces-id")
		
		if (piece) {
			if (!this.state.pieces[piece]) { this.state.pieces[piece] = {} }
			this.state.pieces[piece][key] = event.currentTarget.innerHTML
		
			this.setState({
				pieces: this.state.pieces
			})
		}
	}

	preventClick(event) {
		event.preventDefault()
	}

	save(event) {
		console.log(this.state.changes)
	}


	render() {
		
		return <div className="save">
			<Button className="button--small" disabled={this.state.changes.length == 0} label="Save" onClick={this.save.bind(this)} />
		</div>
	}
}