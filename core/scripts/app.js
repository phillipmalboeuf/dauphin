

import { Login } from './login.js'
import { Save } from './save.js'
import { EditableList } from './editable_list.js'
import { IconSelect } from './icon_select.js'
import { Reservation } from './reservation.js'
import { Slider } from './slider.js'
import { Background } from './background.js'


if (module.hot)
	module.hot.accept()


window.Core = {
	init() {
		this.render()
		this.renderLogin()
	},

	renderLogin() {
		const login = document.getElementById("login")
		if (login) {
			ReactDOM.render(
				<Login />, login
			)
		}
	},

	render() {

		if (window.innerWidth > 600) {
			const reservation = document.getElementById("reservation")
			if (reservation) {
				ReactDOM.render(
					<Reservation 
						hotelId={reservation.getAttribute("data-hotel-id")}
						coupon={reservation.getAttribute("data-reservation-coupon")}
						icon={reservation.getAttribute("data-icon-svg")} />, reservation
				)
			}
		}

		if (window.innerWidth > 900) {
			const sliders = document.querySelectorAll("[data-slider]")
			if (sliders.length > 0) {
				for (var i = sliders.length - 1; i >= 0; i--) {
					ReactDOM.render(
						<Slider slides={sliders[i].getAttribute("data-slides").split(",")} />, sliders[i]
					)
				}
			}
		}

		const background = document.getElementById("background")
		if (background) {
			ReactDOM.render(
				<Background />, background
			)
		}

		const save = document.getElementById("save")
		if (save) {
			ReactDOM.render(
				<Save ref={(save)=> { this.save = save}} />, save
			)
		}

		const lists = document.querySelectorAll("[data-editable-list]")
		if (lists.length > 0) {
			for (var i = lists.length - 1; i >= 0; i--) {
				let items = []
				const itemsSelector = lists[i].querySelectorAll("[data-list-item]")
				for (var j = 0; j < itemsSelector.length; j++) {
					items.push(itemsSelector[j])
				}
				ReactDOM.render(
					<EditableList save={this.save} items={items} />, lists[i]
				)
			}
		}

		this.renderIcons()
	},


	renderIcons() {
		const icons = document.querySelectorAll("[data-icon]")
		if (icons.length > 0) {
			for (var i = icons.length - 1; i >= 0; i--) {
				ReactDOM.render(
					<IconSelect icon={icons[i].getAttribute("data-icon")}
						dataKey={icons[i].getAttribute("data-key")}
						list={icons[i].getAttribute("data-list")}
						index={icons[i].getAttribute("data-index")}
						hotel={icons[i].getAttribute("data-hotel")}
						room={icons[i].getAttribute("data-room")}
						save={this.save} />, icons[i]
				)
			}
		}
	},

	destroy() {
		const elements = document.querySelectorAll("[data-reactroot]")
		if (elements.length > 0) {
			for (var i = elements.length - 1; i >= 0; i--) {
				if (!elements[i].parentNode.hasAttribute("data-turbolinks-permanent")) {
					ReactDOM.unmountComponentAtNode(elements[i].parentNode)	
				}
			}
		}
	}
}

window.Core.destroy()
window.Core.init()
document.addEventListener("turbolinks:load", ()=> {
	window.Core.render()
})
document.addEventListener("turbolinks:before-render", ()=> {
	window.Core.destroy()
})
