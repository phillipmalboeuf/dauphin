

export class Slider extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			current: 0
		}
	}

	slideTo(event, index) {
		if (event) {
			event.preventDefault()
			event.currentTarget.blur()
		}

		this.setState({
			current: index
		})
	}

	nextSlide(event) {
		if (this.state.current == this.props.slides.length - 1) {
			this.slideTo(event, 0)
		} else {
			this.slideTo(event, this.state.current + 1)
		}
	}


	previousSlide(event) {
		if (this.state.current == 0) {
			this.slideTo(event, this.props.slides.length - 1)
		} else {
			this.slideTo(event, this.state.current - 1)
		}
	}


	render() {

		return <div className="grid grid--spaced grid--middle">
			<div className="col col--1of12"><button onClick={this.previousSlide.bind(this)} className="button--transparent">&lt; Précédent</button></div>
			<div className="col col--10of12 slider">
				<div className="slider__container" ref={(div)=>{this.container = div}} style={{
						width: (this.props.slides.length * 100)+"%"
					}}>
					{this.props.slides.map((slide, index)=> (
					<div className="slide" key={index} style={{
							width: (100 / this.props.slides.length)+"%",
							transform: `translateX(-${this.state.current}00%)`
						}}>
						<a href={slide} target="_blank"><img src={slide} /></a>
					</div>
					))}
				</div>
			</div>
			<div className="col col--1of12 text_right"><button onClick={this.nextSlide.bind(this)} className="button--transparent">Prochain &gt;</button></div>
		</div>
	}
}

