import React from 'react';
import {
  Container,
  Header,
  Title,
  Button,
  Icon,
  Left,
  Right,
  Body,
  StyleProvider,
} from 'native-base';
import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/material';

class HomeHeader extends React.Component {
  render() {
    return (
      <StyleProvider style={getTheme(material)}>
        <Container>
          <Header span>
            <Body>
              <Title>Feb</Title>
              <Title>Good Morning, Annie</Title>
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
