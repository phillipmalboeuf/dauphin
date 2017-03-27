

import { Login } from './login.js'
import { Save } from './save.js'
import { IconSelect } from './icon_select.js'
import { Reservation } from './reservation.js'
import { Slider } from './slider.js'
import { Background } from './background.js'


if (module.hot)
	module.hot.accept()


const Core = {
	init() {
		this.render()
		this.renderLogin()
		this.renderSave()
	},

	renderLogin() {
		const login = document.getElementById("login")
		if (login) {
			ReactDOM.render(
				<Login />, login
			)
		}
	},

	renderSave() {
		
	},

	render() {
		let editables = []

		const icons = document.querySelectorAll("[data-icon]")
		if (icons.length > 0) {
			for (var i = icons.length - 1; i >= 0; i--) {
				editables.push(ReactDOM.render(
					<IconSelect icon={icons[i].getAttribute("data-icon")}
						dataKey={icons[i].getAttribute("data-key")}
						list={icons[i].getAttribute("data-list")}
						index={icons[i].getAttribute("data-index")}
						hotel={icons[i].getAttribute("data-hotel")}
						room={icons[i].getAttribute("data-room")} />, icons[i]
				))

				icons[i].removeAttribute("data-icon")
				icons[i].removeAttribute("data-key")
				icons[i].removeAttribute("data-list")
				icons[i].removeAttribute("data-index")
				icons[i].removeAttribute("data-hotel")
				icons[i].removeAttribute("data-room")
			}
		}

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
				<Save editables={editables} />, save
			)
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

Core.destroy()
Core.init()
document.addEventListener("turbolinks:load", ()=> {
	Core.render()
})
document.addEventListener("turbolinks:before-render", ()=> {
	Core.destroy()
})
