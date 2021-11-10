import { StyleSheet } from 'react-native';
import { store } from './store/Store';

// Basic colours
export var blackColor = '#101010';
export var whiteColor = '#ffffff';
export var grayBackgroundcolor = '#eeeeee';
export var grayLightColor = '#dddddd';
export var grayColor = '#bbbbbb';
export var grayDarkColor = '#777777';

// Primary color - branded
export var primaryColor = '#2194f3';
export var primaryColorStyle = StyleSheet.create({});

// Badges colours
export var okColor = '#8BC34A';
export var infoColor = '#2156e8';
export var warnColor = '#fd9927';
export var errorColor = '#e3202d';

function updatePrimaryColorInfo() {
  const state = store.getState();
  let brandInfo = state.brandInfo.value;

  if (brandInfo && brandInfo.primaryColor) {
    primaryColor = brandInfo.primaryColor;
    primaryColorStyle = StyleSheet.create({
      color: brandInfo.primaryColor,
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
  },
  container: {
    // Layout
    flexDirection: 'column',
    flexWrap: 'nowrap',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
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
});

export const pageItemStyle = StyleSheet.create({
  headerImage: {
    marginTop: 20,
    height: 75,
    width: '100%',
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
    marginTop: 20,
    // Layout
    flexDirection: 'column',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    alignItems: 'stretch',
    width: '100%',
  },
  containerButtons: {
    marginTop: 20,
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
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    // Background and Border
    backgroundColor: whiteColor,
    borderColor: grayColor,
    borderWidth: 1,
    borderRadius: 6,
    // Text
    fontSize: 14,
    textAlign: 'left',
  },
});
