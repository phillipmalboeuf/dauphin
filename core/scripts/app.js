

import { Login } from './login.js'
import { Save } from './save.js'
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
		const save = document.getElementById("save")
		if (save) {
			ReactDOM.render(
				<Save />, save
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
						icon={reservation.getAttribute("data-icon")} />, reservation
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
	}
}

Core.init()
document.addEventListener("turbolinks:load", ()=> {
	Core.render()
})