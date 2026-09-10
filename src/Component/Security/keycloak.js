import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
    url: "http://localhost:7080",
    realm: "savera",
    clientId: "assetmanagement-react-app"
});

export default keycloak;