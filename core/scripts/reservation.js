
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
					<p className="p--small p--highlight_strong text_center"><span contentEditable data-piece={pieces.hotels._id} data-key="reservation_info" dangerouslySetInnerHTML={{'__html': pieces.hotels.reservation_info}} /></p>
					||
					<p className="p--small p--highlight_strong text_center" dangerouslySetInnerHTML={{'__html': pieces.hotels.reservation_info}} />
					}

					<div className="grid grid--tight_guttered grid--middle">
						<div className="col col--2of12"><label className="flat_bottom" htmlFor="check_in">{pieces.hotels.check_in}</label></div>
						<div className="col col--10of12"><input onInput={this.inputDate.bind(this)} type="date" defaultValue={this.today.toJSON().slice(0,10)} name="check_in" id="check_in" /></div>
						<div className="col col--2of12"><label className="flat_bottom" htmlFor="check_out">{pieces.hotels.check_out}</label></div>
						<div className="col col--10of12"><input onInput={this.inputDate.bind(this)} type="date" defaultValue={this.tomorrow.toJSON().slice(0,10)} name="check_out" id="check_out" /></div>
					</div>

					<a href={`http://softbooker.reservit.com/reservit/reserhotel.php?lang=${lang}&hotelid=${this.props.hotelId}&fday=${this.state.checkIn.getDate()}&fmonth=${this.state.checkIn.getMonth()+1}&fyear=${this.state.checkIn.getFullYear()}&tday=${this.state.checkOut.getDate()}&tmonth=${this.state.checkOut.getMonth()+1}&tyear=${this.state.checkOut.getFullYear()}&discountcode=${this.props.coupon}`}
						target="_blank" className="button button--full medium_top">{pieces.hotels.price_availabilities}</a>
				</div>
			</div>

		</div>
	}
}