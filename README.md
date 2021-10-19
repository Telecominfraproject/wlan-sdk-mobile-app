# ow-self-care

## Project access
You can access the current stack as follows:
- GatewayUI (more technician side): https://14oranges-ui.arilia.com
- Provisioning UI: https://10oranges-prov.arilia.com

The default username for now is: tip@ucentral.com password is 'openwifi'

## The system
There are 2 applications: gateway UI and Provisioning. Most of the work will be done in the provisioning. All the API use the OpenAPI standard definition. The 
system works with 4 microservices working together to provide the functionality. The services can be reached over individual ports. 

## APIs
- [Security project](https://github.com/Telecominfraproject/wlan-cloud-ucentralsec)
- [Security API](https://github.com/Telecominfraproject/wlan-cloud-ucentralsec/blob/main/openpapi/ucentralsec/owsec.yaml)

- [Firmware project](https://github.com/Telecominfraproject/wlan-cloud-ucentralfms)
- [Firmware API](https://github.com/Telecominfraproject/wlan-cloud-ucentralfms/blob/main/openapi/owfms.yaml)

- [gateway project](https://github.com/Telecominfraproject/wlan-cloud-ucentralgw)
- [gateway API](https://github.com/Telecominfraproject/wlan-cloud-ucentralgw/blob/master/openapi/ucentral/owgw.yaml)

- [Provisioning project](https://github.com/Telecominfraproject/wlan-cloud-owprov)
- [Provisioning API](https://github.com/Telecominfraproject/wlan-cloud-owprov/blob/main/openapi/owprov.yaml)

## Available UIs
- [Gateway UI](https://github.com/stephb9959/wlan-cloud-ucentralgw-ui)
- [Provisioning UI](https://github.com/stephb9959/ow-prov)

## How to use the API
To see hos the API is used, take a look at the project, go into `test_scripts/curl` and this will show you how to login and perform some calls.

## Authenticating
To authenticate, you will need to send an oauth2 message to the security service, obtain a token, and use that token in all subsequent calls to the services. Once the session is over, just call logout.


