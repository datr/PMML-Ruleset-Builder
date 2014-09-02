# PMML RuleSet Builder

## Set up

The script needs to be able to access the pegjs definition file at the minute
which requires the page to be served from a webserver and not the local file
system.

The easiest way to do this is to use python's built in web server:

    python -m SimpleHTTPServer
