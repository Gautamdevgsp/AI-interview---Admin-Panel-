// Menu configuration for default layout
const menuItems = {
  items: [
    {
      id: 'navigation',
      title: '',
      type: 'group',
      icon: 'icon-navigation',
      children: [
      //   {
      //     id: 'admin-controls',
      //     title: 'Admin-controls',
      //     type: 'collapse',
      //     icon: 'material-icons-two-tone',
      //     iconname: 'home',
      //     children: [
            {
              id: 'Dashboard',
              title: 'Dashboard',
              type: 'item',
              url: '/dashboard'
            },
            {
              id: 'Cinterview',
              title: 'Manage Interviews',
              type: 'item',
              url: '/createinterview'
            },
            {
              id: 'Questions',
              title: 'Assign Questions',
              type: 'item',
              url: '/mngques'
            },
            {
              id: 'Ainterview',
              title: 'Assign Interview',
              type: 'item',
              url: '/assigninterview'
            },
            {
              id: 'Atrackinginterview',
              title: 'Results',
              type: 'item',
              url: '/detailedresult'
            },
            {
              id: 'Atrackinginterview',
              title: 'Students',
              type: 'item',
              url: '/registeruser'
            },
    
      ]
    },
    
 
  ]
};

export default menuItems;
