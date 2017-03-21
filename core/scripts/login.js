import { Session } from './models/session.js';
import { User } from './models/user.js';

import { Form } from './form.js';
import { Input } from './input.js';
import { Button } from './button.js';


export class Login extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			session: new Session(),
			showed: false
		}

		if (this.state.session.id) {
			this.fetchUser()
		}
	}

	componentDidMount() {
		key("escape", this.toggle.bind(this))
	}

	componentWillUnmount() {
		key.unbind("escape")
	}


	toggle(event) {
		event.preventDefault()
		this.setState({showed: !this.state.showed})
	}

	hide(event) {
		event.preventDefault()
		this.setState({showed: false})
	}


	fetchUser() {
		const user = new User()
		user.fetch().then((user)=> { 
			this.setState({ user: user })
		})
	}

	login(e, state) {
		this.state.session.login(state).then((session)=> {
			this.setState({session: session, showed: false})
			Turbolinks.visit(window.location.pathname)
		})
	}

	logout(e) {
		this.state.session.logout().then((session)=> {
			this.setState({ session: new Session(), user: null })
			Turbolinks.visit(window.location.pathname)
		})
	}


	render() {
		
		return <div className={`login ${this.state.showed && "overlay--show"}`}>
			<a className="login__back" onClick={this.hide.bind(this)} />
			<div className="login__container">
			{this.state.session.id &&
				<Button className="button--full" label="Log out" onClick={this.logout.bind(this)} />
			||
				<Form onSubmit={this.login.bind(this)}>
					<Input name='email' type='email' label='Email address' placeholder='email.address@gmail.com' required />
					<Input name='password' type='password' label='Password' placeholder='********' required />
					<Button label='Log in' />
				</Form>
			}
			</div>
		</div>
	}
}