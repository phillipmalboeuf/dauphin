
import { Page } from './models/page.js';
import { Button } from './button.js';


export class AddNewPage extends React.Component {


	constructor(props) {
		super(props)
	}

	addNewPage(event) {
		if (Turbolinks) {
			Turbolinks.controller.adapter.progressBar.setValue(0)
			Turbolinks.controller.adapter.progressBar.show()
		}

		let page = new Page()
		page.save({ name: "Title", route: "new", body: "Body", hide_from_navigation: true }).then((response)=> {
			// console.log(response)

			if (Turbolinks) {
				Turbolinks.controller.adapter.progressBar.setValue(100)
				Turbolinks.controller.adapter.progressBar.hide()
				Turbolinks.visit(`/pages/${response.id}`)
			}
		})
	}

	render() {

		return <div>
			<Button className="button--transparent"
				label="+ Add new page" onClick={this.addNewPage.bind(this)} />
		</div>
	}
}

export class RemovePage extends React.Component {


	constructor(props) {
		super(props)
	}

	removeRoom(event) {
		if (confirm("Are you sure?")) {
			if (Turbolinks) {
				Turbolinks.controller.adapter.progressBar.setValue(0)
				Turbolinks.controller.adapter.progressBar.show()
			}

			let page = new Page()
			page.id = this.props.page
			page.destroy().then((response)=> {
				// console.log(response)

				if (Turbolinks) {
					Turbolinks.controller.adapter.progressBar.setValue(100)
					Turbolinks.controller.adapter.progressBar.hide()
					Turbolinks.visit(`/`)
				}
			})
		}
	}

	render() {

		return <div>
			<Button className="button--transparent"
				label="– Remove page" onClick={this.removeRoom.bind(this)} />
		</div>
	}
}

