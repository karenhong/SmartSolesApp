import React from 'react';
import { Container, Header, Item, Input, Icon, Button, Text, StyleProvider } from 'native-base';

import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/material';

class ExerciseHeader extends React.Component {
  render() {
    return (
      <StyleProvider style={getTheme(material)}>
        <Container>
          <Header searchBar rounded>
            <Item>
              <Icon name="ios-search" />
              <Input placeholder="Search" />
              <Icon name="ios-people" />
            </Item>
            <Button transparent>
              <Text>Search</Text>
            </Button>
          </Header>
        </Container>
      </StyleProvider>
    );
  }
}

export default ExerciseHeader;
