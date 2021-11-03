import { StyleSheet } from 'react-native';
import { store } from './store/Store';

export var whiteColor = '#ffffff';

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
  container: {
    // Layout
    flexDirection: 'column',
    flexWrap: 'nowrap',
    flex: 1,
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    alignItems: 'center',
    // Content
    padding: 34,
    backgroundColor: '#eeeeee',
    // Base Text
    fontSize: 14,
    fontWeight: 'bold',
    color: '#101010',
  },
});

export const pageItemStyle = StyleSheet.create({
  loadingContainer: {
    ...StyleSheet.absoluteFill,
    paddingVertical: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    zIndex: 50,
  },
  headerImage: {
    height: 75,
    width: '100%',
    resizeMode: 'contain',
    marginBottom: 10,
  },
  title: {
    fontSize: 36,
    marginBottom: 14,
  },
  description: {
    fontSize: 14,
    marginBottom: 10,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 10,
    paddingBottom: 10,
  },
  containerButton: {
    height: 40,
    width: '100%',
    marginBottom: 10,
  },
  inputText: {
    // Layout
    height: 40,
    width: '100%',
    marginBottom: 10,
    paddingLeft: 8,
    paddingRight: 8,
    // Background and Border
    backgroundColor: '#ffffff',
    borderColor: '#bbbbbb',
    borderWidth: 1,
    // Text
    textAlign: 'left',
  },
  buttonText: {
    textAlign: 'center',
  },
});
