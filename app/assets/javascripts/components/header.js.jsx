/* This does nothing anymore but I will keep it as reference */

class Menubar extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    let menuItems = this.props.menu.map((i) => {
      return <MenuItem text={i.text} url={i.url} submenu={i.submenu} />
    })
    return (<nav>{menuItems}</nav>)
  }
}

class MenuItem extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    let subItems;
    if (this.props.submenu){
      subItems =
      <div className = 'navSubItems'>
        {this.props.submenu.map(i => {
          return <MenubarLink text={i.text} url = {i.url} />
        })}
      </div>
    }
    let content =   <div className = 'navTopItem'>
              <MenubarLink text={this.props.text} url = {this.props.url} />
              {subItems}
            </div>
    console.log(content)
    return (content);
  }
}

class MenubarLink extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    return (<a href={this.props.url}>{this.props.text}</a>)
  }
}