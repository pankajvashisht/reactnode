export default function () {
	return [
		{
			title: 'Dashboard',
			to: '/',
			htmlBefore: '<i class="material-icons">edit</i>',
			htmlAfter: '',
		},
		{
			title: 'Sub Admin',
			htmlBefore: '<i class="material-icons">supervisor_account</i>',
			to: '/sub-admin',
		},
		{
			title: 'Add User',
			htmlBefore: '<i class="material-icons">person_add</i>',
			to: '/add-user',
		},
		{
			title: 'Users',
			htmlBefore: '<i class="material-icons">people</i>',
			to: '/users',
		},
		{
			title: 'Add Posts',
			htmlBefore: '<i class="material-icons">note_add</i>',
			to: '/add-post',
		},
		{
			title: 'Posts',
			htmlBefore: '<i class="material-icons">local_activity</i>',
			to: '/posts',
		},
		{
			title: 'Trsansaction',
			htmlBefore: '<i class="material-icons">transfer_within_a_station</i>',
			to: '/transaction',
		},
		{
			title: 'User Profile',
			htmlBefore: '<i class="material-icons">person</i>',
			to: '/profile',
		},
		{
			title: 'App Settings',
			htmlBefore: '<i class="material-icons">settings</i>',
			to: '/settings',
		},
	];
}
