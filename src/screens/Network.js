import React, { useCallback, useState, useMemo, useRef, useEffect } from 'react';
import { strings } from '../localization/LocalizationStrings';
import { marginTopDefault, pageStyle, pageItemStyle, whiteColor, paddingHorizontalDefault } from '../AppStyle';
import { StyleSheet, View, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import {
  selectCurrentAccessPointId,
  selectSubscriberInformationLoading,
  selectAccessPoint,
  selectWifiNetworks,
} from '../store/SubscriberInformationSlice';
import { wifiClientsApi, wiredClientsApi, handleApiError } from '../api/apiHandler';
import {
  scrollViewToTop,
  displayValue,
  displayEditableValue,
  isFieldDifferent,
  isArrayDifferent,
  getClientIcon,
  getClientConnectionIcon,
  getClientConnectionStatusColor,
  getGuestNetworkIndex,
  setSubscriberInformationInterval,
  getNetworkBandsSelectorItems,
  modifyNetworkSettings,
  deleteNetwork,
} from '../Utils';
import AccordionSection from '../components/AccordionSection';
import ButtonStyled from '../components/ButtonStyled';
import ItemTextWithIcon from '../components/ItemTextWithIcon';
import ButtonSelector from '../components/ButtonSelector';
import ItemTextWithLabelEditable from '../components/ItemTextWithLabelEditable';
import ItemPickerWithLabel from '../components/ItemPickerWithLabel';

const Network = props => {
  // The sectionZIndex is used to help with any embedded picker/dropdown. Start with a high enough
  // value that it'll cover each section. The sections further up the view should have higher numbers
  var sectionZIndex = 20;
  var pickerZIndex = 20;
  // Route params
  const startingWifiNetworkIndex = props.route.params ? props.route.params.wifiNetworkIndex : 0;
  // Need to use refs so that the async tasks can have proper access to these state changes
  const scrollRef = useRef();
  const isMounted = useRef(false);
  // Selectors
  const currentAccessPointId = useSelector(selectCurrentAccessPointId);
  const subscriberInformationLoading = useSelector(selectSubscriberInformationLoading);
  const accessPoint = useSelector(selectAccessPoint);
  const wifiNetworks = useSelector(selectWifiNetworks);
  // State
  const [selectedWifiNetworkIndex, setSelectedWifiNetworkIndex] = useState(
    wifiNetworks && wifiNetworks.wifiNetworks.length > startingWifiNetworkIndex ? startingWifiNetworkIndex : 0,
  );
  const [selectedWifiNetwork, setSelectedWifiNetwork] = useState(
    wifiNetworks ? wifiNetworks.wifiNetworks[selectedWifiNetworkIndex] : null,
  );
  const [wifiNetworkType, setWifiNetworkType] = useState(selectedWifiNetwork ? selectedWifiNetwork.type : null);
  const [wifiNetworkEncryption, setWifiNetworkEncryption] = useState(
    selectedWifiNetwork ? selectedWifiNetwork.encryption : null,
  );
  const [wifiNetworkBands, setWifiNetworkBands] = useState(selectedWifiNetwork ? selectedWifiNetwork.bands : null);
  const [loadingWiredClients, setLoadingWiredClients] = useState(true); // Only set on initial load
  const [wiredClients, setWiredClients] = useState();
  const wiredClientsErrorReportedRef = useRef(false);
  const [loadingWifiClients, setLoadingWifiClients] = useState(true); // Only set on initial load
  const [wifiClients, setWifiClients] = useState();
  const wifiClientsErrorReportedRef = useRef(false);

  const filteredWifiClients = useMemo(() => {
    if (!wifiClients || !wifiClients.associations) {
      return null;
    }

    let wifiNetworkToFilter = selectedWifiNetwork;
    if (!wifiNetworkToFilter) {
      if (wifiNetworks && wifiNetworks.wifiNetworks) {
        wifiNetworkToFilter = wifiNetworks.wifiNetworks[0];
      }
    }

    if (!wifiNetworkToFilter) {
      return null;
    }

    return wifiClients.associations.filter(client => client.ssid === wifiNetworkToFilter.name);
  }, [wifiClients, selectedWifiNetwork, wifiNetworks]);

  // Keep track of whether the screen is mounted or not so async tasks know to access state or not.
  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    let networks = wifiNetworks && wifiNetworks.wifiNetworks ? wifiNetworks.wifiNetworks : [];

    if (selectedWifiNetworkIndex === null) {
      setSelectedWifiNetwork(null);
    } else if (selectedWifiNetworkIndex >= networks.length) {
      setSelectedWifiNetworkIndex(networks.length - 1 >= 0 ? networks.length - 1 : null);
    } else {
      setSelectedWifiNetwork(networks[selectedWifiNetworkIndex]);
    }
  }, [wifiNetworks, selectedWifiNetworkIndex]);

  useEffect(() => {
    setWifiNetworkType(selectedWifiNetwork ? selectedWifiNetwork.type : null);
    setWifiNetworkEncryption(selectedWifiNetwork ? selectedWifiNetwork.encryption : null);
    setWifiNetworkBands(selectedWifiNetwork ? selectedWifiNetwork.bands : null);
  }, [selectedWifiNetwork]);

  // Refresh the information only anytime there is a navigation change and this has come into focus
  // Need to be careful here as useFocusEffect is also called during re-render so it can result in
  // infinite loops.
  useFocusEffect(
    useCallback(() => {
      scrollViewToTop(scrollRef);

      var intervalId = setSubscriberInformationInterval(async function () {
        // Extra handler, runs at the same time to upate the clients if there is an access point
        if (accessPoint) {
          // Handle both client updates simulatenously
          Promise.all([getWiredClients(accessPoint.macAddress), getWifiClients(accessPoint.macAddress)]);
        }
      });

      return () => {
        clearInterval(intervalId);
      };

      // Disable the eslint warning, as we want to change only on navigation changes
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.navigation, accessPoint]),
  );

  const getWiredClients = async macAddressToQuery => {
    try {
      if (!wiredClientsApi || !macAddressToQuery) {
        if (isMounted.current) {
          setLoadingWiredClients(false);
        }

        // None, just return
        return;
      }

      const response = await wiredClientsApi.getWiredClients(macAddressToQuery);
      if (!response || !response.data) {
        throw new Error(strings.errors.invalidResponse);
      }

      console.log(response.data);

      if (isMounted.current) {
        // Clear this flag on success
        wiredClientsErrorReportedRef.current = false;

        if (isFieldDifferent(wiredClients, response.data, 'modified')) {
          setWiredClients(response.data);
        }
      }
    } catch (error) {
      if (isMounted.current && !wiredClientsErrorReportedRef.current) {
        wiredClientsErrorReportedRef.current = true;
        handleApiError(strings.errors.titleNetwork, error);
      }
    } finally {
      if (isMounted.current) {
        setLoadingWiredClients(false);
      }
    }
  };

  const getWifiClients = async macAddressToQuery => {
    try {
      if (!wifiClientsApi || !macAddressToQuery) {
        if (isMounted.current) {
          setLoadingWiredClients(false);
        }

        // None, just return
        return;
      }

      const response = await wifiClientsApi.getWifiClients(macAddressToQuery);
      if (!response || !response.data) {
        throw new Error(strings.errors.invalidResponse);
      }

      console.log(response.data);

      // Clear this flag on success
      if (isMounted.current) {
        wifiClientsErrorReportedRef.current = false;

        if (isFieldDifferent(wifiClients, response.data, 'modified')) {
          setWifiClients(response.data);
        }
      }
    } catch (error) {
      if (isMounted.current && !wifiClientsErrorReportedRef.current) {
        wifiClientsErrorReportedRef.current = true;
        handleApiError(strings.errors.titleNetwork, error);
      }
    } finally {
      if (isMounted.current) {
        setLoadingWifiClients(false);
      }
    }
  };

  const getClientName = client => {
    return displayValue(client, 'macAddress');
  };

  const getClientMainIcon = client => {
    return getClientIcon(client);
  };

  const getClientBadgeIcon = client => {
    return getClientConnectionIcon(client);
  };

  const getClientBadgeIconTint = client => {
    return getClientConnectionStatusColor(client);
  };

  const onClientPress = client => {
    props.navigation.navigate('DeviceDetails', { accessPoint: accessPoint, client: client });
  };

  const onSelectNetwork = index => {
    setSelectedWifiNetworkIndex(index);
  };

  const isGuestNetworkAvailable = () => {
    // Only one guest network is supported, so if there is already one then
    // disabled the picker. Note if it is the current one that it should still
    // be able to switch it off
    let guesNetworkIndex = getGuestNetworkIndex(wifiNetworks);
    if (guesNetworkIndex !== null && guesNetworkIndex !== selectedWifiNetworkIndex) {
      return false;
    } else {
      return true;
    }
  };

  const onEditNetworkSettings = async val => {
    try {
      if (!selectedWifiNetwork) {
        return;
      }

      // Because this is keyed into pickers, it may get called when we change networks, so need to make sure
      // that things are actually different before trying to update it
      let changed = false;
      for (let [key, value] of Object.entries(val)) {
        let currentValue = selectedWifiNetwork[key];

        if (Array.isArray(currentValue)) {
          changed = isArrayDifferent(currentValue, value);
        } else if (currentValue !== value) {
          changed = true;
        }
      }

      // Nothing really changed, just return
      if (!changed) {
        return;
      }

      await modifyNetworkSettings(currentAccessPointId, selectedWifiNetworkIndex, val);
    } catch (error) {
      handleApiError(strings.errors.titleUpdate, error);
      // Need to throw the error to ensure the caller cleans up
      throw error;
    }
  };

  const onDeleteNetworkPress = () => {
    Alert.alert(strings.network.confirmTitle, strings.network.confirmDeleteNetwork, [
      {
        text: strings.buttons.ok,
        onPress: async () => {
          try {
            await deleteNetwork(currentAccessPointId, selectedWifiNetworkIndex);
          } catch (error) {
            handleApiError(strings.errors.titleNetwork, error);
          }
        },
      },
      {
        text: strings.buttons.cancel,
      },
    ]);
  };

  const onAddNetworkPress = () => {
    props.navigation.navigate('NetworkAdd');
  };

  // Styles
  const componentStyles = StyleSheet.create({
    sectionAccordion: {
      marginTop: marginTopDefault,
    },
    networkSwitcher: {
      marginTop: marginTopDefault,
      height: 30,
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
            style={componentStyles.sectionAccordion}
            title={strings.network.wiredClients}
            isLoading={subscriberInformationLoading || loadingWiredClients}>
            {wiredClients &&
              wiredClients.clients &&
              wiredClients.clients.map(item => {
                return (
                  <ItemTextWithIcon
                    label={getClientName(item)}
                    key={item.macAddress}
                    icon={getClientMainIcon(item)}
                    badgeSource={getClientBadgeIcon(item)}
                    badgeTintColor={whiteColor}
                    badgeBackgroundColor={getClientBadgeIconTint(item)}
                    onPress={() => onClientPress(item)}
                  />
                );
              })}
          </AccordionSection>

          <ButtonSelector
            style={componentStyles.networkSwitcher}
            options={wifiNetworks ? wifiNetworks.wifiNetworks : []}
            selected={selectedWifiNetworkIndex}
            maxButtons={2}
            onSelect={onSelectNetwork}
          />

          <AccordionSection
            style={StyleSheet.flatten([componentStyles.sectionAccordion, { zIndex: sectionZIndex-- }])}
            title={strings.network.settings}
            disableAccordion={true}
            isLoading={false}>
            <ItemPickerWithLabel
              key="type"
              label={strings.network.type}
              value={wifiNetworkType}
              setValue={setWifiNetworkType}
              disabled={!isGuestNetworkAvailable()}
              items={[
                { label: strings.network.selectorTypeMain, value: 'main' },
                { label: strings.network.selectorTypeGuest, value: 'guest' },
              ]}
              changeKey="type"
              onChangeValue={onEditNetworkSettings}
              zIndex={pickerZIndex--}
            />
            <ItemTextWithLabelEditable
              key="name"
              label={strings.network.name}
              value={displayEditableValue(selectedWifiNetwork, 'name')}
              placeholder={strings.messages.empty}
              editKey="name"
              onEdit={onEditNetworkSettings}
            />
            <ItemTextWithLabelEditable
              key="password"
              label={strings.network.password}
              value={displayEditableValue(selectedWifiNetwork, 'password')}
              placeholder={strings.messages.empty}
              type="password"
              editKey="password"
              onEdit={onEditNetworkSettings}
            />
            <ItemPickerWithLabel
              key="encryption"
              label={strings.network.encryption}
              value={wifiNetworkEncryption}
              setValue={setWifiNetworkEncryption}
              items={[
                { label: strings.network.selectorEncryptionWpa2, value: 'wpa2' },
                { label: strings.network.selectorEncryptionWpa, value: 'wpa' },
                { label: strings.network.selectorEncryptionWpaMixed, value: 'wpa-mixed' },
                { label: strings.network.selectorEncryptionPsk, value: 'psk' },
                { label: strings.network.selectorEncryptionPsk2, value: 'psk2' },
              ]}
              changeKey="encryption"
              onChangeValue={onEditNetworkSettings}
              zIndex={pickerZIndex--}
            />
            <ItemPickerWithLabel
              key="bands"
              label={strings.network.bands}
              value={wifiNetworkBands}
              setValue={setWifiNetworkBands}
              multiple={true}
              items={getNetworkBandsSelectorItems(null)}
              changeKey="bands"
              onChangeValue={onEditNetworkSettings}
              zIndex={pickerZIndex--}
            />
          </AccordionSection>

          <AccordionSection
            style={componentStyles.sectionAccordion}
            title={strings.network.wifiClients}
            isLoading={subscriberInformationLoading || loadingWifiClients}>
            {filteredWifiClients &&
              filteredWifiClients.map(item => {
                return (
                  <ItemTextWithIcon
                    label={getClientName(item)}
                    key={item.macAddress}
                    icon={getClientMainIcon(item)}
                    badgeSource={getClientBadgeIcon(item)}
                    badgeTintColor={whiteColor}
                    badgeBackgroundColor={getClientBadgeIconTint(item)}
                    onPress={() => onClientPress(item)}
                  />
                );
              })}
          </AccordionSection>

          <View style={pageItemStyle.containerButtons}>
            <ButtonStyled
              style={componentStyles.buttonLeft}
              title={strings.buttons.deleteNetwork}
              type="outline"
              onPress={onDeleteNetworkPress}
            />
            <ButtonStyled
              style={componentStyles.buttonRight}
              title={strings.buttons.addNetwork}
              type="filled"
              onPress={onAddNetworkPress}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Network;
