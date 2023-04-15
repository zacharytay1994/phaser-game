exports.exceptions = (function () {
    const logger = require("./logger.js").logger;
    return {
        handle: (func, handler = (error) => logger.loge(error)) => {
            try {
                func();
            }
            catch (error) {
                handler(error);
            }
        }
    }
})();

exports.handle = function (func, handler = (error) => console.log(error)) {
    try {
        func();
    }
    catch (error) {
        handler(error);
    }
}