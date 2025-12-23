import {
  GeoPlacesClient,
  AutocompleteCommand,
  SuggestCommand,
  GetPlaceCommand,
  AutocompleteCommandInput,
  AutocompleteCommandOutput,
  SuggestCommandInput,
  SuggestCommandOutput,
  GetPlaceCommandInput,
  GetPlaceCommandOutput,
  ReverseGeocodeCommandInput,
  ReverseGeocodeCommandOutput,
  ReverseGeocodeCommand,
} from "@aws-sdk/client-geo-places";
import { SDKAuthHelper, withAPIKey } from "@aws/amazon-location-utilities-auth-helper";
import { useNotificationStore } from "../stores/notificationStore";

export let authHelper: SDKAuthHelper;

export const initializeAwsSdkClient = (apiKey: string, region: string) => {
  authHelper = withAPIKey(apiKey, region);
  return new GeoPlacesClient({
    ...authHelper.getClientConfig(),
    customUserAgent: "aws-geo-client-src/1.0+AddressForm",
  });
};

export const autocomplete = async (
  client: GeoPlacesClient,
  input: AutocompleteCommandInput,
): Promise<AutocompleteCommandOutput> => {
  try {
    const command = new AutocompleteCommand(input);
    return await client.send(command);
  } catch (error) {
    handleApiError(error, "autocomplete", "Address autocomplete");
    throw error;
  }
};

export const suggest = async (client: GeoPlacesClient, input: SuggestCommandInput): Promise<SuggestCommandOutput> => {
  try {
    const command = new SuggestCommand(input);
    return await client.send(command);
  } catch (error) {
    handleApiError(error, "suggest", "Address suggestions");
    throw error;
  }
};

export const getPlace = async (
  client: GeoPlacesClient,
  input: GetPlaceCommandInput,
): Promise<GetPlaceCommandOutput> => {
  try {
    const command = new GetPlaceCommand(input);
    return await client.send(command);
  } catch (error) {
    handleApiError(error, "get-place", "Place details");
    throw error;
  }
};

export const reverseGeocode = async (
  client: GeoPlacesClient,
  input: ReverseGeocodeCommandInput,
): Promise<ReverseGeocodeCommandOutput> => {
  try {
    const command = new ReverseGeocodeCommand(input);
    return await client.send(command);
  } catch (error) {
    handleApiError(error, "reverse-geocode", "Location lookup");
    throw error;
  }
};

const handleApiError = (error: unknown, id: string, description: string) => {
  const { addNotification } = useNotificationStore.getState();
  const verb = description.endsWith("s") ? "are" : "is";

  const docsLink =
    "https://docs.aws.amazon.com/location/latest/developerguide/address-form-sdk.html#address-form-getting-started";

  if (error && typeof error === "object" && "$metadata" in error) {
    const metadata = (error as { $metadata?: { httpStatusCode?: number } }).$metadata;

    if (metadata?.httpStatusCode === 403) {
      addNotification(
        {
          id: `${id}-permission-error`,
          type: "error",
          message: `${description} ${verb} currently unavailable.`,
        },
        () => {
          console.error(
            `${description} failed: This is likely due to insufficient API key permissions. See ${docsLink} for API key setup instructions.`,
            error,
          );
        },
      );

      throw error;
    }
  }

  addNotification(
    {
      id: `${id}-unknown-error`,
      message: `${description} ${verb} currently unavailable.`,
      type: "error",
    },
    () => {
      console.error(`${description} failed with unknown error. See ${docsLink} for troubleshooting.`, error);
    },
  );

  throw error;
};
