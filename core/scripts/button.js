

export const Button = props => {
	return <button
		className={props.className}
		onClick={(e)=> {
			e.currentTarget.blur()
			if (props.onClick) {props.onClick(e)}
		}}>{props.label}</button>
}