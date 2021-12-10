import React, { useCallback, useState, useMemo, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { strings } from '../localization/LocalizationStrings';
import { marginTopDefault, pageStyle, pageItemStyle, whiteColor, paddingHorizontalDefault } from '../AppStyle';
import { StyleSheet, View, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  selectCurrentAccessPointId,
  selectSubscriberInformationLoading,
  selectSubscriberInformation,
  selectAccessPoint,
  selectWifiNetworks,
} from '../store/SubscriberInformationSlice';
import { wifiClientsApi, wiredClientsApi, handleApiError } from '../api/apiHandler';
import {
  scrollViewToTop,
  displayValue,
  displayEditableValue,
  isFieldDifferent,
  getClientIcon,
  getClientConnectionIcon,
  getClientConnectionStatusColor,
  setSubscriberInformationInterval,
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
  // Need to use refs so that the async tasks can have proper access to these state changes
  const scrollRef = useRef();
  const isFocusedRef = useRef(false);
  const startingWifiNetworkIndex = props.route.params ? props.route.params.wifiNetworkIndex : 0;

  const currentAccessPointId = useSelector(selectCurrentAccessPointId);
  const subscriberInformation = useSelector(selectSubscriberInformation);
  const subscriberInformationLoading = useSelector(selectSubscriberInformationLoading);
  const accessPoint = useSelector(selectAccessPoint);
  const wifiNetworks = useSelector(selectWifiNetworks);
  const [selectedWifiNetworkIndex, setSelectedWifiNetworkIndex] = useState(startingWifiNetworkIndex);
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
    if (!wifiClients) {
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

    return wifiClients.filter(client => client.ssid === wifiNetworkToFilter.name);
  }, [wifiClients, selectedWifiNetwork, wifiNetworks]);

  useEffect(() => {
    setSelectedWifiNetwork(wifiNetworks ? wifiNetworks.wifiNetworks[selectedWifiNetworkIndex] : null);
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
      isFocusedRef.current = true;

      return () => {
        isFocusedRef.current = false;
      };
    }, []),
  );

  // Refresh the information only anytime there is a navigation change and this has come into focus
  // Need to be careful here as useFocusEffect is also called during re-render so it can result in
  // infinite loops.
  useFocusEffect(
    useCallback(() => {
      scrollViewToTop(scrollRef);

      async function updateClients() {
        getWifiClients(currentAccessPointId);
        getWiredClients(selectedWifiNetwork);
      }
      var intervalId = setSubscriberInformationInterval(subscriberInformation, updateClients);

      return () => {
        clearInterval(intervalId);
      };
      // Disable the eslint warning, as we want to change only on navigation changes
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.navigation, currentAccessPointId]),
  );

  const getWiredClients = async accessPointIdToQuery => {
    if (!wiredClientsApi) {
      return;
    }

    try {
      if (!accessPointIdToQuery) {
        if (accessPoint) {
          accessPointIdToQuery = accessPoint.id;
        } else {
          // None, just return
          return;
        }
      }

      const response = await wiredClientsApi.getWiredClients(accessPointIdToQuery);
      if (!response || !response.data) {
        throw new Error(strings.errors.invalidResponse);
      }

      // Clear this flag on success
      wiredClientsErrorReportedRef.current = false;

      if (isFieldDifferent(wiredClients, response.data, 'modified')) {
        console.log(response.data);
        setWiredClients(response.data);
      }
    } catch (error) {
      if (isFocusedRef.current && !wiredClientsErrorReportedRef.current) {
        wiredClientsErrorReportedRef.current = true;
        handleApiError(strings.errors.titleNetwork, error);
      }
    } finally {
      if (isFocusedRef.current) {
        setLoadingWiredClients(false);
      }
    }
  };

  const getWifiClients = async accessPointIdToQuery => {
    if (!wifiClientsApi) {
      return;
    }

    try {
      if (!accessPointIdToQuery) {
        if (accessPoint) {
          accessPointIdToQuery = accessPoint.id;
        } else {
          // None, just return
          return;
        }
      }

      const response = await wifiClientsApi.getWifiClients(accessPointIdToQuery);
      if (!response || !response.data) {
        throw new Error(strings.errors.invalidResponse);
      }

      // Clear this flag on success
      wifiClientsErrorReportedRef.current = false;

      if (isFieldDifferent(wifiClients, response.data, 'modified')) {
        console.log(response.data);
        setWifiClients(response.data);
      }
    } catch (error) {
      if (isFocusedRef.current && !wifiClientsErrorReportedRef.current) {
        wifiClientsErrorReportedRef.current = true;
        handleApiError(strings.errors.titleNetwork, error);
      }
    } finally {
      if (isFocusedRef.current) {
        setLoadingWifiClients(false);
      }
    }
  };

  const getClientName = client => {
    return displayValue(client, 'name');
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

  const onClientPress = async client => {
    props.navigation.navigate('DeviceDetails', { accessPoint: accessPoint, client: client });
  };

  const onSelectNetwork = index => {
    setSelectedWifiNetworkIndex(index);
  };

  const onEditNetworkSettings = async val => {
    try {
      await modifyNetworkSettings(subscriberInformation, currentAccessPointId, selectedWifiNetworkIndex, val);
    } catch (error) {
      handleApiError(strings.errors.titleUpdate, error);
      // Need to throw the error to ensure the caller cleans up
      throw error;
    }
  };

  const onDeleteNetworkPress = async => {
    Alert.alert(strings.network.confirmTitle, strings.network.confirmDeleteNetwork, [
      {
        text: strings.buttons.ok,
        onPress: async () => {
          deleteNetwork(subscriberInformation, currentAccessPointId, selectedWifiNetworkIndex);
        },
      },
      {
        text: strings.buttons.cancel,
      },
    ]);
  };

  const onAddNetworkPress = async => {
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
              items={[
                { label: strings.network.selectorTypeMain, value: 'main' },
                { label: strings.network.selectorTypeGuest, value: 'guest' },
              ]}
              changeKey="type"
              onChangeValue={onEditNetworkSettings}
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
                { label: strings.network.selectorEncryptionWep, value: 'wep' },
              ]}
              changeKey="encryption"
              onChangeValue={onEditNetworkSettings}
            />
            <ItemPickerWithLabel
              key="bands"
              label={strings.network.bands}
              value={wifiNetworkBands}
              setValue={setWifiNetworkBands}
              multiple={true}
              items={[
                { label: strings.network.selectorBands2g, value: '2G' },
                { label: strings.network.selectorBands5g, value: '5G' },
                { label: strings.network.selectorBands5gl, value: '5GL' },
                { label: strings.network.selectorBands5gu, value: '5GU' },
                { label: strings.network.selectorBands6g, value: '6G' },
              ]}
              changeKey="bands"
              onChangeValue={onEditNetworkSettings}
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
