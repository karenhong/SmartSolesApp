import {StyleSheet} from 'react-native';
import SSColors from './colors';

/**
 * TODO @Peijia
 * Styles elements shared between many pages can be defined here
 * For specific style components, create a new js file in this folder and define a new stylesheet
 */
const commonStyles = StyleSheet.create({
  // TODO: left as example. Not all of these are currently used, please remove unused styles
  body: {
    backgroundColor: SSColors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 48,
    fontWeight: '900',
    color: SSColors.black,
  },
  sectionDescription: {
    marginTop: 40,
    fontSize: 24,
    fontWeight: '400',
    color: SSColors.black,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: SSColors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  roundButton: {
    borderWidth: 40,
    borderColor: SSColors.lighter,
    alignItems: 'center',
    justifyContent: 'center',
    width: 280,
    height: 280,
    backgroundColor: SSColors.primary,
    borderRadius: 140,
  },
  disabledButton: {
    borderWidth: 40,
    borderColor: SSColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    width: 280,
    height: 280,
    backgroundColor: SSColors.primary,
    borderRadius: 140,
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 40,
    color: 'white',
    textAlign: 'center',
    fontWeight: '700',
  },
});

export default commonStyles;
