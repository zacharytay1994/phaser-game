var exceptions = (function () {
    return {
        handle: (caller, func, handler = (error) => logger.loge(error.stack)) => {
            try {
                func(caller);
            }
            catch (error) {
                handler(error);
            }
        }
    }
})();