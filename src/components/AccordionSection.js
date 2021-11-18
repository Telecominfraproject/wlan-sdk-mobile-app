import React, { useState } from 'react';
import { strings } from '../localization/LocalizationStrings';
import { paddingHorizontalDefault, borderRadiusDefault, primaryColor, whiteColor, grayColor } from '../AppStyle';
import { StyleSheet, TouchableOpacity, View, Text, Image, ActivityIndicator } from 'react-native';

const AccordionSection = props => {
  const [showChildren, setShowChildren] = useState(true);

  const getTitle = () => {
    return props.title;
  };

  const hasAccordion = () => {
    return props.disableAccordion ? false : true;
  };

  const getChildrenCount = () => {
    return React.Children.count(props.children);
  };

  const getCaretIcon = () => {
    return showChildren ? require('../assets/angle-down-solid.png') : require('../assets/angle-right-solid.png');
  };

  const onHeaderPress = async () => {
    showChildren ? setShowChildren(false) : setShowChildren(true);
  };

  const childrenWithSeparators = () => {
    if (!props.children) {
      return props.children;
    }

    let children = props.children;
    if (!Array.isArray(children)) {
      // If there is a single element, it won't be an array, so convert to simplify the handling
      children = [children];
    }

    // The children can have arrays of arrays - flatten this to ensure there is a single list
    let childrenFlattened = children.flat();
    if (childrenFlattened.length <= 1) {
      return childrenFlattened;
    }

    return childrenFlattened.map((child, index) => {
      return [child, index !== childrenFlattened.length - 1 && <View style={componentStyles.separator} />];
    });
  };

  const componentStyles = StyleSheet.create({
    container: {
      // Include all margins from the passed in style, if it exists
      margin: props.style ? props.style.margin : 0,
      marginBottom: props.style ? props.style.marginBottom : 0,
      marginTop: props.style ? props.style.marginTop : 0,
      marginLeft: props.style ? props.style.marginLeft : 0,
      marginRight: props.style ? props.style.marginRight : 0,

      width: '100%',
    },
    touchableContainer: {
      width: '100%',
    },
    headerContainer: {
      flexDirection: 'row',
      flexWrap: 'nowrap',
      flex: 0,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: paddingHorizontalDefault,
      height: 44,
      // Visual
      backgroundColor: primaryColor,
      borderTopLeftRadius: borderRadiusDefault,
      borderTopRightRadius: borderRadiusDefault,
    },
    headerEndContainer: {
      flexDirection: 'row',
      flexWrap: 'nowrap',
      flex: 0,
      alignItems: 'center',
    },
    headerText: {
      fontSize: 12,
      textTransform: 'uppercase',
      color: whiteColor,
    },
    headerCaret: {
      height: 16,
      width: 16,
      resizeMode: 'contain',
      tintColor: whiteColor,
    },
    itemsContainer: {
      flexDirection: 'column',
      flexWrap: 'nowrap',
      justifyContent: 'flex-start',
      width: '100%',
      // Visual
      backgroundColor: whiteColor,
      borderBottomLeftRadius: borderRadiusDefault,
      borderBottomRightRadius: borderRadiusDefault,
    },
    separator: {
      backgroundColor: grayColor,
      height: 1,
      marginHorizontal: paddingHorizontalDefault,
    },
    noneContainer: {
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: 30,
    },
  });

  return (
    <View style={componentStyles.container}>
      <TouchableOpacity style={componentStyles.touchableContainer} onPress={onHeaderPress} disabled={!hasAccordion()}>
        <View style={componentStyles.headerContainer}>
          <Text style={componentStyles.headerText}>{getTitle()}</Text>
          {hasAccordion() ? (
            <View style={componentStyles.headerEndContainer}>
              <Text style={componentStyles.headerText}>{getChildrenCount()}</Text>
              <Image style={componentStyles.headerCaret} source={getCaretIcon()} />
            </View>
          ) : (
            <View />
          )}
        </View>
      </TouchableOpacity>
      {props.isLoading ? (
        <View style={componentStyles.itemsContainer}>
          <ActivityIndicator size="large" color={primaryColor} animating={props.isLoading} />
        </View>
      ) : showChildren ? (
        <View style={componentStyles.itemsContainer}>
          {getChildrenCount() > 0 ? (
            childrenWithSeparators()
          ) : (
            <View style={componentStyles.noneContainer}>
              <Text>{strings.accordionSection.none}</Text>
            </View>
          )}
        </View>
      ) : (
        <View />
      )}
    </View>
  );
};

export default AccordionSection;
