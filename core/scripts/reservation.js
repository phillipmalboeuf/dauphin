

export class Reservation extends React.Component {

	constructor(props) {
		super(props)
	}

	componentDidMount(prevProps, prevState) {
		this.content.style.maxHeight = this.content.clientHeight+"px"
	}

	render() {

		let today = new Date()
		today.setMinutes(today.getMinutes() - today.getTimezoneOffset())
		let tomorrow = new Date(today)
		tomorrow.setDate(tomorrow.getDate() + 1)

		return <div>
			<input type="checkbox" id="reservation_checkbox" className="reservation__checkbox" />
			<label htmlFor="reservation_checkbox" className="button button--full button--no_corners">
				<h3 className="text_center"><span dangerouslySetInnerHTML={{'__html': this.props.icon}} />&nbsp;&nbsp; {pieces.hotels.reservation} &nbsp;&nbsp;<span dangerouslySetInnerHTML={{'__html': this.props.icon}} /></h3>
			</label>

			<div className="reservation__content" id="reservation_content" ref={(content)=>{ this.content = content }}>
				<div className="padded padded--tight light_back">
					<p className="p--small p--highlight_strong text_center" dangerouslySetInnerHTML={{'__html': pieces.hotels.reservation_info}} />

					<div className="grid grid--tight_guttered grid--middle">
						<div className="col col--2of12"><label className="flat_bottom" htmlFor="check_in">{pieces.hotels.check_in}</label></div>
						<div className="col col--10of12"><input type="date" defaultValue={today.toJSON().slice(0,10)} name="check_in" id="check_in" /></div>
						<div className="col col--2of12"><label className="flat_bottom" htmlFor="check_out">{pieces.hotels.check_out}</label></div>
						<div className="col col--10of12"><input type="date" defaultValue={tomorrow.toJSON().slice(0,10)} name="check_out" id="check_out" /></div>
					</div>
					

					<a href="#" className="button button--full medium_top">{pieces.hotels.price_availabilities}</a>
				</div>
			</div>

		</div>
	}
}