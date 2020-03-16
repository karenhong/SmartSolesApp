import {StyleSheet} from 'react-native';
import SSColors from './colors';
import React from 'react';

/**
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
    borderWidth: 0,
    borderColor: SSColors.lighter,
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 200,
    backgroundColor: SSColors.white,
    borderRadius: 100,
  },
  disabledButton: {
    borderWidth: 0,
    borderColor: SSColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 200,
    backgroundColor: SSColors.white,
    borderRadius: 100,
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 55,
    color: SSColors.accent,
    textAlign: 'center',
    fontWeight: '700',
  },
  behind: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
  },
  center: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    height: 3,
    width: '100%',
    backgroundColor: SSColors.Gray,
    zIndex: 99,
  },
});

export default commonStyles;
