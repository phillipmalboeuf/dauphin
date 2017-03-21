

export class Background extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			image: "",
			showed: false
		}
	}

	componentDidMount() {
		this.buttons = document.querySelectorAll("[data-background-image]")
		for (var i = 0; i < this.buttons.length; i++) {
			this.buttons[i].addEventListener("mouseover", (event)=> {
				this.setState({
					image: event.currentTarget.getAttribute("data-background-image"),
					showed: true
				})
			})

			this.buttons[i].addEventListener("mouseout", this.hide.bind(this))
		}
	}

	componentWillUnmount() {
		for (var i = 0; i < this.buttons.length; i++) {
			this.buttons[i].removeEventListener("mouseover", this.hide)
			this.buttons[i].removeEventListener("mouseout", this.hide)
		}
	}

	hide(event) {
		this.setState({showed: false})
	}


	render() {

		document.body.className = this.state.showed ? "white" : ""

		return <div className={this.state.showed ? "background background--show" : "background"} style={{
				backgroundImage: `url(${this.state.image})`
			}}>
			<div className="background__overlay" />
		</div>
	}
}