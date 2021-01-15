import React from 'react';
import { Nav } from 'shards-react';

import SidebarNavItem from './SidebarNavItem';
import { Store } from '../../../flux';
import subAdmin from '../../../data/subadmin-nav-items';
class SidebarNavItems extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			navItems: Store.getSidebarItems(),
		};
		this.onChange = this.onChange.bind(this);
	}

	componentWillMount() {
		if (localStorage.getItem('userInfo')) {
			const login_datails = JSON.parse(localStorage.getItem('userInfo'));
			if (login_datails.admin_role !== 0) {
				this.setState({ navItems: subAdmin[login_datails.admin_role] });
			}
		}
		Store.addChangeListener(this.onChange);
	}
	componentWillUnmount() {
		Store.removeChangeListener(this.onChange);
	}

	onChange() {
		if (localStorage.getItem('userInfo')) {
			const login_datails = JSON.parse(localStorage.getItem('userInfo'));
			if (login_datails.admin_role !== 0) {
				this.setState({ navItems: subAdmin[login_datails.admin_role] });
			}
		} else {
			this.setState({
				...this.state,
				navItems: Store.getSidebarItems(),
			});
		}
	}

	render() {
		const { navItems: items } = this.state;
		return (
			<div className='nav-wrapper'>
				<Nav className='nav--no-borders flex-column'>
					{items.map((item, idx) => (
						<>
							<SidebarNavItem key={idx} item={item} />
						</>
					))}
				</Nav>
			</div>
		);
	}
}

export default SidebarNavItems;
