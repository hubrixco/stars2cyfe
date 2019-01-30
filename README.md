# Stars2Cyfe

A simple NodeJS script, intended to be run on a daily schedule (e.g. with cron), to collect "Starred" counts on specified GitHub respositories and "push" the resulting data to a Cyfe "Push API" widget for tracking in a Cyfe dashbord.

The Cyfe "Push API" is a straightforward specification for a JSON payload to be POSTed to an endpoint URL. The JSON format is documented here: https://www.cyfe.com/api

This is a rewrite of an earlier (very shabby) implementation of this same logic as a bash script, stored as a Snippet: https://bitbucket.org/snippets/hubrix-mktg/zeqRo5/getstars-retrieve-starred-count-from

## What to put in the .env file

Here is the required contents and format of `.env` variables:

* `ghuser` the GitHub username / owner of the repos
* `ghrepos` a comma-delimited list of repo names
* `ghmetric` the (top-level) key in the JSON object returned by GitHub for which we want to collect tracking metrics. For GitHub Stars this is `stargazers_count` but you could just as easily track Watchers with `watchers_count` or Open Issues with `open_issues_count` 
* `cyfendpoint` the endpoint URL of the Cyfe "Push API" widget
