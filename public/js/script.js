// ############################# VUE code ############################# //

(function() {
    new Vue({
        el: "#main",
        data: {
            name: "PLACES + FACES",
            form: {
                title: "",
                description: "",
                username: "",
                file: null
            },
            images: []
        }, // closes data
        mounted: function() {
            var self = this;
            axios.get("/images").then(function(resp) {
                self.images = resp.data;
            });
        } // closes mounted
    }); // closes vue instance
})();
