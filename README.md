# DaidaGuard dataLayer Validator Tag for Google Tag Manager

The **DaidaGuard dataLayer Validator** tag for Google Tag Manager validates `dataLayer` events against JSON schemas directly in the browser. Invalid events are caught client-side before they corrupt your analytics tools.

The tag loads the DaidaGuard browser SDK, which:

1. Patches `window.dataLayer.push()` to intercept every event.
2. Loads your pre-compiled validation bundle from DaidaGuard.
3. Validates each event against its matching JSON schema.
4. Batches and sends validation telemetry (pass/fail, errors, redacted payload) to the DaidaGuard ingestion API.

## Prerequisites

Before adding the tag, you need:

- Your DaidaGuard account's **Organization ID** and **Account ID** (found in the DaidaGuard account settings).

## How to use the DaidaGuard dataLayer Validator Tag

1. Import the custom template into your GTM container:
   1. In GTM, go to **Templates > Tag Templates > New > Import**.
   2. Select the `DaidaGuard - dataLayer Validator.tpl` file from this directory.
2. Create a new tag using the **DaidaGuard - dataLayer Validator** template.
3. Enter your **Organization ID** and **Account ID**.
4. Set the trigger to **All Pages** (or your preferred trigger).
5. Publish the container.

## Parameters

### Account

| Parameter | Required | Description |
| --- | --- | --- |
| **Organization ID** | Yes | Your DaidaGuard organization identifier. Find it in the DaidaGuard admin under Organization Settings. |
| **Account ID** | Yes | Your DaidaGuard account identifier. Find it in the DaidaGuard admin under Account Settings. |

### Advanced

| Parameter | Required | Default | Description |
| --- | --- | --- | --- |
| **dataLayer variable name** | No | `dataLayer` | The name of the `dataLayer` array on `window`. Only change this if your site uses a custom variable name. Must be a valid JavaScript identifier. |
| **Enable debug mode** | No | `false` | When enabled, logs verbose messages to the browser console prefixed with `[DaidaGuard]` and disables telemetry delivery. Useful for testing in GTM Preview mode. |

## How it works

The tag uses the GTM sandboxed JS API to:

1. **Initialize a global registry** (`window.__DAIDA_GUARD__`) that coordinates multiple tag instances (e.g., when monitoring separate `dataLayer` arrays).
2. **Stage the tag configuration** into `__DAIDA_GUARD__.pendingConfigs` so the SDK knows which org/account/dataLayer to bind on load.
3. **Inject the SDK script** from `https://cdn.daidalytics.com/sdk/latest/dlv-sdk.min.js`. The SDK then loads the compiled validation bundle from `https://cdn.daidalytics.com/schemas/{orgId}/{accountId}/bundle.js`.

### Permissions

The tag requires the following GTM sandboxed JS permissions:

| Permission | Scope | Reason |
| --- | --- | --- |
| **Inject Scripts** | `https://cdn.daidalytics.com/*` | Load the DaidaGuard SDK and schema bundles. |
| **Access Globals** | `__DAIDA_GUARD__` (read/write), `_dlvDebugMode` (read/write) | Coordinate tag instances and toggle debug mode. |
| **Logging** | All environments | Console logging for debug mode. |

## Useful Resources

- [DaidaGuard Admin](https://app.daidalytics.com) — Author schemas, publish bundles, and manage accounts.

## Open Source

The **DaidaGuard dataLayer Validator Tag for GTM** is developed and maintained by the [DaidaGuard team](https://daidalytics.com/) under the Apache 2.0 license.
