
import { Cookies } from './utilities/cookies.js';

export class Reservation extends React.Component {

	constructor(props) {
		super(props)

		this.today = new Date()
		this.today.setMinutes(this.today.getMinutes() - this.today.getTimezoneOffset())
		this.tomorrow = new Date(this.today)
		this.tomorrow.setDate(this.tomorrow.getDate() + 1)

		this.state = {
			checkIn: this.today,
			checkOut: this.tomorrow,
			hidden: Cookies.get("reservation_hidden") == "true"
		}
	}

	componentDidMount(prevProps, prevState) {
		this.content.style.maxHeight = this.content.scrollHeight+"px"
	}

	inputDate(moment, name) {

		if (name == "check_in") {
			this.setState({
				checkIn: moment.toDate()
			})
		} else if (name == "check_out") {
			this.setState({
				checkOut: moment.toDate()
			})
		}
	}

	toggle(event) {
		this.setState({
			hidden: event.currentTarget.checked
		})

		Cookies.set("reservation_hidden", event.currentTarget.checked)
	}

	render() {

		return <div>
			<input type="checkbox" id="reservation_checkbox" onChange={this.toggle.bind(this)} checked={this.state.hidden ? true : false} className="reservation__checkbox" />
			<label htmlFor="reservation_checkbox" className="button button--full button--no_corners">
				<h3 className="text_center"><span dangerouslySetInnerHTML={{'__html': this.props.icon}} />&nbsp;&nbsp; {pieces.hotels.reservation} &nbsp;&nbsp;<span dangerouslySetInnerHTML={{'__html': this.props.icon}} /></h3>
			</label>

			<div className="reservation__content" id="reservation_content" ref={(content)=>{ this.content = content }}>
				<div className="padded padded--tight light_back">
					{Cookies.get('Session-Secret') &&
					<p className="p--small p--highlight_strong text_center">
						<span contentEditable data-hotel={this.props.hotel._id} data-key="reservation_info" dangerouslySetInnerHTML={{'__html': this.props.hotel.reservation_info ? this.props.hotel.reservation_info : pieces.hotels.reservation_info}} /><br />
						Reservit Id: <span contentEditable data-hotel={this.props.hotel._id} data-key="reservation_id" dangerouslySetInnerHTML={{'__html': this.props.hotel.reservation_id}} />
					</p>
					||
					<p className="p--small p--highlight_strong text_center" dangerouslySetInnerHTML={{'__html': this.props.hotel.reservation_info ? this.props.hotel.reservation_info : pieces.hotels.reservation_info}} />
					}

					<div className="grid grid--tight_guttered grid--middle">
						<div className="col col--2of12"><label className="flat_bottom" htmlFor="check_in">{pieces.hotels.check_in}</label></div>
						<div className="col col--10of12 relative">
							<Datetime open={false}
							onChange={(moment)=> { this.inputDate(moment, "check_in") }}
							timeFormat={false}
							dateFormat={"YYYY-MM-DD"}
							defaultValue={this.today.toJSON().slice(0,10)}
							inputProps={{"name": "check_in", "id": "check_in"}} />
						</div>
						<div className="col col--2of12"><label className="flat_bottom" htmlFor="check_out">{pieces.hotels.check_out}</label></div>
						<div className="col col--10of12 relative">
							<Datetime open={false}
							onChange={(moment)=> { this.inputDate(moment, "check_out") }}
							timeFormat={false}
							dateFormat={"YYYY-MM-DD"}
							defaultValue={this.tomorrow.toJSON().slice(0,10)}
							inputProps={{"name": "check_out", "id": "check_out"}} />
						</div>
					</div>

					<a href={`http://softbooker.reservit.com/reservit/reserhotel.php?lang=${lang}&hotelid=${this.props.hotel.reservation_id}&fday=${this.state.checkIn.getDate()}&fmonth=${this.state.checkIn.getMonth()+1}&fyear=${this.state.checkIn.getFullYear()}&tday=${this.state.checkOut.getDate()}&tmonth=${this.state.checkOut.getMonth()+1}&tyear=${this.state.checkOut.getFullYear()}`}
						target="_blank" className="button button--full medium_top">{pieces.hotels.price_availabilities}</a>
				</div>
			</div>

		</div>
	}
}