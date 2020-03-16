import React, {Component} from 'react';
import {Image, TouchableOpacity} from 'react-native';

import {
  Container,
  Content,
  Card,
  CardItem,
  Text,
  H2,
  Button,
} from 'native-base';

export default class ExerciseCard extends Component {
  // https://www.youtube.com/watch?v=9hRRbq6wjKo
  // https://www.youtube.com/watch?v=i0uao-VKw9Q

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container>
        <Content>
          <TouchableOpacity
            activeOpacity={100}
            onPress={() => console.log('tapped')}>
            <Card>
              <CardItem cardBody>
                <Image
                  source={this.props.imageUrl}
                  style={{height: 200, width: 500, flex: 1}}
                />
              </CardItem>
              <CardItem>
                <H2>{this.props.title}</H2>
              </CardItem>
              <CardItem>
                <Button rounded accent>
                  <Text>{this.props.type}</Text>
                </Button>
              </CardItem>
            </Card>
          </TouchableOpacity>
        </Content>
      </Container>
    );
  }
}
