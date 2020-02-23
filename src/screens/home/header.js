import React from 'react';
import {
  Header,
  Button,
  Icon,
  Right,
  H1,
  Text,
  Body,
  StyleProvider,
} from 'native-base';
import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/smartSole';
import SSColors from '../../styles/colors';

class HomeHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: '',
    };
  }
  componentDidMount() {
    var monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year

    this.setState({
      date: monthNames[month - 1] + ' ' + date + this.nth(date) + ', ' + year,
    });
  }

  nth = d => {
    if (d > 3 && d < 21) {
      return 'th';
    }
    switch (d % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };

  render() {
    return (
      <StyleProvider style={getTheme(material)}>
        <Header span>
          <Body>
            <Text>{this.state.date}</Text>
            <H1 style={{fontWeight: 'bold', color: SSColors.darkGray}}>
              Good morning, Annie.
            </H1>
          </Body>
          <Right>
            <Button transparent>
              <Icon
                type="MaterialCommunityIcons"
                name="shoe-print"
                style={{
                  fontSize: 35,
                  color: this.props.connected ? SSColors.accent : SSColors.gray,
                }}
              />
            </Button>
          </Right>
        </Header>
      </StyleProvider>
    );
  }
}

export default HomeHeader;
