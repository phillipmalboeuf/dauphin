
import { Upload } from './utilities/upload.js';


export class EditableBackgroundImage extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			image: props.image
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevState.image != this.state.image) {
			this.props.save.updateChanges({currentTarget: this.element})
		}
	}

	triggerUpload(event) {
		this.input.click()
	}

	uploadImage(event) {
		let file = event.currentTarget.files[0]
		if (file.type.match('image.*')) {
			if (Turbolinks) {
				Turbolinks.controller.adapter.progressBar.setValue(0)
				Turbolinks.controller.adapter.progressBar.show()
			}

			Upload.upload(file).then((response)=> {
				this.setState({
					image: response.url
				})

				if (Turbolinks) {
					Turbolinks.controller.adapter.progressBar.setValue(100)
					Turbolinks.controller.adapter.progressBar.hide()
				}
			})
		}
	}

	render() {

		return <div style={{position: "absolute", bottom: 0, right: 0}}>
			<span ref={(element)=> { this.element = element }} className="hide"
				data-list={this.props.list}
				data-index={this.props.index}
				data-hotel={this.props.hotel}
				data-room={this.props.room}
				data-key={this.props.dataKey}>{this.state.image}</span>
			<img ref={(image)=> { this.image = image }}
				data-hotel={this.props.hotel}
				data-room={this.props.room}
				onClick={this.triggerUpload.bind(this)}
				src={this.state.image} alt={this.props.key} className="img--clickable" />
			<input ref={(input)=> { this.input = input }}
				onChange={this.uploadImage.bind(this)}
				type="file"  className="hide" />
		</div>
	}
}