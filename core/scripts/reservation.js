
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
			hidden: true,
			popupHidden: false
		}
	}

	componentDidMount(prevProps, prevState) {
		this.content.style.maxHeight = this.content.scrollHeight+"px"
		if (this.popup) { this.popup.style.height = "auto" }

		if (Cookies.get("reservation_hidden") !== "true" && window.innerWidth > 600) {
			this.setState({ hidden: false })
		}

		if (Cookies.get("reservation_popup_hidden") == "true") {
			this.setState({ popupHidden: true })
		}
	}

	inputDate(moment, name) {

		if (name == "check_in") {
			let checkIn = moment.toDate()
			let checkOut = new Date(checkIn)
			checkOut.setDate(checkOut.getDate() + 1)

			// console.log(this.state.checkOut < checkOut)

			if (this.state.checkOut < checkOut) {
				this.setState({
					checkIn: checkIn,
					checkOut: checkOut
				})
			} else {
				this.setState({
					checkIn: checkIn
				})
			}

			
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

	hidePopup(event) {
		this.setState({
			popupHidden: true
		})

		Cookies.set("reservation_popup_hidden", "true", 2)
	}

	render() {

		return <div>
			<input type="checkbox" id="reservation_checkbox" onChange={this.toggle.bind(this)} checked={this.state.hidden ? true : false} className="reservation__checkbox" />
			<label htmlFor="reservation_checkbox" className="button button--full button--no_corners">
				<h3 className="text_center"><span dangerouslySetInnerHTML={{'__html': this.props.icon}} />&nbsp;&nbsp; {ui.reservation} &nbsp;&nbsp;<span dangerouslySetInnerHTML={{'__html': this.props.icon}} /></h3>
			</label>

			<div className="reservation__content" id="reservation_content" ref={(content)=>{ this.content = content }}>
				<div className="padded padded--tight light_back">
					<p className="p--small p--highlight_strong text_center" dangerouslySetInnerHTML={{'__html': ui.reservation_info}} />

					<div className="grid grid--tight_guttered grid--middle">
						<div className="col col--2of12"><label className="flat_bottom" htmlFor="check_in">{ui.check_in}</label></div>
						<div className="col col--10of12 relative">
							<Datetime open={false}
							onChange={(moment)=> { this.inputDate(moment, "check_in") }}
							timeFormat={false}
							dateFormat={"YYYY-MM-DD"}
							value={this.state.checkIn.toJSON().slice(0,10)}
							inputProps={{"name": "check_in", "id": "check_in"}} />
						</div>
						<div className="col col--2of12"><label className="flat_bottom" htmlFor="check_out">{ui.check_out}</label></div>
						<div className="col col--10of12 relative">
							<Datetime open={false}
							onChange={(moment)=> { this.inputDate(moment, "check_out") }}
							timeFormat={false}
							dateFormat={"YYYY-MM-DD"}
							value={this.state.checkOut.toJSON().slice(0,10)}
							inputProps={{"name": "check_out", "id": "check_out"}} />
						</div>
					</div>

					<a href={`http://softbooker.reservit.com/reservit/reserhotel.php?lang=${lang}&hotelid=${this.props.hotel.reservation_id}&fday=${this.state.checkIn.getDate()}&fmonth=${this.state.checkIn.getMonth()+1}&fyear=${this.state.checkIn.getFullYear()}&tday=${this.state.checkOut.getDate()}&tmonth=${this.state.checkOut.getMonth()+1}&tyear=${this.state.checkOut.getFullYear()}`}
						target="_blank" className="button button--full medium_top">{ui.price_availabilities}</a>
				</div>
			</div>

			{!this.state.popupHidden && <div className='reservation__popup padded grid grid--vertically_centered grid--center' ref={(element)=>{ this.popup = element }}>
				<div>
					<button className="button--transparent" onClick={this.hidePopup.bind(this)}><svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 13.44 13.44"><line x1="0.71" y1="12.73" x2="12.73" y2="0.71" stroke="currentColor"/><line x1="0.71" y1="0.71" x2="12.73" y2="12.73" stroke="currentColor"/></svg></button>
					<h3 className='text_center'>{ui.reservation_popup_title}</h3>
					<p className="p--small p--highlight_strong text_center" dangerouslySetInnerHTML={{'__html': ui.reservation_popup}} />
				</div>
			</div>}
		</div>
	}
}