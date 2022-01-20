import React, { useState, useRef, useEffect } from 'react';
import { strings } from '../localization/LocalizationStrings';
import { marginTopDefault, pageStyle, pageItemStyle, paddingHorizontalDefault } from '../AppStyle';
import { StyleSheet, View, ScrollView, SafeAreaView } from 'react-native';
import { useSelector } from 'react-redux';
import { selectCurrentAccessPointId, selectWifiNetworks } from '../store/SubscriberInformationSlice';
import { handleApiError, WifiNetworkEncryptionEnum, WifiNetworkTypeEnum } from '../api/apiHandler';
import { getGuestNetworkIndex, getNetworkBandsSelectorItems, addNetwork } from '../Utils';
import AccordionSection from '../components/AccordionSection';
import ButtonStyled from '../components/ButtonStyled';
import ItemTextWithLabelEditable from '../components/ItemTextWithLabelEditable';
import ItemPickerWithLabel from '../components/ItemPickerWithLabel';

const NetworkAdd = props => {
  // The sectionZIndex is used to help with any embedded picker/dropdown. Start with a high enough
  // value that it'll cover each section. The sections further up the view should have higher numbers
  var sectionZIndex = 20;
  var pickerZIndex = 20;
  // Need to use refs so that the async tasks can have proper access to these state changes
  const scrollRef = useRef();
  const isMounted = useRef(false);
  // Selectors
  const currentAccessPointId = useSelector(selectCurrentAccessPointId);
  const wifiNetworks = useSelector(selectWifiNetworks);
  // States
  const [loading, setLoading] = useState(false);
  const [wifiNetworkType, setWifiNetworkType] = useState('main');
  const [wifiNetworkName, setWifiNetworkName] = useState();
  const [wifiNetworkPassword, setWifiNetworkPassword] = useState();
  const [wifiNetworkEncryption, setWifiNetworkEncryption] = useState('wpa2');
  const [wifiNetworkBands, setWifiNetworkBands] = useState([]);

  // Keep track of whether the screen is mounted or not so async tasks know to access state or not.
  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  const hasGuestNetwork = () => {
    // Check to see if it has a guest network
    return getGuestNetworkIndex(wifiNetworks) !== null;
  };

  const onCancelPress = () => {
    props.navigation.goBack();
  };

  const onSubmitPress = async () => {
    try {
      let networkJsonObject = {
        type: wifiNetworkType,
        name: wifiNetworkName,
        password: wifiNetworkPassword,
        encryption: wifiNetworkEncryption,
        bands: wifiNetworkBands,
      };

      setLoading(true);

      await addNetwork(currentAccessPointId, networkJsonObject);

      if (isMounted.current) {
        setLoading(false);

        // On success just go back
        props.navigation.goBack();
      }
    } catch (error) {
      if (isMounted.current) {
        setLoading(false);
      }

      handleApiError(strings.errors.titleNetworkModify, error);
    }
  };

  // Styles
  const componentStyles = StyleSheet.create({
    sectionAccordion: {
      marginTop: marginTopDefault,
    },
    buttonLeft: {
      marginRight: paddingHorizontalDefault / 2,
      flex: 1,
    },
    buttonRight: {
      marginLeft: paddingHorizontalDefault / 2,
      flex: 1,
    },
  });

  return (
    <SafeAreaView style={pageStyle.safeAreaView}>
      <ScrollView ref={scrollRef} contentContainerStyle={pageStyle.scrollView}>
        <View style={pageStyle.containerPostLogin}>
          <AccordionSection
            style={StyleSheet.flatten([componentStyles.sectionAccordion, { zIndex: sectionZIndex-- }])}
            title={strings.network.settings}
            disableAccordion={true}
            isLoading={loading}>
            <ItemPickerWithLabel
              key="type"
              label={strings.network.type}
              value={wifiNetworkType}
              setValue={setWifiNetworkType}
              disabled={hasGuestNetwork()}
              disabledReason={strings.messages.guestNetworkExists}
              items={[
                { label: strings.network.selectorTypeMain, value: WifiNetworkTypeEnum.Main },
                { label: strings.network.selectorTypeGuest, value: WifiNetworkTypeEnum.Guest },
              ]}
              zIndex={pickerZIndex--}
            />
            <ItemTextWithLabelEditable
              key="name"
              label={strings.network.nameSsid}
              value={wifiNetworkName}
              placeholder={strings.messages.empty}
              onEdit={setWifiNetworkName}
            />
            <ItemTextWithLabelEditable
              key="password"
              label={strings.common.password}
              value={wifiNetworkPassword}
              placeholder={strings.messages.empty}
              type="password"
              onEdit={setWifiNetworkPassword}
            />
            <ItemPickerWithLabel
              key="encryption"
              label={strings.network.encryption}
              value={wifiNetworkEncryption}
              setValue={setWifiNetworkEncryption}
              items={[
                {
                  label: strings.network.selectorEncryptionWpa1Personal,
                  value: WifiNetworkEncryptionEnum.Wpa1Personal,
                },
                {
                  label: strings.network.selectorEncryptionWpa2Personal,
                  value: WifiNetworkEncryptionEnum.Wpa2Personal,
                },
                {
                  label: strings.network.selectorEncryptionWpa3Personal,
                  value: WifiNetworkEncryptionEnum.Wpa3Personal,
                },
                {
                  label: strings.network.selectorEncryptionWpa12Personal,
                  value: WifiNetworkEncryptionEnum.Wpa12Personal,
                },
                {
                  label: strings.network.selectorEncryptionWpa23Personal,
                  value: WifiNetworkEncryptionEnum.Wpa23Personal,
                },
              ]}
              zIndex={pickerZIndex--}
            />
            <ItemPickerWithLabel
              key="bands"
              label={strings.network.bands}
              value={wifiNetworkBands}
              setValue={setWifiNetworkBands}
              multiple={true}
              items={getNetworkBandsSelectorItems(null)}
              zIndex={pickerZIndex--}
            />
          </AccordionSection>

          <View style={pageItemStyle.containerButtons}>
            <ButtonStyled
              style={componentStyles.buttonLeft}
              title={strings.buttons.cancel}
              type="outline"
              onPress={onCancelPress}
            />
            <ButtonStyled
              style={componentStyles.buttonRight}
              title={strings.buttons.add}
              type="filled"
              onPress={onSubmitPress}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NetworkAdd;
