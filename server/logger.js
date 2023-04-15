exports.logger = (function () {

    var line = 0;

    const logType = {
        INFO: "[i] INFO",
        ERROR: "[e] ERROR"
    }

    function log(content, type) {
        // const seperatorLength = 20;
        // const logSubSeperator = '_'.repeat(10);
        // ++line;
        // console.log(logSubSeperator);
        // console.log("\n " + line + ". " + type + "\n");
        // console.log("\t" + content);
        // console.log(logSubSeperator.padStart(seperatorLength, ' '));
    }

    return {
        logi: (content) => {
            log(content, logType.INFO);
        },
        loge: (content) => {
            log(content, logType.ERROR);
        }
    }
})();