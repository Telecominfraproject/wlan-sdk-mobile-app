import { StyleSheet } from 'react-native';
import { store } from './store/Store';

// Primary color - branded, may change!
export var primaryColor = '#2194f3';
export var primaryColorStyle = StyleSheet.create({});

// Basic colours
export const blackColor = '#101010';
export const whiteColor = '#ffffff';
export const grayBackgroundcolor = '#eeeeee';
export const grayLightColor = '#dddddd';
export const grayColor = '#bbbbbb';
export const grayDarkColor = '#777777';
export const placeholderColor = '#c7c7cd';

// Badges colours
export const okColor = '#8BC34A';
export const infoColor = '#2156e8';
export const warnColor = '#fd9927';
export const errorColor = '#e3202d';

// Padding and Margins
export const marginTopDefault = 15;
export const paddingHorizontalDefault = 10;
export const paddingVerticalDefault = 5;
export const heightCellDefault = 50;
export const borderRadiusDefault = 6;

function updatePrimaryColorInfo() {
  const state = store.getState();
  let brandInfo = state.brandInfo.value;

  if (brandInfo && brandInfo.org_color_1) {
    primaryColor = brandInfo.org_color_1;
    primaryColorStyle = StyleSheet.create({
      color: brandInfo.org_color_1,
    });
  }
}
store.subscribe(updatePrimaryColorInfo);
updatePrimaryColorInfo();

export const pageStyle = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  scrollView: {
    // The following needs to be flexGrow rather than flex in order to ensure
    // scrolling will still happen on views that are larger than the screen height
    flexGrow: 1,
    alignItems: 'center',
  },
  containerPreLogin: {
    // Layout
    flexDirection: 'column',
    flexWrap: 'nowrap',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    maxWidth: 600,
    width: '100%',
    margin: 'auto',
    // Content
    paddingTop: 15,
    paddingBottom: 35,
    paddingRight: 35,
    paddingLeft: 35,
    backgroundColor: grayBackgroundcolor,
    // Base Text
    fontSize: 14,
    color: blackColor,
  },
  containerPostLogin: {
    // Layout
    flexDirection: 'column',
    flexWrap: 'nowrap',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    maxWidth: 600,
    width: '100%',
    margin: 'auto',
    // Content
    paddingTop: 15,
    paddingBottom: 30,
    paddingRight: 20,
    paddingLeft: 20,
    backgroundColor: grayBackgroundcolor,
    // Base Text
    fontSize: 14,
    color: blackColor,
  },
});

export const pageItemStyle = StyleSheet.create({
  headerImage: {
    marginTop: 20,
    height: 75,
    width: '100%',
    maxWidth: 250,
    resizeMode: 'contain',
  },
  title: {
    marginTop: 20,
    fontSize: 36,
  },
  description: {
    marginTop: 20,
    fontSize: 14,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFill,
    paddingVertical: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    zIndex: 50,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  containerButton: {
    marginTop: marginTopDefault,
    // Layout
    flexDirection: 'column',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    alignItems: 'stretch',
    width: '100%',
  },
  containerButtons: {
    marginTop: marginTopDefault,
    // Layout
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  inputText: {
    marginTop: 10,
    // Layout
    height: 44,
    width: '100%',
    paddingLeft: 10,
    paddingRight: 10,
    // Background and Border
    backgroundColor: whiteColor,
    borderColor: grayColor,
    borderWidth: 1,
    borderRadius: borderRadiusDefault,
    // Text
    fontSize: 14,
    textAlign: 'left',
  },
});
