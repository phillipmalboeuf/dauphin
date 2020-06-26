
import { Cookies } from './utilities/cookies.js';

export class Popup extends React.Component {

	constructor(props) {
		super(props)

		this.state = {
			popupHidden: true
		}

    this.hidePopup = this.hidePopup.bind(this)
	}

	componentDidMount(prevProps, prevState) {
		if (Cookies.get("popup_hidden") == "true") {
			this.setState({ popupHidden: true })
		} else {
      window.setTimeout(() => {
        this.setState({ popupHidden: false })
      }, 100)
    }
	}

	hidePopup(event) {
		this.setState({ popupHidden: true })

		Cookies.set("popup_hidden", "true", 7)
	}

	render() {
    console.log(this.props)
		return <div className={`overlay overlay--full ${!this.state.popupHidden && "overlay--show"}`}>
      <button className='overlay__back' onClick={this.hidePopup}></button>
      <div className='overlay__container'>
        <button className='overlay__close' onClick={this.hidePopup}>✕</button>
        <img src={this.props.media} alt={this.props.title} />
      </div>
		</div>
	}
}