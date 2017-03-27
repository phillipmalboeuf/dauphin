

export class IconSelect extends React.Component {

	icons() {
		return ["none", "alarm", "appletv", "babycrib", "breakfast", "businesscenter", "coffeemachine", "computer", "fax", "floor", "fridge", "gym", "hairdryer", "hanger", "iron", "microwave", "newspaper", "parking", "phone", "pillow", "rockingchair", "safe", "shower", "skincare", "smarttv", "wifi", "workdesk"]
	}

	constructor(props) {
		super(props)
		this.state = {
			showed: false,
			icon: props.icon
		}
	}

	componentDidMount() {
		document.addEventListener("click", this.hide.bind(this))
	}

	componentWillUnmount() {
		document.removeEventListener("click", this.hide)
	}

	toggle(event) {
		event.nativeEvent.stopImmediatePropagation()	
		event.preventDefault()
		
		this.setState({showed: !this.state.showed})
	}

	hide(event) {
		if (this.state.showed) {
			this.setState({showed: false})
		}
	}

	changeIcon(event, icon) {
		this.setState({icon: icon})
	}

	render() {

		return <span className={`tooltip_container ${this.state.showed && "tooltip_container--show"}`}>
			<button className="button--transparent" onClick={this.toggle.bind(this)}><svg className="icon" dangerouslySetInnerHTML={{__html: `<use xlink:href="#icon-${this.state.icon}" />`}} /></button>
			<div className="tooltip">
				<div className="grid grid--tight_guttered">
					{this.icons().map((icon)=> (
					<div className="col" key={icon}>
						<button className="button--transparent" onClick={(event)=> {this.changeIcon(event, icon)}}><svg className="icon" dangerouslySetInnerHTML={{__html: `<use xlink:href="#icon-${icon}" />`}} /></button>
					</div>
					))}
				</div>
			</div>
		</span>
	}
}

