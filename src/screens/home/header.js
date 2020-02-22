import React from 'react';
import {
  Container,
  Header,
  Title,
  Button,
  Icon,
  Left,
  Right,
  H1,
  H2,
  H3,
  Text,
  Body,
  StyleProvider,
} from 'native-base';
import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/material';

class HomeHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //defauilt value of the date time
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
        <Container>
          <Header span>
            <Body>
              <Text>{this.state.date}</Text>
              <H1>Good Morning, Annie</H1>
            </Body>
            <Right>
              <Button transparent>
                <Icon type="MaterialCommunityIcons" name="shoe-print" />
              </Button>
            </Right>
          </Header>
        </Container>
      </StyleProvider>
    );
  }
}

export default HomeHeader;
