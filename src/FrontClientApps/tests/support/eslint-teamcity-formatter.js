"use strict";
function escapeTeamCityString(str) {
    if (!str) {
        return "";
    }

    return str
        .replace(/\|/g, "||")
        .replace(/\'/g, "|'")
        .replace(/\n/g, "|n")
        .replace(/\r/g, "|r")
        .replace(/\u0085/g, "|x")
        .replace(/\u2028/g, "|l")
        .replace(/\u2029/g, "|p")
        .replace(/\[/g, "|[")
        .replace(/\]/g, "|]");
}

const reportName = "ESLint Violations";

module.exports = function(results) {
    let output = "";

    output += "##teamcity[testSuiteStarted name='" + reportName + "']\n";

    results.forEach(result => {
        const messages = result.messages;

        output += "##teamcity[testStarted name='" + reportName + ": " + escapeTeamCityString(result.filePath) + "']\n";

        const errorsList = [];
        const warningsList = [];

        messages.forEach(message => {
            const userMessage =
                "line " +
                (message.line || 0) +
                ", col " +
                (message.column || 0) +
                ", " +
                message.message +
                (message.ruleId ? " (" + message.ruleId + ")" : "");

            if (message.fatal || message.severity === 2) {
                errorsList.push(userMessage);
            } else {
                warningsList.push(userMessage);
            }
        });

        if (errorsList.length) {
            output +=
                "##teamcity[testFailed name='" +
                reportName +
                ": " +
                escapeTeamCityString(result.filePath) +
                "' message='" +
                escapeTeamCityString(errorsList.join("\n")) +
                "']\n";
        } else if (warningsList.length) {
            output +=
                "##teamcity[testStdOut name='" +
                reportName +
                ": " +
                escapeTeamCityString(result.filePath) +
                "' out='warning: " +
                escapeTeamCityString(warningsList.join("\n")) +
                "']\n";
        }

        output += "##teamcity[testFinished name='" + reportName + ": " + escapeTeamCityString(result.filePath) + "']\n";
    });

    output += "##teamcity[testSuiteFinished name='" + reportName + "']\n";
    return output;
};
