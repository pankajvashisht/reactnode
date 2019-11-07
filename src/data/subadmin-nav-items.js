export default function() {
  return [
    {
      title: 'Dashboard',
      to: '/',
      htmlBefore: '<i class="material-icons">edit</i>',
      htmlAfter: '',
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
  ];
}
