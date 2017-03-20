

export class Reservation extends React.Component {

	constructor(props) {
		super(props)

		this.today = new Date()
		this.today.setMinutes(this.today.getMinutes() - this.today.getTimezoneOffset())
		this.tomorrow = new Date(this.today)
		this.tomorrow.setDate(this.tomorrow.getDate() + 1)

		this.state = {
			checkIn: this.today,
			checkOut: this.tomorrow
		}
	}

	componentDidMount(prevProps, prevState) {
		this.content.style.maxHeight = this.content.clientHeight+"px"
	}

	inputDate(event) {
		let date = new Date(this.today)
		let split = event.currentTarget.value.split("-")
		date.setDate(split[2])
		date.setMonth(split[1]-1)
		date.setFullYear(split[0])

		if (event.currentTarget.name == "check_in") {
			this.setState({
				checkIn: date
			})
		} else if (event.currentTarget.name == "check_out") {
			this.setState({
				checkOut: date
			})
		}
	}

	render() {

		

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
						<div className="col col--10of12"><input onInput={this.inputDate.bind(this)} type="date" defaultValue={this.today.toJSON().slice(0,10)} name="check_in" id="check_in" /></div>
						<div className="col col--2of12"><label className="flat_bottom" htmlFor="check_out">{pieces.hotels.check_out}</label></div>
						<div className="col col--10of12"><input onInput={this.inputDate.bind(this)} type="date" defaultValue={this.tomorrow.toJSON().slice(0,10)} name="check_out" id="check_out" /></div>
					</div>

					<a href={`http://softbooker.reservit.com/reservit/reserhotel.php?lang=${lang}&hotelid=${this.props.hotelId}&fday=${this.state.checkIn.getDate()}&fmonth=${this.state.checkIn.getMonth()+1}&fyear=${this.state.checkIn.getFullYear()}&tday=${this.state.checkOut.getDate()}&tmonth=${this.state.checkOut.getMonth()+1}&tyear=${this.state.checkOut.getFullYear()}`}
						target="_blank" className="button button--full medium_top">{pieces.hotels.price_availabilities}</a>
				</div>
			</div>

		</div>
	}
}