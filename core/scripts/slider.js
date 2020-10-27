
export class Slider extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			slides: props.slides,
			current: 0,
			height: "100%"
		}
	}

	componentDidMount() {
		document.querySelectorAll(".slide")[0].querySelectorAll("img")[0].addEventListener("load", (event)=> {
			this.setState({
				height: `${event.currentTarget.scrollHeight}px`
			})
		})
	}

	componentDidUpdate(prevProps, prevState) {
		// window.Core.renderBackgroundImages()
	}

	slideTo(event, index) {
		if (event) {
			event.preventDefault()
			event.currentTarget.blur()
		}

		this.setState({
			current: index,
			height: `${document.querySelectorAll(".slide")[index].querySelectorAll("a > *")[0].scrollHeight}px`
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

	addSlide(event) {
		this.state.slides.push(this.state.slides[this.state.slides.length - 1])

		this.setState({
			slides: this.state.slides
		})

		setTimeout(()=> {
			this.slideTo(null, this.state.slides.length - 1)
		}, 100)
	}

	removeSlide(event, index) {
		this.state.slides.splice(index, 1)

		this.setState({
			slides: this.state.slides
		})

		setTimeout(()=> {
			this.previousSlide(null)
		}, 100)
	}


	render() {
		return <div className="grid grid--spaced">
			<div className="col col--1of12" style={{paddingTop: "30%"}}>
				<button onClick={this.previousSlide.bind(this)} className="button--transparent">&lt; {lang === 'en' ? 'Previous' : 'Précédent'}</button>
			</div>
			<div className="col col--10of12 slider">
				<div className="slider__container" ref={(div)=>{this.container = div}} style={{
						width: (this.state.slides.length * 100)+"%"
					}}>
					{this.state.slides.map((slide, index)=> (
					<div className="slide" key={index} style={{
							width: (100 / this.state.slides.length)+"%",
							height: this.state.height,
							transform: `translateX(-${this.state.current}00%)`
						}}>
						<a href={slide} target="_blank">
							{slide.includes('videos.ctfassets') 
							? <video src={slide} autoPlay muted loop playsInline />
							: <img src={slide} />}
						</a>
					</div>
					))}
				</div>
			</div>
			<div className="col col--1of12 text_right" style={{paddingTop: "30%"}}>
				<button onClick={this.nextSlide.bind(this)} className="button--transparent">{lang === 'en' ? 'Next' : 'Prochain'} &gt;</button>
			</div>
		</div>
	}
}

