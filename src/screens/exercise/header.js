import React from 'react';
import {
  Header,
  Item,
  Input,
  Icon,
  Button,
  Text,
  StyleProvider,
} from 'native-base';

import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/smartSole';

class ExerciseHeader extends React.Component {
  render() {
    return (
      <StyleProvider style={getTheme(material)}>
        <Header searchBar rounded>
          <Item>
            <Icon name="ios-search" />
            <Input placeholder="Search" />
          </Item>
          <Button transparent>
            <Text>Search</Text>
          </Button>
        </Header>
      </StyleProvider>
    );
  }
}

export default ExerciseHeader;
