

import { Login } from './login.js'
import { Save } from './save.js'
import { EditableList } from './editable_list.js'
import { EditableBackgroundImage } from './editable_background_image.js'
import { IconSelect } from './icon_select.js'
import { AddNewPage } from './add_new_page.js'
import { AddNewRoom } from './add_new_room.js'
import { RemovePage } from './add_new_page.js'
import { RemoveRoom } from './add_new_room.js'
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
		
		const menu = document.getElementById("menu")
		if (menu) {
			document.getElementById("main").addEventListener("click", (event)=> {
				menu.checked = false
			})
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
						<Slider slides={sliders[i].getAttribute("data-slides").split(",")}
							hotel={sliders[i].getAttribute("data-hotel")}
							room={sliders[i].getAttribute("data-room")}
							list={sliders[i].getAttribute("data-slides-list")}
							dataKey={sliders[i].getAttribute("data-slides-key")} />, sliders[i]
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

		const new_pages = document.querySelectorAll("[data-add-new-page]")
		if (new_pages.length > 0) {
			for (var i = new_pages.length - 1; i >= 0; i--) {
				ReactDOM.render(
					<AddNewPage />, new_pages[i]
				)
			}
		}

		const new_rooms = document.querySelectorAll("[data-add-new-room]")
		if (new_rooms.length > 0) {
			for (var i = new_rooms.length - 1; i >= 0; i--) {
				ReactDOM.render(
					<AddNewRoom hotel={new_rooms[i].getAttribute("data-hotel")} />, new_rooms[i]
				)
			}
		}

		const remove_pages = document.querySelectorAll("[data-remove-page]")
		if (remove_pages.length > 0) {
			for (var i = remove_pages.length - 1; i >= 0; i--) {
				ReactDOM.render(
					<RemovePage page={remove_pages[i].getAttribute("data-remove-page")} />, remove_pages[i]
				)
			}
		}

		const remove_rooms = document.querySelectorAll("[data-remove-room]")
		if (remove_rooms.length > 0) {
			for (var i = remove_rooms.length - 1; i >= 0; i--) {
				ReactDOM.render(
					<RemoveRoom room={remove_rooms[i].getAttribute("data-remove-room")} hotel={remove_rooms[i].getAttribute("data-hotel")} />, remove_rooms[i]
				)
			}
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

		this.renderBackgroundImages()
		this.renderIcons()
	},

	renderBackgroundImages() {
		const images = document.querySelectorAll("[data-editable-background-image]")
		if (images.length > 0) {
			for (var i = images.length - 1; i >= 0; i--) {
				ReactDOM.render(
					<EditableBackgroundImage
						image={images[i].getAttribute("data-editable-background-image")}
						dataKey={images[i].getAttribute("data-key")}
						hotel={images[i].getAttribute("data-hotel")}
						room={images[i].getAttribute("data-room")}
						list={images[i].getAttribute("data-list")}
						index={images[i].getAttribute("data-index")}
						save={this.save} />, images[i]
				)
			}
		}
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
