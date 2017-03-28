
import { Button } from './button.js';


export class EditableList extends React.Component {


	constructor(props) {
		super(props)
		this.state = {
			items: props.items
		}
	}

	componentDidMount() {
		window.Core.renderIcons()
		this.props.save.componentWillUnmount()
		this.props.save.componentDidMount()
	}

	componentWillUnmount() {

	}

	componentDidUpdate(prevProps, prevState) {
		window.Core.renderIcons()
		this.props.save.componentWillUnmount()
		this.props.save.componentDidMount()
	}

	addItem(event) {
		let item = this.state.items[this.state.items.length - 1].cloneNode(true)
		
		const itemsLength = this.state.items.length
		const itemsSelector = item.querySelectorAll("[data-index]")
		for (var j = 0; j < itemsSelector.length; j++) {
			itemsSelector[j].setAttribute("data-index", itemsLength)
		}

		this.state.items.push(item)

		this.setState({
			items: this.state.items
		})
	}

	removeItem(event, index) {
		this.state.items.splice(index, 1)

		this.setState({
			items: this.state.items
		})
	}

	render() {

		return <div>
			<div className="grid grid--tight_guttered">
				{this.state.items.map((item, index)=> (
				<div className={`${item.className} relative`} key={index}>
				  <div dangerouslySetInnerHTML={{__html: item.innerHTML}} />
				  <button className="button--transparent" style={{position: "absolute", right: 0, top: 0}}
				  	onClick={(event)=> { this.removeItem(event, index) }}>–</button>
				</div>
				))}
			</div>
			<Button className="button--transparent"
				label="+ Add new item" onClick={this.addItem.bind(this)} />
		</div>
	}
}

