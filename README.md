# Stars2Cyfe

A simple NodeJS script, intended to be run on a daily schedule (e.g. with cron), to collect &#34;Starred&#34; counts on specified GitHub respo&#39;s and &#34;push&#34; the resulting data to a Cyfe &#34;Push API&#34; widget for tracking in a Cyfe dashbord.

The Cyfe &#34;Push API&#34; is a straightforward specification for a JSON payload to be POSTed to an endpoint URL. The JSON format is documented here: https://www.cyfe.com/api