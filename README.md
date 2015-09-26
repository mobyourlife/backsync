# Back Sync
Module responsible for syncing data from Facebook. It's built to be very modular and to offer a CLI tool for testing each sync method.

# Plugins Modularity
Plugins are placed in `lib` folder and CLI commands are placed in `bin` folder.

The plugins are used for communication with the Facebook API and will perform the requests in their platform.

The commands will barely call these plugins to print data in the console.

## Types of Plugins
The existing types of plugins are:
* **lib/auth:** Plugins used for authorisation.
* **lib/data:** Plugins used for getting data from the API.
* **lib/request:** Plugins for making requests to the API.

## Separation of Concerns
Data plugins shouldn't make any call to the Facebook API. Instead, they'll just return the request method, endpoint and arguments.

Making the API call is a task for request plugins. There are two request plugins:
* **Single request:** It's used only in CLI and will perform a single request to the Facebook API.
* **Batched request:** It's used in the Back Sync service and will perform batches with up to 50 commands to the Facebook API in order to save API calls.

This separation of concerns will make it easy to develop additional data plugins and plug and play into both request plugins whenever desired.
