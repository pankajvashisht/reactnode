export default function() {
  return [
    {
      title: "Dashboard",
      to: "/",
      htmlBefore: '<i class="material-icons">edit</i>',
      htmlAfter: ""
    },
    {
      title: "Users",
      htmlBefore: '<i class="material-icons">vertical_split</i>',
      to: "/users",
    },
    {
      title: "Posts",
      htmlBefore: '<i class="material-icons">note_add</i>',
      to: "/posts",
    },
    {
      title: "User Profile",
      htmlBefore: '<i class="material-icons">person</i>',
      to: "/profile",
    }
  ];
}
