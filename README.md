# Stars2Cyfe

A simple NodeJS script, intended to be run on a daily schedule (e.g. with `cron`), to collect "Starred" counts on specified GitHub respositories and "push" the resulting data to a Cyfe "Push API" widget for tracking in a Cyfe dashbord.

![Cyfe widget populated with Stars2Cyfe](https://storage.googleapis.com/webdata.hubrix.co/static/stars2cyfe.example.jpg "Cyfe widget populated with Stars2Cyfe")

**Cyfe** is a handy SaaS utility to build metrics and KPI dashboards out of "widgets." Hubrix has no special relationship with Cyfe, we're just a happy user. <a href="https://www.cyfe.com/" target="_blank">https://www.cyfe.com/</a>

The Cyfe "Push API" is a straightforward specification for a JSON payload to be POSTed to an endpoint URL. This in turn updates a dashboard widget. Cyfe takes care of storing previous data so you can explore trends over an arbitrary date range. The JSON format is documented here: https://www.cyfe.com/api

This script assumes all referenced repositories are public, and therefore that no authentication is required to obtain the desired GitHub metrics. The only security feature on the Cyfe "Push API" is the secrecy of the (unique, generated) endpoint URL.

## What to put in the .env file

Here is the required contents and format of the `.env` variables:

* `ghuser` the GitHub username / owner of the repos
* `ghrepos` a comma-delimited list of repo names
* `ghmetric` the (top-level) key in the JSON object returned by GitHub for which we want to collect tracking metrics. For GitHub Stars this is `stargazers_count` but you could just as easily track Watchers with `watchers_count` or Open Issues with `open_issues_count` 
* `cyfendpoint` the endpoint URL of the Cyfe "Push API" widget

## Known limitations

* The script depends on [sync-request](https://www.npmjs.com/package/sync-request) which is not recommended for production use. Then again, this is a `cron` script with a typically very short execution lifespan, not a complex service managing a bunch of asynchronous threads.

* The colors (for the Cyfe linechart) are hard-coded, limiting the number of repositories that can be "pushed" to Cyfe in a single widget to 12. However, you _can_ run several instances of the script with different Cyfe endpoints to update several widgets.