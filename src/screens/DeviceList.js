import React, { useCallback, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { strings } from '../localization/LocalizationStrings';
import { marginTopDefault, pageStyle, whiteColor } from '../AppStyle';
import { StyleSheet, View, ScrollView, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { selectCurrentAccessPointId } from '../store/CurrentAccessPointIdSlice';
import { selectSubscriberInformation } from '../store/SubscriberInformationSlice';
import { selectSubscriberInformationLoading } from '../store/SubscriberInformationLoadingSlice';
import { wifiClientsApi, wiredClientsApi, getSubscriberAccessPointInfo, handleApiError } from '../api/apiHandler';
import {
  showGeneralError,
  displayValue,
  getClientIcon,
  getClientConnectionIcon,
  getClientConnectionStatusColor,
} from '../Utils';
import AccordionSection from '../components/AccordionSection';
import ItemTextWithIcon from '../components/ItemTextWithIcon';
import ButtonSelector from '../components/ButtonSelector';

const DeviceList = props => {
  const selectedNetworkName = props.route.params ? props.route.params.networkName : null;
  const currentAccessPointId = useSelector(selectCurrentAccessPointId);
  const subscriberInformation = useSelector(selectSubscriberInformation);
  const subscriberInformationLoading = useSelector(selectSubscriberInformationLoading);
  const accessPoint = useMemo(
    () => getSubscriberAccessPointInfo(subscriberInformation, currentAccessPointId, null),
    [subscriberInformation, currentAccessPointId],
  );
  const wifiNetworks = useMemo(
    () => getSubscriberAccessPointInfo(subscriberInformation, currentAccessPointId, 'wifiNetworks'),
    [subscriberInformation, currentAccessPointId],
  );
  const [selectedWifi, setSelectedWifi] = useState();
  const [loadingWiredClients, setLoadingWiredClients] = useState(false);
  const [wiredClients, setWiredClients] = useState([{ name: 'Mac Book Pro', macAddress: '43:e1:55:23:59:12' }]);
  const [loadingWifiClients, setLoadingWifiClients] = useState(false);
  const [wifiClients, setWifiClients] = useState([
    { name: 'Lenovo Legion 5', macAddress: '11:ed:20:12:52:ee', ssid: 'Main Network' },
    { name: 'Tablet Main', macAddress: 'string', ssid: 'Main Network' },
    { name: 'Phone Guest', macAddress: 'string', ssid: 'Guest Network' },
  ]);
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

    let f = wifiClients.filter(client => client.ssid === wifiNetworkToFilter.name);
    console.log(f);
    return f;
  }, [wifiClients, selectedWifi, wifiNetworks]);

  // Refresh the information only anytime there is a navigation change and this has come into focus
  // Need to be careful here as useFocusEffect is also called during re-render so it can result in
  // infinite loops.
  useFocusEffect(
    useCallback(() => {
      getWifiClients(currentAccessPointId);
      getWiredClients(currentAccessPointId);

      // Return function of what should be done on 'focus out'
      return () => {};
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
        accessPointIdToQuery = accessPoint.id;
      }

      if (!wiredClients) {
        // Only set the loading flag is there is currently no information. If there is already
        // information consider this a refresh so no need to show the user.
        setLoadingWiredClients(true);
      }

      const response = await wiredClientsApi.getWiredClients(accessPointIdToQuery);
      if (!response || !response.data) {
        console.log(response);
        console.error('Invalid response from getWiredClients');
        showGeneralError(strings.errors.titleDeviceList, strings.errors.invalidResponse);
        return;
      }

      console.log(response.data);
      setWiredClients(response.data);
    } catch (error) {
      handleApiError(strings.errors.titleDeviceList, error);
    } finally {
      setLoadingWiredClients(false);
    }
  };

  const getWifiClients = async accessPointIdToQuery => {
    if (!wifiClientsApi) {
      return;
    }

    try {
      if (!accessPointIdToQuery) {
        accessPointIdToQuery = accessPoint.id;
      }

      if (!wifiClients) {
        // Only set the loading flag is there is currently no information. If there is already
        // information consider this a refresh so no need to show the user.
        setLoadingWifiClients(true);
      }

      const response = await wifiClientsApi.getWifiClients(accessPointIdToQuery);
      if (!response || !response.data) {
        console.log(response);
        console.error('Invalid response from getWifiClients');
        showGeneralError(strings.errors.titleDeviceList, strings.errors.invalidResponse);
        return;
      }

      console.log(response.data);
      setWifiClients(response.data);
    } catch (error) {
      handleApiError(strings.errors.titleDeviceList, error);
    } finally {
      setLoadingWifiClients(false);
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
    console.log('onSelectNetwork', network);
    // Update wifi clients
    // getWifiClients(accessPoint);
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
      <ScrollView contentContainerStyle={pageStyle.scrollView}>
        <View style={pageStyle.container}>
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
            options={wifiNetworks.wifiNetworks}
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

export default DeviceList;
