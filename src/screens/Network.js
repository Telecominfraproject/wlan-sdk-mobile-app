import React, { useCallback, useState, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { strings } from '../localization/LocalizationStrings';
import { marginTopDefault, pageStyle, whiteColor } from '../AppStyle';
import { StyleSheet, View, ScrollView, SafeAreaView } from 'react-native';
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
  displayValue,
  getClientIcon,
  getClientConnectionIcon,
  getClientConnectionStatusColor,
  setSubscriberInformationInterval,
  isFieldDifferent,
  scrollViewToTop,
} from '../Utils';
import AccordionSection from '../components/AccordionSection';
import ItemTextWithIcon from '../components/ItemTextWithIcon';
import ButtonSelector from '../components/ButtonSelector';

const Network = props => {
  // Need to use refs so that the async tasks can have proper access to these state changes
  const scrollRef = useRef();
  const isFocusedRef = useRef(false);
  const selectedNetworkName = props.route.params ? props.route.params.networkName : null;
  const currentAccessPointId = useSelector(selectCurrentAccessPointId);
  const subscriberInformation = useSelector(selectSubscriberInformation);
  const subscriberInformationLoading = useSelector(selectSubscriberInformationLoading);
  const accessPoint = useSelector(selectAccessPoint);
  const wifiNetworks = useSelector(selectWifiNetworks);
  const [selectedWifi, setSelectedWifi] = useState(selectedNetworkName);
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

    let wifiNetworkToFilter = selectedWifi;
    if (!wifiNetworkToFilter) {
      if (wifiNetworks && wifiNetworks.wifiNetworks) {
        wifiNetworkToFilter = wifiNetworks.wifiNetworks[0];
      }
    }

    if (!wifiNetworkToFilter) {
      return null;
    }

    return wifiClients.filter(client => client.ssid === wifiNetworkToFilter.name);
  }, [wifiClients, selectedWifi, wifiNetworks]);

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
        getWiredClients(currentAccessPointId);
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

  const onSelectNetwork = network => {
    setSelectedWifi(network);
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
  });

  return (
    <SafeAreaView style={pageStyle.safeAreaView}>
      <ScrollView ref={scrollRef} contentContainerStyle={pageStyle.scrollView}>
        <View style={pageStyle.containerPostLogin}>
          <AccordionSection
            style={componentStyles.sectionAccordion}
            title={strings.deviceList.wiredClients}
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
            style={componentStyles.sectionAccordion}
            title={strings.deviceList.wifiClients}
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Network;
